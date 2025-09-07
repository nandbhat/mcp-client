/**
 * MCP Client Library - Main entry point
 * A standalone JavaScript/TypeScript library for MCP communication
 */

import { MCPClient } from './mcp-client';
export { MCPClient } from './mcp-client';
export type {
  MCPTool,
  MCPToolCallResult,
  ClientInfo,
  MCPClientOptions,
  MCPClientResponse,
  MCPRequest,
  MCPResponse
} from './types';

/**
 * Convenience function to create a new MCP client
 * Similar to axios.create()
 */
export function createMCPClient(urls: string | string[], options?: import('./types').MCPClientOptions): MCPClient {
  return new MCPClient(urls, options);
}

/**
 * Convenience function for one-off tool calls
 * Similar to axios.get() or axios.post()
 */
export async function mcpCall(
  urls: string | string[], 
  toolName: string, 
  arguments_: any = {}, 
  options?: import('./types').MCPClientOptions
): Promise<import('./types').MCPClientResponse<import('./types').MCPToolCallResult>> {
  const client = new MCPClient(urls, options);
  return await client.callTool(toolName, arguments_);
}

/**
 * Convenience function for getting tools
 */
export async function mcpGetTools(
  urls: string | string[], 
  options?: import('./types').MCPClientOptions
): Promise<import('./types').MCPClientResponse<import('./types').MCPTool[]>> {
  const client = new MCPClient(urls, options);
  return await client.getTools();
}

// Default export
export default MCPClient;
