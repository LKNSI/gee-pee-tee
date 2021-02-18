const openai = require('../main.js')

const main = async() => {
    const gpt = new openai({apiToken: process.env.OPENAITOKEN})
    await gpt.initalize()
    const req = await gpt.prompt({"prompt":`Hello world is commonly used by programmers as a way of`})
    console.log(require('util').inspect(req,false, null, true))
}

main()