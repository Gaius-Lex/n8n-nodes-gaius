import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class GaiusLexApi implements ICredentialType {
	name = 'gaiusLexApi';
	displayName = 'Gaius-Lex API';
	documentationUrl = '';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			description: 'API key in format provided by Gaius-Lex',
			type: 'string',
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: 'Api-Key {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://gaius-lex.pl',
			url: '/',
			method: 'GET',
		},
	};
}

