import { runLLM } from './llm'
import { addMessage, getMessages } from './memory'
import { logMessage, showLoader } from './ui'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  await addMessage([
    {
      role: 'user',
      content: userMessage,
    },
  ])

  const loader = showLoader('Thinking...')

  const history = await getMessages()
  const response = await runLLM({
    messages: history,
    tools,
  })

  if (response.tool_calls) {
    console.log('Tool calls:', response.tool_calls)
  }

  await addMessage([response])

  logMessage(response)
  loader.stop()
  return getMessages()
}
