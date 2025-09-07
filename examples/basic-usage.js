/**
 * Basic usage example for MCP Client
 * Run with: node examples/basic-usage.js
 */

const { MCPClient } = require('../dist/index.js');

async function main() {
  console.log('MCP Client - Basic Usage Example\n');
  
  try {
    // Create client
    const client = new MCPClient('http://localhost:8000/mcp');
    
    // Get tools
    console.log('Getting tools...');
    const toolsResponse = await client.getTools();
    
    if (toolsResponse.status === 'success') {
      console.log('Available tools:', toolsResponse.data.map(t => t.name));
    } else {
      console.log('Failed to get tools:', toolsResponse.error);
      return;
    }
    
    // Call a tool
    console.log('\nCalling greeting tool...');
    const result = await client.callTool('greeting', { name: 'World' });
    
    if (result.status === 'success') {
      const greeting = result.data.content?.[0]?.text || result.data.structuredContent?.result;
      console.log('Greeting result:', greeting);
    } else {
      console.log('Failed to call tool:', result.error);
    }
    
    console.log('\nExample completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nMake sure the MCP server is running on http://localhost:8000/mcp');
  }
}

main();
