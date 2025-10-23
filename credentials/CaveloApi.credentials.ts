import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CaveloApi implements ICredentialType {
	name = 'caveloApi';
	displayName = 'Cavelo API';
	documentationUrl = 'https://docs.cavelo.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Cavelo API key. Create one at https://dashboard.prod.cavelodata.com/',
		},
		{
			displayName: 'Organization UUID',
			name: 'organizationUuid',
			type: 'string',
			default: '',
			required: true,
			description: 'Your organization UUID from the Cavelo dashboard. Found in Settings → Organization',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.prod.cavelodata.com',
			required: false,
			description: 'Cavelo API base URL (usually not needed to change)',
			displayOptions: {
				show: {
					showAdvanced: [true],
				},
			},
		},
		{
			displayName: 'Show Advanced Settings',
			name: 'showAdvanced',
			type: 'boolean',
			default: false,
			description: 'Show advanced settings like base URL',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/organizations/{{$credentials.organizationUuid}}',
			method: 'GET',
		},
	};
}
