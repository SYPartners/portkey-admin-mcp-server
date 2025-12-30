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

## Current Tools (21)

### User & Access
| Tool | Description |
|------|-------------|
| `list_all_users` | List all users in organization |
| `invite_user` | Invite a new user |
| `get_user_stats` | Get user statistics |

### Workspaces & Config
| Tool | Description |
|------|-------------|
| `list_workspaces` | List all workspaces |
| `get_workspace` | Get workspace details |
| `list_configs` | List gateway configs |
| `get_config` | Get config details |
| `list_virtual_keys` | List virtual keys |

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

- **Phase 1**: Core Admin CRUD (configs, API keys, virtual keys, workspaces, users)
- **Phase 2**: Governance & Security (guardrails, rate limits, usage limits, audit logs)
- **Phase 3**: Prompt Enhancements (partials, labels, versions)
- **Phase 4**: Observability (analytics, logs, traces, feedback)
- **Phase 5**: Providers & Integrations
- **Phase 6**: Gateway APIs (embeddings, images, audio, files)

## License

ISC License
