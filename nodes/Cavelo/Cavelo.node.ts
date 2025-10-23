import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	buildDateRangeFilters,
	buildSearchPayload,
	calculateDaysSinceDiscovery,
	caveloApiRequest,
	caveloApiRequestAllItems,
	formatSeverity,
} from './GenericFunctions';

import {
	accessAuditFields,
	accessAuditOperations,
} from './descriptions/AccessAuditDescription';

import {
	benchmarkFields,
	benchmarkOperations,
} from './descriptions/BenchmarkDescription';

import {
	piiFields,
	piiOperations,
} from './descriptions/PiiDescription';

import {
	vulnerabilityFields,
	vulnerabilityOperations,
} from './descriptions/VulnerabilityDescription';

export class Cavelo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cavelo',
		name: 'cavelo',
		icon: 'file:cavelo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Cavelo Attack Surface Management API',
		defaults: {
			name: 'Cavelo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'caveloApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Vulnerability',
						value: 'vulnerability',
					},
					{
						name: 'PII',
						value: 'pii',
					},
					{
						name: 'Access Audit',
						value: 'accessAudit',
					},
					{
						name: 'Benchmark',
						value: 'benchmark',
					},
				],
				default: 'vulnerability',
			},
			...vulnerabilityOperations,
			...vulnerabilityFields,
			...piiOperations,
			...piiFields,
			...accessAuditOperations,
			...accessAuditFields,
			...benchmarkOperations,
			...benchmarkFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				if (resource === 'vulnerability') {
					responseData = await this.executeVulnerabilityOperation(i, operation);
				} else if (resource === 'pii') {
					responseData = await this.executePiiOperation(i, operation);
				} else if (resource === 'accessAudit') {
					responseData = await this.executeAccessAuditOperation(i, operation);
				} else if (resource === 'benchmark') {
					responseData = await this.executeBenchmarkOperation(i, operation);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				// Handle array responses
				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({
							json: item,
							pairedItem: { item: i },
						});
					}
				} else {
					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}

	private async executeVulnerabilityOperation(itemIndex: number, operation: string): Promise<any> {
		if (operation === 'search') {
			return await this.searchVulnerabilities(itemIndex);
		} else if (operation === 'getHistorical') {
			return await this.getHistoricalVulnerabilities(itemIndex);
		} else if (operation === 'getByTarget') {
			return await this.getVulnerabilitiesByTarget(itemIndex);
		} else {
			throw new NodeOperationError(this.getNode(), `Unknown vulnerability operation: ${operation}`);
		}
	}

	private async executePiiOperation(itemIndex: number, operation: string): Promise<any> {
		if (operation === 'search') {
			return await this.searchPii(itemIndex);
		} else if (operation === 'getByTarget') {
			return await this.getPiiByTarget(itemIndex);
		} else {
			throw new NodeOperationError(this.getNode(), `Unknown PII operation: ${operation}`);
		}
	}

	private async executeAccessAuditOperation(itemIndex: number, operation: string): Promise<any> {
		if (operation === 'search') {
			return await this.searchAccessAudits(itemIndex);
		} else {
			throw new NodeOperationError(this.getNode(), `Unknown access audit operation: ${operation}`);
		}
	}

	private async executeBenchmarkOperation(itemIndex: number, operation: string): Promise<any> {
		if (operation === 'search') {
			return await this.searchBenchmarks(itemIndex);
		} else {
			throw new NodeOperationError(this.getNode(), `Unknown benchmark operation: ${operation}`);
		}
	}

	private async searchVulnerabilities(itemIndex: number): Promise<any[]> {
		const quickFilters = this.getNodeParameter('quickFilters', itemIndex, {}) as any;
		const cvssFilters = this.getNodeParameter('cvssFilters', itemIndex, {}) as any;
		const cveFilters = this.getNodeParameter('cveFilters', itemIndex, {}) as any;
		const targetFilters = this.getNodeParameter('targetFilters', itemIndex, {}) as any;
		const dateRange = this.getNodeParameter('dateRange', itemIndex) as string;
		const customDateRange = this.getNodeParameter('customDateRange', itemIndex, {}) as any;
		const sortBy = this.getNodeParameter('sortBy', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 100) as number;

		// Build search payload
		const searchPayload: any = {};

		// Apply quick filters
		if (quickFilters.highCriticalOnly) {
			searchPayload.cveV3BaseScore = 7.0;
		}
		if (quickFilters.criticalOnly) {
			searchPayload.cveV3BaseScore = 9.0;
		}
		if (quickFilters.exploitableOnly) {
			searchPayload.cveEpssScore = 0.5;
		}

		// Apply CVSS filters
		Object.assign(searchPayload, cvssFilters);

		// Apply CVE filters
		if (cveFilters.cves) {
			searchPayload.cves = cveFilters.cves.split(',').map((cve: string) => cve.trim());
		}
		if (cveFilters.products) {
			searchPayload.products = cveFilters.products.split(',').map((product: string) => product.trim());
		}
		if (cveFilters.operatingSystemOnly !== undefined) {
			searchPayload.operatingSystemOnly = cveFilters.operatingSystemOnly;
		}

		// Apply target filters
		if (targetFilters.agentUuids) {
			searchPayload.agentUuids = targetFilters.agentUuids.split(',').map((uuid: string) => uuid.trim());
		}
		if (targetFilters.hostnames) {
			searchPayload.hostnames = targetFilters.hostnames.split(',').map((hostname: string) => hostname.trim());
		}
		if (targetFilters.severities && targetFilters.severities.length > 0) {
			searchPayload.severities = targetFilters.severities;
		}

		// Apply date range filters
		if (dateRange !== 'custom') {
			const dateFilters = buildDateRangeFilters(dateRange, 'vulnerabilityScanTimeAfter', 'vulnerabilityScanTimeBefore');
			Object.assign(searchPayload, dateFilters);
		} else {
			Object.assign(searchPayload, customDateRange);
		}

		// Apply production system filter
		if (quickFilters.productionOnly) {
			// This would need to be implemented based on hostname patterns
			// For now, we'll add a note that this requires post-processing
		}

		// Build query parameters
		const qs: any = {};
		if (sortBy) {
			qs.sort = sortBy;
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/endpoint-vulnerabilities',
			searchPayload,
			qs,
			{ limit }
		);

		// Enrich response data
		return response.map((vuln: any) => {
			const enriched = { ...vuln };
			
			// Add calculated fields
			if (vuln.vulnerabilityScanTime) {
				enriched.daysSinceDiscovery = calculateDaysSinceDiscovery(vuln.vulnerabilityScanTime);
			}
			
			// Add severity formatting
			if (vuln.vulnerabilityCvssV3BaseScore) {
				enriched.severityFormatted = formatSeverity(vuln.vulnerabilityCvssV3BaseScore);
			}

			return enriched;
		});
	}

	private async getHistoricalVulnerabilities(itemIndex: number): Promise<any[]> {
		const dateRange = this.getNodeParameter('historicalDateRange', itemIndex) as string;
		const customDateRange = this.getNodeParameter('customHistoricalDateRange', itemIndex, {}) as any;
		const category = this.getNodeParameter('category', itemIndex) as string;
		const groupBySeverity = this.getNodeParameter('groupBySeverity', itemIndex, false) as boolean;

		// Build search payload
		const searchPayload: any = {};

		// Apply date range
		if (dateRange !== 'custom') {
			const dateFilters = buildDateRangeFilters(dateRange, 'intervalAfter', 'intervalBefore');
			Object.assign(searchPayload, dateFilters);
		} else {
			Object.assign(searchPayload, customDateRange);
		}

		// Apply category filter
		if (category !== 'both') {
			searchPayload.category = category;
		}

		// Make API request
		const response = await caveloApiRequest.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/historical-endpoint-vulnerabilities',
			searchPayload
		);

		// Group by severity if requested
		if (groupBySeverity && Array.isArray(response.data)) {
			// This would require additional processing based on the actual API response structure
			// For now, return the data as-is
		}

		return response.data || response;
	}

	private async getVulnerabilitiesByTarget(itemIndex: number): Promise<any[]> {
		const targetId = this.getNodeParameter('targetId', itemIndex) as number;
		const limit = this.getNodeParameter('targetLimit', itemIndex, 100) as number;

		const qs: any = {};
		if (limit > 0) {
			qs.pagesize = limit;
		}

		const response = await caveloApiRequest.call(
			this,
			'GET',
			`/v1/organizations/{organization_uuid}/targets/${targetId}/vulnerabilities`,
			undefined,
			qs
		);

		return response.data || response;
	}

	private async searchPii(itemIndex: number): Promise<any[]> {
		const quickFilters = this.getNodeParameter('quickFilters', itemIndex, {}) as any;
		const classifications = this.getNodeParameter('classifications', itemIndex, []) as string[];
		const inventoryTags = this.getNodeParameter('inventoryTags', itemIndex, '') as string;
		const msipLabels = this.getNodeParameter('msipLabels', itemIndex, '') as string;
		const sourceTypes = this.getNodeParameter('sourceTypes', itemIndex, []) as string[];
		const agentUuids = this.getNodeParameter('agentUuids', itemIndex, '') as string;
		const dateRange = this.getNodeParameter('dateRange', itemIndex) as string;
		const customDateRange = this.getNodeParameter('customDateRange', itemIndex, {}) as any;
		const sortBy = this.getNodeParameter('sortBy', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 100) as number;

		// Build search payload
		const searchPayload: any = {};

		// Apply quick filters
		if (quickFilters.highRiskOnly) {
			searchPayload.classifications = ['SSN', 'Credit Card', 'Bank Account'];
		} else if (classifications.length > 0) {
			searchPayload.classifications = classifications;
		}

		if (inventoryTags) {
			searchPayload.inventoryTags = inventoryTags.split(',').map((tag: string) => tag.trim());
		}

		if (msipLabels) {
			searchPayload.msipLabels = msipLabels.split(',').map((label: string) => label.trim());
		}

		if (sourceTypes.length > 0) {
			searchPayload.sourceTypes = sourceTypes;
		}

		if (agentUuids) {
			searchPayload.agentUuids = agentUuids.split(',').map((uuid: string) => uuid.trim());
		}

		// Apply date range filters
		if (dateRange !== 'custom') {
			const dateFilters = buildDateRangeFilters(dateRange, 'scanTimeAfter', 'scanTimeBefore');
			Object.assign(searchPayload, dateFilters);
		} else {
			Object.assign(searchPayload, customDateRange);
		}

		// Build query parameters
		const qs: any = {};
		if (sortBy) {
			qs.sort = sortBy;
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/pii',
			searchPayload,
			qs,
			{ limit }
		);

		// Enrich response data
		return response.map((pii: any) => {
			const enriched = { ...pii };
			
			// Add calculated fields
			if (pii.scanTime) {
				enriched.daysSinceDiscovery = calculateDaysSinceDiscovery(pii.scanTime);
			}

			return enriched;
		});
	}

	private async getPiiByTarget(itemIndex: number): Promise<any[]> {
		const targetId = this.getNodeParameter('targetId', itemIndex) as number;
		const inventoryTag = this.getNodeParameter('inventoryTag', itemIndex, '') as string;
		const limit = this.getNodeParameter('targetLimit', itemIndex, 100) as number;

		const qs: any = {};
		if (limit > 0) {
			qs.pagesize = limit;
		}
		if (inventoryTag) {
			qs.inventoryTag = inventoryTag;
		}

		const response = await caveloApiRequest.call(
			this,
			'GET',
			`/v1/organizations/{organization_uuid}/targets/${targetId}/pii`,
			undefined,
			qs
		);

		return response.data || response;
	}

	private async searchAccessAudits(itemIndex: number): Promise<any[]> {
		const quickFilters = this.getNodeParameter('quickFilters', itemIndex, {}) as any;
		const actions = this.getNodeParameter('actions', itemIndex, []) as string[];
		const resourceTypes = this.getNodeParameter('resourceTypes', itemIndex, []) as string[];
		const sourceTypes = this.getNodeParameter('sourceTypes', itemIndex, []) as string[];
		const sourceUuids = this.getNodeParameter('sourceUuids', itemIndex, '') as string;
		const userPrincipals = this.getNodeParameter('userPrincipals', itemIndex, '') as string;
		const dateRange = this.getNodeParameter('dateRange', itemIndex) as string;
		const customDateRange = this.getNodeParameter('customDateRange', itemIndex, {}) as any;
		const timeRange = this.getNodeParameter('timeRange', itemIndex, {}) as any;
		const sortBy = this.getNodeParameter('sortBy', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 100) as number;

		// Build search payload
		const searchPayload: any = {};

		// Apply quick filters
		if (quickFilters.suspiciousOnly) {
			searchPayload.actions = ['delete', 'download', 'copy'];
		} else if (actions.length > 0) {
			searchPayload.actions = actions;
		}

		if (resourceTypes.length > 0) {
			searchPayload.resourceTypes = resourceTypes;
		}

		if (sourceTypes.length > 0) {
			searchPayload.sourceTypes = sourceTypes;
		}

		if (sourceUuids) {
			searchPayload.sourceUuids = sourceUuids.split(',').map((uuid: string) => uuid.trim());
		}

		if (userPrincipals) {
			searchPayload.userPrincipals = userPrincipals.split(',').map((principal: string) => principal.trim());
		}

		// Apply date range filters
		if (dateRange !== 'custom') {
			const dateFilters = buildDateRangeFilters(dateRange, 'eventTimeAfter', 'eventTimeBefore');
			Object.assign(searchPayload, dateFilters);
		} else {
			Object.assign(searchPayload, customDateRange);
		}

		// Build query parameters
		const qs: any = {};
		if (sortBy) {
			qs.sort = sortBy;
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/access-audits',
			searchPayload,
			qs,
			{ limit }
		);

		// Enrich response data
		return response.map((audit: any) => {
			const enriched = { ...audit };
			
			// Add calculated fields
			if (audit.eventTime) {
				enriched.isBusinessHours = this.isBusinessHours(audit.eventTime);
				enriched.riskScore = this.calculateRiskScore(audit);
			}

			return enriched;
		});
	}

	private async searchBenchmarks(itemIndex: number): Promise<any[]> {
		const quickFilters = this.getNodeParameter('quickFilters', itemIndex, {}) as any;
		const benchmarkIds = this.getNodeParameter('benchmarkIds', itemIndex, '') as string;
		const statuses = this.getNodeParameter('statuses', itemIndex, []) as string[];
		const agentUuids = this.getNodeParameter('agentUuids', itemIndex, '') as string;
		const hostnames = this.getNodeParameter('hostnames', itemIndex, '') as string;
		const categories = this.getNodeParameter('categories', itemIndex, []) as string[];
		const dateRange = this.getNodeParameter('dateRange', itemIndex) as string;
		const customDateRange = this.getNodeParameter('customDateRange', itemIndex, {}) as any;
		const groupBy = this.getNodeParameter('groupBy', itemIndex) as string;
		const sortBy = this.getNodeParameter('sortBy', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 100) as number;

		// Build search payload
		const searchPayload: any = {};

		// Apply quick filters
		if (quickFilters.failedOnly) {
			searchPayload.statuses = ['fail'];
		} else if (quickFilters.passedOnly) {
			searchPayload.statuses = ['pass'];
		} else if (statuses.length > 0) {
			searchPayload.statuses = statuses;
		}

		if (benchmarkIds) {
			searchPayload.benchmarkIds = benchmarkIds.split(',').map((id: string) => id.trim());
		}

		if (agentUuids) {
			searchPayload.agentUuids = agentUuids.split(',').map((uuid: string) => uuid.trim());
		}

		if (hostnames) {
			searchPayload.hostnames = hostnames.split(',').map((hostname: string) => hostname.trim());
		}

		if (categories.length > 0) {
			searchPayload.categories = categories;
		}

		// Apply date range filters
		if (dateRange !== 'custom') {
			const dateFilters = buildDateRangeFilters(dateRange, 'lastCheckedAfter', 'lastCheckedBefore');
			Object.assign(searchPayload, dateFilters);
		} else {
			Object.assign(searchPayload, customDateRange);
		}

		// Build query parameters
		const qs: any = {};
		if (sortBy) {
			qs.sort = sortBy;
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/benchmarks',
			searchPayload,
			qs,
			{ limit }
		);

		// Group results if requested
		if (groupBy !== 'none' && Array.isArray(response)) {
			return this.groupBenchmarkResults(response, groupBy);
		}

		return response;
	}

	private groupBenchmarkResults(results: any[], groupBy: string): any[] {
		const grouped: { [key: string]: any[] } = {};
		
		for (const result of results) {
			const key = result[groupBy] || 'unknown';
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key].push(result);
		}

		return Object.entries(grouped).map(([key, items]) => ({
			[groupBy]: key,
			count: items.length,
			items: items,
		}));
	}

	private isBusinessHours(dateString: string): boolean {
		const date = new Date(dateString);
		const hour = date.getHours();
		const day = date.getDay();
		
		return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
	}

	private calculateRiskScore(event: any): number {
		let score = 0;
		
		// High-risk actions
		if (['delete', 'download', 'copy'].includes(event.action)) {
			score += 10;
		}
		
		// Off-hours access
		if (!this.isBusinessHours(event.eventTime)) {
			score += 5;
		}
		
		// Failed access
		if (!event.success) {
			score += 15;
		}
		
		return score;
	}
}
