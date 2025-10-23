import {
	INodeProperties,
} from 'n8n-workflow';

export const accessAuditOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accessAudit'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Search access audit events',
				action: 'Search access audits',
			},
		],
		default: 'search',
	},
];

export const accessAuditFields: INodeProperties[] = [
	// Search operation fields
	{
		displayName: 'Quick Filters',
		name: 'quickFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Suspicious Activity Only',
				name: 'suspiciousOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only suspicious access patterns (delete, download, copy actions)',
			},
			{
				displayName: 'Off-Hours Only',
				name: 'offHoursOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only access events outside business hours (9 AM - 5 PM, Mon-Fri)',
			},
			{
				displayName: 'Failed Access Only',
				name: 'failedOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only failed access attempts',
			},
			{
				displayName: 'External Access Only',
				name: 'externalOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only access from external IP addresses',
			},
		],
	},
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'multiOptions',
		options: [
			{
				name: 'Read',
				value: 'read',
				description: 'Read access events',
			},
			{
				name: 'Write',
				value: 'write',
				description: 'Write access events',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete access events',
			},
			{
				name: 'Download',
				value: 'download',
				description: 'Download access events',
			},
			{
				name: 'Copy',
				value: 'copy',
				description: 'Copy access events',
			},
			{
				name: 'Move',
				value: 'move',
				description: 'Move access events',
			},
			{
				name: 'Share',
				value: 'share',
				description: 'Share access events',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create access events',
			},
			{
				name: 'Modify',
				value: 'modify',
				description: 'Modify access events',
			},
		],
		default: [],
		description: 'Types of actions to filter by',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Resource Types',
		name: 'resourceTypes',
		type: 'multiOptions',
		options: [
			{
				name: 'File',
				value: 'file',
				description: 'File access events',
			},
			{
				name: 'Database',
				value: 'database',
				description: 'Database access events',
			},
			{
				name: 'Email',
				value: 'email',
				description: 'Email access events',
			},
			{
				name: 'SharePoint',
				value: 'sharepoint',
				description: 'SharePoint access events',
			},
			{
				name: 'OneDrive',
				value: 'onedrive',
				description: 'OneDrive access events',
			},
			{
				name: 'Box',
				value: 'box',
				description: 'Box access events',
			},
		],
		default: [],
		description: 'Types of resources to filter by',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Source Types',
		name: 'sourceTypes',
		type: 'multiOptions',
		options: [
			{
				name: 'Agent',
				value: 'agent',
				description: 'Endpoint agents',
			},
			{
				name: 'Box Cloud',
				value: 'boxcloud',
				description: 'Box cloud connector',
			},
			{
				name: 'Office 365',
				value: 'o365',
				description: 'Office 365 connector',
			},
		],
		default: [],
		description: 'Types of sources to include',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Source UUIDs',
		name: 'sourceUuids',
		type: 'string',
		default: '',
		placeholder: 'uuid1, uuid2, uuid3',
		description: 'Comma-separated list of source UUIDs to filter by',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'User Principals',
		name: 'userPrincipals',
		type: 'string',
		default: '',
		placeholder: 'user1@company.com, user2@company.com',
		description: 'Comma-separated list of user principals to filter by',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'options',
		options: [
			{
				name: 'Last 24 Hours',
				value: 'last24h',
			},
			{
				name: 'Last 7 Days',
				value: 'last7days',
			},
			{
				name: 'Last 30 Days',
				value: 'last30days',
			},
			{
				name: 'Last 90 Days',
				value: 'last90days',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
		],
		default: 'last7days',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Custom Date Range',
		name: 'customDateRange',
		type: 'collection',
		placeholder: 'Add Date Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
				dateRange: ['custom'],
			},
		},
		options: [
			{
				displayName: 'Event Time After',
				name: 'eventTimeAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter access events after this date',
			},
			{
				displayName: 'Event Time Before',
				name: 'eventTimeBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter access events before this date',
			},
		],
	},
	{
		displayName: 'Time Range',
		name: 'timeRange',
		type: 'collection',
		placeholder: 'Add Time Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Start Hour',
				name: 'startHour',
				type: 'number',
				default: 0,
				description: 'Start hour for filtering (0-23)',
			},
			{
				displayName: 'End Hour',
				name: 'endHour',
				type: 'number',
				default: 23,
				description: 'End hour for filtering (0-23)',
			},
		],
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		options: [
			{
				name: 'Event Time (Newest First)',
				value: 'eventTime:desc',
			},
			{
				name: 'Event Time (Oldest First)',
				value: 'eventTime:asc',
			},
			{
				name: 'User Principal (A-Z)',
				value: 'userPrincipal:asc',
			},
			{
				name: 'User Principal (Z-A)',
				value: 'userPrincipal:desc',
			},
			{
				name: 'Resource Name (A-Z)',
				value: 'resourceName:asc',
			},
			{
				name: 'Resource Name (Z-A)',
				value: 'resourceName:desc',
			},
			{
				name: 'Action (A-Z)',
				value: 'action:asc',
			},
			{
				name: 'Action (Z-A)',
				value: 'action:desc',
			},
		],
		default: 'eventTime:desc',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 100,
		description: 'Maximum number of results to return (0 = no limit)',
		displayOptions: {
			show: {
				resource: ['accessAudit'],
				operation: ['search'],
			},
		},
	},
];
