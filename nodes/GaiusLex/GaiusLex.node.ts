import type { IExecuteFunctions, IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

type Endpoint =
	| 'answerCreate'
	| 'answerGet'
	| 'thesesAnalysisCreate'
	| 'thesesAnalysisGet'
	| 'abusivityCreate'
	| 'abusivityGet'
	| 'alignmentRuleExtraction'
	| 'alignmentCreate'
	| 'alignmentGet';

export class GaiusLex implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Gaius-Lex',
			name: 'gaiusLex',
			icon: 'file:logo-full-256x.png',
		group: ['transform'],
		version: 1,
		description: 'Interact with the Gaius-Lex API',
		defaults: {},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'gaiusLexApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'answerCreate',
				options: [
					{ name: 'Answer - Create', value: 'answerCreate' },
					{ name: 'Answer - Get', value: 'answerGet' },
					{ name: 'Theses Analysis - Create', value: 'thesesAnalysisCreate' },
					{ name: 'Theses Analysis - Get', value: 'thesesAnalysisGet' },
					{ name: 'Abusivity - Create', value: 'abusivityCreate' },
					{ name: 'Abusivity - Get', value: 'abusivityGet' },
					{ name: 'Alignment - Rule Extraction', value: 'alignmentRuleExtraction' },
					{ name: 'Alignment - Create', value: 'alignmentCreate' },
					{ name: 'Alignment - Get', value: 'alignmentGet' },
				],
			},
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				description: 'Override base URL if needed',
				type: 'string',
				default: 'https://gaius-lex.pl',
				required: true,
			},
			// Common fields
			{
				displayName: 'Request ID',
				name: 'requestId',
				description: 'UUID returned by create endpoints',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['answerGet', 'thesesAnalysisGet', 'abusivityGet', 'alignmentGet'] } },
				required: true,
			},
			{
				displayName: 'Question',
				name: 'question',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['answerCreate'] } },
				required: true,
			},
			{
				displayName: 'Simplify',
				name: 'simplify',
				type: 'boolean',
				default: true,
				displayOptions: { show: { operation: ['answerCreate'] } },
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 6 },
				default: '',
				displayOptions: { show: { operation: ['thesesAnalysisCreate', 'abusivityCreate', 'alignmentRuleExtraction', 'alignmentCreate'] } },
				required: true,
			},
			{
				displayName: 'Rules (JSON)',
				name: 'rulesJson',
				description: 'Array of rules; required for alignment endpoints except rule extraction',
				type: 'string',
				default: '[]',
				displayOptions: { show: { operation: ['alignmentCreate'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		for (let i = 0; i < length; i++) {
			const operation = this.getNodeParameter('operation', i) as Endpoint;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;
			let responseData: IDataObject | IDataObject[] = {};

			if (operation === 'answerCreate') {
				const question = this.getNodeParameter('question', i) as string;
				const simplify = this.getNodeParameter('simplify', i) as boolean;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'POST',
					uri: `${baseUrl}/backend/api/v1/poll/answer`,
					json: true,
					body: { question, simplify },
				});
			} else if (operation === 'answerGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'GET',
					uri: `${baseUrl}/backend/api/v1/poll/answer/${requestId}`,
					json: true,
				});
			} else if (operation === 'thesesAnalysisCreate') {
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'POST',
					uri: `${baseUrl}/backend/api/v1/poll/theses-analysis`,
					json: true,
					body: { text },
				});
			} else if (operation === 'thesesAnalysisGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'GET',
					uri: `${baseUrl}/backend/api/v1/poll/theses-analysis/${requestId}`,
					json: true,
				});
			} else if (operation === 'abusivityCreate') {
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'POST',
					uri: `${baseUrl}/backend/api/v1/poll/abusivity`,
					json: true,
					body: { text },
				});
			} else if (operation === 'abusivityGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'GET',
					uri: `${baseUrl}/backend/api/v1/poll/abusivity/${requestId}`,
					json: true,
				});
			} else if (operation === 'alignmentRuleExtraction') {
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'POST',
					uri: `${baseUrl}/backend/api/v1/alignment/rule-extraction`,
					json: true,
					body: { text },
				});
			} else if (operation === 'alignmentCreate') {
				const text = this.getNodeParameter('text', i) as string;
				const rulesJson = this.getNodeParameter('rulesJson', i) as string;
				let rules: unknown;
				try {
					rules = JSON.parse(rulesJson || '[]');
				} catch (e) {
					throw new Error('Invalid JSON provided in Rules (JSON)');
				}
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'POST',
					uri: `${baseUrl}/backend/api/v1/poll/alignment`,
					json: true,
					body: { rules, text },
				});
			} else if (operation === 'alignmentGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.requestWithAuthentication.call(this, 'gaiusLexApi', {
					method: 'GET',
					uri: `${baseUrl}/backend/api/v1/poll/alignment/${requestId}`,
					json: true,
				});
			}

			const executionItem = {
				json: responseData as IDataObject,
			};
			returnData.push(executionItem);
		}

		return [returnData];
	}
}

