import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { PortkeyService } from "../services/index.js";
import { registerAnalyticsTools } from "./analytics.tools.js";
import { registerAuditTools } from "./audit.tools.js";
import { registerCollectionsTools } from "./collections.tools.js";
import { registerConfigsTools } from "./configs.tools.js";
import { registerGuardrailsTools } from "./guardrails.tools.js";
import { registerIntegrationsTools } from "./integrations.tools.js";
import { registerKeysTools } from "./keys.tools.js";
import { registerLabelsTools } from "./labels.tools.js";
import { registerLimitsTools } from "./limits.tools.js";
import { registerLoggingTools } from "./logging.tools.js";
import { registerPartialsTools } from "./partials.tools.js";
import { registerPromptsTools } from "./prompts.tools.js";
import { registerProvidersTools } from "./providers.tools.js";
import { registerTracingTools } from "./tracing.tools.js";
import { registerUsersTools } from "./users.tools.js";
import { registerWorkspacesTools } from "./workspaces.tools.js";

/**
 * Register all Admin API tools on the MCP server
 * @param server - The MCP server instance
 * @param service - The PortkeyService facade
 */
export function registerAllTools(
	server: McpServer,
	service: PortkeyService,
): void {
	// Register tools by domain
	registerUsersTools(server, service); // 10 tools
	registerWorkspacesTools(server, service); // 10 tools
	registerConfigsTools(server, service); // 6 tools
	registerKeysTools(server, service); // 10 tools
	registerCollectionsTools(server, service); // 5 tools
	registerPromptsTools(server, service); // 12 tools
	registerAnalyticsTools(server, service); // 20 tools
	registerGuardrailsTools(server, service); // 5 tools
	registerLimitsTools(server, service); // 10 tools (5 usage + 5 rate)
	registerAuditTools(server, service); // 1 tool
	registerLabelsTools(server, service); // 5 tools
	registerPartialsTools(server, service); // 7 tools
	registerTracingTools(server, service); // 4 tools
	registerLoggingTools(server, service); // 8 tools
	registerProvidersTools(server, service); // 5 tools
	registerIntegrationsTools(server, service); // 10 tools
	// Total: 128 Admin API tools
}

// Re-export individual registration functions for selective use
export {
	registerUsersTools,
	registerWorkspacesTools,
	registerConfigsTools,
	registerKeysTools,
	registerCollectionsTools,
	registerPromptsTools,
	registerAnalyticsTools,
	registerGuardrailsTools,
	registerLimitsTools,
	registerAuditTools,
	registerLabelsTools,
	registerPartialsTools,
	registerTracingTools,
	registerLoggingTools,
	registerProvidersTools,
	registerIntegrationsTools,
};
