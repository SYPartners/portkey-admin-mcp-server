import { BaseService } from "./base.service.js";

// Audit Log Types
export interface AuditLogEntry {
	id: string;
	action: string;
	actor_id: string;
	actor_email?: string;
	actor_name?: string;
	resource_type: string;
	resource_id: string;
	resource_name?: string;
	workspace_id?: string;
	organisation_id: string;
	metadata?: Record<string, unknown>;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
}

export interface ListAuditLogsParams {
	workspace_id?: string;
	actor_id?: string;
	action?: string;
	resource_type?: string;
	resource_id?: string;
	start_time?: string;
	end_time?: string;
	current_page?: number;
	page_size?: number;
}

export interface ListAuditLogsResponse {
	success: boolean;
	data: AuditLogEntry[];
	total?: number;
	current_page?: number;
	page_size?: number;
}

export class AuditService extends BaseService {
	async listAuditLogs(
		params?: ListAuditLogsParams,
	): Promise<ListAuditLogsResponse> {
		return this.get<ListAuditLogsResponse>("/audit-logs", {
			workspace_id: params?.workspace_id,
			actor_id: params?.actor_id,
			action: params?.action,
			resource_type: params?.resource_type,
			resource_id: params?.resource_id,
			start_time: params?.start_time,
			end_time: params?.end_time,
			current_page: params?.current_page,
			page_size: params?.page_size,
		});
	}
}
