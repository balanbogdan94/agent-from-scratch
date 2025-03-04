import 'dotenv/config'
import { runLLM } from './src/llm'
import { addMessage, getMessages } from './src/memory'
import type { AIMessage } from './types'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}
const newMessage: AIMessage = { role: 'user', content: userMessage }
await addMessage([newMessage])

const messages = await getMessages()
const response = await runLLM({
  messages,
})

await addMessage([response])

console.log(response.content)
