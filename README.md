# MCP Client

A simple, lightweight JavaScript/TypeScript client library for Model Context Protocol (MCP) communication. Designed for easy integration with a single MCP server.

## Features

- **Ultra-simple API** - Clean, minimal interface for MCP communication
- **Single server focus** - Optimized for single MCP server connections
- **Auto-initialization** - Handles MCP protocol handshake automatically
- **Type-safe** - Full TypeScript support with comprehensive type definitions
- **Universal compatibility** - Works in React, Vue, Node.js, and vanilla JavaScript
- **Direct responses** - Returns data directly without wrapper objects
- **Multiple usage patterns** - Class-based, convenience functions, and ultra-simple global functions

## Installation

```bash
npm install mcp-client
```

## Quick Start

### Ultra-simple Functions (Recommended)

```typescript
import { getTools, callTool } from 'mcp-client';

// Get available tools
const tools = await getTools('http://localhost:8000/mcp');
console.log('Available tools:', tools);

// Call a tool
const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'World' });
console.log('Result:', result);
```

### Class-based Usage

```typescript
import { MCPClient } from 'mcp-client';

// Create client instance
const client = new MCPClient('http://localhost:8000/mcp');

// Get available tools
const tools = await client.getTools();
console.log('Available tools:', tools);

// Call a tool
const result = await client.callTool('greeting', { name: 'World' });
console.log('Result:', result);
```

### Convenience Functions

```typescript
import { mcpCall, mcpGetTools } from 'mcp-client';

// One-off tool call
const result = await mcpCall('http://localhost:8000/mcp', 'greeting', { name: 'World' });
console.log('Result:', result);

// Get tools from server
const tools = await mcpGetTools('http://localhost:8000/mcp');
console.log('Tools:', tools);
```

## API Reference

### Ultra-simple Functions

#### getTools(serverUrl)
```typescript
function getTools(serverUrl: string): Promise<MCPTool[]>
```
Get available tools from the MCP server. Auto-initializes the connection.

#### callTool(serverUrl, toolName, arguments)
```typescript
function callTool(serverUrl: string, toolName: string, arguments?: any): Promise<MCPToolCallResult>
```
Call a tool on the MCP server. Auto-initializes the connection.

#### resetMCP()
```typescript
function resetMCP(): void
```
Reset the global connection state (useful for testing).

### MCPClient Class

#### Constructor
```typescript
new MCPClient(baseUrl: string, options?: { sessionId?: string })
```

#### Methods

- `getTools(): Promise<MCPTool[]>` - Retrieve tools from the server
- `callTool(toolName: string, arguments?: any): Promise<MCPToolCallResult>` - Execute a tool call
- `reset(): void` - Reset the connection
- `isInitialized(): boolean` - Check if client is initialized

### Convenience Functions

#### mcpCall(serverUrl, toolName, arguments)
```typescript
function mcpCall(serverUrl: string, toolName: string, arguments?: any): Promise<MCPToolCallResult>
```
One-off tool call with a new client instance.

#### mcpGetTools(serverUrl)
```typescript
function mcpGetTools(serverUrl: string): Promise<MCPTool[]>
```
Get tools with a new client instance.

### Types

```typescript
interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
  _meta?: any;
}

interface MCPToolCallResult {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: any;
  isError?: boolean;
}
```

## Usage Examples

### React

```typescript
import { getTools, callTool } from 'mcp-client';
// or import { MCPClient } from 'mcp-client';

function MyComponent() {
  const [tools, setTools] = useState([]);
  
  const handleGetTools = async () => {
    const tools = await getTools('http://localhost:8000/mcp');
    setTools(tools);
  };
  
  const handleCallTool = async () => {
    const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'React' });
    console.log('Result:', result);
  };
  
  return (
    <div>
      <button onClick={handleGetTools}>Get Tools</button>
      <button onClick={handleCallTool}>Call Tool</button>
    </div>
  );
}
```

### Vue.js

```typescript
import { getTools, callTool } from 'mcp-client';

export default {
  data() {
    return {
      tools: []
    }
  },
  methods: {
    async getTools() {
      this.tools = await getTools('http://localhost:8000/mcp');
    },
    async callGreeting() {
      const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'Vue' });
      console.log('Result:', result);
    }
  }
}
```

### Node.js

```javascript
const { getTools, callTool } = require('mcp-client');

async function main() {
  const tools = await getTools('http://localhost:8000/mcp');
  console.log('Tools:', tools);
  
  const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'Node.js' });
  console.log('Result:', result);
}

main().catch(console.error);
```

### Vanilla JavaScript

```html
<script type="module">
  import { getTools, callTool } from 'mcp-client';
  
  document.getElementById('getTools').addEventListener('click', async () => {
    const tools = await getTools('http://localhost:8000/mcp');
    console.log('Tools:', tools);
  });
  
  document.getElementById('callTool').addEventListener('click', async () => {
    const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'Browser' });
    console.log('Result:', result);
  });
</script>
```

## Error Handling

```typescript
import { getTools, callTool } from 'mcp-client';

try {
  const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'World' });
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
}

// Or with class-based approach
const client = new MCPClient('http://localhost:8000/mcp');

try {
  const tools = await client.getTools();
  console.log('Tools:', tools);
} catch (error) {
  console.error('Connection error:', error);
}
```

## Key Features

- **Simple**: No complex response wrappers - methods return data directly
- **Auto-initialization**: Handles MCP protocol handshake automatically
- **Session management**: Unique session IDs for each connection
- **Server-Sent Events**: Proper parsing of MCP server responses
- **Multiple patterns**: Choose from ultra-simple functions, class-based, or convenience functions

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
