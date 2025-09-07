/**
 * Tests for Simple MCP Client Library
 */

import { MCPClient, mcpCall, mcpGetTools, getTools, callTool, resetMCP } from '../index';

// Mock fetch
global.fetch = jest.fn();

describe('MCPClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with single URL', () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      expect(client).toBeInstanceOf(MCPClient);
    });

    it('should accept options', () => {
      const options = { sessionId: 'test-session' };
      const client = new MCPClient('http://localhost:8000/mcp', options);
      expect(client).toBeInstanceOf(MCPClient);
    });
  });

  describe('isInitialized', () => {
    it('should return false initially', () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      expect(client.isInitialized()).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset client state', () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      client.reset();
      expect(client.isInitialized()).toBe(false);
    });
  });

  describe('getTools', () => {
    it('should handle empty tools response', async () => {
      const mockResponse = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":2,"result":{"tools":[]}}')
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const client = new MCPClient('http://localhost:8000/mcp');
      const tools = await client.getTools();
      expect(tools).toEqual([]);
    });
  });
});

describe('convenience functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mcpCall', () => {
    it('should be a function', () => {
      expect(typeof mcpCall).toBe('function');
    });
  });

  describe('mcpGetTools', () => {
    it('should be a function', () => {
      expect(typeof mcpGetTools).toBe('function');
    });
  });
});

describe('ultra-simple functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMCP(); // Reset global state
  });

  describe('getTools', () => {
    it('should be a function', () => {
      expect(typeof getTools).toBe('function');
    });
  });

  describe('callTool', () => {
    it('should be a function', () => {
      expect(typeof callTool).toBe('function');
    });
  });

  describe('resetMCP', () => {
    it('should be a function', () => {
      expect(typeof resetMCP).toBe('function');
    });
  });
});
