const openai = require('../main.js')

const main = async() => {
    try{
        const gpt = new openai({apiToken: process.env.OPENAITOKEN})
        await gpt.initialize()
        const res = await gpt.promptStream({"prompt":`Hello world is commonly used by programmers as a way of`})
        return res;
    }catch(err){
        console.log(err)
    }
}

main().then(k => {
    console.log(k)
})
