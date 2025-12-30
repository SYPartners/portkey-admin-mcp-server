import dotenv from 'dotenv';

dotenv.config();

interface PortkeyUser {
  object: string;
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  created_at: string;
  last_updated_at: string;
}

interface PortkeyUsersResponse {
  total: number;
  object: string;
  data: PortkeyUser[];
}

interface WorkspaceDetails {
  id: string;    // Changed from slug to id
  role: 'admin' | 'member' | 'manager';  // Added 'manager' option
}

interface WorkspaceApiKeyDetails {
  name?: string;
  expiry?: string;
  metadata?: Record<string, string>;
  scopes: string[];  // Added required scopes array
}

interface InviteUserRequest {
  email: string;
  role: 'admin' | 'member';
  first_name?: string;
  last_name?: string;
  workspaces: WorkspaceDetails[];
  workspace_api_key_details?: WorkspaceApiKeyDetails;
}

interface InviteUserResponse {
  id: string;        // Changed to match API response
  invite_link: string;  // Changed to match API response
}

interface UserGroupedDataParams {
  time_of_generation_min: string;  // ISO8601 format
  time_of_generation_max: string;  // ISO8601 format
  total_units_min?: number;
  total_units_max?: number;
  cost_min?: number;
  cost_max?: number;
  prompt_token_min?: number;
  prompt_token_max?: number;
  completion_token_min?: number;
  completion_token_max?: number;
  status_code?: string;
  weighted_feedback_min?: number;
  weighted_feedback_max?: number;
  virtual_keys?: string;
  configs?: string;
  workspace_slug?: string;
  api_key_ids?: string;
  current_page?: number;
  page_size?: number;
  metadata?: string;
  ai_org_model?: string;
  trace_id?: string;
  span_id?: string;
}

interface AnalyticsGroup {
  user: string;
  requests: string;
  cost: string;
  object: "analytics-group";
}

interface UserGroupedData {
  total: number;
  object: string;
  data: AnalyticsGroup[];
}

interface WorkspaceDefaults {
  is_default?: number;
  metadata?: Record<string, string>;
  object: 'workspace';
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  last_updated_at: string;
  defaults: WorkspaceDefaults | null;
  object: 'workspace';
}

interface ListWorkspacesResponse {
  total: number;
  object: 'list';
  data: Workspace[];
}

interface ListWorkspacesParams {
  page_size?: number;
  current_page?: number;
}

interface WorkspaceUser {
  object: 'workspace-user';
  id: string;
  first_name: string;
  last_name: string;
  org_role: 'admin' | 'member' | 'owner';
  role: 'admin' | 'member' | 'manager';
  status: 'active';
  created_at: string;
  last_updated_at: string;
}

interface SingleWorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  last_updated_at: string;
  defaults: {
    is_default: number;
    metadata: Record<string, string>;
    object: 'workspace';
  } | null;
  users: WorkspaceUser[];
}

interface Config {
  id: string;
  name: string;
  slug: string;
  organisation_id: string;
  workspace_id: string;
  is_default: number;
  status: string;
  owner_id: string;
  updated_by: string;
  created_at: string;
  last_updated_at: string;
}

interface ListConfigsResponse {
  success: boolean;
  data: Config[];
}

interface VirtualKeyRateLimit {
  type: 'requests';
  unit: 'rpm';
  value: number;
}

interface VirtualKeyUsageLimits {
  alert_threshold: number;
  credit_limit: number;
  periodic_reset: 'monthly';
}

interface VirtualKey {
  name: string;
  note: string | null;
  status: 'active' | 'exhausted';
  usage_limits: VirtualKeyUsageLimits | null;
  reset_usage: number | null;
  created_at: string;
  slug: string;
  model_config: Record<string, any>;
  rate_limits: VirtualKeyRateLimit[] | null;
  object: 'virtual-key';
}

interface ListVirtualKeysResponse {
  object: 'list';
  total: number;
  data: VirtualKey[];
}

interface CostDataPoint {
  timestamp: string;
  total: number;
  avg: number;
}

interface CostSummary {
  total: number;
  avg: number;
}

interface CostAnalyticsResponse {
  object: 'analytics-graph';
  data_points: CostDataPoint[];
  summary: CostSummary;
}

