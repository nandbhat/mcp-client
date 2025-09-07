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
    const tools = await client.getTools();
    console.log('Available tools:', tools.map(t => t.name));
    
    // Call a tool
    console.log('\nCalling greeting tool...');
    const result = await client.callTool('greeting', { name: 'World' });
    
    const greeting = result.content?.[0]?.text || result.structuredContent?.result;
    console.log('Greeting result:', greeting);
    
    console.log('\nExample completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nMake sure the MCP server is running on http://localhost:8000/mcp');
  }
}

main();
