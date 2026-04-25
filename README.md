# n8n-nodes-gaius-lex

An n8n community node for connecting workflows with the Gaius-Lex API.

Use it to search legal sources, ask legal questions, run OCR and anonymization, process async legal analysis jobs, and plug Gaius-Lex capabilities into your automation flows.

## Features

- Search legal sources directly from n8n
- Run question answering and agent-based workflows
- Upload files for OCR and external vectorization
- Process async jobs with polling or webhook callbacks
- Use legal analysis endpoints like abusivity, theses analysis, alignment, and KRS tools

## Installation

Install the package in your n8n environment:

```bash
npm install n8n-nodes-gaius-lex
```

For a local custom setup, place this project in your n8n custom nodes directory and build it:

```bash
npm install
npm run build
```

## Credentials

Create a `Gaius-Lex API` credential in n8n and provide:

- `API Key` - sent as `Authorization: Api-Key <KEY>`
- `Base URL` - defaults to `https://api.gaius-lex.pl`, but may point to any absolute HTTP(S) endpoint you control

## Security Notes

- `Temp Token` fields are masked in the n8n UI
- The node validates `Base URL` and `Callback Endpoint` as absolute HTTP(S) URLs
- Redirects are disabled for outbound API calls to reduce accidental credential leakage across hosts
- Async `requestId` values are validated as UUIDs before being inserted into request paths
- Large uploads and very large text / JSON inputs are rejected early to reduce accidental overload
- Files, text, and callback URLs are still sent to the configured Gaius-Lex-compatible API, so only use trusted hosts

## Available Operations

The `Gaius-Lex` node currently supports the following operations.

### Search and Sources

- `Available Sources`
- `Search`
- `Agent Profiles`

### External Documents

- `External - Vectorize File`
- `External - Get Document`
- `External - List Documents`

### Agent

- `Agent - Create (Poll)`
- `Agent - Get Status`
- `Agent - Create (Webhook)`

### Answering

- `Answer - Create (Poll)`
- `Answer - Get Status`
- `Answer - Create (Webhook)`

### OCR and Text Processing

- `OCR - Create`
- `OCR - Get Status`
- `Anonymization`
- `Doc Verification - Create`
- `Doc Verification - Get Status`

### Beta Operations

- `[BETA] Abusivity - Create (Poll)`
- `[BETA] Abusivity - Get Status`
- `[BETA] Abusivity - Create (Webhook)`
- `[BETA] Theses Analysis - Create (Poll)`
- `[BETA] Theses Analysis - Get Status`
- `[BETA] Theses Analysis - Create (Webhook)`
- `[BETA] Alignment - Create (Poll)`
- `[BETA] Alignment - Get Status`
- `[BETA] Alignment - Create (Webhook)`
- `[BETA] Alignment - Rule Extraction`
- `[BETA] KRS Lookup`
- `[BETA] KRS Text Analysis`
- `[BETA] KRS Agreement`

## Usage Notes

- Use polling operations when you want n8n to request results later with a `requestId`
- Use webhook operations when Gaius-Lex should call back to your workflow endpoint
- File-based operations such as OCR and external vectorization expect binary input data
- JSON fields in the node, such as messages, rules, or source filters, must contain valid JSON
- Callback endpoints must be absolute HTTP(S) URLs

## Example Flows

### Search legal sources

1. Add the `Gaius-Lex` node
2. Select `Search`
3. Fill in `Query` and optional filters like `Language`, `Date From`, or `Categories`
4. Run the node to receive search results as JSON

### Ask a legal question

1. Select `Answer - Create (Poll)`
2. Enter the question text
3. Run the node and keep the returned `requestId`
4. Use `Answer - Get Status` to fetch the final result

### OCR a file

1. Pass a binary file into the node
2. Select `OCR - Create`
3. Set the binary property name, default `data`
4. Poll the OCR result with `OCR - Get Status`

### Run webhook-based async analysis

1. Select a webhook-enabled operation such as `Agent - Create (Webhook)`
2. Provide your callback URL in `Callback Endpoint`
3. Optionally include a `Temp Token` for verification
4. Receive the result asynchronously in your n8n webhook flow

## Development

Install dependencies and build the node:

```bash
npm install
npm run build
```

This package is configured as an n8n community node and builds to `dist/`.

## License

MIT