interface CostAnalyticsParams {
  time_of_generation_min: string;  // ISO8601 format
  time_of_generation_max: string;  // ISO8601 format
  total_units_min?: number;
  total_units_max?: number;
  cost_min?: number;
  cost_max?: number;
  prompt_token_min?: number;
  prompt_token_max?: number;
  completion_token_min?: number;
  completion_token_max?: number;
  status_code?: string;
  weighted_feedback_min?: number;
  weighted_feedback_max?: number;
  virtual_keys?: string;
  configs?: string;
  workspace_slug?: string;
  api_key_ids?: string;
  metadata?: string;
  ai_org_model?: string;
  trace_id?: string;
  span_id?: string;
}

interface ConfigTarget {
  provider?: string;
  virtual_key?: string;
}

interface ConfigDetails {
  retry?: {
    attempts?: number;
    on_status_codes?: number[];
  };
  cache?: {
    mode?: string;
    max_age?: number;
  };
  strategy?: {
    mode?: string;
  };
  targets?: ConfigTarget[];
}

interface GetConfigResponse {
  success?: boolean;
  data?: {
    config?: ConfigDetails;
  };
}

// ============================================
// Collection Interfaces (App Grouping)
// ============================================

interface Collection {
  id: string;
  name: string;
  slug: string;
  workspace_id: string;
  created_at: string;
  last_updated_at: string;
  object: 'collection';
}

interface ListCollectionsParams {
  workspace_id?: string;
  current_page?: number;
  page_size?: number;
  search?: string;
}

interface ListCollectionsResponse {
  data: Collection[];
  total: number;
  object: 'list';
}

interface CreateCollectionRequest {
  name: string;
  workspace_id?: string;
}

interface CreateCollectionResponse {
  id: string;
  slug: string;
  object: 'collection';
}

// ============================================
// Prompt Admin API Interfaces
// ============================================

interface PromptMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PromptParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  default?: string | number | boolean | unknown[] | Record<string, unknown>;
  required?: boolean;
  description?: string;
}

interface PromptFunctionDefinition {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

interface PromptToolDefinition {
  type: 'function';
  function: PromptFunctionDefinition;
}

type ToolChoice = 'auto' | 'none' | { type: 'function'; function: { name: string } };

interface PromptTemplateMetadata {
  app?: string;
  env?: string;
  source_file?: string;
  migrated_at?: string;
  [key: string]: unknown;
}

// Create Prompt
interface CreatePromptRequest {
  name: string;
  collection_id: string;
  /** Portkey API field name - contains message array, not a string */
  string: PromptMessage[];
  parameters: PromptParameter[];
  virtual_key: string;
  functions?: PromptFunctionDefinition[];
  tools?: PromptToolDefinition[];
  tool_choice?: ToolChoice;
  model?: string;
  version_description?: string;
  template_metadata?: PromptTemplateMetadata;
}

interface CreatePromptResponse {
  id: string;
  slug: string;
  version_id: string;
  object: 'prompt';
}

// List Prompts
interface ListPromptsParams {
  collection_id?: string;
  workspace_id?: string;
  current_page?: number;
  page_size?: number;
  search?: string;
}

interface PromptListItem {
  id: string;
  name: string;
  slug: string;
  collection_id: string;
  workspace_id?: string;
  model?: string;
  status?: string;
  created_at: string;
  last_updated_at: string;
  object: 'prompt';
}

interface ListPromptsResponse {
  data: PromptListItem[];
  total: number;
  object: 'list';
}

// Get Prompt
interface PromptVersion {
  id: string;
  version_number: number;
  version_description?: string;
  /** Portkey API field name - contains message array, not a string */
  string: PromptMessage[];
  parameters: PromptParameter[];
  model?: string;
  virtual_key?: string;
  functions?: PromptFunctionDefinition[];
  tools?: PromptToolDefinition[];
  tool_choice?: ToolChoice;
  template_metadata?: PromptTemplateMetadata;
  created_at: string;
}

interface GetPromptResponse {
  id: string;
  name: string;
  slug: string;
  collection_id: string;
  workspace_id?: string;
  created_at: string;
  last_updated_at: string;
  current_version: PromptVersion;
  versions: PromptVersion[];
  object: 'prompt';
}

// Update Prompt
interface UpdatePromptRequest {
  name?: string;
  collection_id?: string;
  /** Portkey API field name - contains message array, not a string */
  string?: PromptMessage[];
  parameters?: PromptParameter[];
  model?: string;
  virtual_key?: string;
  functions?: PromptFunctionDefinition[];
  tools?: PromptToolDefinition[];
  tool_choice?: ToolChoice;
  version_description?: string;
  template_metadata?: PromptTemplateMetadata;
}

interface UpdatePromptResponse {
  id: string;
  slug: string;
  prompt_version_id: string;
  object: 'prompt';
}

// Render Prompt
interface RenderPromptRequest {
  variables: Record<string, string | number | boolean>;
  hyperparameters?: PromptHyperparameters;
}

interface PromptHyperparameters {
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string[];
}

interface RenderPromptResponse {
  success: boolean;
  data: {
    messages: PromptMessage[];
    model?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    [key: string]: unknown;
  };
}

// Prompt Completions
interface BillingMetadata {
  client_id: string;
  app: string;
  env: string;
  project_id?: string;
  feature?: string;
  prompt_slug?: string;
  prompt_version?: string;
  [key: string]: unknown;
}

interface PromptCompletionRequest {
  variables: Record<string, string | number | boolean>;
  metadata?: BillingMetadata;
  stream?: boolean;
  hyperparameters?: PromptHyperparameters;
}

interface PromptCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface PromptCompletionUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface PromptCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: PromptCompletionChoice[];
  usage: PromptCompletionUsage;
}

