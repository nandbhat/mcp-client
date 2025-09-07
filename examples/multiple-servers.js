/**
 * Ultra-simple functions example for MCP Client
 * Run with: node examples/ultra-simple.js
 * 
 * This example shows the recommended ultra-simple usage pattern
 * with global functions that handle everything automatically.
 */

const { getTools, callTool, resetMCP } = require('../dist/index.js');

async function main() {
  console.log('🚀 MCP Client - Ultra-Simple Functions Example\n');
  
  try {
    // Get available tools (auto-initializes connection)
    console.log('📋 Getting tools...');
    const tools = await getTools('http://localhost:8000/mcp');
    console.log('✅ Available tools:', tools.map(t => t.name));
    
    // Call a tool (reuses the same connection)
    console.log('\n🔧 Calling greeting tool...');
    const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'Ultra-Simple' });
    
    const greeting = result.content?.[0]?.text || result.structuredContent?.result;
    console.log('✅ Greeting result:', greeting);
    
    // Call another tool
    if (tools.some(t => t.name === 'echo')) {
      console.log('\n📢 Calling echo tool...');
      const echoResult = await callTool('http://localhost:8000/mcp', 'echo', { message: 'Hello from ultra-simple example!' });
      
      const echoMessage = echoResult.content?.[0]?.text || echoResult.structuredContent?.result;
      console.log('✅ Echo result:', echoMessage);
    }
    
    console.log('\n🎉 Ultra-simple functions example completed!');
    console.log('\n💡 Key benefits:');
    console.log('   - No client instance needed');
    console.log('   - Auto-initialization');
    console.log('   - Connection reuse');
    console.log('   - Direct data return (no wrapper objects)');
    console.log('   - Perfect for simple scripts and quick integrations');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure the MCP server is running on http://localhost:8000/mcp');
  } finally {
    // Optional: Reset the global client state
    // This is mainly useful for testing or when switching servers
    console.log('\n🔄 Resetting connection state...');
    resetMCP();
    console.log('✅ Connection state reset');
  }
}

main();