# Portkey Admin API Endpoints

This document lists all API endpoints used by the Portkey Admin MCP Server, verified against the [official Portkey Admin API documentation](https://portkey.ai/docs/api-reference/admin-api/introduction).

## Configuration

- **Base URL**: `https://api.portkey.ai/v1`
- **Authentication**: `x-portkey-api-key` header
- **Total Endpoints**: 96

## Verification Legend

| Symbol | Meaning |
|--------|---------|
| [x] | Verified - matches official docs |
| [!] | Discrepancy - path differs from docs |
| [?] | Undocumented - not found in official docs |

---

## 1. Users

**Service**: `src/services/users.service.ts`
**Docs**: [Admin API - Users](https://portkey.ai/docs/api-reference/admin-api/control-plane/users)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [!] | GET | `/admin/users` | `/users` | List all users |
| [!] | GET | `/admin/users/{userId}` | `/users/{id}` | Get user by ID |
| [!] | PUT | `/admin/users/{userId}` | `/users/{id}` | Update user |
| [!] | DELETE | `/admin/users/{userId}` | `/users/{id}` | Delete user |

**Note**: Codebase uses `/admin/users` prefix, docs show `/users`. Both may work.

---

## 2. User Invites

**Service**: `src/services/users.service.ts`
**Docs**: [Admin API - User Invites](https://portkey.ai/docs/api-reference/admin-api/control-plane/user-invites)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [!] | POST | `/admin/users/invites` | `/user-invites` | Invite user |
| [!] | GET | `/admin/users/invites` | `/user-invites` | List invites |
| [!] | GET | `/admin/users/invites/{inviteId}` | `/user-invites/{id}` | Get invite |
| [!] | DELETE | `/admin/users/invites/{inviteId}` | `/user-invites/{id}` | Delete invite |
| [!] | POST | `/admin/users/invites/{inviteId}/resend` | `/user-invites/{id}/resend` | Resend invite |

**Note**: Codebase uses `/admin/users/invites`, docs show `/user-invites`. Functionally different paths.

---

## 3. User Analytics

**Service**: `src/services/users.service.ts`
**Docs**: [Admin API - Analytics](https://portkey.ai/docs/api-reference/admin-api/control-plane/analytics)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/analytics/groups/users` | `/analytics/groups/users` | User grouped analytics |

---

## 4. Workspaces

**Service**: `src/services/workspaces.service.ts`
**Docs**: [Admin API - Workspaces](https://portkey.ai/docs/api-reference/admin-api/control-plane/workspaces)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [!] | GET | `/admin/workspaces` | `/workspaces` | List workspaces |
| [!] | POST | `/admin/workspaces` | `/workspaces` | Create workspace |
| [!] | GET | `/admin/workspaces/{workspaceId}` | `/workspaces/{id}` | Get workspace |
| [!] | PUT | `/admin/workspaces/{workspaceId}` | `/workspaces/{id}` | Update workspace |
| [!] | DELETE | `/admin/workspaces/{workspaceId}` | `/workspaces/{id}` | Delete workspace |

**Note**: Codebase uses `/admin/workspaces` prefix, docs show `/workspaces`.

---

## 5. Workspace Members

**Service**: `src/services/workspaces.service.ts`
**Docs**: [Admin API - Workspace Members](https://portkey.ai/docs/api-reference/admin-api/control-plane/workspace-members)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [!] | POST | `/admin/workspaces/{id}/users` | `/workspaces/{id}/members` | Add member |
| [!] | GET | `/admin/workspaces/{id}/users` | `/workspaces/{id}/members` | List members |
| [!] | GET | `/admin/workspaces/{id}/users/{userId}` | `/workspaces/{id}/members/{member_id}` | Get member |
| [!] | PUT | `/admin/workspaces/{id}/users/{userId}` | `/workspaces/{id}/members/{member_id}` | Update member |
| [!] | DELETE | `/admin/workspaces/{id}/users/{userId}` | `/workspaces/{id}/members/{member_id}` | Remove member |

**Note**: Codebase uses `/users`, docs use `/members`. Different path segment.

---

## 6. Configs

**Service**: `src/services/configs.service.ts`
**Docs**: [Admin API - Configs](https://portkey.ai/docs/api-reference/admin-api/control-plane/configs)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/configs` | `/configs` | List all configs |
| [x] | POST | `/configs` | `/configs` | Create config |
| [x] | GET | `/configs/{slug}` | `/configs/{id}` | Get config |
| [x] | PUT | `/configs/{slug}` | `/configs/{id}` | Update config |
| [x] | DELETE | `/configs/{slug}` | `/configs/{id}` | Delete config |
| [x] | GET | `/configs/{slug}/versions` | `/configs/{id}/versions` | List versions |

---

## 7. Virtual Keys

**Service**: `src/services/keys.service.ts`
**Docs**: [Admin API - Virtual Keys](https://portkey.ai/docs/api-reference/admin-api/control-plane/virtual-keys)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/virtual-keys` | `/virtual-keys` | List virtual keys |
| [x] | POST | `/virtual-keys` | `/virtual-keys` | Create virtual key |
| [x] | GET | `/virtual-keys/{slug}` | `/virtual-keys/{id}` | Get virtual key |
| [x] | PUT | `/virtual-keys/{slug}` | `/virtual-keys/{id}` | Update virtual key |
| [x] | DELETE | `/virtual-keys/{slug}` | `/virtual-keys/{id}` | Delete virtual key |

---

## 8. API Keys

**Service**: `src/services/keys.service.ts`
**Docs**: [Admin API - API Keys](https://portkey.ai/docs/api-reference/admin-api/control-plane/api-keys)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | POST | `/api-keys/{type}/{subType}` | `/api-keys` | Create API key |
| [x] | GET | `/api-keys` | `/api-keys` | List API keys |
| [x] | GET | `/api-keys/{id}` | `/api-keys/{id}` | Get API key |
| [x] | PUT | `/api-keys/{id}` | `/api-keys/{id}` | Update API key |
| [x] | DELETE | `/api-keys/{id}` | `/api-keys/{id}` | Delete API key |

**Note**: Create endpoint uses `/{type}/{subType}` for key type specification.

---

## 9. Collections

**Service**: `src/services/collections.service.ts`
**Docs**: [Admin API - Collections](https://portkey.ai/docs/api-reference/admin-api/control-plane/prompts/collections)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/collections` | `/collections` | List collections |
| [x] | POST | `/collections` | `/collections` | Create collection |
| [x] | GET | `/collections/{collectionId}` | `/collections/{id}` | Get collection |
| [x] | PUT | `/collections/{collectionId}` | `/collections/{id}` | Update collection |
| [x] | DELETE | `/collections/{collectionId}` | `/collections/{id}` | Delete collection |

---

## 10. Prompts

**Service**: `src/services/prompts.service.ts`
**Docs**: [Admin API - Prompts](https://portkey.ai/docs/api-reference/admin-api/control-plane/prompts)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | POST | `/prompts` | `/prompts` | Create prompt |
| [x] | GET | `/prompts` | `/prompts` | List prompts |
| [x] | GET | `/prompts/{promptId}` | `/prompts/{id}` | Get prompt |
| [x] | PUT | `/prompts/{promptId}` | `/prompts/{id}` | Update prompt |
| [x] | DELETE | `/prompts/{promptId}` | `/prompts/{id}` | Delete prompt |
| [!] | PUT | `/prompts/{promptId}/makeDefault` | `/prompts/{id}/publish` | Publish version |
| [x] | GET | `/prompts/{promptId}/versions` | `/prompts/{id}/versions` | List versions |
| [x] | POST | `/prompts/{promptId}/render` | `/prompts/{id}/render` | Render prompt |
| [x] | POST | `/prompts/{promptId}/completions` | `/prompts/{id}/completions` | Run completion |

**Note**: Publish endpoint uses `/makeDefault` in codebase, docs show `/publish`.

---

## 11. Prompt Partials

**Service**: `src/services/partials.service.ts`
**Docs**: [Admin API - Partials](https://portkey.ai/docs/api-reference/admin-api/control-plane/prompts/partials)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | POST | `/prompts/partials` | `/prompts/partials` | Create partial |
| [x] | GET | `/prompts/partials` | `/prompts/partials` | List partials |
| [x] | GET | `/prompts/partials/{promptPartialId}` | `/prompts/partials/{id}` | Get partial |
| [x] | PUT | `/prompts/partials/{promptPartialId}` | `/prompts/partials/{id}` | Update partial |
| [x] | DELETE | `/prompts/partials/{promptPartialId}` | `/prompts/partials/{id}` | Delete partial |
| [x] | GET | `/prompts/partials/{promptPartialId}/versions` | `/prompts/partials/{id}/versions` | List versions |
| [!] | PUT | `/prompts/partials/{promptPartialId}/makeDefault` | `/prompts/partials/{id}/publish` | Publish version |

**Note**: Publish endpoint uses `/makeDefault` in codebase, docs show `/publish`.

---

## 12. Labels

**Service**: `src/services/labels.service.ts`
**Docs**: [Admin API - Labels](https://portkey.ai/docs/api-reference/admin-api/control-plane/prompts/labels)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | POST | `/labels` | `/labels` | Create label |
| [x] | GET | `/labels` | `/labels` | List labels |
| [x] | GET | `/labels/{labelId}` | `/labels/{id}` | Get label |
| [x] | PUT | `/labels/{labelId}` | `/labels/{id}` | Update label |
| [x] | DELETE | `/labels/{labelId}` | `/labels/{id}` | Delete label |

---

## 13. Analytics

**Service**: `src/services/analytics.service.ts`
**Docs**: [Admin API - Analytics](https://portkey.ai/docs/api-reference/admin-api/control-plane/analytics)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/analytics/graphs/cost` | `/analytics/graphs/cost` | Cost analytics |
| [x] | GET | `/analytics/graphs/requests` | `/analytics/graphs/requests` | Request count |
| [x] | GET | `/analytics/graphs/tokens` | `/analytics/graphs/tokens` | Token usage |
| [x] | GET | `/analytics/graphs/latency` | `/analytics/graphs/latency` | Latency (p50/p90/p99) |
| [x] | GET | `/analytics/graphs/errors` | `/analytics/graphs/errors` | Error count |
| [x] | GET | `/analytics/graphs/errors/rate` | `/analytics/graphs/errors/rate` | Error rate |
| [x] | GET | `/analytics/graphs/cache/latency` | `/analytics/graphs/cache/latency` | Cache latency |
| [x] | GET | `/analytics/graphs/cache/hit-rate` | `/analytics/graphs/cache/hit-rate` | Cache hit rate |

---

## 14. Guardrails

**Service**: `src/services/guardrails.service.ts`
**Docs**: [Admin API - Guardrails](https://portkey.ai/docs/api-reference/admin-api/control-plane/guardrails)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/guardrails` | `/guardrails` | List guardrails |
| [x] | POST | `/guardrails` | `/guardrails` | Create guardrail |
| [x] | GET | `/guardrails/{guardrailId}` | `/guardrails/{id}` | Get guardrail |
| [x] | PUT | `/guardrails/{guardrailId}` | `/guardrails/{id}` | Update guardrail |
| [x] | DELETE | `/guardrails/{guardrailId}` | `/guardrails/{id}` | Delete guardrail |

---

## 15. Usage Limits

**Service**: `src/services/limits.service.ts`
**Docs**: [Admin API - Usage Limits](https://portkey.ai/docs/api-reference/admin-api/control-plane/policies/usage-limits)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/policies/usage-limits` | `/policies/usage-limits` | List usage limits |
| [x] | POST | `/policies/usage-limits` | `/policies/usage-limits` | Create usage limit |
| [x] | GET | `/policies/usage-limits/{id}` | `/policies/usage-limits/{id}` | Get usage limit |
| [x] | PUT | `/policies/usage-limits/{id}` | `/policies/usage-limits/{id}` | Update usage limit |
| [x] | DELETE | `/policies/usage-limits/{id}` | `/policies/usage-limits/{id}` | Delete usage limit |

---

## 16. Rate Limits

**Service**: `src/services/limits.service.ts`
**Docs**: [Admin API - Rate Limits](https://portkey.ai/docs/api-reference/admin-api/control-plane/policies/rate-limits)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/policies/rate-limits` | `/policies/rate-limits` | List rate limits |
| [x] | POST | `/policies/rate-limits` | `/policies/rate-limits` | Create rate limit |
| [x] | GET | `/policies/rate-limits/{id}` | `/policies/rate-limits/{id}` | Get rate limit |
| [x] | PUT | `/policies/rate-limits/{id}` | `/policies/rate-limits/{id}` | Update rate limit |
| [x] | DELETE | `/policies/rate-limits/{id}` | `/policies/rate-limits/{id}` | Delete rate limit |

---

## 17. Audit Logs

**Service**: `src/services/audit.service.ts`
**Docs**: [Admin API - Audit Logs](https://portkey.ai/docs/api-reference/admin-api/control-plane/audit-logs)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [!] | GET | `/admin/audit-logs` | `/audit-logs` | List audit logs |

**Note**: Codebase uses `/admin/audit-logs`, docs show `/audit-logs`.

---

## 18. Tracing / Feedback

**Service**: `src/services/tracing.service.ts`
**Docs**: [Admin API - Feedback](https://portkey.ai/docs/api-reference/admin-api/data-plane/feedback)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | POST | `/feedback` | `/feedback` | Create feedback |
| [x] | PUT | `/feedback/{id}` | `/feedback/{id}` | Update feedback |
| [x] | GET | `/logs` | `/logs` | List traces |
| [x] | GET | `/logs/{id}` | `/logs/{id}` | Get trace |

---

## 19. Logging / Exports

**Service**: `src/services/logging.service.ts`
**Docs**: [Admin API - Log Exports](https://portkey.ai/docs/api-reference/admin-api/data-plane/logs/log-exports-beta)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | POST | `/logs` | `/logs` | Insert log entry |
| [x] | POST | `/logs/exports` | `/logs/exports` | Create export job |
| [x] | GET | `/logs/exports` | `/logs/exports` | List exports |
| [x] | GET | `/logs/exports/{exportId}` | `/logs/exports/{id}` | Get export |
| [x] | POST | `/logs/exports/{exportId}/start` | `/logs/exports/{id}/start` | Start export |
| [x] | POST | `/logs/exports/{exportId}/cancel` | `/logs/exports/{id}/cancel` | Cancel export |
| [x] | GET | `/logs/exports/{exportId}/download` | `/logs/exports/{id}/download` | Download export |
| [x] | PUT | `/logs/exports/{exportId}` | `/logs/exports/{id}` | Update export |

---

## 20. Providers

**Service**: `src/services/providers.service.ts`
**Docs**: [Admin API - Providers](https://portkey.ai/docs/api-reference/admin-api/control-plane/providers)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [x] | GET | `/providers` | `/providers` | List providers |
| [x] | POST | `/providers` | `/providers` | Create provider |
| [x] | GET | `/providers/{slug}` | `/providers/{id}` | Get provider |
| [x] | PUT | `/providers/{slug}` | `/providers/{id}` | Update provider |
| [x] | DELETE | `/providers/{slug}` | `/providers/{id}` | Delete provider |

---

## 21. Integrations

**Service**: `src/services/integrations.service.ts`
**Docs**: [Admin API - Integrations](https://portkey.ai/docs/api-reference/admin-api/control-plane/integrations)

| Status | Method | Codebase Path | Docs Path | Description |
|--------|--------|---------------|-----------|-------------|
| [!] | GET | `/admin/integrations` | `/integrations` | List integrations |
| [!] | POST | `/admin/integrations` | `/integrations` | Create integration |
| [!] | GET | `/admin/integrations/{slug}` | `/integrations/{id}` | Get integration |
| [!] | PUT | `/admin/integrations/{slug}` | `/integrations/{id}` | Update integration |
| [!] | DELETE | `/admin/integrations/{slug}` | `/integrations/{id}` | Delete integration |
| [!] | GET | `/admin/integrations/{slug}/models` | `/integrations/{id}/models` | List models |
| [!] | PUT | `/admin/integrations/{slug}/models` | `/integrations/{id}/models` | Update models |
| [!] | DELETE | `/admin/integrations/{slug}/models/{modelId}` | `/integrations/{id}/models/{model_id}` | Delete model |
| [!] | GET | `/admin/integrations/{slug}/workspaces` | `/integrations/{id}/workspaces` | List workspaces |
| [!] | PUT | `/admin/integrations/{slug}/workspaces` | `/integrations/{id}/workspaces` | Update workspaces |

**Note**: Codebase uses `/admin/integrations` prefix, docs show `/integrations`.

---

## Summary

### Verification Statistics

| Status | Count | Percentage |
|--------|-------|------------|
| [x] Verified | 64 | 67% |
| [!] Discrepancy | 32 | 33% |
| [?] Undocumented | 0 | 0% |

### Key Discrepancies

1. **Admin prefix**: Users, Workspaces, Audit Logs, and Integrations use `/admin/` prefix in codebase but not in docs
2. **Path segments**: Workspace members use `/users` vs docs `/members`
3. **User invites path**: Uses `/admin/users/invites` vs `/user-invites`
4. **Publish action**: Uses `/makeDefault` vs docs `/publish` for prompts and partials

### Recommendations

1. Verify if `/admin/` prefixed paths are aliases or different API versions
2. Test both path variants to confirm which are accepted by the API
3. Consider updating codebase to match official documentation paths for consistency
