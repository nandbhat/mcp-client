/**
 * Multiple servers example for MCP Client
 * Run with: node examples/multiple-servers.js
 */

const { MCPClient } = require('../dist/index.js');

async function main() {
  console.log('🌐 MCP Client - Multiple Servers Example\n');
  
  try {
    // Create client with multiple servers
    const client = new MCPClient([
      'http://localhost:8000/mcp',
      'http://localhost:8001/mcp',
      'http://localhost:8002/mcp'
    ]);
    
    // Get tools from all servers
    console.log('📋 Getting tools from all servers...');
    const toolsResponse = await client.getTools();
    
    if (toolsResponse.status === 'success') {
      console.log('✅ Total tools found:', toolsResponse.data.length);
      
      // Group tools by server
      const toolsByServer = {};
      toolsResponse.data.forEach(tool => {
        const serverUrl = tool._meta?.serverUrl || 'unknown';
        if (!toolsByServer[serverUrl]) {
          toolsByServer[serverUrl] = [];
        }
        toolsByServer[serverUrl].push(tool.name);
      });
      
      console.log('\n📊 Tools by server:');
      Object.entries(toolsByServer).forEach(([server, tools]) => {
        console.log(`  ${server}: ${tools.join(', ')}`);
      });
    } else {
      console.log('❌ Failed to get tools:', toolsResponse.error);
    }
    
    // Show connected servers
    console.log('\n🔗 Connected servers:', client.getConnectedServers());
    
    // Try to call a tool (will auto-find the right server)
    console.log('\n🔧 Calling greeting tool (auto-find server)...');
    const result = await client.callTool('greeting', { name: 'Multi-server' });
    
    if (result.status === 'success') {
      const greeting = result.data.content?.[0]?.text || result.data.structuredContent?.result;
      console.log('✅ Greeting result:', greeting);
      console.log('📍 Called on server:', result.serverUrl);
    } else {
      console.log('❌ Failed to call tool:', result.error);
    }
    
    console.log('\n🎉 Multiple servers example completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure at least one MCP server is running');
  }
}

main();
