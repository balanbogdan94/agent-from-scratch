import type { z } from 'zod'
import { runLLM } from './llm'
import { addMessage, getMessages, saveToolResponse } from './memory'
import { runTool } from './toolRunner'
import { logMessage, showLoader } from './ui'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: { name: string; parameters: z.AnyZodObject }[]
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

  await addMessage([response])
  logMessage(response)

  if (response.tool_calls) {
    const toolCall = response.tool_calls[0]
    loader.update(`executing: ${toolCall.function.name}`)

    const toolResponse = await runTool(toolCall, userMessage)
    await saveToolResponse(toolCall.id, toolResponse)

    loader.update(`executed: ${toolCall.function.name}`)
  }

  loader.stop()
  return getMessages()
}
