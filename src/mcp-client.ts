/**
 * Simple MCP Client - Single server, minimal abstraction
 * Based on the working implementation pattern
 */

import { MCPTool, MCPToolCallResult } from './types';

interface MCPResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * MCP Client - Simple single server client
 */
export class MCPClient {
  private baseUrl: string;
  private sessionId: string;
  private initialized: boolean = false;

  constructor(baseUrl: string, options?: { sessionId?: string }) {
    this.baseUrl = baseUrl;
    this.sessionId = options?.sessionId || 'default-session';
  }

  /**
   * Parse Server-Sent Events response
   */
  private parseSSEResponse(text: string): any {
    const lines = text.split('\n');
    let data = '';
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        data = line.substring(6);
        break;
      }
    }
    
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse SSE data:', data);
        throw new Error(`Failed to parse server response: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    
    throw new Error('No data found in server response');
  }

  /**
   * Make a request to the MCP server
   */
  private async makeRequest<T>(method: string, params: any = {}, id: number = 1): Promise<MCPResponse<T>> {
    const url = `${this.baseUrl}?session=${this.sessionId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    const data = this.parseSSEResponse(responseText);
    
    if (data.error) {
      throw new Error(`MCP Error: ${data.error.message}`);
    }
    
    return data;
  }

  /**
   * Initialize connection to MCP server
   */
  private async initialize(clientInfo: { name: string; version: string } = { name: 'mcp-client', version: '1.0.0' }): Promise<void> {
    if (this.initialized) return;

    await this.makeRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo,
    }, 1);
    
    this.initialized = true;
  }

  /**
   * Get list of available tools
   */
  async getTools(): Promise<MCPTool[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const response = await this.makeRequest<{ tools: MCPTool[] }>('tools/list', {}, 2);
    return response.result?.tools || [];
  }

  /**
   * Call a specific tool
   */
  async callTool(toolName: string, arguments_: any = {}): Promise<MCPToolCallResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const response = await this.makeRequest<MCPToolCallResult>('tools/call', {
      name: toolName,
      arguments: arguments_,
    }, 3);
    
    return response.result!;
  }

  /**
   * Reset the connection
   */
  reset(): void {
    this.initialized = false;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}
