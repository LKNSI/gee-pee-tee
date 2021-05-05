# @chatsight/gee-pee-tee 🏌️

NodeJS library for interacting with OpenAI and their various language models and GPT weights.

## Installation
```shell

npm install @chatsight/gee-pee-tee

```

## Quick Start

```javascript
const openai = require('@chatsight/gee-pee-tee')

const main = async() => {
    const gpt = new openai({apiToken: process.env.OPENAITOKEN})
    await gpt.initialize()
    const req = await gpt.prompt({"prompt":`Hello world is commonly used by programmers as a way of`})
    console.log(require('util').inspect(req,false, null, true))
}

main()
```

## API Reference

### Constructor

```javascript
new openai({
  apiToken: STRING,
  engine: STRING, // Default: davinci
  timeout: INT, // Default: 50000
  keepAlive: BOOLEAN, // Internal HTTPS Agent Keepalive
  rejectUnauthorized: BOOLEAN // Internal HTTPS Agent SSL Behaviour
})
```
#### Example
```javascript
new openai({
  apiToken: "sk-...",
  engine: "davinci",
  timeout: 50000,
  keepAlive: true,
  rejectUnauthorized: true
})
```

### openai.Prototype.initialize()
Initializes the client, required before using any function. Configures the HTTPS agent and applies constructor base presets.

```javascript
openai.Prototype.initialize()
```

```javascript
const gpt = new openai({apiToken: ...})

await gpt.initialize()
```

### openai.Prototype.prompt()
Method for sending prompts to OpenAI.

```javascript
openai.Prototype.prompt({
  prompt: STRING, // String Literals are supported here and recommended.
  temperature: FLOAT, // Default: 0.3
  maxTokens: INT, // API Name: max_tokens Default: 60
  topProbability: FLOAT, // API Name: top_p Default: 1.0
  frequencyPenalty: FLOAT, // API Name: frequency_penalty Default: 0.5
  presencePenalty: FLOAT, // API Name: presence_penalty Default: 0.0
  stop: ARRAY[...STRING] // Default: "###"
})
```

```javascript
gpt.prompt({
  prompt: `Hello world is commonly used by programmers as a way of`,
  temperature: 0.3,
  maxTokens: 60,
  topProbability: 1.0,
  frequencyPenalty: 0.5,
  presencePenalty: 0.0,
  stop: ["###"]
})
```
 #### Output
 ```javascript
 {
  id: 'cmpl-...',
  object: 'text_completion',
  model: {
    build: 'davinci:YYYY-MM-DD',
    slug: 'davinci',
    version: 'YYYY-MM-DD'
  },
  choices: {
    elements: 1,
    data: [
      {
        text: 'testing a new program. It is also used as a simple example to introduce a new programming language.\n' +
          '\n' +
          'Hello world is the first program that every programmer writes when learning a new programming language. The phrase was coined by Brian Kernighan in his 1972 book, "A Tutorial Introduction to the Language',
        index: 0,
        logprobs: null,
        finish_reason: 'length'
      }
    ]
  }
}
 ```
 
 ### openai.Prototype.getEngines()
Returns a detailed manifest of all available engines, and a simple array of engine slugs.

```javascript
openai.Prototype.getEngines()
```

#### Output
```javascript
{
  enginesAvailable: 4
  engineSlugs: [
    "engine1",
    "engine2",
    "engine3",
    "engine4" 
    ...
  ],
  manifest:[
    {
      id: "engine1",
      object: "engine",
      created: null,
      max_replicas: null,
      owner: "openai",
      permissions: null,
      ready: true,
      ready_replicas: null,
      replicas: null
    },
    ...
  ]
}
```

 ### openai.Prototype.setEngines()
Switch the engine used by the client. Provides a validation method while doing so.

```javascript
openai.Prototype.setEngine({
  verifyChoice: BOOLEAN, // Default: False. If true, fetch a list of available engines and verify the new engine is supported. One shot if false, throws if engine is not supported.
  engine: STRING // Name of the engine by its slug to use.
})
```
 