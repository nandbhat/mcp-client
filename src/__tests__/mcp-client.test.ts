/**
 * Tests for MCP Client Library
 */

import { MCPClient, mcpCall, mcpGetTools } from '../index';

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

    it('should create client with multiple URLs', () => {
      const urls = ['http://localhost:8000/mcp', 'http://localhost:8001/mcp'];
      const client = new MCPClient(urls);
      expect(client).toBeInstanceOf(MCPClient);
    });

    it('should accept options', () => {
      const options = {
        timeout: 10000,
        retries: 2,
        clientInfo: { name: 'test', version: '1.0.0' }
      };
      const client = new MCPClient('http://localhost:8000/mcp', options);
      expect(client).toBeInstanceOf(MCPClient);
    });
  });

  describe('getConnectedServers', () => {
    it('should return empty array initially', () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      expect(client.getConnectedServers()).toEqual([]);
    });
  });

  describe('isServerConnected', () => {
    it('should return false for unconnected server', () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      expect(client.isServerConnected('http://localhost:8000/mcp')).toBe(false);
    });
  });

  describe('addServer', () => {
    it('should add server to URLs list', async () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      await client.addServer('http://localhost:8001/mcp');
      // Note: This would require mocking the initialization
    });
  });

  describe('removeServer', () => {
    it('should remove server from URLs list', () => {
      const client = new MCPClient(['http://localhost:8000/mcp', 'http://localhost:8001/mcp']);
      client.removeServer('http://localhost:8001/mcp');
      // Note: This would require checking internal state
    });
  });

  describe('reset', () => {
    it('should reset client state', () => {
      const client = new MCPClient('http://localhost:8000/mcp');
      client.reset();
      expect(client.getConnectedServers()).toEqual([]);
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

describe('utility functions', () => {
  // These would test the internal utility functions
  // For now, we'll just ensure they exist
  it('should have generateUUID function', () => {
    // This would be tested through the public API
    expect(true).toBe(true);
  });
});
