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

// Multiple client instances based on server URL
const clientInstances: Map<string, MCPClient> = new Map();
const initializedServers: Set<string> = new Set();

/**
 * Initialize the MCP connection (called automatically)
 */
async function ensureInitialized(serverUrl: string) {
  // Get or create client for this server URL
  if (!clientInstances.has(serverUrl)) {
    const sessionId = generateUUID();
    const client = new MCPClient(serverUrl, { sessionId });
    clientInstances.set(serverUrl, client);
  }
  
  // Initialize if not already done for this server
  if (!initializedServers.has(serverUrl)) {
    const client = clientInstances.get(serverUrl)!;
    await client.getTools(); // This will trigger initialization
    initializedServers.add(serverUrl);
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
  await ensureInitialized(serverUrl);
  const client = clientInstances.get(serverUrl)!;
  return await client.callTool(toolName, arguments_);
}

/**
 * Convenience function for getting tools
 */
export async function mcpGetTools(serverUrl: string): Promise<import('./types').MCPTool[]> {
  await ensureInitialized(serverUrl);
  const client = clientInstances.get(serverUrl)!;
  return await client.getTools();
}

/**
 * Ultra-simple functions - maintains separate client instances per server URL
 */

/**
 * Get available tools from MCP server
 * Usage: getTools("http://localhost:8000/mcp")
 */
export async function getTools(serverUrl: string): Promise<import('./types').MCPTool[]> {
  await ensureInitialized(serverUrl);
  const client = clientInstances.get(serverUrl)!;
  return await client.getTools();
}

/**
 * Call a tool on MCP server  
 * Usage: callTool("http://localhost:8000/mcp", "greeting", { name: "World" })
 */
export async function callTool(serverUrl: string, toolName: string, arguments_: any = {}): Promise<import('./types').MCPToolCallResult> {
  await ensureInitialized(serverUrl);
  const client = clientInstances.get(serverUrl)!;
  return await client.callTool(toolName, arguments_);
}

/**
 * Reset the connection (useful for testing)
 */
export function resetMCP(): void {
  // Reset all client instances
  for (const client of clientInstances.values()) {
    client.reset();
  }
  clientInstances.clear();
  initializedServers.clear();
}

// Default export
export default MCPClient;
