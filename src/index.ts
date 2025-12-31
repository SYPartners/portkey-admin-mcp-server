#!/usr/bin/env node
/**
 * Portkey MCP Server - stdio transport entry point
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./lib/mcp-server.js";

// Create MCP server with all tools registered
const { server } = createMcpServer();

// Start server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
