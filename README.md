[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/r-huijts-portkey-admin-mcp-server-badge.png)](https://mseep.ai/app/r-huijts-portkey-admin-mcp-server)

# Portkey MCP Server
[![smithery badge](https://smithery.ai/badge/@r-huijts/portkey-admin-mcp-server)](https://smithery.ai/server/@r-huijts/portkey-admin-mcp-server)

Transform your AI assistant into a Portkey platform expert! This MCP server connects Claude to Portkey's API, enabling comprehensive management of AI configurations, workspaces, analytics, and user access.

<a href="https://glama.ai/mcp/servers/iftjfqrk0v"><img width="380" height="200" src="https://glama.ai/mcp/servers/iftjfqrk0v/badge" alt="Portkey Server MCP server" /></a>

## Installation

### From Source
1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Copy the example environment file:
```bash
cp .env.example .env
```
4. Add your Portkey API key to the `.env` file:
```bash
PORTKEY_API_KEY=your_portkey_api_key_here
```
5. Then update your Claude configuration file:

```json
{
  "mcpServers": {
    "portkey-server": {
      "command": "node",
      "args": [
        "/path/to/portkey-server/build/index.js"
      ],
      "env": {
        "PORTKEY_API_KEY": "your_portkey_api_key_here"
      }
    }
  }
}
```

Make sure to:
- Replace `/path/to/portkey-server` with the actual path to your installation
- Add your Portkey API key in the `env` section

After updating the configuration, restart Claude Desktop for the changes to take effect.

### Installing via Smithery

To install Portkey MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@r-huijts/portkey-admin-mcp-server):

```bash
npx -y @smithery/cli install @r-huijts/portkey-admin-mcp-server --client claude
```

## Real-World Use Cases
- "What are my current API usage statistics across different models?"
- "Show me the performance metrics for my AI deployments"
- "Create a new workspace for my team's project"
- "What's my current API key usage and remaining credits?"
- "Generate an analytics report for last month's API calls"
- "Set up rate limiting for my development environment"
- "Configure fallback behavior for my production endpoints"
- "Add team members to my Portkey workspace"
- "Show me the latency statistics for my API calls"
- "Set up custom headers for my API requests"

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| PORTKEY_API_KEY | Your Portkey API key (required) |

## 🌟 Features

This MCP server provides comprehensive access to Portkey's platform through the following capabilities:

### User & Access Management
- **User Administration**: List and manage all users in your Portkey organization
- **User Invitations**: Invite new users with customizable roles and permissions
- **Workspace Access**: Configure user access levels across different workspaces
- **Role-Based Control**: Assign admin, manager, or member roles at organization and workspace levels

### Analytics & Reporting
- **Usage Analytics**: Track detailed user activity and request patterns
- **Cost Analysis**: Monitor and analyze costs across different time periods
- **Request Metrics**: View request counts, token usage, and response times
- **Filtered Reports**: Generate reports based on custom criteria like status codes, virtual keys, and time ranges

### Workspace Management
- **Workspace Overview**: List and view detailed information about all workspaces
- **Configuration Management**: Access and review workspace configurations
- **Virtual Key Management**: Monitor and manage API keys with usage limits and rate limits
- **Workspace Settings**: View and track workspace metadata and user associations

### Configuration & API Settings
- **Config Listings**: View all available configurations in your organization
- **Detailed Config Info**: Access cache settings, retry policies, and routing strategies
- **Virtual Key Details**: Monitor key status, usage limits, and rate limits
- **API Integration**: Track API endpoints and their configurations

### Prompt Admin
- **Collection Management**: Organize prompts by app using collections
- **Prompt CRUD**: Create, list, get, and update prompt templates
- **Version Control**: Automatic versioning on prompt updates
- **Template Rendering**: Preview rendered prompts with variables
- **Prompt Completions**: Execute prompts with billing metadata tracking
- **Migration Helper**: Create-or-update prompts with app/env support
- **Environment Promotion**: Promote prompts from staging to production
- **Billing Validation**: Enforce required metadata for cost attribution

### Core Admin (New!)
- **Config Management**: Full CRUD operations for gateway configurations with versioning
- **API Key Management**: Create, list, update, and delete API keys with scopes, rate limits, and usage limits
- **Virtual Key Management**: Manage provider virtual keys with rate limiting and budget controls
- **Workspace Management**: Create, update, and delete workspaces with default settings
- **Workspace Members**: Add, list, update roles, and remove workspace members
- **User Management**: Get, update, and delete user accounts

## Prompt Admin Tools

This fork adds 12 new tools for managing Portkey prompts with app grouping, environment promotion, and billing metadata validation.

### Collection Tools (App Grouping)

| Tool | Description |
|------|-------------|
| `list_collections` | List all collections with optional workspace filtering |
| `create_collection` | Create a new collection to group prompts by app |
| `get_collection` | Get collection details by ID |

### Prompt CRUD Tools

| Tool | Description |
|------|-------------|
| `create_prompt` | Create a new prompt template with messages and parameters |
| `list_prompts` | List prompts with optional collection/workspace filtering |
| `get_prompt` | Get prompt details including version history |
| `update_prompt` | Update prompt (creates new version automatically) |
| `render_prompt` | Preview rendered template with variables (no model call) |
| `run_prompt_completion` | Execute prompt and get completion with billing metadata |

### Migration & Promotion Tools

| Tool | Description |
|------|-------------|
| `migrate_prompt` | Create-or-update helper with app/env support and dry_run mode |
| `promote_prompt` | Copy prompt version from staging to production |
| `validate_completion_metadata` | Validate billing metadata before completion |

### Billing Metadata Schema

When running prompt completions, the following metadata is required for cost attribution:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `client_id` | Yes | Client identifier for billing | `"acme-corp"` |
| `app` | Yes | Application name | `"hourlink"` |
| `env` | Yes | Environment | `"prod"` |
| `project_id` | No | Project identifier | `"proj-123"` |
| `feature` | No | Feature name | `"event-classification"` |

### Example Usage

**Create a collection for an app:**
```bash
# Using Claude Code MCP
"Create a collection called 'hourlink' for our hourlink app prompts"
```

**Create a prompt with parameters:**
```bash
# Using Claude Code MCP
"Create a prompt called 'event-classifier' in the hourlink collection with:
- System message: 'You are an event classifier'
- User message template: 'Classify this event: {{event_description}}'
- Parameter: event_description (string, required)"
```

**Migrate a prompt with environment tagging:**
```bash
# Using Claude Code MCP
"Migrate the event-classifier prompt to staging environment in the hourlink app"
```

**Promote from staging to production:**
```bash
# Using Claude Code MCP
"Promote the event-classifier prompt from staging to production"
```

**Run a completion with billing metadata:**
```bash
# Using Claude Code MCP
"Run the event-classifier prompt with:
- event_description: 'Team meeting scheduled for Monday'
- client_id: 'acme-corp'
- app: 'hourlink'
- env: 'prod'"
```

## Core Admin Tools

This server includes 24 tools for comprehensive Portkey resource management.

### Config Management

| Tool | Description |
|------|-------------|
| `create_config` | Create a new gateway configuration with routing, caching, and retry settings |
| `update_config` | Update an existing configuration |
| `delete_config` | Delete a configuration by ID |
| `list_config_versions` | List all versions of a configuration |

### API Key Management

| Tool | Description |
|------|-------------|
| `create_api_key` | Create a new API key with optional scopes, rate limits, and usage limits |
| `list_api_keys` | List all API keys with pagination support |
| `get_api_key` | Get API key details by ID |
| `update_api_key` | Update API key name, scopes, rate limits, or usage limits |
| `delete_api_key` | Delete an API key by ID |

### Virtual Key Management

| Tool | Description |
|------|-------------|
| `create_virtual_key` | Create a new virtual key for a provider with rate/budget limits |
| `get_virtual_key` | Get virtual key details by ID |
| `update_virtual_key` | Update virtual key settings |
| `delete_virtual_key` | Delete a virtual key by ID |

### Workspace Management

| Tool | Description |
|------|-------------|
| `create_workspace` | Create a new workspace with optional defaults |
| `update_workspace` | Update workspace name, description, or defaults |
| `delete_workspace` | Delete a workspace by ID |

### Workspace Members

| Tool | Description |
|------|-------------|
| `add_workspace_member` | Add a user to a workspace with a specific role |
| `list_workspace_members` | List all members of a workspace with pagination |
| `get_workspace_member` | Get workspace member details by user ID |
| `update_workspace_member` | Update a member's role in a workspace |
| `remove_workspace_member` | Remove a user from a workspace |

### User Management

| Tool | Description |
|------|-------------|
| `get_user` | Get user details by ID |
| `update_user` | Update user first name, last name, or role |
| `delete_user` | Delete a user from the organization |

### Example Usage

**Create an API key with rate limits:**
```bash
# Using Claude Code MCP
"Create an API key called 'production-key' with rate limit of 100 requests per minute"
```

**Add a workspace member:**
```bash
# Using Claude Code MCP
"Add user user_123 as an admin to workspace ws_456"
```

**Create a virtual key:**
```bash
# Using Claude Code MCP
"Create a virtual key for OpenAI with a monthly budget of $500"
```

## License

This project is licensed under the ISC License - see the LICENSE file for details
