import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class GaiusLexApi implements ICredentialType {
	name = 'gaiusLexApi';
	displayName = 'Gaius-Lex API';
	documentationUrl = '';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			description: 'The base URL for the Gaius-Lex API',
			type: 'string',
			default: 'https://api.gaius-lex.pl',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			description: 'API key in format provided by Gaius-Lex',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];
}
