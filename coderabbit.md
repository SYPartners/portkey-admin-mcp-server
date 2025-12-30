# CodeRabbit Review Issues - PR #1

## Critical Issues

### 1. Type mismatch: `string` property should be a string, not an array
**File:** `src/services/portkey.service.ts` (lines 336-349)
**Severity:** Critical

The `string` property matches the Portkey API contract name, but the type is incorrect. The Portkey Admin API expects `string` to be a string (prompt template text), but the interface defines it as `PromptMessage[]`. This will cause API calls to fail at runtime.

**Fix:** Update the type to `string: string` or verify the actual Portkey API schema.

---

## Potential Issues

### 2. Potential key collision when spreading hyperparameters
**File:** `src/services/portkey.service.ts` (lines 1068-1074)
**Severity:** Minor

Spreading `data.hyperparameters` at the top level could overwrite `variables`, `metadata`, or `stream` if hyperparameters contains matching keys.

**Proposed fix:**
```typescript
body: JSON.stringify({
  variables: data.variables,
  metadata: data.metadata,
  stream: false,
  ...(data.hyperparameters && {
    max_tokens: data.hyperparameters.max_tokens,
    temperature: data.hyperparameters.temperature,
    top_p: data.hyperparameters.top_p,
    top_k: data.hyperparameters.top_k,
    presence_penalty: data.hyperparameters.presence_penalty,
    frequency_penalty: data.hyperparameters.frequency_penalty,
    stop: data.hyperparameters.stop
  })
})
```

---

### 3. Unused variable `promptData`
**File:** `src/services/portkey.service.ts` (lines 1092-1094)
**Severity:** Minor

The destructured `promptData` variable is never used.

**Fix:**
```typescript
const { dry_run = false, app, env } = data;
```

---

### 4. Empty string fallback for `virtual_key` may cause API errors
**File:** `src/services/portkey.service.ts` (lines 1260-1279)
**Severity:** Minor

Using `virtual_key: sourceVersion.virtual_key || ''` when the source lacks a `virtual_key` passes an empty string to `createPrompt`, which requires a valid key.

**Proposed fix:**
```typescript
if (!sourceVersion.virtual_key) {
  throw new Error('Source prompt version does not have a virtual_key configured');
}
```

---

## Refactor Suggestions

### 5. Constrain `app` and `env` to enum values for validation
**File:** `src/index.ts` (lines 527-533)
**Severity:** Major refactor

The `app` and `env` fields are described as having specific allowed values but defined as generic strings, bypassing validation.

**Proposed fix:**
```typescript
const BillingMetadataSchema = z.object({
  client_id: z.string().describe("Client ID for billing attribution (REQUIRED)"),
  app: z.enum(['hourlink', 'apizone', 'research-pilot']).describe("App identifier (REQUIRED)"),
  env: z.enum(['dev', 'staging', 'prod']).describe("Environment (REQUIRED)"),
  project_id: z.string().optional().describe("Project ID for granular billing"),
  feature: z.string().optional().describe("Feature name for tracking")
});
```

Apply same pattern to:
- `migrate_prompt` tool parameters (lines 874-875)
- `promote_prompt` tool `target_env` parameter (line 942)

---

### 6. Prefer nullish coalescing for consistency
**File:** `src/index.ts` (lines 917-919)
**Severity:** Nitpick

Using `|| undefined` could incorrectly treat falsy but valid values as undefined. Use `?? undefined` for consistency.

**Proposed fix:**
```typescript
prompt_id: result.prompt_id ?? undefined,
slug: result.slug ?? undefined,
version_id: result.version_id ?? undefined
```

---

## Nitpick Comments

### 7. Environment suffix regex may miss edge cases
**File:** `src/services/portkey.service.ts` (line 1217)

The regex `/-staging$|-dev$/` doesn't handle `-prod` suffix.

**Proposed fix:**
```typescript
const targetName = data.target_name || sourcePrompt.name.replace(/-(dev|staging|prod)$/, '') + `-${data.target_env}`;
```

---

### 8. Hardcoded app/env validation lists may require maintenance
**File:** `src/services/portkey.service.ts` (lines 1313-1323)

Extract `validApps` and `validEnvs` to constants for easier maintenance.

**Proposed fix:**
```typescript
const VALID_APPS = ['hourlink', 'apizone', 'research-pilot'] as const;
const VALID_ENVS = ['dev', 'staging', 'prod'] as const;
```

---

### 9. Fragile change detection using `JSON.stringify`
**File:** `src/services/portkey.service.ts` (lines 1111-1116)

JSON.stringify comparison is order-sensitive. Consider a deep equality utility (e.g., lodash `isEqual`).

---

### 10. Confusing property name `string` for message content
**File:** `src/services/portkey.service.ts` (lines 336-349)

Using `string` as a property name is confusing since it's a TypeScript type keyword. If this matches upstream Portkey API, add a comment explaining this. If local decision, consider renaming to `messages` or `template`.

---

## Documentation

### 11. PR status marked as "Merged" but PR is still open
**File:** `ROADMAP.md` (lines 14-16)

Update status to "In Review" until merge.
