import {
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import {
	IAccessAuditSearchRequest,
	IBenchmarkSearchRequest,
	IErrorResponse,
	IPaginationOptions,
	IPiiSearchRequest,
	IRateLimitInfo,
	IVulnerabilitySearchRequest,
} from '../../interfaces';

/**
 * Generic HTTP request function for Cavelo API with rate limiting and error handling
 */
export async function caveloApiRequest(
	this: any,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	endpoint: string,
	body?: any,
	qs?: any,
	options: IHttpRequestOptions = {},
): Promise<any> {
	const credentials = await this.getCredentials('caveloApi');
	const baseUrl = credentials.baseUrl || 'https://api.prod.cavelodata.com';
	const organizationUuid = credentials.organizationUuid;

	// Replace {organization_uuid} placeholder in endpoint
	const fullEndpoint = endpoint.replace('{organization_uuid}', organizationUuid);

	const requestOptions: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${fullEndpoint}`,
		headers: {
			'X-API-Key': credentials.apiKey,
			'Content-Type': 'application/json',
			...options.headers,
		},
		json: true,
		...options,
	};

	if (body) {
		requestOptions.body = body;
	}

	if (qs) {
		requestOptions.qs = qs;
	}

	let attempts = 0;
	const maxRetries = 3;

	while (attempts <= maxRetries) {
		try {
			const response = await this.helpers.httpRequest(requestOptions);
			return response;
		} catch (error: any) {
			// Handle rate limiting (429)
			if (error.statusCode === 429) {
				attempts++;
				if (attempts > maxRetries) {
					throw new NodeApiError(this.getNode(), {
						message: 'Rate limit exceeded. Maximum retries reached.',
						httpCode: '429',
						description: 'The Cavelo API rate limit has been exceeded. Please try again later.',
					});
				}

				// Extract retry-after header
				const retryAfter = error.response?.headers?.['retry-after'] || Math.pow(2, attempts) * 1000;
				const delay = parseInt(retryAfter.toString()) * 1000;

				this.logger.info(`Rate limited. Retrying in ${delay}ms (attempt ${attempts}/${maxRetries})`);
				await new Promise(resolve => setTimeout(resolve, delay));
				continue;
			}

			// Handle other HTTP errors
			if (error.statusCode) {
				const errorResponse = error.response?.body as IErrorResponse;
				const errorMessage = errorResponse?.error?.message || error.message || 'Unknown error';
				
				throw new NodeApiError(this.getNode(), {
					message: errorMessage,
					httpCode: error.statusCode.toString(),
					description: this.getErrorMessage(error.statusCode),
				});
			}

			// Re-throw non-HTTP errors
			throw error;
		}
	}
}

/**
 * Get user-friendly error message based on HTTP status code
 */
function getErrorMessage(statusCode: number): string {
	switch (statusCode) {
		case 401:
			return 'Invalid API key or organization UUID. Please check your credentials.';
		case 403:
			return 'Access forbidden. Your API key may not have the required permissions.';
		case 404:
			return 'Resource not found. Check that the organization UUID and endpoint are correct.';
		case 429:
			return 'Rate limit exceeded. The request will be retried automatically.';
		case 500:
			return 'Internal server error. Please try again later.';
		case 503:
			return 'Service unavailable. Please try again later.';
		default:
			return 'An error occurred while making the request.';
	}
}

/**
 * Request all items with automatic pagination handling
 */
export async function caveloApiRequestAllItems(
	this: any,
	method: 'GET' | 'POST',
	endpoint: string,
	body?: any,
	qs?: any,
	options: IPaginationOptions = {},
): Promise<any[]> {
	const allItems: any[] = [];
	let cursor: string | undefined = options.cursor;
	const limit = options.limit || 0;
	const pageSize = options.pagesize || 100;

	let hasMore = true;
	let totalFetched = 0;

	while (hasMore && (limit === 0 || totalFetched < limit)) {
		const currentPageSize = limit > 0 ? Math.min(pageSize, limit - totalFetched) : pageSize;
		
		const queryParams = {
			...qs,
			pagesize: currentPageSize,
			...(cursor && { cursor }),
		};

		const response = await caveloApiRequest.call(this, method, endpoint, body, queryParams, options);
		
		// Handle different response structures
		const items = response.data || response.items || response;
		if (Array.isArray(items)) {
			allItems.push(...items);
			totalFetched += items.length;
		}

		// Check pagination
		if (response.pagination) {
			cursor = response.pagination.cursor;
			hasMore = response.pagination.hasMore;
		} else if (response.cursor) {
			cursor = response.cursor;
			hasMore = items.length === currentPageSize;
		} else {
			hasMore = false;
		}

		// Break if we've reached the limit
		if (limit > 0 && totalFetched >= limit) {
			break;
		}

		// Break if no more items
		if (items.length === 0) {
			break;
		}
	}

	return allItems;
}

/**
 * Build search payload for POST requests
 */
export function buildSearchPayload(
	searchRequest: IVulnerabilitySearchRequest | IPiiSearchRequest | IAccessAuditSearchRequest | IBenchmarkSearchRequest,
	additionalFilters: any = {},
): any {
	return {
		...searchRequest,
		...additionalFilters,
	};
}

/**
 * Build date range filters with helper shortcuts
 */
export function buildDateRangeFilters(
	dateRange: string,
	startField: string,
	endField: string,
): { [key: string]: string } {
	const now = new Date();
	const filters: { [key: string]: string } = {};

	switch (dateRange) {
		case 'last24h': {
			const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
			filters[startField] = yesterday.toISOString();
			break;
		}
		case 'last7days': {
			const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			filters[startField] = weekAgo.toISOString();
			break;
		}
		case 'last30days': {
			const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			filters[startField] = monthAgo.toISOString();
			break;
		}
		case 'last90days': {
			const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
			filters[startField] = quarterAgo.toISOString();
			break;
		}
		case 'custom':
			// Custom date range - caller should provide start/end dates
			break;
	}

	return filters;
}

/**
 * Calculate days since discovery for vulnerabilities
 */
export function calculateDaysSinceDiscovery(scanTime: string): number {
	const scanDate = new Date(scanTime);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - scanDate.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format severity for display
 */
export function formatSeverity(cvssScore?: number): string {
	if (!cvssScore) return 'Unknown';
	
	if (cvssScore >= 9.0) return 'Critical';
	if (cvssScore >= 7.0) return 'High';
	if (cvssScore >= 4.0) return 'Medium';
	return 'Low';
}

/**
 * Validate organization UUID format
 */
export function validateOrganizationUuid(uuid: string): boolean {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

/**
 * Extract hostname from computer name or resource name
 */
export function extractHostname(name: string): string {
	// Remove domain suffix if present
	return name.split('.')[0];
}

/**
 * Check if time is during business hours (9 AM - 5 PM, Monday-Friday)
 */
export function isBusinessHours(date: string): boolean {
	const d = new Date(date);
	const hour = d.getHours();
	const day = d.getDay();
	
	return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

/**
 * Calculate risk score for access audit events
 */
export function calculateRiskScore(event: any): number {
	let score = 0;
	
	// High-risk actions
	if (['delete', 'download', 'copy'].includes(event.action)) {
		score += 10;
	}
	
	// Off-hours access
	if (!isBusinessHours(event.eventTime)) {
		score += 5;
	}
	
	// Failed access
	if (!event.success) {
		score += 15;
	}
	
	// External access (if source IP is available)
	if (event.sourceIpAddress && !isInternalIp(event.sourceIpAddress)) {
		score += 5;
	}
	
	return score;
}

/**
 * Check if IP address is internal
 */
function isInternalIp(ip: string): boolean {
	const internalRanges = [
		/^10\./,
		/^172\.(1[6-9]|2[0-9]|3[0-1])\./,
		/^192\.168\./,
		/^127\./,
		/^::1$/,
		/^fc00:/,
		/^fe80:/,
	];
	
	return internalRanges.some(range => range.test(ip));
}
