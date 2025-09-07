/**
 * MCP Client Library - Simple single server client
 * Based on working implementation patterns
 */

import { MCPClient } from './mcp-client';
export { MCPClient } from './mcp-client';
export type { MCPTool, MCPToolCallResult } from './types';

/**
 * Generate a random UUID for session ID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Global client instance for ultra-simple usage
let globalClient: MCPClient | null = null;
let isInitialized = false;
let currentSessionId: string | null = null;

/**
 * Initialize the MCP connection (called automatically)
 */
async function ensureInitialized(serverUrl: string) {
  if (!globalClient) {
    currentSessionId = generateUUID();
    globalClient = new MCPClient(serverUrl, { sessionId: currentSessionId });
  }
  
  if (!isInitialized) {
    await globalClient.getTools(); // This will trigger initialization
    isInitialized = true;
  }
}

/**
 * Convenience function to create a new MCP client
 */
export function createMCPClient(baseUrl: string, options?: { sessionId?: string }): MCPClient {
  return new MCPClient(baseUrl, options);
}

/**
 * Convenience function for one-off tool calls
 */
export async function mcpCall(serverUrl: string, toolName: string, arguments_: any = {}): Promise<import('./types').MCPToolCallResult> {
  const client = new MCPClient(serverUrl);
  return await client.callTool(toolName, arguments_);
}

/**
 * Convenience function for getting tools
 */
export async function mcpGetTools(serverUrl: string): Promise<import('./types').MCPTool[]> {
  const client = new MCPClient(serverUrl);
  return await client.getTools();
}

/**
 * Ultra-simple functions - global client instance
 */

/**
 * Get available tools from MCP server
 * Usage: getTools("http://localhost:8000/mcp")
 */
export async function getTools(serverUrl: string): Promise<import('./types').MCPTool[]> {
  await ensureInitialized(serverUrl);
  return await globalClient!.getTools();
}

/**
 * Call a tool on MCP server  
 * Usage: callTool("http://localhost:8000/mcp", "greeting", { name: "World" })
 */
export async function callTool(serverUrl: string, toolName: string, arguments_: any = {}): Promise<import('./types').MCPToolCallResult> {
  await ensureInitialized(serverUrl);
  return await globalClient!.callTool(toolName, arguments_);
}

/**
 * Reset the connection (useful for testing)
 */
export function resetMCP(): void {
  if (globalClient) {
    globalClient.reset();
  }
  globalClient = null;
  isInitialized = false;
  currentSessionId = null;
}

// Default export
export default MCPClient;
