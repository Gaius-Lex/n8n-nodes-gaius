import type { IExecuteFunctions, IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { Buffer } from 'buffer';

type Endpoint =
	| 'availableSources'
	| 'search'
	| 'agentProfiles'
	| 'externalVectorize'
	| 'externalDocumentGet'
	| 'externalDocumentsList'
	| 'agentPollCreate'
	| 'agentPollGet'
	| 'agentWebhook'
	| 'answerPollCreate'
	| 'answerPollGet'
	| 'answerWebhook'
	| 'ocrPollCreate'
	| 'ocrPollGet'
	| 'anonymization'
	| 'docVerificationPollCreate'
	| 'docVerificationPollGet'
	| 'abusivityPollCreate'
	| 'abusivityPollGet'
	| 'abusivityWebhook'
	| 'thesesAnalysisPollCreate'
	| 'thesesAnalysisPollGet'
	| 'thesesAnalysisWebhook'
	| 'alignmentPollCreate'
	| 'alignmentPollGet'
	| 'alignmentWebhook'
	| 'alignmentRuleExtraction'
	| 'krsLookup'
	| 'krsTextAnalysis'
	| 'krsAgreement';

export class GaiusLex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gaius-Lex',
		name: 'gaiusLex',
		icon: 'file:gaiuslex.svg',
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
				default: 'search',
				options: [
					{ name: 'Available Sources', value: 'availableSources' },
					{ name: 'Search', value: 'search' },
					{ name: 'Agent Profiles', value: 'agentProfiles' },
					{ name: 'External - Vectorize File', value: 'externalVectorize' },
					{ name: 'External - Get Document', value: 'externalDocumentGet' },
					{ name: 'External - List Documents', value: 'externalDocumentsList' },
					{ name: 'Agent - Create (Poll)', value: 'agentPollCreate' },
					{ name: 'Agent - Get Status', value: 'agentPollGet' },
					{ name: 'Agent - Create (Webhook)', value: 'agentWebhook' },
					{ name: 'Answer - Create (Poll)', value: 'answerPollCreate' },
					{ name: 'Answer - Get Status', value: 'answerPollGet' },
					{ name: 'Answer - Create (Webhook)', value: 'answerWebhook' },
					{ name: 'OCR - Create', value: 'ocrPollCreate' },
					{ name: 'OCR - Get Status', value: 'ocrPollGet' },
					{ name: 'Anonymization', value: 'anonymization' },
					{ name: 'Doc Verification - Create', value: 'docVerificationPollCreate' },
					{ name: 'Doc Verification - Get Status', value: 'docVerificationPollGet' },
					{ name: '[BETA] Abusivity - Create (Poll)', value: 'abusivityPollCreate' },
					{ name: '[BETA] Abusivity - Get Status', value: 'abusivityPollGet' },
					{ name: '[BETA] Abusivity - Create (Webhook)', value: 'abusivityWebhook' },
					{ name: '[BETA] Theses Analysis - Create (Poll)', value: 'thesesAnalysisPollCreate' },
					{ name: '[BETA] Theses Analysis - Get Status', value: 'thesesAnalysisPollGet' },
					{ name: '[BETA] Theses Analysis - Create (Webhook)', value: 'thesesAnalysisWebhook' },
					{ name: '[BETA] Alignment - Create (Poll)', value: 'alignmentPollCreate' },
					{ name: '[BETA] Alignment - Get Status', value: 'alignmentPollGet' },
					{ name: '[BETA] Alignment - Create (Webhook)', value: 'alignmentWebhook' },
					{ name: '[BETA] Alignment - Rule Extraction', value: 'alignmentRuleExtraction' },
					{ name: '[BETA] KRS Lookup', value: 'krsLookup' },
					{ name: '[BETA] KRS Text Analysis', value: 'krsTextAnalysis' },
					{ name: '[BETA] KRS Agreement', value: 'krsAgreement' },
				],
			},
			{
				displayName: 'Country',
				name: 'country',
				description: 'Filter sources by country code (e.g., pl)',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['availableSources'] } },
			},
			{
				displayName: 'Query',
				name: 'query',
				description: 'The search query string',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Page',
				name: 'page',
				description: 'Page number for pagination',
				type: 'number',
				default: 1,
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				description: 'Number of results per page',
				type: 'number',
				default: 10,
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				description: 'Criteria to sort results (e.g., score)',
				type: 'string',
				default: 'score',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Date From',
				name: 'dateFrom',
				description: 'Starting date for filtering (YYYY-MM-DD)',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				description: 'Ending date for filtering (YYYY-MM-DD)',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Categories',
				name: 'categories',
				description: 'Categories to filter (comma-separated, e.g., pl_judiciary,pl_acts)',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Language',
				name: 'language',
				description: 'Language code for results (e.g., pl)',
				type: 'string',
				default: 'pl',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				description: 'ID of the file to retrieve',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['externalDocumentGet'] } },
			},
			{
				displayName: 'Binary File',
				name: 'binaryFile',
				description: 'Name of the binary field containing the file',
				type: 'string',
				default: 'data',
				displayOptions: { show: { operation: ['externalVectorize', 'ocrPollCreate'] } },
			},
			{
				displayName: 'Request ID',
				name: 'requestId',
				description: 'UUID of the async request to poll',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['agentPollGet', 'answerPollGet', 'ocrPollGet', 'docVerificationPollGet', 'abusivityPollGet', 'thesesAnalysisPollGet', 'alignmentPollGet'] } },
			},
			{
				displayName: 'Messages (JSON)',
				name: 'messagesJson',
				description: 'Array of message objects, e.g. [{"role": "human", "message": "Question?"}]',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '[]',
				displayOptions: { show: { operation: ['agentPollCreate'] } },
			},
			{
				displayName: 'Max Tool Calls',
				name: 'maxToolCalls',
				description: 'Maximum number of tool calls',
				type: 'number',
				default: 20,
				displayOptions: { show: { operation: ['agentPollCreate', 'agentWebhook'] } },
			},
			{
				displayName: 'Max Lex Budget',
				name: 'maxLexBudget',
				description: 'Maximum lex budget for agent',
				type: 'number',
				default: 50,
				displayOptions: { show: { operation: ['agentPollCreate', 'agentWebhook'] } },
			},
			{
				displayName: 'Permission Mode',
				name: 'permissionMode',
				description: 'Permission mode for tool execution',
				type: 'options',
				default: 'always_allow',
				options: [
					{ name: 'Always Allow', value: 'always_allow' },
					{ name: 'Ask', value: 'ask' },
				],
				displayOptions: { show: { operation: ['agentPollCreate', 'agentWebhook'] } },
			},
			{
				displayName: 'Profile ID',
				name: 'profileId',
				description: 'Profile ID for the agent',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['agentPollCreate', 'agentWebhook'] } },
			},
			{
				displayName: 'Source Filters (JSON)',
				name: 'sourceFiltersJson',
				description: 'Source filters as JSON object',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '{}',
				displayOptions: { show: { operation: ['agentPollCreate', 'agentWebhook'] } },
			},
			{
				displayName: 'Question',
				name: 'question',
				description: 'The question to answer',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				displayOptions: { show: { operation: ['answerPollCreate', 'answerWebhook'] } },
			},
			{
				displayName: 'Simplify',
				name: 'simplify',
				description: 'Simplify the answer',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['answerPollCreate', 'answerWebhook'] } },
			},
			{
				displayName: 'Text',
				name: 'text',
				description: 'Text content to process',
				type: 'string',
				typeOptions: { rows: 6 },
				default: '',
				displayOptions: { show: { operation: ['anonymization', 'docVerificationPollCreate', 'abusivityPollCreate', 'abusivityWebhook', 'thesesAnalysisPollCreate', 'thesesAnalysisWebhook', 'alignmentPollCreate', 'alignmentWebhook', 'alignmentRuleExtraction', 'krsTextAnalysis'] } },
			},
			{
				displayName: 'Threshold',
				name: 'threshold',
				description: 'Threshold for anonymization',
				type: 'number',
				default: 0.3,
				displayOptions: { show: { operation: ['anonymization'] } },
			},
			{
				displayName: 'Include Lemmas',
				name: 'includeLemmas',
				description: 'Include lemmas in anonymization',
				type: 'boolean',
				default: true,
				displayOptions: { show: { operation: ['anonymization'] } },
			},
			{
				displayName: 'Document File ID',
				name: 'docFileId',
				description: 'File ID for document verification',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['docVerificationPollCreate'] } },
			},
			{
				displayName: 'Deep Check',
				name: 'deepCheck',
				description: 'Enable deep verification check',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['docVerificationPollCreate'] } },
			},
			{
				displayName: 'Check Judiciary',
				name: 'checkJudiciary',
				description: 'Check judiciary sources',
				type: 'boolean',
				default: true,
				displayOptions: { show: { operation: ['docVerificationPollCreate'] } },
			},
			{
				displayName: 'Check Interpretations',
				name: 'checkInterpretations',
				description: 'Check interpretation sources',
				type: 'boolean',
				default: true,
				displayOptions: { show: { operation: ['docVerificationPollCreate'] } },
			},
			{
				displayName: 'Check Acts',
				name: 'checkActs',
				description: 'Check acts sources',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['docVerificationPollCreate'] } },
			},
			{
				displayName: 'Check KIO',
				name: 'checkKio',
				description: 'Check KIO sources',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['docVerificationPollCreate'] } },
			},
			{
				displayName: 'Rules (JSON)',
				name: 'rulesJson',
				description: 'Array of rules, e.g. [{"rule": "...", "mode": "must_find"}]',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '[]',
				displayOptions: { show: { operation: ['alignmentPollCreate', 'alignmentWebhook'] } },
			},
			{
				displayName: 'KRS Number',
				name: 'krsNumber',
				description: 'KRS number to look up',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['krsLookup', 'krsAgreement'] } },
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				description: 'Optional file path for KRS text analysis',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['krsTextAnalysis'] } },
			},
			{
				displayName: 'Callback Endpoint',
				name: 'callbackEndpoint',
				description: 'URL to receive the callback response',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['agentWebhook', 'answerWebhook', 'abusivityWebhook', 'thesesAnalysisWebhook', 'alignmentWebhook'] } },
			},
			{
				displayName: 'Temp Token',
				name: 'tempToken',
				description: 'Temporary token for webhook callback',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['agentWebhook', 'answerWebhook', 'abusivityWebhook', 'thesesAnalysisWebhook', 'alignmentWebhook'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as Endpoint;
			const cred = await this.getCredentials('gaiusLexApi');
			const baseUrl = (cred.baseUrl as string) || 'https://api.gaius-lex.pl';
			const apiKey = cred.apiKey as string;
			let responseData: IDataObject | IDataObject[] = {};

			const headers = { Authorization: `Api-Key ${apiKey}` };

			if (operation === 'availableSources') {
				const country = this.getNodeParameter('country', i) as string;
				const qs: IDataObject = {};
				if (country) qs.country = country;
				responseData = await this.helpers.request({
					method: 'GET',
					uri: `${baseUrl}/api/v1/available-sources`,
					headers,
					qs,
					json: true,
				});
			} else if (operation === 'search') {
				const query = this.getNodeParameter('query', i) as string;
				const page = this.getNodeParameter('page', i) as number;
				const pageSize = this.getNodeParameter('pageSize', i) as number;
				const sortBy = this.getNodeParameter('sortBy', i) as string;
				const dateFrom = this.getNodeParameter('dateFrom', i) as string;
				const dateTo = this.getNodeParameter('dateTo', i) as string;
				const categories = this.getNodeParameter('categories', i) as string;
				const language = this.getNodeParameter('language', i) as string;
				const qs: IDataObject = { q: query, page, page_size: pageSize, sort_by: sortBy, language };
				if (dateFrom) qs.date_from = dateFrom;
				if (dateTo) qs.date_to = dateTo;
				if (categories) qs.categories = categories;
				responseData = await this.helpers.request({
					method: 'GET',
					uri: `${baseUrl}/api/v1/search`,
					headers,
					qs,
					json: true,
				});
			} else if (operation === 'agentProfiles') {
				responseData = await this.helpers.request({
					method: 'GET',
					uri: `${baseUrl}/api/v1/agent-profiles`,
					headers,
					json: true,
				});
			} else if (operation === 'externalVectorize') {
				const binaryField = this.getNodeParameter('binaryFile', i) as string;
				const binaryData = items[i].binary?.[binaryField];
				if (!binaryData) throw new Error(`No binary data found in field "${binaryField}"`);
				const fileBuffer = Buffer.from(binaryData.data, 'base64');
				responseData = await this.helpers.request({
					method: 'POST',
					uri: `${baseUrl}/api/v1/external/vectorize`,
					headers,
					formData: { file: { value: fileBuffer, options: { filename: binaryData.fileName || 'file' } } },
					json: true,
				});
			} else if (operation === 'externalDocumentGet') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				responseData = await this.helpers.request({
					method: 'GET',
					uri: `${baseUrl}/api/v1/external/document/${fileId}`,
					headers,
					json: true,
				});
			} else if (operation === 'externalDocumentsList') {
				responseData = await this.helpers.request({
					method: 'GET',
					uri: `${baseUrl}/api/v1/external/list-documents`,
					headers,
					json: true,
				});
			} else if (operation === 'agentPollCreate') {
				const messagesJson = this.getNodeParameter('messagesJson', i) as string;
				const maxToolCalls = this.getNodeParameter('maxToolCalls', i) as number;
				const maxLexBudget = this.getNodeParameter('maxLexBudget', i) as number;
				const permissionMode = this.getNodeParameter('permissionMode', i) as string;
				const profileId = this.getNodeParameter('profileId', i) as string;
				const sourceFiltersJson = this.getNodeParameter('sourceFiltersJson', i) as string;
				let messages: IDataObject[];
				let sourceFilters: IDataObject;
				try { messages = JSON.parse(messagesJson || '[]') as IDataObject[]; } catch { throw new Error('Invalid JSON in Messages'); }
				try { sourceFilters = JSON.parse(sourceFiltersJson || '{}') as IDataObject; } catch { throw new Error('Invalid JSON in Source Filters'); }
				const body: IDataObject = { messages, max_tool_calls: maxToolCalls, max_lex_budget_agent: maxLexBudget, permission_mode: permissionMode, source_filters: sourceFilters };
				if (profileId) body.profile_id = profileId;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/agent/poll`, headers, body, json: true });
			} else if (operation === 'agentPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/agent/poll/${requestId}`, headers, json: true });
			} else if (operation === 'agentWebhook') {
				const endpoint = this.getNodeParameter('callbackEndpoint', i) as string;
				const tempToken = this.getNodeParameter('tempToken', i) as string;
				const maxToolCalls = this.getNodeParameter('maxToolCalls', i) as number;
				const maxLexBudget = this.getNodeParameter('maxLexBudget', i) as number;
				const permissionMode = this.getNodeParameter('permissionMode', i) as string;
				const profileId = this.getNodeParameter('profileId', i) as string;
				const sourceFiltersJson = this.getNodeParameter('sourceFiltersJson', i) as string;
				let sourceFilters: IDataObject;
				try { sourceFilters = JSON.parse(sourceFiltersJson || '{}') as IDataObject; } catch { throw new Error('Invalid JSON in Source Filters'); }
				const body: IDataObject = { endpoint, temp_token: tempToken, max_tool_calls: maxToolCalls, max_lex_budget_agent: maxLexBudget, permission_mode: permissionMode, source_filters: sourceFilters };
				if (profileId) body.profile_id = profileId;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/agent`, headers, body, json: true });
			} else if (operation === 'answerPollCreate') {
				const question = this.getNodeParameter('question', i) as string;
				const simplify = this.getNodeParameter('simplify', i) as boolean;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/answer/poll`, headers, body: { question, simplify }, json: true });
			} else if (operation === 'answerPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/answer/poll/${requestId}`, headers, json: true });
			} else if (operation === 'answerWebhook') {
				const endpoint = this.getNodeParameter('callbackEndpoint', i) as string;
				const tempToken = this.getNodeParameter('tempToken', i) as string;
				const question = this.getNodeParameter('question', i) as string;
				const simplify = this.getNodeParameter('simplify', i) as boolean;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/answer`, headers, body: { endpoint, temp_token: tempToken, question, simplify }, json: true });
			} else if (operation === 'ocrPollCreate') {
				const binaryField = this.getNodeParameter('binaryFile', i) as string;
				const binaryData = items[i].binary?.[binaryField];
				if (!binaryData) throw new Error(`No binary data found in field "${binaryField}"`);
				const fileBuffer = Buffer.from(binaryData.data, 'base64');
				responseData = await this.helpers.request({
					method: 'POST',
					uri: `${baseUrl}/api/v1/ocr/poll`,
					headers,
					formData: { file: { value: fileBuffer, options: { filename: binaryData.fileName || 'file' } } },
					json: true,
				});
			} else if (operation === 'ocrPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/ocr/poll/${requestId}`, headers, json: true });
			} else if (operation === 'anonymization') {
				const text = this.getNodeParameter('text', i) as string;
				const threshold = this.getNodeParameter('threshold', i) as number;
				const includeLemmas = this.getNodeParameter('includeLemmas', i) as boolean;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/anonymization`, headers, body: { text, threshold, include_lemmas: includeLemmas }, json: true });
			} else if (operation === 'docVerificationPollCreate') {
				const text = this.getNodeParameter('text', i) as string;
				const fileId = this.getNodeParameter('docFileId', i) as string;
				const deepCheck = this.getNodeParameter('deepCheck', i) as boolean;
				const checkJudiciary = this.getNodeParameter('checkJudiciary', i) as boolean;
				const checkInterpretations = this.getNodeParameter('checkInterpretations', i) as boolean;
				const checkActs = this.getNodeParameter('checkActs', i) as boolean;
				const checkKio = this.getNodeParameter('checkKio', i) as boolean;
				const body: IDataObject = { deep_check: deepCheck, check_judiciary: checkJudiciary, check_interpretations: checkInterpretations, check_acts: checkActs, check_kio: checkKio };
				if (fileId) body.fileId = parseInt(fileId, 10);
				else body.content = text;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/doc-verification/poll`, headers, body, json: true });
			} else if (operation === 'docVerificationPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/doc-verification/poll/${requestId}`, headers, json: true });
			} else if (operation === 'abusivityPollCreate') {
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/abusivity/poll`, headers, body: { text }, json: true });
			} else if (operation === 'abusivityPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/abusivity/poll/${requestId}`, headers, json: true });
			} else if (operation === 'abusivityWebhook') {
				const endpoint = this.getNodeParameter('callbackEndpoint', i) as string;
				const tempToken = this.getNodeParameter('tempToken', i) as string;
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/abusivity`, headers, body: { endpoint, temp_token: tempToken, text }, json: true });
			} else if (operation === 'thesesAnalysisPollCreate') {
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/theses-analysis/poll`, headers, body: { text }, json: true });
			} else if (operation === 'thesesAnalysisPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/theses-analysis/poll/${requestId}`, headers, json: true });
			} else if (operation === 'thesesAnalysisWebhook') {
				const endpoint = this.getNodeParameter('callbackEndpoint', i) as string;
				const tempToken = this.getNodeParameter('tempToken', i) as string;
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/theses-analysis`, headers, body: { endpoint, temp_token: tempToken, text }, json: true });
			} else if (operation === 'alignmentPollCreate') {
				const text = this.getNodeParameter('text', i) as string;
				const rulesJson = this.getNodeParameter('rulesJson', i) as string;
				let rules: IDataObject[];
				try { rules = JSON.parse(rulesJson || '[]') as IDataObject[]; } catch { throw new Error('Invalid JSON in Rules'); }
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/alignment/poll`, headers, body: { text, rules }, json: true });
			} else if (operation === 'alignmentPollGet') {
				const requestId = this.getNodeParameter('requestId', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/alignment/poll/${requestId}`, headers, json: true });
			} else if (operation === 'alignmentWebhook') {
				const endpoint = this.getNodeParameter('callbackEndpoint', i) as string;
				const tempToken = this.getNodeParameter('tempToken', i) as string;
				const text = this.getNodeParameter('text', i) as string;
				const rulesJson = this.getNodeParameter('rulesJson', i) as string;
				let rules: IDataObject[];
				try { rules = JSON.parse(rulesJson || '[]') as IDataObject[]; } catch { throw new Error('Invalid JSON in Rules'); }
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/alignment`, headers, body: { endpoint, temp_token: tempToken, text, rules }, json: true });
			} else if (operation === 'alignmentRuleExtraction') {
				const text = this.getNodeParameter('text', i) as string;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/alignment/rule-extraction`, headers, body: { text }, json: true });
			} else if (operation === 'krsLookup') {
				const krs = this.getNodeParameter('krsNumber', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/krs`, headers, qs: { krs }, json: true });
			} else if (operation === 'krsTextAnalysis') {
				const text = this.getNodeParameter('text', i) as string;
				const filePath = this.getNodeParameter('filePath', i) as string;
				const body: IDataObject = { text };
				if (filePath) body.filePath = filePath;
				responseData = await this.helpers.request({ method: 'POST', uri: `${baseUrl}/api/v1/krs-text-analysis`, headers, body, json: true });
			} else if (operation === 'krsAgreement') {
				const krs = this.getNodeParameter('krsNumber', i) as string;
				responseData = await this.helpers.request({ method: 'GET', uri: `${baseUrl}/api/v1/krs-agreement`, headers, qs: { krs }, json: true });
			}

			returnData.push({ json: responseData as IDataObject });
		}

		return [returnData];
	}
}
