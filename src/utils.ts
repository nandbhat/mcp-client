/**
 * Utility functions for MCP Client Library
 */

import { MCPResponse } from './types';

/**
 * Generate UUID for correlation IDs
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Parse Server-Sent Events response
 */
export function parseSSEResponse(text: string): MCPResponse | null {
  const lines = text.split('\n');
  let data = '';
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      data = line.substring(6);
      break;
    }
  }
  
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse SSE response:', error);
    return null;
  }
}

/**
 * Create MCP request object
 */
export function createMCPRequest(method: string, params: any = {}, id: number = 1): any {
  return {
    jsonrpc: '2.0',
    method,
    params,
    id
  };
}

/**
 * Make HTTP request with proper headers for MCP
 */
export async function makeMCPRequest(
  url: string, 
  request: any, 
  sessionId: string,
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(`${url}?session=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(request),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Handle MCP response and extract data
 */
export function handleMCPResponse(response: MCPResponse): any {
  if (response.error) {
    throw new Error(`MCP Error: ${response.error.message} (Code: ${response.error.code})`);
  }
  
  return response.result;
}
