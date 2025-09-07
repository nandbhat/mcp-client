/**
 * Convenience functions example for MCP Client
 * Run with: node examples/convenience-functions.js
 */

const { mcpCall, mcpGetTools } = require('../dist/index.js');

async function main() {
  console.log('MCP Client - Convenience Functions Example\n');
  
  try {
    // One-off tool call
    console.log('Making one-off tool call...');
    const result = await mcpCall('http://localhost:8000/mcp', 'greeting', { name: 'Convenience' });
    
    const greeting = result.content?.[0]?.text || result.structuredContent?.result;
    console.log('Tool call result:', greeting);
    
    // Get tools (one-off)
    console.log('\nGetting tools (one-off)...');
    const tools = await mcpGetTools('http://localhost:8000/mcp');
    console.log('Available tools:', tools.map(t => t.name));
    
    console.log('\nConvenience functions example completed!');
    console.log('\nThese functions are perfect for simple one-off operations');
    console.log('without needing to create a client instance.');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nMake sure the MCP server is running on http://localhost:8000/mcp');
  }
}

main();