// Migrate Prompt
interface MigratePromptRequest {
  name: string;
  app: string;
  env: string;
  collection_id: string;
  /** Portkey API field name - contains message array, not a string */
  string: PromptMessage[];
  parameters: PromptParameter[];
  virtual_key: string;
  model?: string;
  version_description?: string;
  template_metadata?: PromptTemplateMetadata;
  functions?: PromptFunctionDefinition[];
  tools?: PromptToolDefinition[];
  tool_choice?: ToolChoice;
  dry_run?: boolean;
}

interface MigratePromptResponse {
  action: 'created' | 'updated' | 'unchanged';
  prompt_id: string;
  slug: string;
  version_id?: string;
  dry_run: boolean;
  message: string;
}

// Promote Prompt
interface PromotePromptRequest {
  source_prompt_id: string;
  target_collection_id: string;
  target_name?: string;
  target_env: string;
  virtual_key?: string;
}

interface PromotePromptResponse {
  source_prompt_id: string;
  source_version_id: string;
  target_prompt_id: string;
  target_version_id: string;
  action: 'created' | 'updated';
  promoted_at: string;
}

// Metadata Validation
interface ValidateMetadataResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class PortkeyService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.portkey.ai/v1';

  constructor() {
    const apiKey = process.env.PORTKEY_API_KEY;
    if (!apiKey) {
      throw new Error('PORTKEY_API_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  async listUsers(): Promise<PortkeyUsersResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as PortkeyUsersResponse;
      return {
        total: data.total,
        object: data.object,
        data: data.data.map(user => ({
          object: user.object,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          last_updated_at: user.last_updated_at
        }))
      };
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch users from Portkey API');
    }
  }

  async inviteUser(data: InviteUserRequest): Promise<InviteUserResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/invites`, {  // Fixed URL
        method: 'POST',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          role: data.role,
          first_name: data.first_name,
          last_name: data.last_name,
          workspaces: data.workspaces,
          workspace_api_key_details: data.workspace_api_key_details
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to invite user: ${response.status}`);
      }

      const result = await response.json();
      return {
        id: result.id,
        invite_link: result.invite_link
      };
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to invite user to Portkey');
    }
  }

  async getUserGroupedData(params: UserGroupedDataParams): Promise<UserGroupedData> {
    try {
      const queryParams = new URLSearchParams({
        time_of_generation_min: params.time_of_generation_min,
        time_of_generation_max: params.time_of_generation_max,
        ...(params.total_units_min && { total_units_min: params.total_units_min.toString() }),
        ...(params.total_units_max && { total_units_max: params.total_units_max.toString() }),
        ...(params.cost_min && { cost_min: params.cost_min.toString() }),
        ...(params.cost_max && { cost_max: params.cost_max.toString() }),
        // Add other optional parameters as needed
      });

      const response = await fetch(
        `${this.baseUrl}/analytics/groups/users?${queryParams.toString()}`, 
        {
          method: 'GET',
          headers: {
            'x-portkey-api-key': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as UserGroupedData;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch user grouped data from Portkey API');
    }
  }

  async listWorkspaces(params?: ListWorkspacesParams): Promise<ListWorkspacesResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page_size) {
        queryParams.append('page_size', params.page_size.toString());
      }
      if (params?.current_page) {
        queryParams.append('current_page', params.current_page.toString());
      }

      const url = `${this.baseUrl}/admin/workspaces${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as ListWorkspacesResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch workspaces from Portkey API');
    }
  }

  async getWorkspace(workspaceId: string): Promise<SingleWorkspaceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/workspaces/${workspaceId}`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as SingleWorkspaceResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch workspace details from Portkey API');
    }
  }

  async listConfigs(): Promise<ListConfigsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/configs`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as ListConfigsResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch configurations from Portkey API');
    }
  }

  async listVirtualKeys(): Promise<ListVirtualKeysResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/virtual-keys`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as ListVirtualKeysResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch virtual keys from Portkey API');
    }
  }

  async getCostAnalytics(params: CostAnalyticsParams): Promise<CostAnalyticsResponse> {
    try {
      const queryParams = new URLSearchParams({
        time_of_generation_min: params.time_of_generation_min,
        time_of_generation_max: params.time_of_generation_max,
        ...(params.total_units_min && { total_units_min: params.total_units_min.toString() }),
        ...(params.total_units_max && { total_units_max: params.total_units_max.toString() }),
        ...(params.cost_min && { cost_min: params.cost_min.toString() }),
        ...(params.cost_max && { cost_max: params.cost_max.toString() }),
        ...(params.prompt_token_min && { prompt_token_min: params.prompt_token_min.toString() }),
        ...(params.prompt_token_max && { prompt_token_max: params.prompt_token_max.toString() }),
        ...(params.completion_token_min && { completion_token_min: params.completion_token_min.toString() }),
        ...(params.completion_token_max && { completion_token_max: params.completion_token_max.toString() }),
        ...(params.status_code && { status_code: params.status_code }),
        ...(params.weighted_feedback_min && { weighted_feedback_min: params.weighted_feedback_min.toString() }),
        ...(params.weighted_feedback_max && { weighted_feedback_max: params.weighted_feedback_max.toString() }),
        ...(params.virtual_keys && { virtual_keys: params.virtual_keys }),
        ...(params.configs && { configs: params.configs }),
        ...(params.workspace_slug && { workspace_slug: params.workspace_slug }),
        ...(params.api_key_ids && { api_key_ids: params.api_key_ids }),
        ...(params.metadata && { metadata: params.metadata }),
        ...(params.ai_org_model && { ai_org_model: params.ai_org_model }),
        ...(params.trace_id && { trace_id: params.trace_id }),
        ...(params.span_id && { span_id: params.span_id })
      });

      const response = await fetch(
        `${this.baseUrl}/analytics/graphs/cost?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'x-portkey-api-key': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as CostAnalyticsResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch cost analytics from Portkey API');
    }
  }

  async getConfig(slug: string): Promise<GetConfigResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/configs/${slug}`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch configuration details from Portkey API');
    }
  }

  // ============================================
  // Collection Methods (App Grouping)
  // ============================================

  async listCollections(params?: ListCollectionsParams): Promise<ListCollectionsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.workspace_id) queryParams.append('workspace_id', params.workspace_id);
      if (params?.current_page) queryParams.append('current_page', params.current_page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = `${this.baseUrl}/prompts/collections${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as ListCollectionsResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch collections from Portkey API');
    }
  }

  async createCollection(data: CreateCollectionRequest): Promise<CreateCollectionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/prompts/collections`, {
        method: 'POST',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json() as CreateCollectionResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCollection(collectionId: string): Promise<Collection> {
    try {
      const response = await fetch(`${this.baseUrl}/prompts/collections/${collectionId}`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Collection not found: ${collectionId}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as Collection;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to fetch collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================
  // Prompt Admin Methods
  // ============================================

  async createPrompt(data: CreatePromptRequest): Promise<CreatePromptResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/prompts`, {
        method: 'POST',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json() as CreatePromptResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listPrompts(params?: ListPromptsParams): Promise<ListPromptsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.collection_id) queryParams.append('collection_id', params.collection_id);
      if (params?.workspace_id) queryParams.append('workspace_id', params.workspace_id);
      if (params?.current_page) queryParams.append('current_page', params.current_page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = `${this.baseUrl}/prompts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as ListPromptsResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error('Failed to fetch prompts from Portkey API');
    }
  }

  async getPrompt(promptId: string): Promise<GetPromptResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/prompts/${promptId}`, {
        method: 'GET',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Prompt not found: ${promptId}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as GetPromptResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to fetch prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePrompt(promptId: string, data: UpdatePromptRequest): Promise<UpdatePromptResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/prompts/${promptId}`, {
        method: 'PUT',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json() as UpdatePromptResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to update prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async renderPrompt(promptId: string, data: RenderPromptRequest): Promise<RenderPromptResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/prompts/${promptId}/render`, {
        method: 'POST',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json() as RenderPromptResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to render prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async runPromptCompletion(promptId: string, data: PromptCompletionRequest): Promise<PromptCompletionResponse> {
    try {
      // Validate required billing metadata - always required for cost attribution
      if (!data.metadata) {
        throw new Error('Billing metadata is required for prompt completions');
      }
      const validationResult = this.validateBillingMetadata(data.metadata);
      if (!validationResult.valid) {
        throw new Error(`Billing metadata validation failed: ${validationResult.errors.join(', ')}`);
      }

      const response = await fetch(`${this.baseUrl}/prompts/${promptId}/completions`, {
        method: 'POST',
        headers: {
          'x-portkey-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          variables: data.variables,
          metadata: data.metadata,
          stream: false, // Force non-streaming for MCP tool response
          ...data.hyperparameters
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json() as PromptCompletionResponse;
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to run prompt completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================
  // Migration & Promotion Methods
  // ============================================

  async migratePrompt(data: MigratePromptRequest): Promise<MigratePromptResponse> {
    const { dry_run = false, app, env } = data;

    try {
      // Search for existing prompt by name in the collection
      const existingPrompts = await this.listPrompts({
        collection_id: data.collection_id,
        search: data.name
      });

      // Find exact name match
      const existingPrompt = existingPrompts.data.find(
        p => p.name.toLowerCase() === data.name.toLowerCase()
      );

      if (existingPrompt) {
        // Prompt exists - check if update is needed
        const currentPrompt = await this.getPrompt(existingPrompt.id);
        const currentVersion = currentPrompt.current_version;

        // Compare template content to detect changes
        const templateChanged = JSON.stringify(currentVersion.string) !== JSON.stringify(data.string);
        const parametersChanged = JSON.stringify(currentVersion.parameters) !== JSON.stringify(data.parameters);
        const modelChanged = data.model !== undefined && currentVersion.model !== data.model;

        const needsUpdate = templateChanged || parametersChanged || modelChanged;

        if (!needsUpdate) {
          return {
            action: 'unchanged',
            prompt_id: existingPrompt.id,
            slug: existingPrompt.slug,
            dry_run,
            message: `Prompt "${data.name}" already exists and is up to date`
          };
        }

        if (dry_run) {
          return {
            action: 'updated',
            prompt_id: existingPrompt.id,
            slug: existingPrompt.slug,
            dry_run: true,
            message: `Would update prompt "${data.name}" (changes detected)`
          };
        }

        // Perform update with app/env metadata
        const updateResult = await this.updatePrompt(existingPrompt.id, {
          string: data.string,
          parameters: data.parameters,
          model: data.model,
          virtual_key: data.virtual_key,
          version_description: data.version_description,
          template_metadata: {
            ...data.template_metadata,
            app,
            env,
            migrated_at: new Date().toISOString()
          },
          functions: data.functions,
          tools: data.tools,
          tool_choice: data.tool_choice
        });

        return {
          action: 'updated',
          prompt_id: updateResult.id,
          slug: updateResult.slug,
          version_id: updateResult.prompt_version_id,
          dry_run: false,
          message: `Updated prompt "${data.name}" with new version`
        };
      }

      // Prompt does not exist - create it
      if (dry_run) {
        return {
          action: 'created',
          prompt_id: '',
          slug: '',
          dry_run: true,
          message: `Would create new prompt "${data.name}"`
        };
      }

      const createResult = await this.createPrompt({
        name: data.name,
        collection_id: data.collection_id,
        string: data.string,
        parameters: data.parameters,
        virtual_key: data.virtual_key,
        model: data.model,
        version_description: data.version_description,
        template_metadata: {
          ...data.template_metadata,
          app,
          env,
          migrated_at: new Date().toISOString()
        },
        functions: data.functions,
        tools: data.tools,
        tool_choice: data.tool_choice
      });

      return {
        action: 'created',
        prompt_id: createResult.id,
        slug: createResult.slug,
        version_id: createResult.version_id,
        dry_run: false,
        message: `Created new prompt "${data.name}"`
      };
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to migrate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async promotePrompt(data: PromotePromptRequest): Promise<PromotePromptResponse> {
    try {
      // Get the source prompt
      const sourcePrompt = await this.getPrompt(data.source_prompt_id);
      const sourceVersion = sourcePrompt.current_version;

      // Determine target name (append env suffix if not provided)
      const targetName = data.target_name || sourcePrompt.name.replace(/-(dev|staging|prod)$/, '') + `-${data.target_env}`;

      // Search for existing target prompt in target collection
      const existingTargets = await this.listPrompts({
        collection_id: data.target_collection_id,
        search: targetName
      });

      const existingTarget = existingTargets.data.find(
        p => p.name.toLowerCase() === targetName.toLowerCase()
      );

      if (existingTarget) {
        // Update existing target prompt with source version content
        const updateResult = await this.updatePrompt(existingTarget.id, {
          string: sourceVersion.string,
          parameters: sourceVersion.parameters,
          model: sourceVersion.model,
          virtual_key: sourceVersion.virtual_key,
          functions: sourceVersion.functions,
          tools: sourceVersion.tools,
          tool_choice: sourceVersion.tool_choice,
          version_description: `Promoted from ${sourcePrompt.slug} v${sourceVersion.version_number}`,
          template_metadata: {
            ...sourceVersion.template_metadata,
            env: data.target_env,
            promoted_from: sourcePrompt.slug,
            promoted_from_version: sourceVersion.version_number.toString(),
            promoted_at: new Date().toISOString()
          }
        });

        return {
          source_prompt_id: data.source_prompt_id,
          source_version_id: sourceVersion.id,
          target_prompt_id: updateResult.id,
          target_version_id: updateResult.prompt_version_id,
          action: 'updated',
          promoted_at: new Date().toISOString()
        };
      }

      // Resolve virtual_key: caller override > source version
      const virtualKey = data.virtual_key || sourceVersion.virtual_key;
      if (!virtualKey) {
        throw new Error('Cannot promote prompt: source version has no virtual_key and none was provided');
      }

      // Create new target prompt
      const createResult = await this.createPrompt({
        name: targetName,
        collection_id: data.target_collection_id,
        string: sourceVersion.string,
        parameters: sourceVersion.parameters,
        virtual_key: virtualKey,
        model: sourceVersion.model,
        functions: sourceVersion.functions,
        tools: sourceVersion.tools,
        tool_choice: sourceVersion.tool_choice,
        version_description: `Promoted from ${sourcePrompt.slug} v${sourceVersion.version_number}`,
        template_metadata: {
          ...sourceVersion.template_metadata,
          env: data.target_env,
          promoted_from: sourcePrompt.slug,
          promoted_from_version: sourceVersion.version_number.toString(),
          promoted_at: new Date().toISOString()
        }
      });

      return {
        source_prompt_id: data.source_prompt_id,
        source_version_id: sourceVersion.id,
        target_prompt_id: createResult.id,
        target_version_id: createResult.version_id,
        action: 'created',
        promoted_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('PortkeyService Error:', error);
      throw new Error(`Failed to promote prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================
  // Metadata Validation
  // ============================================

  validateBillingMetadata(metadata: Partial<BillingMetadata>): ValidateMetadataResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!metadata.client_id) {
      errors.push('Missing required field: client_id');
    }
    if (!metadata.app) {
      errors.push('Missing required field: app');
    }
    if (!metadata.env) {
      errors.push('Missing required field: env');
    }

    // Validate app value
    const validApps = ['hourlink', 'apizone', 'research-pilot'];
    if (metadata.app && !validApps.includes(metadata.app)) {
      warnings.push(`Unrecognized app: "${metadata.app}". Expected one of: ${validApps.join(', ')}`);
    }

    // Validate env value
    const validEnvs = ['dev', 'staging', 'prod'];
    if (metadata.env && !validEnvs.includes(metadata.env)) {
      warnings.push(`Unrecognized env: "${metadata.env}". Expected one of: ${validEnvs.join(', ')}`);
    }

    // Optional but recommended
    if (!metadata.project_id) {
      warnings.push('Missing recommended field: project_id (helps with billing attribution)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
} 