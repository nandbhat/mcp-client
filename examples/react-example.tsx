/**
 * React example for MCP Client
 * This shows how to use the library in a React component
 * 
 * Shows both ultra-simple functions and class-based usage
 */

import React, { useState } from 'react';
import { MCPClient, getTools, callTool } from 'mcp-client';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

interface ToolResult {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: { result: any };
}

function MCPExample() {
  const [client] = useState(() => new MCPClient('http://localhost:8000/mcp'));
  const [tools, setTools] = useState<Tool[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('World');
  const [useUltraSimple, setUseUltraSimple] = useState(true);

  const handleGetTools = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useUltraSimple) {
        // Ultra-simple function - direct data return
        const tools = await getTools('http://localhost:8000/mcp');
        setTools(tools);
      } else {
        // Class-based approach - direct data return
        const tools = await client.getTools();
        setTools(tools);
      }
    } catch (err: any) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleCallTool = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (useUltraSimple) {
        // Ultra-simple function - direct data return
        result = await callTool('http://localhost:8000/mcp', 'greeting', { name });
      } else {
        // Class-based approach - direct data return
        result = await client.callTool('greeting', { name });
      }
      
      const greeting = result.content?.[0]?.text || result.structuredContent?.result;
      setResult(greeting);
    } catch (err: any) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MCP Client - React Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={useUltraSimple}
            onChange={(e) => setUseUltraSimple(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          Use Ultra-Simple Functions (recommended)
        </label>
        
        <button 
          onClick={handleGetTools} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {loading ? 'Loading...' : 'Get Tools'}
        </button>
        
        <button 
          onClick={handleCallTool} 
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          {loading ? 'Loading...' : 'Call Greeting Tool'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Name: 
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      {tools.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Available Tools:</h3>
          <ul>
            {tools.map((tool, index) => (
              <li key={index}>
                <strong>{tool.name}</strong>: {tool.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
          <h3>Tool Result:</h3>
          <p>{result}</p>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffe8e8', borderRadius: '5px' }}>
          <h3>Error:</h3>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Code Examples:</h3>
        
        <h4>Ultra-Simple Functions (Recommended):</h4>
        <pre style={{ fontSize: '12px', overflow: 'auto', marginBottom: '20px' }}>
{`import { getTools, callTool } from 'mcp-client';

function MyComponent() {
  const handleGetTools = async () => {
    const tools = await getTools('http://localhost:8000/mcp');
    console.log('Tools:', tools);
  };
  
  const handleCallTool = async () => {
    const result = await callTool('http://localhost:8000/mcp', 'greeting', { name: 'World' });
    console.log('Result:', result);
  };
  
  return (
    <div>
      <button onClick={handleGetTools}>Get Tools</button>
      <button onClick={handleCallTool}>Call Tool</button>
    </div>
  );
}`}
        </pre>
        
        <h4>Class-Based Approach:</h4>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`import { MCPClient } from 'mcp-client';

function MyComponent() {
  const [client] = useState(() => new MCPClient('http://localhost:8000/mcp'));
  
  const handleGetTools = async () => {
    const tools = await client.getTools();
    console.log('Tools:', tools);
  };
  
  const handleCallTool = async () => {
    const result = await client.callTool('greeting', { name: 'World' });
    console.log('Result:', result);
  };
  
  return (
    <div>
      <button onClick={handleGetTools}>Get Tools</button>
      <button onClick={handleCallTool}>Call Tool</button>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

export default MCPExample;
