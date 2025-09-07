/**
 * React example for MCP Client
 * This shows how to use the library in a React component
 */

import React, { useState } from 'react';
import { MCPClient } from 'mcp-client';

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

  const handleGetTools = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await client.getTools();
      if (response.status === 'success') {
        setTools(response.data);
      } else {
        setError(response.error || 'Failed to get tools');
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
      const response = await client.callTool('greeting', { name });
      if (response.status === 'success') {
        const greeting = response.data.content?.[0]?.text || 
                        response.data.structuredContent?.result;
        setResult(greeting);
      } else {
        setError(response.error || 'Failed to call tool');
      }
    } catch (err: any) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MCP Client - React Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
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
        <h3>Code Example:</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`import { MCPClient } from 'mcp-client';

function MyComponent() {
  const [client] = useState(() => new MCPClient('http://localhost:8000/mcp'));
  
  const handleGetTools = async () => {
    const response = await client.getTools();
    if (response.status === 'success') {
      console.log('Tools:', response.data);
    }
  };
  
  const handleCallTool = async () => {
    const response = await client.callTool('greeting', { name: 'World' });
    if (response.status === 'success') {
      console.log('Result:', response.data);
    }
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
