import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0,
      stop: ['"""'], // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    })

    // const response = openai.Completion.create(
    //   (model = 'text-davinci-003'),
    //   (prompt =
    //     '"""\nUtil exposes the following:\nutil.openai() -> authenticates & returns the openai module, which has the following functions:\nopenai.Completion.create(\n    prompt="<my prompt>", # The prompt to start completing from\n    max_tokens=123, # The max number of tokens to generate\n    temperature=1.0 # A measure of randomness\n    echo=True, # Whether to return the prompt in addition to the generated completion\n)\n"""\nimport util\n"""\nCreate an OpenAI completion starting from the prompt "Once upon an AI", no more than 5 tokens. Does not include the prompt.\n"""\n'),
    //   (temperature = 0.7),
    //   (max_tokens = 64),
    //   (top_p = 1),
    //   (frequency_penalty = 0),
    //   (presence_penalty = 0),
    //   (stop = ['"""']),
    // )

    res.status(200).send({
      bot: response.data.choices[0].text,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong')
  }
})

app.listen(5000, () =>
  console.log('AI server started on http://localhost:5000'),
)
