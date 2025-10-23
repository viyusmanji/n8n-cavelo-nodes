// Core API response interfaces based on Cavelo OpenAPI specification

export interface IVulnerability {
	scanId: number;
	targetId: number;
	vulnerabilityScanTime: string;
	vulnerabilityClass: 'patch' | 'vulnerability';
	vulnerabilityTitle: string;
	vulnerabilityDescription: string;
	vulnerabilityCves: string[];
	vulnerabilityCvssV2BaseScore?: number;
	vulnerabilityCvssV3BaseScore?: number;
	vulnerabilityCvssV2Vector?: string;
	vulnerabilityCvssV3Vector?: string;
	vulnerabilityEpssScore?: number;
	vulnerabilitySeverity?: string;
	hostname?: string;
	agentUuid?: string;
	affectedProducts?: string[];
	daysSinceDiscovery?: number;
}

export interface IPiiItem {
	targetId: number;
	scanId: number;
	scanTime: string;
	filePath: string;
	fileName: string;
	fileSize?: number;
	classification: string;
	confidence: number;
	inventoryTags?: string[];
	msipLabels?: string[];
	hostname?: string;
	agentUuid?: string;
}

export interface IAccessAudit {
	organizationUuid: string;
	sourceUuid: number;
	sourceType: 'agent' | 'boxcloud' | 'o365';
	computerName: string;
	eventTime: string;
	resourceName: string;
	resourceType: string;
	action: string;
	userPrincipal: string;
	sourceIpAddress?: string;
	success: boolean;
}

export interface IBenchmark {
	benchmarkId: string;
	benchmarkName: string;
	status: 'pass' | 'fail';
	hostname: string;
	agentUuid: string;
	description?: string;
	lastChecked: string;
	benchmarkCategory?: string;
}

export interface ISearchFilters {
	// Common pagination
	limit?: number;
	pagesize?: number;
	cursor?: string;
	sort?: string;

	// Date range filters
	eventTimeAfter?: string;
	eventTimeBefore?: string;
	scanTimeAfter?: string;
	scanTimeBefore?: string;
	vulnerabilityScanTimeAfter?: string;
	vulnerabilityScanTimeBefore?: string;

	// Vulnerability specific
	cveV2BaseScore?: number;
	cveV3BaseScore?: number;
	cveEpssScore?: number;
	cves?: string[];
	products?: string[];
	operatingSystemOnly?: boolean;
	agentUuids?: string[];
	hostnames?: string[];
	severities?: string[];

	// PII specific
	classifications?: string[];
	inventoryTags?: string[];
	msipLabels?: string[];
	sourceTypes?: string[];

	// Access Audit specific
	sourceUuids?: string[];
	resourceTypes?: string[];
	actions?: string[];
	userPrincipals?: string[];

	// Benchmark specific
	benchmarkIds?: string[];
	statuses?: string[];
}

export interface IPaginationOptions {
	limit?: number;
	pagesize?: number;
	cursor?: string;
}

export interface IApiResponse<T> {
	data: T[];
	pagination?: {
		cursor?: string;
		hasMore: boolean;
		total?: number;
	};
}

export interface IHistoricalVulnerability {
	intervalStart: string;
	intervalEnd: string;
	category: 'new' | 'remediated';
	vulnerabilityCount: number;
	severityBreakdown?: {
		critical: number;
		high: number;
		medium: number;
		low: number;
	};
}

export interface IOrganization {
	uuid: string;
	name: string;
	createdAt: string;
	settings?: {
		timezone?: string;
		retentionDays?: number;
	};
}

// Request payload interfaces
export interface IVulnerabilitySearchRequest {
	cveV2BaseScore?: number;
	cveV3BaseScore?: number;
	cveEpssScore?: number;
	cves?: string[];
	products?: string[];
	operatingSystemOnly?: boolean;
	agentUuids?: string[];
	hostnames?: string[];
	classifications?: string[];
	vulnerabilityScanTimeAfter?: string;
	vulnerabilityScanTimeBefore?: string;
}

export interface IPiiSearchRequest {
	classifications?: string[];
	inventoryTags?: string[];
	msipLabels?: string[];
	agentUuids?: string[];
	sourceTypes?: string[];
	scanTimeAfter?: string;
	scanTimeBefore?: string;
}

export interface IAccessAuditSearchRequest {
	sourceUuids?: string[];
	sourceTypes?: string[];
	eventTimeAfter?: string;
	eventTimeBefore?: string;
	resourceTypes?: string[];
	actions?: string[];
	userPrincipals?: string[];
}

export interface IBenchmarkSearchRequest {
	benchmarkIds?: string[];
	statuses?: string[];
	agentUuids?: string[];
	hostnames?: string[];
}

export interface IHistoricalVulnerabilitySearchRequest {
	intervalAfter?: string;
	intervalBefore?: string;
	category?: 'new' | 'remediated';
	agentUuids?: string[];
	hostnames?: string[];
}

// Error response interface
export interface IErrorResponse {
	error: {
		code: string;
		message: string;
		details?: any;
	};
}

// Rate limiting interface
export interface IRateLimitInfo {
	retryAfter: number;
	remaining: number;
	resetTime: number;
}
