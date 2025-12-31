import crypto from "node:crypto";
import dotenv from "dotenv";
import {
	buildQueryString,
	fetchWithTimeout,
	parseErrorResponse,
} from "../lib/fetch.js";
import { Logger } from "../lib/logger.js";

dotenv.config();

export interface ApiResponse<T> {
	data: T;
	status: number;
}

export interface PaginationParams {
	current_page?: number;
	page_size?: number;
}

const DEFAULT_BASE_URL = "https://api.portkey.ai/v1";

function validateUrl(url: string): void {
	try {
		const parsed = new URL(url);
		if (!["http:", "https:"].includes(parsed.protocol)) {
			throw new Error(`Invalid URL protocol: ${parsed.protocol}`);
		}
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error(`Invalid base URL: ${url}`);
		}
		throw error;
	}
}

export class BaseService {
	protected readonly apiKey: string;
	protected readonly baseUrl: string;
	protected readonly timeout = 30000;

	constructor(apiKeyOverride?: string) {
		// Use provided API key or fall back to environment variable
		const apiKey = apiKeyOverride ?? process.env.PORTKEY_API_KEY;
		if (!apiKey) {
			throw new Error("PORTKEY_API_KEY environment variable is not set");
		}
		this.apiKey = apiKey;

		// Configurable base URL with validation
		const baseUrl = process.env.PORTKEY_BASE_URL ?? DEFAULT_BASE_URL;
		validateUrl(baseUrl);
		this.baseUrl = baseUrl;
	}

	protected async get<T>(
		path: string,
		params?: Record<string, string | number | undefined>,
	): Promise<T> {
		const requestId = crypto.randomUUID();
		const url = `${this.baseUrl}${path}${buildQueryString(params)}`;
		const startTime = Date.now();

		Logger.debug("HTTP request started", {
			requestId,
			method: "GET",
			path,
			metadata: { url },
		});

		try {
			const response = await fetchWithTimeout(url, {
				method: "GET",
				headers: {
					"x-portkey-api-key": this.apiKey,
					Accept: "application/json",
				},
				timeout: this.timeout,
			});

			const duration_ms = Date.now() - startTime;

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				Logger.error("HTTP request failed", {
					requestId,
					method: "GET",
					path,
					statusCode: response.status,
					duration_ms,
					error: errorMessage,
				});
				throw new Error(errorMessage);
			}

			Logger.info("HTTP request completed", {
				requestId,
				method: "GET",
				path,
				statusCode: response.status,
				duration_ms,
			});

			return response.json() as Promise<T>;
		} catch (error) {
			const duration_ms = Date.now() - startTime;
			if (error instanceof Error && error.name !== "Error") {
				Logger.error("HTTP request error", {
					requestId,
					method: "GET",
					path,
					duration_ms,
					error: error.message,
				});
			}
			throw error;
		}
	}

	protected async post<T>(path: string, body?: unknown): Promise<T> {
		const requestId = crypto.randomUUID();
		const url = `${this.baseUrl}${path}`;
		const startTime = Date.now();

		Logger.debug("HTTP request started", {
			requestId,
			method: "POST",
			path,
		});

		try {
			const response = await fetchWithTimeout(url, {
				method: "POST",
				headers: {
					"x-portkey-api-key": this.apiKey,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: body ? JSON.stringify(body) : undefined,
				timeout: this.timeout,
			});

			const duration_ms = Date.now() - startTime;

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				Logger.error("HTTP request failed", {
					requestId,
					method: "POST",
					path,
					statusCode: response.status,
					duration_ms,
					error: errorMessage,
				});
				throw new Error(errorMessage);
			}

			Logger.info("HTTP request completed", {
				requestId,
				method: "POST",
				path,
				statusCode: response.status,
				duration_ms,
			});

			return response.json() as Promise<T>;
		} catch (error) {
			const duration_ms = Date.now() - startTime;
			if (error instanceof Error && error.name !== "Error") {
				Logger.error("HTTP request error", {
					requestId,
					method: "POST",
					path,
					duration_ms,
					error: error.message,
				});
			}
			throw error;
		}
	}

	protected async put<T>(path: string, body?: unknown): Promise<T> {
		const requestId = crypto.randomUUID();
		const url = `${this.baseUrl}${path}`;
		const startTime = Date.now();

		Logger.debug("HTTP request started", {
			requestId,
			method: "PUT",
			path,
		});

		try {
			const response = await fetchWithTimeout(url, {
				method: "PUT",
				headers: {
					"x-portkey-api-key": this.apiKey,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: body ? JSON.stringify(body) : undefined,
				timeout: this.timeout,
			});

			const duration_ms = Date.now() - startTime;

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				Logger.error("HTTP request failed", {
					requestId,
					method: "PUT",
					path,
					statusCode: response.status,
					duration_ms,
					error: errorMessage,
				});
				throw new Error(errorMessage);
			}

			Logger.info("HTTP request completed", {
				requestId,
				method: "PUT",
				path,
				statusCode: response.status,
				duration_ms,
			});

			return response.json() as Promise<T>;
		} catch (error) {
			const duration_ms = Date.now() - startTime;
			if (error instanceof Error && error.name !== "Error") {
				Logger.error("HTTP request error", {
					requestId,
					method: "PUT",
					path,
					duration_ms,
					error: error.message,
				});
			}
			throw error;
		}
	}

	protected async delete<T>(path: string): Promise<T> {
		const requestId = crypto.randomUUID();
		const url = `${this.baseUrl}${path}`;
		const startTime = Date.now();

		Logger.debug("HTTP request started", {
			requestId,
			method: "DELETE",
			path,
		});

		try {
			const response = await fetchWithTimeout(url, {
				method: "DELETE",
				headers: {
					"x-portkey-api-key": this.apiKey,
					Accept: "application/json",
				},
				timeout: this.timeout,
			});

			const duration_ms = Date.now() - startTime;

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				Logger.error("HTTP request failed", {
					requestId,
					method: "DELETE",
					path,
					statusCode: response.status,
					duration_ms,
					error: errorMessage,
				});
				throw new Error(errorMessage);
			}

			Logger.info("HTTP request completed", {
				requestId,
				method: "DELETE",
				path,
				statusCode: response.status,
				duration_ms,
			});

			return response.json() as Promise<T>;
		} catch (error) {
			const duration_ms = Date.now() - startTime;
			if (error instanceof Error && error.name !== "Error") {
				Logger.error("HTTP request error", {
					requestId,
					method: "DELETE",
					path,
					duration_ms,
					error: error.message,
				});
			}
			throw error;
		}
	}
}
