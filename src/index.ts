import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HttpServer } from './server.js';
import { registerTools } from './tools.js';
import { CONFIG } from './config.js';

async function main() {
  // Create HTTP server instance
  const httpServer = new HttpServer();
  
  // Create MCP server instance
  const mcpServer = new McpServer({
    name: CONFIG.SERVER.NAME,
    version: CONFIG.SERVER.VERSION,
  });
  
  // Register all tools
  registerTools(mcpServer, httpServer);
  
  // Connect to MCP transport
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("Pokemon MCP Server running on stdio");
  
  // Handle graceful shutdown
  const shutdown = () => {
    console.error('Shutting down...');
    httpServer.close();
    process.exit(0);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', () => {
    httpServer.close();
  });
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
