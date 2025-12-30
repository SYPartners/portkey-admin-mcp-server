# Portkey Admin MCP Server - API Coverage Roadmap

## Overview

**Goal:** Full Portkey Admin API coverage
**Current:** 45 tools
**Target:** 129 tools (+84 new)
**Strategy:** One PR per phase for CodeRabbit review

---

## Progress Summary

| Phase | Category | Tools | Status | PR |
|-------|----------|-------|--------|-----|
| 0 | Prompt Admin (existing) | 12 | ✅ Complete | [#1](https://github.com/SYPartners/portkey-admin-mcp-server/pull/1) |
| 1 | Core Admin CRUD | 24 | ✅ Complete | - |
| 2 | Governance & Security | 20 | Pending | - |
| 3 | Prompt Enhancements | 14 | Pending | - |
| 4 | Observability | 23 | Pending | - |
| 5 | Providers & Integrations | 15 | Pending | - |
| 6 | Gateway APIs | 12 | Pending | - |

---

## Phase 1: Core Admin CRUD (24 tools)

**Branch:** `feat/phase1-core-admin`
**Priority:** P0 - Foundation

### 1.1 Config Management
- [x] `create_config` - POST `/configs`
- [x] `update_config` - PUT `/configs/{slug}`
- [x] `delete_config` - DELETE `/configs/{slug}`
- [x] `list_config_versions` - GET `/configs/{slug}/versions`

### 1.2 API Keys
- [x] `create_api_key` - POST `/api-keys`
- [x] `list_api_keys` - GET `/api-keys`
- [x] `get_api_key` - GET `/api-keys/{id}`
- [x] `update_api_key` - PUT `/api-keys/{id}`
- [x] `delete_api_key` - DELETE `/api-keys/{id}`

### 1.3 Virtual Keys
- [x] `create_virtual_key` - POST `/virtual-keys`
- [x] `get_virtual_key` - GET `/virtual-keys/{slug}`
- [x] `update_virtual_key` - PUT `/virtual-keys/{slug}`
- [x] `delete_virtual_key` - DELETE `/virtual-keys/{slug}`

### 1.4 Workspace Management
- [x] `create_workspace` - POST `/admin/workspaces`
- [x] `update_workspace` - PUT `/admin/workspaces/{id}`
- [x] `delete_workspace` - DELETE `/admin/workspaces/{id}`

### 1.5 Workspace Members
- [x] `add_workspace_member` - POST `/admin/workspaces/{id}/members`
- [x] `list_workspace_members` - GET `/admin/workspaces/{id}/members`
- [x] `get_workspace_member` - GET `/admin/workspaces/{id}/members/{userId}`
- [x] `update_workspace_member` - PUT `/admin/workspaces/{id}/members/{userId}`
- [x] `remove_workspace_member` - DELETE `/admin/workspaces/{id}/members/{userId}`

### 1.6 User Management
- [x] `get_user` - GET `/admin/users/{id}`
- [x] `update_user` - PUT `/admin/users/{id}`
- [x] `delete_user` - DELETE `/admin/users/{id}`

---

## Phase 2: Governance & Security (20 tools)

**Branch:** `feat/phase2-governance`
**Priority:** P1 - Security controls

### 2.1 User Invites
- [ ] `list_user_invites` - GET `/user-invites`
- [ ] `get_user_invite` - GET `/user-invites/{id}`
- [ ] `delete_user_invite` - DELETE `/user-invites/{id}`
- [ ] `resend_user_invite` - POST `/user-invites/{id}/resend`

### 2.2 Guardrails
- [ ] `create_guardrail` - POST `/guardrails`
- [ ] `list_guardrails` - GET `/guardrails`
- [ ] `get_guardrail` - GET `/guardrails/{id}`
- [ ] `update_guardrail` - PUT `/guardrails/{id}`
- [ ] `delete_guardrail` - DELETE `/guardrails/{id}`

### 2.3 Usage Limit Policies
- [ ] `create_usage_limit_policy` - POST `/policies/usage-limits`
- [ ] `list_usage_limit_policies` - GET `/policies/usage-limits`
- [ ] `get_usage_limit_policy` - GET `/policies/usage-limits/{id}`
- [ ] `update_usage_limit_policy` - PUT `/policies/usage-limits/{id}`
- [ ] `delete_usage_limit_policy` - DELETE `/policies/usage-limits/{id}`

### 2.4 Rate Limit Policies
- [ ] `create_rate_limit_policy` - POST `/policies/rate-limits`
- [ ] `list_rate_limit_policies` - GET `/policies/rate-limits`
- [ ] `get_rate_limit_policy` - GET `/policies/rate-limits/{id}`
- [ ] `update_rate_limit_policy` - PUT `/policies/rate-limits/{id}`
- [ ] `delete_rate_limit_policy` - DELETE `/policies/rate-limits/{id}`

### 2.5 Audit Logs
- [ ] `list_audit_logs` - GET `/audit-logs`

---

## Phase 3: Prompt Enhancements (14 tools)

**Branch:** `feat/phase3-prompts`
**Priority:** P2 - Prompt workflows

### 3.1 Prompt CRUD Completion
- [ ] `delete_prompt` - DELETE `/prompts/{id}`
- [ ] `publish_prompt` - POST `/prompts/{id}/publish`
- [ ] `list_prompt_versions` - GET `/prompts/{id}/versions`

### 3.2 Prompt Partials
- [ ] `create_prompt_partial` - POST `/prompt-partials`
- [ ] `list_prompt_partials` - GET `/prompt-partials`
- [ ] `get_prompt_partial` - GET `/prompt-partials/{id}`
- [ ] `update_prompt_partial` - PUT `/prompt-partials/{id}`
- [ ] `delete_prompt_partial` - DELETE `/prompt-partials/{id}`

### 3.3 Prompt Labels
- [ ] `create_prompt_label` - POST `/prompt-labels`
- [ ] `list_prompt_labels` - GET `/prompt-labels`
- [ ] `get_prompt_label` - GET `/prompt-labels/{id}`
- [ ] `delete_prompt_label` - DELETE `/prompt-labels/{id}`

### 3.4 Collection Enhancements
- [ ] `update_collection` - PUT `/prompt-collections/{id}`
- [ ] `delete_collection` - DELETE `/prompt-collections/{id}`

---

## Phase 4: Observability (23 tools)

**Branch:** `feat/phase4-observability`
**Priority:** P2 - Monitoring & debugging

### 4.1 Extended Analytics
- [ ] `get_analytics_summary` - GET `/analytics/summary`
- [ ] `get_analytics_by_metadata` - GET `/analytics/metadata`
- [ ] `get_analytics_by_models` - GET `/analytics/models`
- [ ] `get_analytics_by_users` - GET `/analytics/users`
- [ ] `get_latency_analytics` - GET `/analytics/latency`
- [ ] `get_request_analytics` - GET `/analytics/requests`
- [ ] `get_token_analytics` - GET `/analytics/tokens`
- [ ] `get_error_analytics` - GET `/analytics/errors`
- [ ] `get_error_rate_analytics` - GET `/analytics/error-rate`
- [ ] `get_cache_hit_rate_analytics` - GET `/analytics/cache-hit-rate`
- [ ] `get_cache_latency_analytics` - GET `/analytics/cache-hit-latency`
- [ ] `get_feedback_analytics` - GET `/analytics/feedback`
- [ ] `get_status_code_analytics` - GET `/analytics/status-codes`

### 4.2 Logging
- [ ] `insert_log` - POST `/logs`
- [ ] `list_logs` - GET `/logs`
- [ ] `create_log_export` - POST `/logs/exports`
- [ ] `list_log_exports` - GET `/logs/exports`
- [ ] `get_log_export` - GET `/logs/exports/{id}`

### 4.3 Feedback
- [ ] `create_feedback` - POST `/feedback`
- [ ] `update_feedback` - PATCH `/feedback`

### 4.4 Traces
- [ ] `list_traces` - GET `/logs` (filtered)
- [ ] `get_trace` - GET `/logs/{trace_id}`
- [ ] `get_trace_spans` - GET `/logs/{trace_id}/spans`

---

## Phase 5: Providers & Integrations (15 tools)

**Branch:** `feat/phase5-integrations`
**Priority:** P3 - Advanced configuration

### 5.1 Providers
- [ ] `create_provider` - POST `/providers`
- [ ] `list_providers` - GET `/providers`
- [ ] `get_provider` - GET `/providers/{id}`
- [ ] `update_provider` - PUT `/providers/{id}`
- [ ] `delete_provider` - DELETE `/providers/{id}`

### 5.2 Integrations
- [ ] `create_integration` - POST `/integrations`
- [ ] `list_integrations` - GET `/integrations`
- [ ] `get_integration` - GET `/integrations/{id}`
- [ ] `update_integration` - PUT `/integrations/{id}`
- [ ] `delete_integration` - DELETE `/integrations/{id}`
- [ ] `list_integration_models` - GET `/integrations/models`
- [ ] `update_integration_models` - PUT `/integrations/models`
- [ ] `delete_integration_model` - DELETE `/integrations/models`
- [ ] `list_integration_workspaces` - GET `/integrations/workspaces`
- [ ] `update_integration_workspaces` - PUT `/integrations/workspaces`

---

## Phase 6: Gateway APIs (12 tools)

**Branch:** `feat/phase6-gateway`
**Priority:** P3 - Inference capabilities

### 6.1 Embeddings
- [ ] `create_embedding` - POST `/embeddings`

### 6.2 Images
- [ ] `create_image` - POST `/images/generations`
- [ ] `edit_image` - POST `/images/edits`
- [ ] `create_image_variation` - POST `/images/variations`

### 6.3 Audio
- [ ] `text_to_speech` - POST `/audio/speech`
- [ ] `transcribe_audio` - POST `/audio/transcriptions`
- [ ] `translate_audio` - POST `/audio/translations`

### 6.4 Files
- [ ] `upload_file` - POST `/files`
- [ ] `list_files` - GET `/files`
- [ ] `get_file` - GET `/files/{id}`
- [ ] `delete_file` - DELETE `/files/{id}`

### 6.5 Models
- [ ] `list_models` - GET `/models`

---

## Existing Tools (21)

### User & Access (3)
- [x] `list_all_users`
- [x] `invite_user`
- [x] `get_user_stats`

### Workspace & Config (5)
- [x] `list_workspaces`
- [x] `get_workspace`
- [x] `list_configs`
- [x] `get_config`
- [x] `list_virtual_keys`

### Analytics (1)
- [x] `get_cost_analytics`

### Prompt Management (12)
- [x] `list_collections`
- [x] `create_collection`
- [x] `get_collection`
- [x] `create_prompt`
- [x] `list_prompts`
- [x] `get_prompt`
- [x] `update_prompt`
- [x] `render_prompt`
- [x] `run_prompt_completion`
- [x] `migrate_prompt`
- [x] `promote_prompt`
- [x] `validate_completion_metadata`

---

## Contributing

### Per-Phase Workflow
1. Create branch `feat/phase{N}-{name}`
2. Add interfaces to `portkey.service.ts`
3. Add service methods for each endpoint
4. Register tools in `index.ts` with Zod schemas
5. Update README with new tools
6. Update this ROADMAP.md - check off completed items
7. Create PR for CodeRabbit review
8. Update PR link in Progress Summary table
