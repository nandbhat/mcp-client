/**
 * Type definitions for MCP Client Library
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
  _meta?: any;
}

export interface MCPToolCallResult {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: any;
  isError?: boolean;
}

export interface ClientInfo {
  name: string;
  version: string;
}

export interface MCPClientOptions {
  timeout?: number;
  retries?: number;
  clientInfo?: ClientInfo;
}

export interface MCPClientResponse<T = any> {
  data: T;
  status: 'success' | 'error';
  error?: string;
  serverUrl?: string;
}

export interface MCPRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id: number;
}

export interface MCPResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
