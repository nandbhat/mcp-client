/**
 * Core MCP Client implementation
 */

import { 
  MCPTool, 
  MCPToolCallResult, 
  ClientInfo, 
  MCPClientOptions, 
  MCPClientResponse,
  MCPRequest,
  MCPResponse
} from './types';
import { 
  generateUUID, 
  parseSSEResponse, 
  createMCPRequest, 
  makeMCPRequest, 
  handleMCPResponse 
} from './utils';

/**
 * MCP Client - Standalone library for MCP communication
 * Similar to axios but for MCP servers
 */
export class MCPClient {
  private urls: string[];
  private clients: Map<string, MCPClientInstance> = new Map();
  private initialized: boolean = false;
  private options: MCPClientOptions;

  constructor(urls: string | string[], options: MCPClientOptions = {}) {
    this.urls = Array.isArray(urls) ? urls : [urls];
    this.options = {
      timeout: 30000,
      retries: 3,
      clientInfo: { name: 'mcp-client', version: '1.0.0' },
      ...options
    };
  }

  /**
   * Initialize connections to all MCP servers
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    for (const url of this.urls) {
      const sessionId = generateUUID();
      const client = new MCPClientInstance(url, sessionId, this.options);
      
      try {
        await client.initialize(this.options.clientInfo!);
        this.clients.set(url, client);
      } catch (error) {
        console.warn(`Failed to initialize MCP client for ${url}:`, error);
        // Continue with other servers
      }
    }

    this.initialized = true;
  }

  /**
   * Get tools from all connected servers
   */
  async getTools(): Promise<MCPClientResponse<MCPTool[]>> {
    await this.initialize();

    try {
      const allTools: MCPTool[] = [];
      
      for (const [url, client] of this.clients) {
        try {
          const serverTools = await client.getTools();
          // Add server URL as metadata
          const toolsWithServer = serverTools.map(tool => ({
            ...tool,
            _meta: {
              ...tool._meta,
              serverUrl: url
            }
          }));
          allTools.push(...toolsWithServer);
        } catch (error) {
          console.warn(`Failed to get tools from ${url}:`, error);
        }
      }

      return {
        data: allTools,
        status: 'success'
      };
    } catch (error: any) {
      return {
        data: [],
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Call a tool on the appropriate server
   */
  async callTool(toolName: string, arguments_: any = {}): Promise<MCPClientResponse<MCPToolCallResult>> {
    await this.initialize();

    try {
      // First get tools to find which server has this tool
      const toolsResponse = await this.getTools();
      if (toolsResponse.status === 'error') {
        throw new Error(toolsResponse.error);
      }

      const tool = toolsResponse.data.find(t => t.name === toolName);
      if (!tool) {
        throw new Error(`Tool '${toolName}' not found. Available tools: ${toolsResponse.data.map(t => t.name).join(', ')}`);
      }

      const serverUrl = tool._meta?.serverUrl;
      if (!serverUrl) {
        throw new Error(`Server URL not found for tool '${toolName}'`);
      }

      const client = this.clients.get(serverUrl);
      if (!client) {
        throw new Error(`Client not found for server '${serverUrl}'`);
      }

      const result = await client.callTool(toolName, arguments_);
      
      return {
        data: result,
        status: 'success',
        serverUrl
      };
    } catch (error: any) {
      return {
        data: {} as MCPToolCallResult,
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Get tools from a specific server
   */
  async getToolsFromServer(serverUrl: string): Promise<MCPClientResponse<MCPTool[]>> {
    await this.initialize();

    const client = this.clients.get(serverUrl);
    if (!client) {
      return {
        data: [],
        status: 'error',
        error: `No client found for server: ${serverUrl}`
      };
    }

    try {
      const tools = await client.getTools();
      return {
        data: tools,
        status: 'success',
        serverUrl
      };
    } catch (error: any) {
      return {
        data: [],
        status: 'error',
        error: error.message,
        serverUrl
      };
    }
  }

  /**
   * Call a tool on a specific server
   */
  async callToolOnServer(serverUrl: string, toolName: string, arguments_: any = {}): Promise<MCPClientResponse<MCPToolCallResult>> {
    await this.initialize();

    const client = this.clients.get(serverUrl);
    if (!client) {
      return {
        data: {} as MCPToolCallResult,
        status: 'error',
        error: `No client found for server: ${serverUrl}`
      };
    }

    try {
      const result = await client.callTool(toolName, arguments_);
      return {
        data: result,
        status: 'success',
        serverUrl
      };
    } catch (error: any) {
      return {
        data: {} as MCPToolCallResult,
        status: 'error',
        error: error.message,
        serverUrl
      };
    }
  }

  /**
   * Get list of connected servers
   */
  getConnectedServers(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Check if a server is connected
   */
  isServerConnected(serverUrl: string): boolean {
    return this.clients.has(serverUrl);
  }

  /**
   * Reset all connections
   */
  reset(): void {
    for (const client of this.clients.values()) {
      client.reset();
    }
    this.clients.clear();
    this.initialized = false;
  }

  /**
   * Add a new server URL
   */
  async addServer(url: string): Promise<void> {
    if (this.urls.includes(url)) return;
    
    this.urls.push(url);
    
    if (this.initialized) {
      const sessionId = generateUUID();
      const client = new MCPClientInstance(url, sessionId, this.options);
      await client.initialize(this.options.clientInfo!);
      this.clients.set(url, client);
    }
  }

  /**
   * Remove a server
   */
  removeServer(url: string): void {
    const client = this.clients.get(url);
    if (client) {
      client.reset();
      this.clients.delete(url);
    }
    this.urls = this.urls.filter(u => u !== url);
  }
}

/**
 * Individual MCP client instance for a single server
 */
class MCPClientInstance {
  private url: string;
  private sessionId: string;
  private options: MCPClientOptions;
  private initialized: boolean = false;

  constructor(url: string, sessionId: string, options: MCPClientOptions) {
    this.url = url;
    this.sessionId = sessionId;
    this.options = options;
  }

  async initialize(clientInfo: ClientInfo): Promise<void> {
    if (this.initialized) return;

    const request = createMCPRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo
    });

    const response = await makeMCPRequest(this.url, request, this.sessionId, this.options.timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const parsed = parseSSEResponse(text);
    
    if (parsed) {
      handleMCPResponse(parsed);
    }

    this.initialized = true;
  }

  async getTools(): Promise<MCPTool[]> {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const request = createMCPRequest('tools/list', {});
    const response = await makeMCPRequest(this.url, request, this.sessionId, this.options.timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const parsed = parseSSEResponse(text);
    
    if (parsed) {
      const result = handleMCPResponse(parsed);
      return result.tools || [];
    }

    return [];
  }

  async callTool(toolName: string, arguments_: any = {}): Promise<MCPToolCallResult> {
    if (!this.initialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const request = createMCPRequest('tools/call', {
      name: toolName,
      arguments: arguments_
    });

    const response = await makeMCPRequest(this.url, request, this.sessionId, this.options.timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const parsed = parseSSEResponse(text);
    
    if (parsed) {
      return handleMCPResponse(parsed);
    }

    throw new Error('No response received from server');
  }

  reset(): void {
    this.initialized = false;
  }
}
