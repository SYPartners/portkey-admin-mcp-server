import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PortkeyService } from "./services/portkey.service.js";
import { z } from "zod";

// Create service instance
const portkeyService = new PortkeyService();

// Create MCP server
const server = new McpServer({
  name: "portkey-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {}
  }
});

// List all users tool
server.tool(
  "list_all_users",
  "List all users in your Portkey organization, including their roles and account details",
  {},
  async () => {
    const users = await portkeyService.listUsers();
    return {
      content: [{ type: "text", text: JSON.stringify(users, null, 2) }]
    }
  }
);

// Invite user tool
server.tool(
  "invite_user",
  "Invite a new user to your Portkey organization with specific workspace access and API key permissions",
  {
    email: z.string().email().describe("Email address of the user to invite"),
    role: z.enum(['admin', 'member']).describe("Organization-level role: 'admin' for full access, 'member' for limited access"),
    first_name: z.string().optional().describe("User's first name"),
    last_name: z.string().optional().describe("User's last name"),
    workspaces: z.array(z.object({
      id: z.string().describe("Workspace ID/slug where the user will be granted access"),
      role: z.enum(['admin', 'member', 'manager']).describe("Workspace-level role: 'admin' for full access, 'manager' for workspace management, 'member' for basic access")
    })).describe("List of workspaces and corresponding roles to grant to the user"),
    workspace_api_key_details: z.object({
      name: z.string().optional().describe("Name of the API key to be created"),
      expiry: z.string().optional().describe("Expiration date for the API key (ISO8601 format)"),
      metadata: z.record(z.string()).optional().describe("Additional metadata key-value pairs for the API key"),
      scopes: z.array(z.string()).describe("List of permission scopes for the API key")
    }).optional().describe("Optional API key to be created for the user")
  },
  async (params) => {
    try {
      const result = await portkeyService.inviteUser(params);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            message: `Successfully invited ${params.email} as ${params.role}`,
            invite_id: result.id,
            invite_link: result.invite_link
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error inviting user: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// User analytics tool
server.tool(
  "get_user_stats",
  "Retrieve detailed analytics data about user activity within a specified time range, including request counts and costs",
  {
    time_of_generation_min: z.string().describe("Start time for the analytics period (ISO8601 format, e.g., '2024-01-01T00:00:00Z')"),
    time_of_generation_max: z.string().describe("End time for the analytics period (ISO8601 format, e.g., '2024-02-01T00:00:00Z')"),
    total_units_min: z.number().positive().optional().describe("Minimum number of total tokens to filter by"),
    total_units_max: z.number().positive().optional().describe("Maximum number of total tokens to filter by"),
    cost_min: z.number().positive().optional().describe("Minimum cost in cents to filter by"),
    cost_max: z.number().positive().optional().describe("Maximum cost in cents to filter by"),
    status_code: z.string().optional().describe("Filter by specific HTTP status codes (comma-separated)"),
    virtual_keys: z.string().optional().describe("Filter by specific virtual key slugs (comma-separated)"),
    page_size: z.number().positive().optional().describe("Number of results per page (for pagination)")
  },
  async (params) => {
    try {
      const stats = await portkeyService.getUserGroupedData(params);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(stats, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching user statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// List workspaces tool
server.tool(
  "list_workspaces",
  "Retrieve all workspaces in your Portkey organization, including their configurations and metadata",
  {
    page_size: z.number().positive().optional().describe("Number of workspaces to return per page (default varies by endpoint)"),
    current_page: z.number().positive().optional().describe("Page number to retrieve when results are paginated")
  },
  async (params) => {
    try {
      const workspaces = await portkeyService.listWorkspaces(params);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(workspaces, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching workspaces: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Get single workspace tool
server.tool(
  "get_workspace",
  "Retrieve detailed information about a specific workspace, including its configuration, metadata, and user access details",
  {
    workspace_id: z.string().describe(
      "The unique identifier of the workspace to retrieve. " +
      "This can be found in the workspace's URL or from the list_workspaces tool response"
    )
  },
  async (params) => {
    try {
      const workspace = await portkeyService.getWorkspace(params.workspace_id);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            description: workspace.description,
            created_at: workspace.created_at,
            last_updated_at: workspace.last_updated_at,
            defaults: workspace.defaults,
            users: workspace.users.map(user => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              organization_role: user.org_role,
              workspace_role: user.role,
              status: user.status,
              created_at: user.created_at,
              last_updated_at: user.last_updated_at
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching workspace details: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// List configurations tool
server.tool(
  "list_configs",
  "Retrieve all configurations in your Portkey organization, including their status and workspace associations",
  {},
  async () => {
    try {
      const configs = await portkeyService.listConfigs();
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: configs.success,
            configurations: configs.data.map(config => ({
              id: config.id,
              name: config.name,
              slug: config.slug,
              workspace_id: config.workspace_id,
              status: config.status,
              is_default: config.is_default,
              created_at: config.created_at,
              last_updated_at: config.last_updated_at,
              owner_id: config.owner_id,
              updated_by: config.updated_by
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching configurations: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// List virtual keys tool
server.tool(
  "list_virtual_keys",
  "Retrieve all virtual keys in your Portkey organization, including their usage limits, rate limits, and status",
  {},
  async () => {
    try {
      const virtualKeys = await portkeyService.listVirtualKeys();
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            total: virtualKeys.total,
            virtual_keys: virtualKeys.data.map(key => ({
              name: key.name,
              slug: key.slug,
              status: key.status,
              note: key.note,
              usage_limits: key.usage_limits ? {
                credit_limit: key.usage_limits.credit_limit,
                alert_threshold: key.usage_limits.alert_threshold,
                periodic_reset: key.usage_limits.periodic_reset
              } : null,
              rate_limits: key.rate_limits?.map(limit => ({
                type: limit.type,
                unit: limit.unit,
                value: limit.value
              })) ?? null,
              reset_usage: key.reset_usage,
              created_at: key.created_at,
              model_config: key.model_config
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching virtual keys: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Get cost analytics tool
server.tool(
  "get_cost_analytics",
  "Retrieve detailed cost analytics data over time, including total costs and averages per request",
  {
    time_of_generation_min: z.string().describe("Start time for the analytics period (ISO8601 format, e.g., '2024-01-01T00:00:00Z')"),
    time_of_generation_max: z.string().describe("End time for the analytics period (ISO8601 format, e.g., '2024-02-01T00:00:00Z')"),
    total_units_min: z.number().positive().optional().describe("Minimum number of total tokens to filter by"),
    total_units_max: z.number().positive().optional().describe("Maximum number of total tokens to filter by"),
    cost_min: z.number().positive().optional().describe("Minimum cost in cents to filter by"),
    cost_max: z.number().positive().optional().describe("Maximum cost in cents to filter by"),
    prompt_token_min: z.number().positive().optional().describe("Minimum number of prompt tokens"),
    prompt_token_max: z.number().positive().optional().describe("Maximum number of prompt tokens"),
    completion_token_min: z.number().positive().optional().describe("Minimum number of completion tokens"),
    completion_token_max: z.number().positive().optional().describe("Maximum number of completion tokens"),
    status_code: z.string().optional().describe("Filter by specific HTTP status codes (comma-separated)"),
    weighted_feedback_min: z.number().min(-10).max(10).optional().describe("Minimum weighted feedback score (-10 to 10)"),
    weighted_feedback_max: z.number().min(-10).max(10).optional().describe("Maximum weighted feedback score (-10 to 10)"),
    virtual_keys: z.string().optional().describe("Filter by specific virtual key slugs (comma-separated)"),
    configs: z.string().optional().describe("Filter by specific config slugs (comma-separated)"),
    workspace_slug: z.string().optional().describe("Filter by specific workspace"),
    api_key_ids: z.string().optional().describe("Filter by specific API key UUIDs (comma-separated)"),
    metadata: z.string().optional().describe("Filter by metadata (stringified JSON object)"),
    ai_org_model: z.string().optional().describe("Filter by AI provider and model (comma-separated, use __ as separator)"),
    trace_id: z.string().optional().describe("Filter by trace IDs (comma-separated)"),
    span_id: z.string().optional().describe("Filter by span IDs (comma-separated)")
  },
  async (params) => {
    try {
      const analytics = await portkeyService.getCostAnalytics(params);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            summary: {
              total_cost: analytics.summary.total,
              average_cost_per_request: analytics.summary.avg
            },
            data_points: analytics.data_points.map(point => ({
              timestamp: point.timestamp,
              total_cost: point.total,
              average_cost: point.avg
            })),
            object: analytics.object
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching cost analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Get configuration details tool
server.tool(
  "get_config",
  "Retrieve detailed information about a specific configuration, including cache settings, retry policies, and routing strategy",
  {
    slug: z.string().describe(
      "The unique identifier (slug) of the configuration to retrieve. " +
      "This can be found in the configuration's URL or from the list_configs tool response"
    )
  },
  async (params) => {
    try {
      const config = await portkeyService.getConfig(params.slug);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            success: config.success,
            config: {
              cache: config.data?.config?.cache && {
                mode: config.data.config.cache.mode,
                max_age: config.data.config.cache.max_age
              },
              retry: config.data?.config?.retry && {
                attempts: config.data.config.retry.attempts,
                on_status_codes: config.data.config.retry.on_status_codes
              },
              strategy: config.data?.config?.strategy && {
                mode: config.data.config.strategy.mode
              },
              targets: config.data?.config?.targets?.map(target => ({
                provider: target.provider,
                virtual_key: target.virtual_key
              }))
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Error fetching configuration details: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// ============================================
// Collection Tools (App Grouping)
// ============================================

// List collections tool
server.tool(
  "list_collections",
  "List all prompt collections in your Portkey organization. Collections group prompts by app (e.g., hourlink, apizone, research-pilot).",
  {
    workspace_id: z.string().optional().describe("Filter by workspace ID"),
    search: z.string().optional().describe("Search collections by name"),
    current_page: z.number().positive().optional().describe("Page number for pagination"),
    page_size: z.number().positive().max(100).optional().describe("Results per page (max 100)")
  },
  async (params) => {
    try {
      const collections = await portkeyService.listCollections(params);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            total: collections.total,
            collections: collections.data.map(collection => ({
              id: collection.id,
              name: collection.name,
              slug: collection.slug,
              workspace_id: collection.workspace_id,
              created_at: collection.created_at,
              last_updated_at: collection.last_updated_at
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error listing collections: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Create collection tool
server.tool(
  "create_collection",
  "Create a new prompt collection for organizing prompts by app. Use one collection per app (hourlink, apizone, research-pilot).",
  {
    name: z.string().describe("Collection name (e.g., 'hourlink', 'apizone', 'research-pilot')"),
    workspace_id: z.string().optional().describe("Workspace ID to create collection in")
  },
  async (params) => {
    try {
      const result = await portkeyService.createCollection(params);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: `Successfully created collection "${params.name}"`,
            id: result.id,
            slug: result.slug
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating collection: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Get collection tool
server.tool(
  "get_collection",
  "Retrieve detailed information about a specific collection",
  {
    collection_id: z.string().describe("Collection ID or slug to retrieve")
  },
  async (params) => {
    try {
      const collection = await portkeyService.getCollection(params.collection_id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: collection.id,
            name: collection.name,
            slug: collection.slug,
            workspace_id: collection.workspace_id,
            created_at: collection.created_at,
            last_updated_at: collection.last_updated_at
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching collection: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// ============================================
// Prompt Admin Tools
// ============================================

// Zod schemas for reusable prompt components
const PromptMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']).describe("Message role"),
  content: z.string().describe("Message content with optional {{variable}} placeholders")
});

const PromptParameterSchema = z.object({
  name: z.string().describe("Parameter name (matches {{name}} in template)"),
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']).describe("Parameter data type"),
  default: z.union([z.string(), z.number(), z.boolean(), z.array(z.unknown()), z.record(z.unknown())]).optional().describe("Default value"),
  required: z.boolean().optional().describe("Whether this parameter is required"),
  description: z.string().optional().describe("Parameter description")
});

const PromptFunctionSchema = z.object({
  name: z.string().describe("Function name"),
  description: z.string().optional().describe("Function description"),
  parameters: z.record(z.unknown()).optional().describe("Function parameters schema")
});

const PromptToolSchema = z.object({
  type: z.literal('function').describe("Tool type"),
  function: PromptFunctionSchema.describe("Function definition")
});

const HyperparametersSchema = z.object({
  max_tokens: z.number().positive().optional().describe("Maximum tokens to generate"),
  temperature: z.number().min(0).max(2).optional().describe("Sampling temperature (0-2)"),
  top_p: z.number().min(0).max(1).optional().describe("Top-p sampling (0-1)"),
  top_k: z.number().positive().optional().describe("Top-k sampling"),
  presence_penalty: z.number().min(-2).max(2).optional().describe("Presence penalty (-2 to 2)"),
  frequency_penalty: z.number().min(-2).max(2).optional().describe("Frequency penalty (-2 to 2)"),
  stop: z.array(z.string()).optional().describe("Stop sequences")
});

const BillingMetadataSchema = z.object({
  client_id: z.string().describe("Client ID for billing attribution (REQUIRED)"),
  app: z.enum(['hourlink', 'apizone', 'research-pilot']).describe("App identifier (REQUIRED)"),
  env: z.enum(['dev', 'staging', 'prod']).describe("Environment (REQUIRED)"),
  project_id: z.string().optional().describe("Project ID for granular billing"),
  feature: z.string().optional().describe("Feature name for tracking")
});

// Create prompt tool
server.tool(
  "create_prompt",
  "Create a new prompt template in Portkey. Prompts are versioned message templates with variable substitution support.",
  {
    name: z.string().describe("Display name for the prompt"),
    collection_id: z.string().describe("Collection ID to organize the prompt in (use list_collections to find)"),
    string: z.string().describe("Prompt template string with {{variable}} mustache syntax"),
    parameters: z.record(z.unknown()).describe("Default values for template variables"),
    virtual_key: z.string().describe("Virtual key slug for model access"),
    model: z.string().optional().describe("Model identifier (e.g., 'gpt-4', 'claude-3-opus')"),
    version_description: z.string().optional().describe("Description for this prompt version"),
    template_metadata: z.record(z.unknown()).optional().describe("Custom metadata (app, env, source_file, etc.)"),
    functions: z.array(PromptFunctionSchema).optional().describe("Function definitions for function calling"),
    tools: z.array(PromptToolSchema).optional().describe("Tool definitions for tool use"),
    tool_choice: z.union([
      z.enum(['auto', 'none']),
      z.object({ type: z.literal('function'), function: z.object({ name: z.string() }) })
    ]).optional().describe("Tool choice strategy"),
    dry_run: z.boolean().optional().describe("When true, validate without creating")
  },
  async (params) => {
    try {
      if (params.dry_run) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              dry_run: true,
              action: 'create',
              message: `Would create prompt "${params.name}" in collection ${params.collection_id}`,
              prompt_preview: {
                name: params.name,
                collection_id: params.collection_id,
                model: params.model,
                template_length: params.string.length,
                parameter_count: Object.keys(params.parameters ?? {}).length
              }
            }, null, 2)
          }]
        };
      }

      const result = await portkeyService.createPrompt({
        name: params.name,
        collection_id: params.collection_id,
        string: params.string,
        parameters: params.parameters,
        virtual_key: params.virtual_key,
        model: params.model,
        version_description: params.version_description,
        template_metadata: params.template_metadata,
        functions: params.functions,
        tools: params.tools,
        tool_choice: params.tool_choice
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: `Successfully created prompt "${params.name}"`,
            id: result.id,
            slug: result.slug,
            version_id: result.version_id
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// List prompts tool
server.tool(
  "list_prompts",
  "List all prompts in your Portkey organization with optional filtering by collection, workspace, or search query",
  {
    collection_id: z.string().optional().describe("Filter by collection ID (recommended for app-specific prompts)"),
    workspace_id: z.string().optional().describe("Filter by workspace ID"),
    search: z.string().optional().describe("Search prompts by name"),
    current_page: z.number().positive().optional().describe("Page number for pagination"),
    page_size: z.number().positive().max(100).optional().describe("Results per page (max 100)")
  },
  async (params) => {
    try {
      const prompts = await portkeyService.listPrompts(params);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            total: prompts.total,
            prompts: prompts.data.map(prompt => ({
              id: prompt.id,
              name: prompt.name,
              slug: prompt.slug,
              collection_id: prompt.collection_id,
              model: prompt.model,
              status: prompt.status,
              created_at: prompt.created_at,
              last_updated_at: prompt.last_updated_at
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error listing prompts: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Get prompt tool
server.tool(
  "get_prompt",
  "Retrieve detailed information about a specific prompt including its template, parameters, and version history",
  {
    prompt_id: z.string().describe("Prompt ID or slug to retrieve")
  },
  async (params) => {
    try {
      const prompt = await portkeyService.getPrompt(params.prompt_id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: prompt.id,
            name: prompt.name,
            slug: prompt.slug,
            collection_id: prompt.collection_id,
            created_at: prompt.created_at,
            last_updated_at: prompt.last_updated_at,
            current_version: {
              id: prompt.current_version.id,
              version_number: prompt.current_version.version_number,
              description: prompt.current_version.version_description,
              model: prompt.current_version.model,
              template: prompt.current_version.string,
              parameters: prompt.current_version.parameters,
              metadata: prompt.current_version.template_metadata,
              has_tools: !!(prompt.current_version.tools?.length),
              has_functions: !!(prompt.current_version.functions?.length)
            },
            version_count: prompt.versions.length,
            versions: prompt.versions.map(v => ({
              id: v.id,
              version_number: v.version_number,
              description: v.version_description,
              created_at: v.created_at
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Update prompt tool
server.tool(
  "update_prompt",
  "Update an existing prompt template. Creates a new version with the changes.",
  {
    prompt_id: z.string().describe("Prompt ID or slug to update"),
    name: z.string().optional().describe("New display name for the prompt"),
    collection_id: z.string().optional().describe("Move to a different collection"),
    string: z.string().optional().describe("New prompt template string with {{variable}} mustache syntax"),
    parameters: z.record(z.unknown()).optional().describe("New default values for template variables"),
    model: z.string().optional().describe("New model identifier"),
    virtual_key: z.string().optional().describe("New virtual key slug"),
    version_description: z.string().optional().describe("Description for this version"),
    template_metadata: z.record(z.unknown()).optional().describe("New metadata"),
    functions: z.array(PromptFunctionSchema).optional().describe("New function definitions"),
    tools: z.array(PromptToolSchema).optional().describe("New tool definitions"),
    tool_choice: z.union([
      z.enum(['auto', 'none']),
      z.object({ type: z.literal('function'), function: z.object({ name: z.string() }) })
    ]).optional().describe("New tool choice strategy"),
    dry_run: z.boolean().optional().describe("When true, validate without updating")
  },
  async (params) => {
    try {
      const { prompt_id, dry_run, ...updateData } = params;

      if (dry_run) {
        const current = await portkeyService.getPrompt(prompt_id);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              dry_run: true,
              action: 'update',
              message: `Would update prompt "${current.name}"`,
              current_version: current.current_version.version_number,
              changes: Object.keys(updateData).filter(k => updateData[k as keyof typeof updateData] !== undefined)
            }, null, 2)
          }]
        };
      }

      const result = await portkeyService.updatePrompt(prompt_id, updateData);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: `Successfully updated prompt`,
            id: result.id,
            slug: result.slug,
            new_version_id: result.prompt_version_id
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error updating prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Render prompt tool
server.tool(
  "render_prompt",
  "Render a prompt template by substituting variables, returning the final messages without executing",
  {
    prompt_id: z.string().describe("Prompt ID or slug to render"),
    variables: z.record(z.union([z.string(), z.number(), z.boolean()])).describe("Variable values to substitute into the template"),
    hyperparameters: HyperparametersSchema.optional().describe("Override default hyperparameters")
  },
  async (params) => {
    try {
      const result = await portkeyService.renderPrompt(params.prompt_id, {
        variables: params.variables,
        hyperparameters: params.hyperparameters
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: result.success,
            rendered_messages: result.data.messages,
            model: result.data.model,
            hyperparameters: {
              max_tokens: result.data.max_tokens,
              temperature: result.data.temperature,
              top_p: result.data.top_p
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error rendering prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Run prompt completion tool
server.tool(
  "run_prompt_completion",
  "Execute a prompt template with variables and get the model completion response. REQUIRES billing metadata (client_id, app, env).",
  {
    prompt_id: z.string().describe("Prompt ID or slug to execute"),
    variables: z.record(z.union([z.string(), z.number(), z.boolean()])).describe("Variable values to substitute into the template"),
    metadata: BillingMetadataSchema.describe("Billing metadata - client_id, app, env are REQUIRED for cost attribution"),
    hyperparameters: HyperparametersSchema.optional().describe("Override default hyperparameters")
  },
  async (params) => {
    try {
      const result = await portkeyService.runPromptCompletion(params.prompt_id, {
        variables: params.variables,
        metadata: params.metadata,
        hyperparameters: params.hyperparameters,
        stream: false
      });

      const choice = result.choices?.[0];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: result.id,
            model: result.model,
            response: choice?.message?.content ?? null,
            finish_reason: choice?.finish_reason ?? null,
            usage: result.usage ? {
              prompt_tokens: result.usage.prompt_tokens,
              completion_tokens: result.usage.completion_tokens,
              total_tokens: result.usage.total_tokens
            } : null
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error running prompt completion: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// ============================================
// Migration & Promotion Tools
// ============================================

// Migrate prompt tool
server.tool(
  "migrate_prompt",
  "Create or update a prompt based on whether it exists. Useful for CI/CD and prompt-as-code workflows. Finds existing prompts by name within the collection.",
  {
    name: z.string().describe("Prompt name to create or find for update"),
    app: z.enum(['hourlink', 'apizone', 'research-pilot']).describe("App identifier"),
    env: z.enum(['dev', 'staging', 'prod']).describe("Environment"),
    collection_id: z.string().describe("Collection ID to search in and create under"),
    string: z.string().describe("Prompt template string with {{variable}} mustache syntax"),
    parameters: z.record(z.unknown()).describe("Default values for template variables"),
    virtual_key: z.string().describe("Virtual key slug for model access"),
    model: z.string().optional().describe("Model identifier"),
    version_description: z.string().optional().describe("Description for this version"),
    template_metadata: z.record(z.unknown()).optional().describe("Additional custom metadata"),
    functions: z.array(PromptFunctionSchema).optional().describe("Function definitions"),
    tools: z.array(PromptToolSchema).optional().describe("Tool definitions"),
    tool_choice: z.union([
      z.enum(['auto', 'none']),
      z.object({ type: z.literal('function'), function: z.object({ name: z.string() }) })
    ]).optional().describe("Tool choice strategy"),
    dry_run: z.boolean().optional().describe("When true, only check what action would be taken without making changes")
  },
  async (params) => {
    try {
      const result = await portkeyService.migratePrompt({
        name: params.name,
        app: params.app,
        env: params.env,
        collection_id: params.collection_id,
        string: params.string,
        parameters: params.parameters,
        virtual_key: params.virtual_key,
        model: params.model,
        version_description: params.version_description,
        template_metadata: params.template_metadata,
        functions: params.functions,
        tools: params.tools,
        tool_choice: params.tool_choice,
        dry_run: params.dry_run
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            action: result.action,
            dry_run: result.dry_run,
            message: result.message,
            prompt_id: result.prompt_id ?? undefined,
            slug: result.slug ?? undefined,
            version_id: result.version_id ?? undefined
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error migrating prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Promote prompt tool
server.tool(
  "promote_prompt",
  "Promote a prompt from one environment to another (e.g., staging → prod). Copies the current version to the target environment.",
  {
    source_prompt_id: z.string().describe("Source prompt ID or slug (e.g., staging prompt)"),
    target_collection_id: z.string().describe("Target collection ID for the promoted prompt"),
    target_name: z.string().optional().describe("Target prompt name (defaults to source name with env suffix replaced)"),
    target_env: z.enum(['dev', 'staging', 'prod']).describe("Target environment"),
    virtual_key: z.string().optional().describe("Virtual key ID to use (defaults to source prompt's virtual_key)")
  },
  async (params) => {
    try {
      const result = await portkeyService.promotePrompt({
        source_prompt_id: params.source_prompt_id,
        target_collection_id: params.target_collection_id,
        target_name: params.target_name,
        target_env: params.target_env,
        virtual_key: params.virtual_key
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: `Successfully promoted prompt to ${params.target_env}`,
            source: {
              prompt_id: result.source_prompt_id,
              version_id: result.source_version_id
            },
            target: {
              prompt_id: result.target_prompt_id,
              version_id: result.target_version_id,
              action: result.action
            },
            promoted_at: result.promoted_at
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error promoting prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// ============================================
// Metadata Validation Tool
// ============================================

// Validate completion metadata tool
server.tool(
  "validate_completion_metadata",
  "Validate billing metadata before running a completion. Checks for required fields (client_id, app, env) and valid values.",
  {
    client_id: z.string().optional().describe("Client ID for billing attribution"),
    app: z.enum(['hourlink', 'apizone', 'research-pilot']).optional().describe("App identifier"),
    env: z.enum(['dev', 'staging', 'prod']).optional().describe("Environment"),
    project_id: z.string().optional().describe("Project ID for granular billing"),
    feature: z.string().optional().describe("Feature name for tracking")
  },
  async (params) => {
    try {
      const result = portkeyService.validateBillingMetadata(params);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            valid: result.valid,
            errors: result.errors,
            warnings: result.warnings,
            metadata: params
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error validating metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// ============================================
// Phase 1: Config Management Tools
// ============================================

server.tool(
  "create_config",
  "Create a new gateway configuration with routing rules, model settings, and other options",
  {
    name: z.string().describe("Name for the new config"),
    config: z.record(z.unknown()).describe("Configuration object with routing rules, cache settings, etc."),
    is_default: z.number().optional().describe("Set to 1 to make this the default config"),
    workspace_id: z.string().optional().describe("Workspace ID to create the config in")
  },
  async (params) => {
    try {
      const result = await portkeyService.createConfig({
        name: params.name,
        config: params.config,
        is_default: params.is_default,
        workspace_id: params.workspace_id
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating config: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_config",
  "Update an existing gateway configuration",
  {
    config_id: z.string().describe("Config ID or slug to update"),
    name: z.string().optional().describe("New name for the config"),
    config: z.record(z.unknown()).optional().describe("Updated configuration object"),
    is_default: z.number().optional().describe("Set to 1 to make this the default config")
  },
  async (params) => {
    try {
      const result = await portkeyService.updateConfig(params.config_id, {
        name: params.name,
        config: params.config,
        is_default: params.is_default
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating config: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_config",
  "Delete a gateway configuration",
  {
    config_id: z.string().describe("Config ID or slug to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteConfig(params.config_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Config ${params.config_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting config: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "list_config_versions",
  "List all versions of a configuration",
  {
    config_id: z.string().describe("Config ID or slug to list versions for")
  },
  async (params) => {
    try {
      const result = await portkeyService.listConfigVersions(params.config_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing config versions: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 1: API Key Tools
// ============================================

server.tool(
  "create_api_key",
  "Create a new API key for accessing Portkey services",
  {
    name: z.string().describe("Name for the new API key"),
    type: z.string().optional().describe("Type of API key"),
    scopes: z.array(z.string()).optional().describe("Permission scopes for the API key"),
    workspace_id: z.string().optional().describe("Workspace ID to scope the API key to"),
    rate_limits: z.array(z.object({
      type: z.string(),
      unit: z.string(),
      value: z.number()
    })).optional().describe("Rate limiting configuration"),
    usage_limits: z.object({
      credit_limit: z.number().optional(),
      alert_threshold: z.number().optional(),
      periodic_reset: z.string().optional()
    }).optional().describe("Usage limits configuration"),
    expiry: z.string().optional().describe("Expiration date in ISO8601 format"),
    metadata: z.record(z.string()).optional().describe("Custom metadata key-value pairs")
  },
  async (params) => {
    try {
      const result = await portkeyService.createApiKey(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating API key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "list_api_keys",
  "List all API keys in your Portkey organization",
  {
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination"),
    workspace_id: z.string().optional().describe("Filter by workspace ID")
  },
  async (params) => {
    try {
      const result = await portkeyService.listApiKeys(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing API keys: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_api_key",
  "Get details of a specific API key",
  {
    api_key_id: z.string().describe("API key ID to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getApiKey(params.api_key_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting API key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_api_key",
  "Update an existing API key",
  {
    api_key_id: z.string().describe("API key ID to update"),
    name: z.string().optional().describe("New name for the API key"),
    scopes: z.array(z.string()).optional().describe("Updated permission scopes"),
    rate_limits: z.array(z.object({
      type: z.string(),
      unit: z.string(),
      value: z.number()
    })).optional().describe("Updated rate limiting configuration"),
    usage_limits: z.object({
      credit_limit: z.number().optional(),
      alert_threshold: z.number().optional(),
      periodic_reset: z.string().optional()
    }).optional().describe("Updated usage limits"),
    status: z.string().optional().describe("API key status (e.g., 'active', 'inactive')")
  },
  async (params) => {
    try {
      const { api_key_id, ...updateData } = params;
      const result = await portkeyService.updateApiKey(api_key_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating API key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_api_key",
  "Delete an API key",
  {
    api_key_id: z.string().describe("API key ID to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteApiKey(params.api_key_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `API key ${params.api_key_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting API key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 1: Virtual Key Tools
// ============================================

server.tool(
  "create_virtual_key",
  "Create a new virtual key to wrap provider API keys with additional controls",
  {
    name: z.string().describe("Name for the virtual key"),
    key: z.string().describe("The actual provider API key to wrap"),
    provider: z.string().describe("Provider name (e.g., 'openai', 'anthropic', 'azure')"),
    note: z.string().optional().describe("Optional note or description"),
    api_key_id: z.string().optional().describe("API key ID to associate with"),
    workspace_id: z.string().optional().describe("Workspace ID to create the key in"),
    rate_limits: z.array(z.object({
      type: z.string(),
      unit: z.string(),
      value: z.number()
    })).optional().describe("Rate limiting configuration"),
    usage_limits: z.object({
      credit_limit: z.number().optional(),
      alert_threshold: z.number().optional(),
      periodic_reset: z.string().optional()
    }).optional().describe("Usage limits configuration"),
    model_config: z.record(z.unknown()).optional().describe("Model-specific configuration")
  },
  async (params) => {
    try {
      const result = await portkeyService.createVirtualKey(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating virtual key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_virtual_key",
  "Get details of a specific virtual key",
  {
    virtual_key_id: z.string().describe("Virtual key ID or slug to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getVirtualKey(params.virtual_key_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting virtual key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_virtual_key",
  "Update an existing virtual key",
  {
    virtual_key_id: z.string().describe("Virtual key ID or slug to update"),
    name: z.string().optional().describe("New name for the virtual key"),
    note: z.string().optional().describe("Updated note or description"),
    rate_limits: z.array(z.object({
      type: z.string(),
      unit: z.string(),
      value: z.number()
    })).optional().describe("Updated rate limiting configuration"),
    usage_limits: z.object({
      credit_limit: z.number().optional(),
      alert_threshold: z.number().optional(),
      periodic_reset: z.string().optional()
    }).optional().describe("Updated usage limits"),
    model_config: z.record(z.unknown()).optional().describe("Updated model-specific configuration"),
    status: z.string().optional().describe("Virtual key status")
  },
  async (params) => {
    try {
      const { virtual_key_id, ...updateData } = params;
      const result = await portkeyService.updateVirtualKey(virtual_key_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating virtual key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_virtual_key",
  "Delete a virtual key",
  {
    virtual_key_id: z.string().describe("Virtual key ID or slug to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteVirtualKey(params.virtual_key_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Virtual key ${params.virtual_key_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting virtual key: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 1: Workspace Management Tools
// ============================================

server.tool(
  "create_workspace",
  "Create a new workspace in your Portkey organization",
  {
    name: z.string().describe("Name for the new workspace"),
    description: z.string().optional().describe("Description of the workspace"),
    defaults: z.object({
      is_default: z.number().optional(),
      metadata: z.record(z.string()).optional()
    }).optional().describe("Default settings for the workspace")
  },
  async (params) => {
    try {
      const result = await portkeyService.createWorkspace(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating workspace: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_workspace",
  "Update an existing workspace",
  {
    workspace_id: z.string().describe("Workspace ID or slug to update"),
    name: z.string().optional().describe("New name for the workspace"),
    description: z.string().optional().describe("Updated description"),
    defaults: z.object({
      is_default: z.number().optional(),
      metadata: z.record(z.string()).optional()
    }).optional().describe("Updated default settings")
  },
  async (params) => {
    try {
      const { workspace_id, ...updateData } = params;
      const result = await portkeyService.updateWorkspace(workspace_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating workspace: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_workspace",
  "Delete a workspace",
  {
    workspace_id: z.string().describe("Workspace ID or slug to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteWorkspace(params.workspace_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Workspace ${params.workspace_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting workspace: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 1: Workspace Member Tools
// ============================================

server.tool(
  "add_workspace_member",
  "Add a user as a member of a workspace",
  {
    workspace_id: z.string().describe("Workspace ID or slug"),
    user_id: z.string().describe("User ID to add as a member"),
    role: z.enum(['admin', 'member', 'manager']).describe("Role to assign: 'admin' for full access, 'manager' for workspace management, 'member' for basic access")
  },
  async (params) => {
    try {
      const result = await portkeyService.addWorkspaceMember(params.workspace_id, {
        user_id: params.user_id,
        role: params.role
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error adding workspace member: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "list_workspace_members",
  "List all members in a workspace",
  {
    workspace_id: z.string().describe("Workspace ID or slug"),
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination")
  },
  async (params) => {
    try {
      const { workspace_id, ...queryParams } = params;
      const result = await portkeyService.listWorkspaceMembers(workspace_id, queryParams);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing workspace members: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_workspace_member",
  "Get details of a specific workspace member",
  {
    workspace_id: z.string().describe("Workspace ID or slug"),
    user_id: z.string().describe("User ID of the member to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getWorkspaceMember(params.workspace_id, params.user_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting workspace member: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_workspace_member",
  "Update a member's role in a workspace",
  {
    workspace_id: z.string().describe("Workspace ID or slug"),
    user_id: z.string().describe("User ID of the member to update"),
    role: z.enum(['admin', 'member', 'manager']).describe("New role to assign")
  },
  async (params) => {
    try {
      const result = await portkeyService.updateWorkspaceMember(params.workspace_id, params.user_id, {
        role: params.role
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating workspace member: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "remove_workspace_member",
  "Remove a member from a workspace",
  {
    workspace_id: z.string().describe("Workspace ID or slug"),
    user_id: z.string().describe("User ID of the member to remove")
  },
  async (params) => {
    try {
      await portkeyService.removeWorkspaceMember(params.workspace_id, params.user_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Member ${params.user_id} removed from workspace ${params.workspace_id}` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error removing workspace member: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 1: User Management Tools
// ============================================

server.tool(
  "get_user",
  "Get details of a specific user in your Portkey organization",
  {
    user_id: z.string().describe("User ID to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getUser(params.user_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting user: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_user",
  "Update user information in your Portkey organization",
  {
    user_id: z.string().describe("User ID to update"),
    first_name: z.string().optional().describe("New first name"),
    last_name: z.string().optional().describe("New last name"),
    role: z.enum(['admin', 'member']).optional().describe("New organization-level role")
  },
  async (params) => {
    try {
      const { user_id, ...updateData } = params;
      const result = await portkeyService.updateUser(user_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_user",
  "Remove a user from your Portkey organization",
  {
    user_id: z.string().describe("User ID to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteUser(params.user_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `User ${params.user_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 2: User Invite Tools
// ============================================

server.tool(
  "list_user_invites",
  "List all user invitations in your Portkey organization with optional filtering by status",
  {
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination"),
    status: z.enum(['pending', 'accepted', 'expired']).optional().describe("Filter by invite status")
  },
  async (params) => {
    try {
      const result = await portkeyService.listUserInvites(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing user invites: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_user_invite",
  "Get details of a specific user invitation",
  {
    invite_id: z.string().describe("The ID of the user invite to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getUserInvite(params.invite_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting user invite: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_user_invite",
  "Delete a pending user invitation",
  {
    invite_id: z.string().describe("The ID of the user invite to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteUserInvite(params.invite_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `User invite ${params.invite_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting user invite: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "resend_user_invite",
  "Resend a user invitation email",
  {
    invite_id: z.string().describe("The ID of the user invite to resend")
  },
  async (params) => {
    try {
      const result = await portkeyService.resendUserInvite(params.invite_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `User invite resent successfully`, invite: result }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error resending user invite: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 2: Guardrail Tools
// ============================================

const GuardrailCheckSchema = z.object({
  id: z.string().describe("Unique identifier for the check"),
  type: z.string().describe("Type of guardrail check (e.g., 'pii', 'toxicity', 'prompt_injection')"),
  enabled: z.boolean().describe("Whether this check is enabled"),
  config: z.record(z.unknown()).optional().describe("Configuration options for this check")
});

server.tool(
  "create_guardrail",
  "Create a new guardrail for content safety and policy enforcement",
  {
    name: z.string().describe("Name for the guardrail"),
    description: z.string().optional().describe("Description of what this guardrail does"),
    checks: z.array(GuardrailCheckSchema).describe("Array of checks to include in this guardrail"),
    actions: z.object({
      on_fail: z.enum(['block', 'log', 'warn']).optional().describe("Action to take when checks fail"),
      on_pass: z.enum(['allow', 'log']).optional().describe("Action to take when checks pass")
    }).optional().describe("Actions to take based on check results"),
    workspace_id: z.string().optional().describe("Workspace ID to create the guardrail in")
  },
  async (params) => {
    try {
      const result = await portkeyService.createGuardrail(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating guardrail: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "list_guardrails",
  "List all guardrails in your Portkey organization",
  {
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination"),
    workspace_id: z.string().optional().describe("Filter by workspace ID")
  },
  async (params) => {
    try {
      const result = await portkeyService.listGuardrails(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing guardrails: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_guardrail",
  "Get details of a specific guardrail",
  {
    guardrail_id: z.string().describe("The ID or slug of the guardrail to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getGuardrail(params.guardrail_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting guardrail: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_guardrail",
  "Update an existing guardrail",
  {
    guardrail_id: z.string().describe("The ID or slug of the guardrail to update"),
    name: z.string().optional().describe("New name for the guardrail"),
    description: z.string().optional().describe("Updated description"),
    checks: z.array(GuardrailCheckSchema).optional().describe("Updated array of checks"),
    actions: z.object({
      on_fail: z.enum(['block', 'log', 'warn']).optional().describe("Action to take when checks fail"),
      on_pass: z.enum(['allow', 'log']).optional().describe("Action to take when checks pass")
    }).optional().describe("Updated actions"),
    status: z.enum(['active', 'inactive']).optional().describe("Guardrail status")
  },
  async (params) => {
    try {
      const { guardrail_id, ...updateData } = params;
      const result = await portkeyService.updateGuardrail(guardrail_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating guardrail: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_guardrail",
  "Delete a guardrail",
  {
    guardrail_id: z.string().describe("The ID or slug of the guardrail to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteGuardrail(params.guardrail_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Guardrail ${params.guardrail_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting guardrail: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 2: Usage Limit Policy Tools
// ============================================

const AppliesToSchema = z.object({
  workspace_ids: z.array(z.string()).optional().describe("Workspace IDs this policy applies to"),
  api_key_ids: z.array(z.string()).optional().describe("API key IDs this policy applies to"),
  virtual_key_ids: z.array(z.string()).optional().describe("Virtual key IDs this policy applies to"),
  user_ids: z.array(z.string()).optional().describe("User IDs this policy applies to")
});

server.tool(
  "create_usage_limit_policy",
  "Create a new usage limit policy to control resource consumption",
  {
    name: z.string().describe("Name for the usage limit policy"),
    description: z.string().optional().describe("Description of the policy"),
    type: z.enum(['cost', 'tokens', 'requests']).describe("Type of limit: 'cost' for dollar limits, 'tokens' for token limits, 'requests' for request count limits"),
    limit_value: z.number().positive().describe("The limit value (e.g., 1000 for 1000 tokens or $10 for cost)"),
    period: z.enum(['hourly', 'daily', 'weekly', 'monthly']).describe("Time period for the limit"),
    alert_threshold: z.number().min(0).max(100).optional().describe("Percentage threshold to trigger alerts (0-100)"),
    action_on_limit: z.enum(['block', 'warn', 'log']).optional().describe("Action to take when limit is reached"),
    applies_to: AppliesToSchema.optional().describe("Resources this policy applies to")
  },
  async (params) => {
    try {
      const result = await portkeyService.createUsageLimitPolicy(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating usage limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "list_usage_limit_policies",
  "List all usage limit policies in your Portkey organization",
  {
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination")
  },
  async (params) => {
    try {
      const result = await portkeyService.listUsageLimitPolicies(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing usage limit policies: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_usage_limit_policy",
  "Get details of a specific usage limit policy",
  {
    policy_id: z.string().describe("The ID of the usage limit policy to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getUsageLimitPolicy(params.policy_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting usage limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_usage_limit_policy",
  "Update an existing usage limit policy",
  {
    policy_id: z.string().describe("The ID of the usage limit policy to update"),
    name: z.string().optional().describe("New name for the policy"),
    description: z.string().optional().describe("Updated description"),
    type: z.enum(['cost', 'tokens', 'requests']).optional().describe("Updated limit type"),
    limit_value: z.number().positive().optional().describe("Updated limit value"),
    period: z.enum(['hourly', 'daily', 'weekly', 'monthly']).optional().describe("Updated time period"),
    alert_threshold: z.number().min(0).max(100).optional().describe("Updated alert threshold"),
    action_on_limit: z.enum(['block', 'warn', 'log']).optional().describe("Updated action on limit"),
    applies_to: AppliesToSchema.optional().describe("Updated resource scope"),
    status: z.enum(['active', 'inactive']).optional().describe("Policy status")
  },
  async (params) => {
    try {
      const { policy_id, ...updateData } = params;
      const result = await portkeyService.updateUsageLimitPolicy(policy_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating usage limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_usage_limit_policy",
  "Delete a usage limit policy",
  {
    policy_id: z.string().describe("The ID of the usage limit policy to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteUsageLimitPolicy(params.policy_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Usage limit policy ${params.policy_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting usage limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 2: Rate Limit Policy Tools
// ============================================

server.tool(
  "create_rate_limit_policy",
  "Create a new rate limit policy to control request throughput",
  {
    name: z.string().describe("Name for the rate limit policy"),
    description: z.string().optional().describe("Description of the policy"),
    type: z.enum(['requests', 'tokens']).describe("Type of rate limit: 'requests' for request count, 'tokens' for token throughput"),
    limit_value: z.number().positive().describe("The rate limit value (e.g., 100 requests per window)"),
    window: z.enum(['second', 'minute', 'hour']).describe("Time window for the rate limit"),
    action_on_limit: z.enum(['block', 'queue', 'throttle']).optional().describe("Action to take when limit is reached"),
    applies_to: AppliesToSchema.optional().describe("Resources this policy applies to")
  },
  async (params) => {
    try {
      const result = await portkeyService.createRateLimitPolicy(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating rate limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "list_rate_limit_policies",
  "List all rate limit policies in your Portkey organization",
  {
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination")
  },
  async (params) => {
    try {
      const result = await portkeyService.listRateLimitPolicies(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing rate limit policies: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "get_rate_limit_policy",
  "Get details of a specific rate limit policy",
  {
    policy_id: z.string().describe("The ID of the rate limit policy to retrieve")
  },
  async (params) => {
    try {
      const result = await portkeyService.getRateLimitPolicy(params.policy_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting rate limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "update_rate_limit_policy",
  "Update an existing rate limit policy",
  {
    policy_id: z.string().describe("The ID of the rate limit policy to update"),
    name: z.string().optional().describe("New name for the policy"),
    description: z.string().optional().describe("Updated description"),
    type: z.enum(['requests', 'tokens']).optional().describe("Updated rate limit type"),
    limit_value: z.number().positive().optional().describe("Updated limit value"),
    window: z.enum(['second', 'minute', 'hour']).optional().describe("Updated time window"),
    action_on_limit: z.enum(['block', 'queue', 'throttle']).optional().describe("Updated action on limit"),
    applies_to: AppliesToSchema.optional().describe("Updated resource scope"),
    status: z.enum(['active', 'inactive']).optional().describe("Policy status")
  },
  async (params) => {
    try {
      const { policy_id, ...updateData } = params;
      const result = await portkeyService.updateRateLimitPolicy(policy_id, updateData);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating rate limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.tool(
  "delete_rate_limit_policy",
  "Delete a rate limit policy",
  {
    policy_id: z.string().describe("The ID of the rate limit policy to delete")
  },
  async (params) => {
    try {
      await portkeyService.deleteRateLimitPolicy(params.policy_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ message: `Rate limit policy ${params.policy_id} deleted successfully` }, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting rate limit policy: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// ============================================
// Phase 2: Audit Log Tools
// ============================================

server.tool(
  "list_audit_logs",
  "List audit logs for your Portkey organization with filtering options",
  {
    page_size: z.number().positive().optional().describe("Number of results per page"),
    current_page: z.number().positive().optional().describe("Page number for pagination"),
    action: z.string().optional().describe("Filter by action type (e.g., 'create', 'update', 'delete')"),
    resource_type: z.string().optional().describe("Filter by resource type (e.g., 'config', 'api_key', 'virtual_key')"),
    resource_id: z.string().optional().describe("Filter by specific resource ID"),
    actor_id: z.string().optional().describe("Filter by the ID of the user or API key that performed the action"),
    workspace_id: z.string().optional().describe("Filter by workspace ID"),
    start_time: z.string().optional().describe("Filter logs from this time (ISO8601 format)"),
    end_time: z.string().optional().describe("Filter logs until this time (ISO8601 format)")
  },
  async (params) => {
    try {
      const result = await portkeyService.listAuditLogs(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error listing audit logs: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);