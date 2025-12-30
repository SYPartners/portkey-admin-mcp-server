# Portkey Admin MCP Server

MCP server for the Portkey Admin API. Manage prompts, configs, workspaces, API keys, and more through Claude.

> Based on [r-huijts/portkey-admin-mcp-server](https://github.com/r-huijts/portkey-admin-mcp-server). This fork expands API coverage toward full Portkey Admin API support.

## Installation

1. Clone and install:
```bash
git clone https://github.com/SYPartners/portkey-admin-mcp-server.git
cd portkey-admin-mcp-server
npm install
npm run build
```

2. Add to your Claude config (`~/.claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "portkey": {
      "command": "node",
      "args": ["/path/to/portkey-admin-mcp-server/build/index.js"],
      "env": {
        "PORTKEY_API_KEY": "your_api_key"
      }
    }
  }
}
```

3. Restart Claude Desktop.

## Current Tools (45)

### User & Access
| Tool | Description |
|------|-------------|
| `list_all_users` | List all users in organization |
| `invite_user` | Invite a new user |
| `get_user_stats` | Get user statistics |
| `get_user` | Get user details |
| `update_user` | Update user details |
| `delete_user` | Delete a user |

### Workspaces
| Tool | Description |
|------|-------------|
| `list_workspaces` | List all workspaces |
| `get_workspace` | Get workspace details |
| `create_workspace` | Create a new workspace |
| `update_workspace` | Update workspace details |
| `delete_workspace` | Delete a workspace |

### Workspace Members
| Tool | Description |
|------|-------------|
| `add_workspace_member` | Add user to workspace |
| `list_workspace_members` | List workspace members |
| `get_workspace_member` | Get workspace member details |
| `update_workspace_member` | Update member role |
| `remove_workspace_member` | Remove user from workspace |

### Config Management
| Tool | Description |
|------|-------------|
| `list_configs` | List gateway configs |
| `get_config` | Get config details |
| `create_config` | Create a new config |
| `update_config` | Update config settings |
| `delete_config` | Delete a config |
| `list_config_versions` | List config versions |

### API Keys
| Tool | Description |
|------|-------------|
| `create_api_key` | Create an API key |
| `list_api_keys` | List all API keys |
| `get_api_key` | Get API key details |
| `update_api_key` | Update API key |
| `delete_api_key` | Delete an API key |

### Virtual Keys
| Tool | Description |
|------|-------------|
| `list_virtual_keys` | List virtual keys |
| `get_virtual_key` | Get virtual key details |
| `create_virtual_key` | Create a virtual key |
| `update_virtual_key` | Update virtual key |
| `delete_virtual_key` | Delete a virtual key |

### Analytics
| Tool | Description |
|------|-------------|
| `get_cost_analytics` | Get cost analytics data |

### Prompt Management
| Tool | Description |
|------|-------------|
| `list_collections` | List prompt collections |
| `create_collection` | Create a collection |
| `get_collection` | Get collection details |
| `create_prompt` | Create a prompt template |
| `list_prompts` | List prompts |
| `get_prompt` | Get prompt details |
| `update_prompt` | Update a prompt |
| `render_prompt` | Render prompt with variables |
| `run_prompt_completion` | Execute prompt completion |
| `migrate_prompt` | Create-or-update prompt |
| `promote_prompt` | Promote prompt between environments |
| `validate_completion_metadata` | Validate billing metadata |

## Roadmap

Expanding to full Portkey Admin API coverage (~129 tools):

- **Phase 1**: Core Admin CRUD - ✅ Complete (24 tools)
- **Phase 2**: Governance & Security (guardrails, rate limits, usage limits, audit logs)
- **Phase 3**: Prompt Enhancements (partials, labels, versions)
- **Phase 4**: Observability (analytics, logs, traces, feedback)
- **Phase 5**: Providers & Integrations
- **Phase 6**: Gateway APIs (embeddings, images, audio, files)

## License

ISC License
