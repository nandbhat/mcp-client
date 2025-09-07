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

  describe('multi-port routing', () => {
    beforeEach(() => {
      resetMCP(); // Clean slate for each test
    });

    it('should route calls to different ports correctly', async () => {
      // Mock responses for different servers
      const mockInit8001 = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05"}}')
      };
      
      const mockInit8002 = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05"}}')
      };

      const mockTools8001 = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":2,"result":{"tools":[{"name":"server8001_tool","description":"Tool from 8001"}]}}')
      };

      const mockTools8002 = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":2,"result":{"tools":[{"name":"server8002_tool","description":"Tool from 8002"}]}}')
      };

      const mockCall8001 = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":3,"result":{"content":[{"type":"text","text":"Response from server 8001"}]}}')
      };

      const mockCall8002 = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":3,"result":{"content":[{"type":"text","text":"Response from server 8002"}]}}')
      };

      // Setup fetch mock to return different responses based on URL
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('localhost:8001')) {
          // First call to 8001 is initialization
          if ((global.fetch as jest.Mock).mock.calls.filter(call => call[0].includes('localhost:8001')).length === 1) {
            return Promise.resolve(mockInit8001);
          }
          // Second call to 8001 is getTools
          if ((global.fetch as jest.Mock).mock.calls.filter(call => call[0].includes('localhost:8001')).length === 2) {
            return Promise.resolve(mockTools8001);
          }
          // Third call to 8001 is callTool
          return Promise.resolve(mockCall8001);
        } else if (url.includes('localhost:8002')) {
          // First call to 8002 is initialization
          if ((global.fetch as jest.Mock).mock.calls.filter(call => call[0].includes('localhost:8002')).length === 1) {
            return Promise.resolve(mockInit8002);
          }
          // Second call to 8002 is getTools
          if ((global.fetch as jest.Mock).mock.calls.filter(call => call[0].includes('localhost:8002')).length === 2) {
            return Promise.resolve(mockTools8002);
          }
          // Third call to 8002 is callTool
          return Promise.resolve(mockCall8002);
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

      // Call tool on port 8001
      const result8001 = await callTool('http://localhost:8001/mcp', 'test_tool', { param: 'value1' });
      
      // Call tool on port 8002
      const result8002 = await callTool('http://localhost:8002/mcp', 'test_tool', { param: 'value2' });

      // Verify the responses are from the correct servers
      expect(result8001.content).toBeDefined();
      expect(result8002.content).toBeDefined();
      expect(result8001.content![0].text).toBe('Response from server 8001');
      expect(result8002.content![0].text).toBe('Response from server 8002');

      // Verify that fetch was called with the correct URLs
      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const calls8001 = fetchCalls.filter(call => call[0].includes('localhost:8001'));
      const calls8002 = fetchCalls.filter(call => call[0].includes('localhost:8002'));

      expect(calls8001.length).toBeGreaterThan(0);
      expect(calls8002.length).toBeGreaterThan(0);
    });

    it('should maintain separate sessions for different ports', async () => {
      // Mock initialization responses
      const mockInit = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05"}}')
      };

      const mockTools = {
        ok: true,
        text: () => Promise.resolve('data: {"jsonrpc":"2.0","id":2,"result":{"tools":[]}}')
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockInit);

      // Make calls to both servers to trigger initialization
      await callTool('http://localhost:8001/mcp', 'tool1', {});
      
      // Change mock to return tools response
      (global.fetch as jest.Mock).mockResolvedValue(mockTools);
      
      await callTool('http://localhost:8002/mcp', 'tool2', {});

      // Check that different session IDs were used
      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const calls8001 = fetchCalls.filter(call => call[0].includes('localhost:8001'));
      const calls8002 = fetchCalls.filter(call => call[0].includes('localhost:8002'));

      // Extract session IDs from URLs
      const session8001 = calls8001[0][0].match(/session=([^&]+)/)?.[1];
      const session8002 = calls8002[0][0].match(/session=([^&]+)/)?.[1];

      expect(session8001).toBeDefined();
      expect(session8002).toBeDefined();
      expect(session8001).not.toBe(session8002);
    });
  });
});
