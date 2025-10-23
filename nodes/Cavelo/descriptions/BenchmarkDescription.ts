import {
	INodeProperties,
} from 'n8n-workflow';

export const benchmarkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['benchmark'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Search CIS benchmark results',
				action: 'Search benchmarks',
			},
		],
		default: 'search',
	},
];

export const benchmarkFields: INodeProperties[] = [
	// Search operation fields
	{
		displayName: 'Quick Filters',
		name: 'quickFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['benchmark'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Failed Only',
				name: 'failedOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only failed benchmark checks',
			},
			{
				displayName: 'Passed Only',
				name: 'passedOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only passed benchmark checks',
			},
			{
				displayName: 'Critical Benchmarks Only',
				name: 'criticalOnly',
				type: 'boolean',
				default: false,
				description: 'Filter to only critical security benchmarks',
			},
		],
	},
	{
		displayName: 'Benchmark IDs',
		name: 'benchmarkIds',
		type: 'string',
		default: '',
		placeholder: 'benchmark1, benchmark2, benchmark3',
		description: 'Comma-separated list of benchmark IDs to filter by',
		displayOptions: {
			show: {
				resource: ['benchmark'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'statuses',
		type: 'multiOptions',
		options: [
			{
				name: 'Pass',
				value: 'pass',
				description: 'Passed benchmark checks',
			},
			{
				name: 'Fail',
				value: 'fail',
				description: 'Failed benchmark checks',
			},
		],
		default: [],
		description: 'Filter by benchmark status',
		displayOptions: {
			show: {
				resource: ['benchmark'],
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
				resource: ['benchmark'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Hostnames',
		name: 'hostnames',
		type: 'string',
		default: '',
		placeholder: 'server1, server2, server3',
		description: 'Comma-separated list of hostnames to filter by',
		displayOptions: {
			show: {
				resource: ['benchmark'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Benchmark Categories',
		name: 'categories',
		type: 'multiOptions',
		options: [
			{
				name: 'Windows Security',
				value: 'windows-security',
				description: 'Windows security benchmarks',
			},
			{
				name: 'Linux Security',
				value: 'linux-security',
				description: 'Linux security benchmarks',
			},
			{
				name: 'Network Security',
				value: 'network-security',
				description: 'Network security benchmarks',
			},
			{
				name: 'Database Security',
				value: 'database-security',
				description: 'Database security benchmarks',
			},
			{
				name: 'Web Application Security',
				value: 'web-app-security',
				description: 'Web application security benchmarks',
			},
			{
				name: 'Cloud Security',
				value: 'cloud-security',
				description: 'Cloud security benchmarks',
			},
		],
		default: [],
		description: 'Filter by benchmark categories',
		displayOptions: {
			show: {
				resource: ['benchmark'],
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
				resource: ['benchmark'],
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
				resource: ['benchmark'],
				operation: ['search'],
				dateRange: ['custom'],
			},
		},
		options: [
			{
				displayName: 'Last Checked After',
				name: 'lastCheckedAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter benchmarks checked after this date',
			},
			{
				displayName: 'Last Checked Before',
				name: 'lastCheckedBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter benchmarks checked before this date',
			},
		],
	},
	{
		displayName: 'Group By',
		name: 'groupBy',
		type: 'options',
		options: [
			{
				name: 'None',
				value: 'none',
				description: 'No grouping',
			},
			{
				name: 'Hostname',
				value: 'hostname',
				description: 'Group by hostname',
			},
			{
				name: 'Benchmark ID',
				value: 'benchmarkId',
				description: 'Group by benchmark ID',
			},
			{
				name: 'Status',
				value: 'status',
				description: 'Group by status (pass/fail)',
			},
			{
				name: 'Category',
				value: 'category',
				description: 'Group by benchmark category',
			},
		],
		default: 'none',
		description: 'Group results for analysis',
		displayOptions: {
			show: {
				resource: ['benchmark'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		options: [
			{
				name: 'Last Checked (Newest First)',
				value: 'lastChecked:desc',
			},
			{
				name: 'Last Checked (Oldest First)',
				value: 'lastChecked:asc',
			},
			{
				name: 'Hostname (A-Z)',
				value: 'hostname:asc',
			},
			{
				name: 'Hostname (Z-A)',
				value: 'hostname:desc',
			},
			{
				name: 'Benchmark ID (A-Z)',
				value: 'benchmarkId:asc',
			},
			{
				name: 'Benchmark ID (Z-A)',
				value: 'benchmarkId:desc',
			},
			{
				name: 'Status (Pass First)',
				value: 'status:asc',
			},
			{
				name: 'Status (Fail First)',
				value: 'status:desc',
			},
		],
		default: 'lastChecked:desc',
		displayOptions: {
			show: {
				resource: ['benchmark'],
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
				resource: ['benchmark'],
				operation: ['search'],
			},
		},
	},
];
