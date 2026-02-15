## n8n-nodes-gaius-lex

Community node for n8n integrating the Gaius-Lex API.

### Install

- Copy this folder into your n8n custom nodes directory or install via npm:

```bash
npm i n8n-nodes-gaius-lex
```

### Credentials

- Gaius-Lex API: set your API key. Header used: `Authorization: Api-Key <KEY>`.

### Node operations

- Answer: POST /backend/api/v1/poll/answer, GET /backend/api/v1/poll/answer/:id
- Theses Analysis: POST /backend/api/v1/poll/theses-analysis, GET /backend/api/v1/poll/theses-analysis/:id
- Abusivity: POST /backend/api/v1/poll/abusivity, GET /backend/api/v1/poll/abusivity/:id
- Alignment: POST /backend/api/v1/alignment/rule-extraction, POST /backend/api/v1/poll/alignment, GET /backend/api/v1/poll/alignment/:id

### Build

```bash
npm run build
```

