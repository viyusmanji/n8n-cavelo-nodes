import {
	INodeProperties,
} from 'n8n-workflow';

export const piiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pii'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Search PII with filters',
				action: 'Search PII',
			},
			{
				name: 'Get by Target',
				value: 'getByTarget',
				description: 'Get PII for specific target',
				action: 'Get PII by target',
			},
		],
		default: 'search',
	},
];

export const piiFields: INodeProperties[] = [
	// Search operation fields
	{
		displayName: 'Quick Filters',
		name: 'quickFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['pii'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'High-Risk PII Only',
				name: 'highRiskOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only high-risk PII types (SSN, Credit Card, Bank Account)',
			},
			{
				displayName: 'Exclude Approved Locations',
				name: 'excludeApproved',
				type: 'boolean',
				default: false,
				description: 'Exclude PII from approved storage locations',
			},
			{
				displayName: 'Large Files Only',
				name: 'largeFilesOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to files larger than 1MB (potential data dumps)',
			},
		],
	},
	{
		displayName: 'PII Classifications',
		name: 'classifications',
		type: 'multiOptions',
		options: [
			{
				name: 'SSN',
				value: 'SSN',
				description: 'Social Security Numbers',
			},
			{
				name: 'Credit Card',
				value: 'Credit Card',
				description: 'Credit card numbers',
			},
			{
				name: 'Bank Account',
				value: 'Bank Account',
				description: 'Bank account numbers',
			},
			{
				name: 'Driver License',
				value: 'Driver License',
				description: 'Driver license numbers',
			},
			{
				name: 'Passport',
				value: 'Passport',
				description: 'Passport numbers',
			},
			{
				name: 'Email',
				value: 'Email',
				description: 'Email addresses',
			},
			{
				name: 'Phone',
				value: 'Phone',
				description: 'Phone numbers',
			},
			{
				name: 'Address',
				value: 'Address',
				description: 'Physical addresses',
			},
			{
				name: 'Date of Birth',
				value: 'Date of Birth',
				description: 'Date of birth information',
			},
			{
				name: 'Medical Record',
				value: 'Medical Record',
				description: 'Medical record numbers',
			},
		],
		default: [],
		description: 'Types of PII to search for',
		displayOptions: {
			show: {
				resource: ['pii'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Inventory Tags',
		name: 'inventoryTags',
		type: 'string',
		default: '',
		placeholder: 'approved-storage, sensitive-data, public-folder',
		description: 'Comma-separated list of inventory tags to filter by',
		displayOptions: {
			show: {
				resource: ['pii'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'MSIP Labels',
		name: 'msipLabels',
		type: 'string',
		default: '',
		placeholder: 'Confidential, Internal, Public',
		description: 'Comma-separated list of Microsoft Security Information Protection labels',
		displayOptions: {
			show: {
				resource: ['pii'],
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
				resource: ['pii'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Agent UUIDs',
		name: 'agentUuids',
		type: 'string',
		default: '',
		placeholder: 'uuid1, uuid2, uuid3',
		description: 'Comma-separated list of agent UUIDs to filter by',
		displayOptions: {
			show: {
				resource: ['pii'],
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
		default: 'last30days',
		displayOptions: {
			show: {
				resource: ['pii'],
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
				resource: ['pii'],
				operation: ['search'],
				dateRange: ['custom'],
			},
		},
		options: [
			{
				displayName: 'Scan Time After',
				name: 'scanTimeAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter PII discovered after this date',
			},
			{
				displayName: 'Scan Time Before',
				name: 'scanTimeBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter PII discovered before this date',
			},
		],
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		options: [
			{
				name: 'Scan Time (Newest First)',
				value: 'scanTime:desc',
			},
			{
				name: 'Scan Time (Oldest First)',
				value: 'scanTime:asc',
			},
			{
				name: 'Classification (A-Z)',
				value: 'classification:asc',
			},
			{
				name: 'Classification (Z-A)',
				value: 'classification:desc',
			},
			{
				name: 'File Size (Largest First)',
				value: 'fileSize:desc',
			},
			{
				name: 'File Size (Smallest First)',
				value: 'fileSize:asc',
			},
			{
				name: 'Confidence (Highest First)',
				value: 'confidence:desc',
			},
			{
				name: 'Confidence (Lowest First)',
				value: 'confidence:asc',
			},
		],
		default: 'scanTime:desc',
		displayOptions: {
			show: {
				resource: ['pii'],
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
				resource: ['pii'],
				operation: ['search'],
			},
		},
	},
	// Get by Target operation fields
	{
		displayName: 'Target ID',
		name: 'targetId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The target ID to get PII for',
		displayOptions: {
			show: {
				resource: ['pii'],
				operation: ['getByTarget'],
			},
		},
	},
	{
		displayName: 'Inventory Tag Filter',
		name: 'inventoryTag',
		type: 'string',
		default: '',
		placeholder: 'approved-storage, sensitive-data',
		description: 'Filter PII by inventory tag',
		displayOptions: {
			show: {
				resource: ['pii'],
				operation: ['getByTarget'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'targetLimit',
		type: 'number',
		default: 100,
		description: 'Maximum number of PII items to return for this target',
		displayOptions: {
			show: {
				resource: ['pii'],
				operation: ['getByTarget'],
			},
		},
	},
];
