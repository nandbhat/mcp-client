# MCP Client

A professional JavaScript/TypeScript client library for Model Context Protocol (MCP) communication. Provides a familiar axios-like API for seamless integration with MCP servers.

## Features

- **Simple API** - Familiar axios-like interface for MCP communication
- **Multi-server support** - Connect to multiple MCP servers simultaneously
- **Auto-initialization** - Handles MCP protocol complexity automatically
- **Type-safe** - Full TypeScript support with comprehensive type definitions
- **Universal compatibility** - Works in React, Vue, Node.js, and vanilla JavaScript
- **Robust error handling** - Comprehensive error management and reporting
- **Request correlation** - Unique UUIDs for request tracking and debugging

## Installation

```bash
npm install mcp-client
```

## Quick Start

### Basic Usage

```typescript
import { MCPClient } from 'mcp-client';

// Create client instance
const client = new MCPClient('http://localhost:8000/mcp');

// Get available tools
const toolsResponse = await client.getTools();
if (toolsResponse.status === 'success') {
  console.log('Available tools:', toolsResponse.data);
}

// Call a tool
const result = await client.callTool('greeting', { name: 'World' });
if (result.status === 'success') {
  console.log('Result:', result.data);
}
```

### Multiple Servers

```typescript
const client = new MCPClient([
  'http://localhost:8000/mcp',
  'http://localhost:8001/mcp',
  'http://localhost:8002/mcp'
]);

// Get tools from all servers
const tools = await client.getTools();

// Call tool (automatically finds the right server)
const result = await client.callTool('greeting', { name: 'Multi-server' });
```

### Convenience Functions

```typescript
import { mcpCall, mcpGetTools } from 'mcp-client';

// One-off tool call
const result = await mcpCall('http://localhost:8000/mcp', 'greeting', { name: 'World' });

// Get tools from server
const tools = await mcpGetTools('http://localhost:8000/mcp');
```

## API Reference

### MCPClient Class

#### Constructor
```typescript
new MCPClient(urls: string | string[], options?: MCPClientOptions)
```

#### Methods

- `getTools()` - Retrieve tools from all connected servers
- `callTool(toolName, arguments)` - Execute a tool call (automatically finds the appropriate server)
- `getToolsFromServer(serverUrl)` - Retrieve tools from a specific server
- `callToolOnServer(serverUrl, toolName, arguments)` - Execute a tool call on a specific server
- `getConnectedServers()` - Get list of currently connected servers
- `isServerConnected(serverUrl)` - Check if a specific server is connected
- `addServer(url)` - Add a new server to the client
- `removeServer(url)` - Remove a server from the client
- `reset()` - Reset all connections and clear state

### Response Format

All methods return a response object:

```typescript
interface MCPClientResponse<T> {
  data: T;
  status: 'success' | 'error';
  error?: string;
  serverUrl?: string;
}
```

### Options

```typescript
interface MCPClientOptions {
  timeout?: number;        // Request timeout in milliseconds (default: 30000)
  retries?: number;        // Number of retry attempts (default: 3)
  clientInfo?: {           // Client identification information
    name: string;
    version: string;
  };
}
```

## Usage Examples

### React

```typescript
import { MCPClient } from 'mcp-client';

function MyComponent() {
  const [client] = useState(() => new MCPClient('http://localhost:8000/mcp'));
  const [tools, setTools] = useState([]);
  
  const handleGetTools = async () => {
    const response = await client.getTools();
    if (response.status === 'success') {
      setTools(response.data);
    }
  };
  
  return <button onClick={handleGetTools}>Get Tools</button>;
}
```

### Vue.js

```typescript
import { MCPClient } from 'mcp-client';

export default {
  data() {
    return {
      client: new MCPClient('http://localhost:8000/mcp'),
      tools: []
    }
  },
  methods: {
    async getTools() {
      const response = await this.client.getTools();
      if (response.status === 'success') {
        this.tools = response.data;
      }
    }
  }
}
```

### Node.js

```javascript
const { MCPClient } = require('mcp-client');

async function main() {
  const client = new MCPClient('http://localhost:8000/mcp');
  
  const tools = await client.getTools();
  console.log('Tools:', tools.data);
  
  const result = await client.callTool('greeting', { name: 'Node.js' });
  console.log('Result:', result.data);
}

main().catch(console.error);
```

### Vanilla JavaScript

```html
<script type="module">
  import { MCPClient } from 'mcp-client';
  
  const client = new MCPClient('http://localhost:8000/mcp');
  
  document.getElementById('getTools').addEventListener('click', async () => {
    const response = await client.getTools();
    if (response.status === 'success') {
      console.log('Tools:', response.data);
    }
  });
</script>
```

## Error Handling

```typescript
const client = new MCPClient('http://localhost:8000/mcp');

try {
  const result = await client.callTool('greeting', { name: 'World' });
  if (result.status === 'error') {
    console.error('Tool error:', result.error);
  } else {
    console.log('Success:', result.data);
  }
} catch (error) {
  console.error('Connection error:', error);
}
```

## Server Management

```typescript
const client = new MCPClient('http://localhost:8000/mcp');

// Check connected servers
console.log('Connected:', client.getConnectedServers());

// Add new server
await client.addServer('http://localhost:8001/mcp');

// Remove server
client.removeServer('http://localhost:8001/mcp');

// Reset all connections
client.reset();
```

## Comparison with axios

| Feature | axios | MCP Client |
|---------|-------|-------------------|
| **Purpose** | HTTP requests | MCP communication |
| **Usage** | `axios.get(url)` | `client.getTools()` |
| **Response** | `response.data` | `response.data` |
| **Error handling** | `response.status` | `response.status` |
| **Multiple endpoints** | Manual configuration | Automatic discovery |
| **Protocol** | HTTP | MCP (JSON-RPC) |

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run in development mode
npm run dev
```

## License

MIT
