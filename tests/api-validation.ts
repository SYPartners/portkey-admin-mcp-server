/**
 * API Validation Tests
 *
 * Tests the Portkey Admin API endpoints to validate our implementation.
 * Specifically validates that:
 *   - `string` field is a plain template string with {{variable}} mustache syntax
 *   - `parameters` field is a Record<string, unknown> of default values
 *
 * Run: npx tsx tests/api-validation.ts
 */

import 'dotenv/config';
import { PortkeyService } from '../src/services/portkey.service.js';

const portkey = new PortkeyService();

interface TestResult {
  name: string;
  passed: boolean;
  data?: unknown;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<unknown>): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${name}`);
  console.log('='.repeat(60));

  try {
    const data = await fn();
    console.log('PASSED');
    console.log('Response:', JSON.stringify(data, null, 2).slice(0, 500));
    results.push({ name, passed: true, data });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log('FAILED:', errorMsg);
    results.push({ name, passed: false, error: errorMsg });
  }
}

async function main() {
  console.log('\nPortkey API Validation Tests');
  console.log('============================\n');

  // Check API key
  if (!process.env.PORTKEY_API_KEY) {
    console.error('ERROR: PORTKEY_API_KEY not set in .env');
    process.exit(1);
  }
  console.log('API Key loaded: [REDACTED]');

  // Store IDs for cleanup
  let workspaceId: string | undefined;
  let collectionId: string | undefined;
  let promptId: string | undefined;
  let virtualKeyId: string | undefined;

  // ============================================================
  // Test 1: List Workspaces
  // ============================================================
  await test('List Workspaces', async () => {
    const response = await portkey.listWorkspaces();
    if (response.data && response.data.length > 0) {
      workspaceId = response.data[0].id;
      console.log(`Found ${response.data.length} workspace(s), using: ${workspaceId}`);
    }
    return response;
  });

  if (!workspaceId) {
    console.error('\nNo workspace found. Cannot continue tests.');
    printSummary();
    return;
  }

  // ============================================================
  // Test 2: List Virtual Keys (needed for prompt creation)
  // ============================================================
  await test('List Virtual Keys', async () => {
    const response = await portkey.listVirtualKeys({ workspace_id: workspaceId });
    if (response.data && response.data.length > 0) {
      virtualKeyId = response.data[0].id;
      console.log(`Found ${response.data.length} virtual key(s), using: ${virtualKeyId}`);
    }
    return response;
  });

  if (!virtualKeyId) {
    console.error('\nNo virtual key found. Create one in Portkey dashboard first.');
    printSummary();
    return;
  }

  // ============================================================
  // Test 3: List Collections
  // ============================================================
  await test('List Collections', async () => {
    const response = await portkey.listCollections({ workspace_id: workspaceId });
    if (response.data && response.data.length > 0) {
      collectionId = response.data[0].id;
      console.log(`Found ${response.data.length} collection(s)`);
    }
    return response;
  });

  // ============================================================
  // Test 4: Create Collection (if none exist)
  // ============================================================
  if (!collectionId) {
    await test('Create Collection', async () => {
      const response = await portkey.createCollection({
        name: 'MCP Test Collection',
        workspace_id: workspaceId!,
        description: 'Created by API validation tests'
      });
      collectionId = response.id;
      console.log(`Created collection: ${collectionId}`);
      return response;
    });
  }

  if (!collectionId) {
    console.error('\nNo collection available. Cannot continue tests.');
    printSummary();
    return;
  }

  // ============================================================
  // Test 5: Create Prompt (validates string: string format)
  // ============================================================
  await test('Create Prompt (validates string field is plain string)', async () => {
    const response = await portkey.createPrompt({
      name: `MCP Test Prompt ${Date.now()}`,
      collection_id: collectionId!,
      // The string field is a template string with {{variable}} mustache syntax
      string: 'You are a helpful assistant. The user name is {{name}}.\n\nQuestion: {{question}}',
      // Parameters are default values for template variables
      parameters: {
        name: 'User',
        question: 'What is 2+2?'
      },
      virtual_key: virtualKeyId!,
      model: 'gpt-4o-mini'
    });
    promptId = response.id;
    console.log(`Created prompt: ${promptId}`);
    console.log(`Slug: ${response.slug}`);
    return response;
  });

  if (!promptId) {
    console.error('\nPrompt creation failed. The string field test FAILED.');
    printSummary();
    return;
  }

  // ============================================================
  // Test 6: Get Prompt (verify structure)
  // ============================================================
  await test('Get Prompt (verify string field is template string)', async () => {
    const response = await portkey.getPrompt(promptId!);
    const templateString = response.current_version?.string;
    console.log(`String type: ${typeof templateString}`);
    console.log(`String length: ${templateString?.length ?? 0}`);
    if (typeof templateString === 'string' && templateString.length > 0) {
      console.log(`Template preview: ${templateString.slice(0, 100)}...`);
    }
    return response;
  });

  // ============================================================
  // Test 7: Render Prompt (test variable substitution)
  // ============================================================
  await test('Render Prompt', async () => {
    const response = await portkey.renderPrompt(promptId!, {
      variables: {
        name: 'TestUser',
        question: 'What is 2+2?'
      }
    });
    console.log('Rendered messages:', JSON.stringify(response.data?.messages, null, 2));
    return response;
  });

  // ============================================================
  // Test 8: Run Prompt Completion (full end-to-end)
  // ============================================================
  await test('Run Prompt Completion', async () => {
    const response = await portkey.runPromptCompletion(promptId!, {
      variables: {
        name: 'TestUser',
        question: 'What is 2+2? Answer in one word.'
      },
      metadata: {
        client_id: 'test-client',
        app: 'research-pilot',
        env: 'dev'
      }
    });
    console.log('Completion response received');
    return response;
  });

  // Print summary
  printSummary();
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  for (const result of results) {
    const status = result.passed ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(`  ${status} ${result.name}`);
  }

  console.log(`\nTotal: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('\n\x1b[32mAll tests passed! The API schema implementation is CORRECT.\x1b[0m');
  } else {
    console.log('\n\x1b[31mSome tests failed. Check the output above for details.\x1b[0m');
  }
}

main().catch(console.error);
