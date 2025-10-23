import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	buildDateRangeFilters,
	caveloApiRequest,
	caveloApiRequestAllItems,
} from './GenericFunctions';

export class CaveloTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cavelo Trigger',
		name: 'caveloTrigger',
		icon: 'file:cavelo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["triggerType"]}}',
		description: 'Trigger workflows on new Cavelo security events',
		defaults: {
			name: 'Cavelo Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'caveloApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Trigger Type',
				name: 'triggerType',
				type: 'options',
				options: [
					{
						name: 'New Vulnerabilities',
						value: 'newVulnerabilities',
						description: 'Trigger on new vulnerability discoveries',
					},
					{
						name: 'New PII Discoveries',
						value: 'newPii',
						description: 'Trigger on new PII discoveries',
					},
					{
						name: 'New Access Audits',
						value: 'newAccessAudits',
						description: 'Trigger on new access audit events',
					},
				],
				default: 'newVulnerabilities',
			},
			{
				displayName: 'Polling Interval (minutes)',
				name: 'pollingInterval',
				type: 'number',
				default: 15,
				description: 'How often to check for new events (in minutes)',
			},
			// Vulnerability trigger options
			{
				displayName: 'Severity Threshold',
				name: 'severityThreshold',
				type: 'options',
				options: [
					{
						name: 'All',
						value: 'all',
						description: 'All vulnerabilities',
					},
					{
						name: 'High and Critical',
						value: 'high',
						description: 'High and critical severity (CVSS >= 7.0)',
					},
					{
						name: 'Critical Only',
						value: 'critical',
						description: 'Critical severity only (CVSS >= 9.0)',
					},
				],
				default: 'high',
				displayOptions: {
					show: {
						triggerType: ['newVulnerabilities'],
					},
				},
			},
			{
				displayName: 'Hostname Filter',
				name: 'hostnameFilter',
				type: 'string',
				default: '',
				placeholder: 'prod-*, production-*',
				description: 'Filter by hostname patterns (supports wildcards)',
				displayOptions: {
					show: {
						triggerType: ['newVulnerabilities'],
					},
				},
			},
			{
				displayName: 'Agent UUIDs',
				name: 'agentUuids',
				type: 'string',
				default: '',
				placeholder: 'uuid1, uuid2, uuid3',
				description: 'Comma-separated list of agent UUIDs to monitor',
				displayOptions: {
					show: {
						triggerType: ['newVulnerabilities'],
					},
				},
			},
			// PII trigger options
			{
				displayName: 'PII Classifications',
				name: 'piiClassifications',
				type: 'multiOptions',
				options: [
					{
						name: 'SSN',
						value: 'SSN',
					},
					{
						name: 'Credit Card',
						value: 'Credit Card',
					},
					{
						name: 'Bank Account',
						value: 'Bank Account',
					},
					{
						name: 'Driver License',
						value: 'Driver License',
					},
					{
						name: 'Passport',
						value: 'Passport',
					},
					{
						name: 'Email',
						value: 'Email',
					},
					{
						name: 'Phone',
						value: 'Phone',
					},
					{
						name: 'Address',
						value: 'Address',
					},
				],
				default: ['SSN', 'Credit Card', 'Bank Account'],
				description: 'Types of PII to monitor for',
				displayOptions: {
					show: {
						triggerType: ['newPii'],
					},
				},
			},
			{
				displayName: 'High-Risk PII Only',
				name: 'highRiskOnly',
				type: 'boolean',
				default: true,
				description: 'Only trigger on high-risk PII types',
				displayOptions: {
					show: {
						triggerType: ['newPii'],
					},
				},
			},
			// Access audit trigger options
			{
				displayName: 'Actions to Monitor',
				name: 'monitoredActions',
				type: 'multiOptions',
				options: [
					{
						name: 'Delete',
						value: 'delete',
					},
					{
						name: 'Download',
						value: 'download',
					},
					{
						name: 'Copy',
						value: 'copy',
					},
					{
						name: 'Share',
						value: 'share',
					},
					{
						name: 'All',
						value: 'all',
					},
				],
				default: ['delete', 'download', 'copy'],
				description: 'Types of actions to monitor for',
				displayOptions: {
					show: {
						triggerType: ['newAccessAudits'],
					},
				},
			},
			{
				displayName: 'Suspicious Activity Only',
				name: 'suspiciousOnly',
				type: 'boolean',
				default: true,
				description: 'Only trigger on suspicious access patterns',
				displayOptions: {
					show: {
						triggerType: ['newAccessAudits'],
					},
				},
			},
			{
				displayName: 'Off-Hours Only',
				name: 'offHoursOnly',
				type: 'boolean',
				default: false,
				description: 'Only trigger on off-hours access (outside 9 AM - 5 PM, Mon-Fri)',
				displayOptions: {
					show: {
						triggerType: ['newAccessAudits'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const triggerType = this.getNodeParameter('triggerType', 0) as string;
		const pollingInterval = this.getNodeParameter('pollingInterval', 0) as number;

		// Get last poll time from static data
		const staticData = this.getWorkflowStaticData('global');
		const lastPoll = staticData.lastPoll as number || 0;
		const now = Date.now();

		// Check if enough time has passed since last poll
		const intervalMs = pollingInterval * 60 * 1000;
		if (now - lastPoll < intervalMs) {
			return [[]];
		}

		// Update last poll time
		staticData.lastPoll = now;

		let newEvents: any[] = [];

		try {
			if (triggerType === 'newVulnerabilities') {
				newEvents = await this.getNewVulnerabilities();
			} else if (triggerType === 'newPii') {
				newEvents = await this.getNewPii();
			} else if (triggerType === 'newAccessAudits') {
				newEvents = await this.getNewAccessAudits();
			} else {
				throw new NodeOperationError(this.getNode(), `Unknown trigger type: ${triggerType}`);
			}

			// Deduplicate events
			newEvents = this.deduplicateEvents(newEvents, triggerType);

			// Convert to n8n format
			const returnData: INodeExecutionData[] = newEvents.map(event => ({
				json: event,
			}));

			return [returnData];
		} catch (error) {
			if (this.continueOnFail()) {
				return [[{ json: { error: error.message } }]];
			} else {
				throw error;
			}
		}
	}

	private async getNewVulnerabilities(): Promise<any[]> {
		const severityThreshold = this.getNodeParameter('severityThreshold', 0) as string;
		const hostnameFilter = this.getNodeParameter('hostnameFilter', 0, '') as string;
		const agentUuids = this.getNodeParameter('agentUuids', 0, '') as string;

		// Get last poll time
		const staticData = this.getWorkflowStaticData('global');
		const lastPoll = staticData.lastPoll as number || 0;
		const lastPollDate = new Date(lastPoll).toISOString();

		// Build search payload
		const searchPayload: any = {
			vulnerabilityScanTimeAfter: lastPollDate,
		};

		// Apply severity threshold
		if (severityThreshold === 'high') {
			searchPayload.cveV3BaseScore = 7.0;
		} else if (severityThreshold === 'critical') {
			searchPayload.cveV3BaseScore = 9.0;
		}

		// Apply hostname filter
		if (hostnameFilter) {
			searchPayload.hostnames = [hostnameFilter];
		}

		// Apply agent UUIDs filter
		if (agentUuids) {
			searchPayload.agentUuids = agentUuids.split(',').map((uuid: string) => uuid.trim());
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/endpoint-vulnerabilities',
			searchPayload
		);

		// Enrich with additional context
		return response.map((vuln: any) => ({
			...vuln,
			triggerType: 'newVulnerability',
			severityFormatted: this.formatSeverity(vuln.vulnerabilityCvssV3BaseScore),
			daysSinceDiscovery: this.calculateDaysSinceDiscovery(vuln.vulnerabilityScanTime),
		}));
	}

	private async getNewPii(): Promise<any[]> {
		const classifications = this.getNodeParameter('piiClassifications', 0, []) as string[];
		const highRiskOnly = this.getNodeParameter('highRiskOnly', 0, true) as boolean;

		// Get last poll time
		const staticData = this.getWorkflowStaticData('global');
		const lastPoll = staticData.lastPoll as number || 0;
		const lastPollDate = new Date(lastPoll).toISOString();

		// Build search payload
		const searchPayload: any = {
			scanTimeAfter: lastPollDate,
		};

		// Apply classification filter
		if (highRiskOnly) {
			searchPayload.classifications = ['SSN', 'Credit Card', 'Bank Account'];
		} else if (classifications.length > 0) {
			searchPayload.classifications = classifications;
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/pii',
			searchPayload
		);

		// Enrich with additional context
		return response.map((pii: any) => ({
			...pii,
			triggerType: 'newPii',
			daysSinceDiscovery: this.calculateDaysSinceDiscovery(pii.scanTime),
			isHighRisk: ['SSN', 'Credit Card', 'Bank Account'].includes(pii.classification),
		}));
	}

	private async getNewAccessAudits(): Promise<any[]> {
		const monitoredActions = this.getNodeParameter('monitoredActions', 0, []) as string[];
		const suspiciousOnly = this.getNodeParameter('suspiciousOnly', 0, true) as boolean;
		const offHoursOnly = this.getNodeParameter('offHoursOnly', 0, false) as boolean;

		// Get last poll time
		const staticData = this.getWorkflowStaticData('global');
		const lastPoll = staticData.lastPoll as number || 0;
		const lastPollDate = new Date(lastPoll).toISOString();

		// Build search payload
		const searchPayload: any = {
			eventTimeAfter: lastPollDate,
		};

		// Apply action filter
		if (suspiciousOnly) {
			searchPayload.actions = ['delete', 'download', 'copy'];
		} else if (monitoredActions.length > 0 && !monitoredActions.includes('all')) {
			searchPayload.actions = monitoredActions;
		}

		// Make API request
		const response = await caveloApiRequestAllItems.call(
			this,
			'POST',
			'/v1/organizations/{organization_uuid}/search/access-audits',
			searchPayload
		);

		// Filter by off-hours if requested
		let filteredResponse = response;
		if (offHoursOnly) {
			filteredResponse = response.filter((audit: any) => !this.isBusinessHours(audit.eventTime));
		}

		// Enrich with additional context
		return filteredResponse.map((audit: any) => ({
			...audit,
			triggerType: 'newAccessAudit',
			isBusinessHours: this.isBusinessHours(audit.eventTime),
			riskScore: this.calculateRiskScore(audit),
			isSuspicious: this.isSuspiciousActivity(audit),
		}));
	}

	private deduplicateEvents(events: any[], triggerType: string): any[] {
		const staticData = this.getWorkflowStaticData('global');
		const seenEvents = staticData.seenEvents as Set<string> || new Set();

		const uniqueEvents: any[] = [];
		const newSeenEvents = new Set(seenEvents);

		for (const event of events) {
			let eventKey: string;

			if (triggerType === 'newVulnerabilities') {
				eventKey = `${event.scanId}-${event.targetId}-${event.vulnerabilityCves?.join(',') || 'unknown'}`;
			} else if (triggerType === 'newPii') {
				eventKey = `${event.targetId}-${event.filePath}-${event.classification}`;
			} else if (triggerType === 'newAccessAudits') {
				eventKey = `${event.sourceUuid}-${event.eventTime}-${event.resourceName}`;
			} else {
				eventKey = `${event.id || event.scanId || event.targetId}-${Date.now()}`;
			}

			if (!seenEvents.has(eventKey)) {
				uniqueEvents.push(event);
				newSeenEvents.add(eventKey);
			}
		}

		// Update seen events (keep last 1000 to prevent memory bloat)
		if (newSeenEvents.size > 1000) {
			const eventsArray = Array.from(newSeenEvents);
			staticData.seenEvents = new Set(eventsArray.slice(-1000));
		} else {
			staticData.seenEvents = newSeenEvents;
		}

		return uniqueEvents;
	}

	private formatSeverity(cvssScore?: number): string {
		if (!cvssScore) return 'Unknown';
		
		if (cvssScore >= 9.0) return 'Critical';
		if (cvssScore >= 7.0) return 'High';
		if (cvssScore >= 4.0) return 'Medium';
		return 'Low';
	}

	private calculateDaysSinceDiscovery(scanTime: string): number {
		const scanDate = new Date(scanTime);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - scanDate.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

	private isSuspiciousActivity(event: any): boolean {
		// High-risk actions
		if (['delete', 'download', 'copy'].includes(event.action)) {
			return true;
		}
		
		// Off-hours access
		if (!this.isBusinessHours(event.eventTime)) {
			return true;
		}
		
		// Failed access
		if (!event.success) {
			return true;
		}
		
		return false;
	}
}
