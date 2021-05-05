const axios = require('axios')
const https = require('https')
const qstri = require('querystring');
const {SSE} = require('sse.js')
const EventSource = require('eventsource')

class openai {
    constructor(opts){
        this._keepAlive = opts.keepalive ? opts.keepalive : true,
        this._rejectUnauthorized = opts.rejectUnauthorized ? opts.rejectUnauthorized : true
        this.apiToken = opts.apiToken ? opts.apiToken : false
        this.engine = opts.engine ? opts.engine : "davinci"
        this.base = "https://api.openai.com"
        this.timeout = opts.timeout ? opts.timeout : 50000
        this.agent = null
        this.runner = null
        this.ready = false
        this.stream = null
    }

    async initialize(){
        try{
            if(this.apiToken === false) throw new Error('API Key Required for OpenAI')
            this.agent = new https.Agent({rejectUnauthorized: this._rejectUnauthorized, keepAlive: this._keepAlive})
            this.runner = axios.create({baseURL: this.base, timeout: this.timeout, headers:{"Authorization":`Bearer ${this.apiToken}`}, httpsAgent: this.agent})
            if(this.agent && this.runner){
                this.ready = true
            }else{
                throw new Error('Couldn\'t validate object structures are in place.')
            }
        }catch(err){
            return err
        }
    }

    async prompt(opts){
        try{
            if(this.ready){
                const request = await this.runner.post(`/v1/engines/${this.engine}/completions`,{
                    "prompt":opts.prompt,
                    "temperature": opts.temperature ? opts.temperature : 0.3,
                    "max_tokens": opts.maxTokens ? opts.maxTokens : 60,
                    "top_p": opts.topProbability  ? opts.topProbability : 1.0,
                    "frequency_penalty": opts.frequencyPenalty ? opts.frequencyPenalty : 0.5,
                    "presence_penalty": opts.presencePenalty ? opts.presencePenalty : 0.0,
                    "stop": opts.stop ? [...opts.stop] : ["###"]                    
                }).catch(k => {})
                if(request.status === 200){
                    const r = request.data
                    const parsedChoices = []
                    r.choices.forEach(el => parsedChoices.push({...el,text: el.text.trim()}))
                    const obj = {
                        id: r.id,
                        object: r.object,
                        model:{
                            build: r.model,
                            slug: r.model.split(":")[0],
                            version: r.model.split(":")[1],
                        },
                        choices:{
                            elements: r.choices.length,
                            data:parsedChoices
                        }
                    }
                    return obj
                }else{
                    throw new Error(`Request Failed.`)
                }
            }else{
                throw new Error('Run openai.Prototype.initalize() first.')
            }
        }catch(err){
            return err
        }
    }

    async promptStream(opts){
        try{
            if(this.ready){
                const streamPromise = new Promise(async(resolve,reject) => {
                    const src = new EventSource(`https://api.openai.com/v1/engines/${this.engine}/completions/browser_stream`,{headers:{"Authorization":this.apiToken},
                    payload: {
                        "prompt":opts.prompt,
                        "temperature": opts.temperature ? opts.temperature : 0.3,
                        "max_tokens": opts.maxTokens ? opts.maxTokens : 60,
                        "top_p": opts.topProbability  ? opts.topProbability : 1.0,
                        "frequency_penalty": opts.frequencyPenalty ? opts.frequencyPenalty : 0.5,
                        "presence_penalty": opts.presencePenalty ? opts.presencePenalty : 0.0,
                        "stop": opts.stop ? [...opts.stop] : ["###"]
                    }})
                    src.onmessage = (e) => {
                        console.log(e)
                        resolve(e)
                    }
                })
                await streamPromise
            }
        }catch(err){
            return err
        }        
    }

    async endPromptStream(){

    }
    async getEngines(){
        try{
            if(this.ready){
                const request = await this.runner.get("/v1/engines").catch(k => {console.log(k)})
                if(request.status === 200){
                    const r = request.data
                    const slugs = []
                    r.data.forEach(el => slugs.push(el.id))
                    const obj = {
                        enginesAvailable: r.data.length,
                        engineSlugs: slugs,
                        manifest: r.data
                    }
                    return obj
                }else{
                    throw new Error(`Request Failed.`)
                }
            }else{
                throw new Error('Run openai.Prototype.initalize() first.')
            }
        }catch(err){
            return err
        }
    }

    async setEngine(opts){
        try{
            if(this.ready){
                const verifyChoice = opts.verifyChoice ? opts.verifyChoice : false
                if(verifyChoice){
                    const getManifest = await this.getEngines()
                    if(getManifest.engineSlugs.includes(opts.engine)){
                        this.engine = opts.engine
                    }else{
                        throw new Error('Engine choice is not available or does not exist.')
                    }
                }else{
                    this.engine = opts.engine
                }                
            }else{
                throw new Error('Run openai.Prototype.initalize() first.')
            }
        }catch(err){
            return err
        }

    }

/*  Boilerplate
    async <function>(){
        try{
            if(this.ready){
                
            }
        }catch(err){
            return err
        }
    }
*/

}

if(require.main === module){
    const main = async () => {
        const test = new openai({apiToken: process.env.OPENAITOKEN})
        await test.initalize()
        const req = await test.prompt({"prompt":`This is a tweet sentiment classifier

Tweet: "I love GPT-3!"
Sentiment: 1.0
###
Tweet: "Hello world!"
Sentiment:`})
        return req
    }
    main().then(k => {
        console.log(require('util').inspect(k,false, null, true))
        console.log("Test OK.")
    }).catch(k => {
        console.log(k)
        console.log("Test Failed.")
    })
} 

module.exports = openai