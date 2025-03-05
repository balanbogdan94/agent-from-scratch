import type OpenAI from 'openai'
import { dadJoke } from './tools/dadJoke'
import { generateImage } from './tools/generateImage'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments),
  }
  switch (toolCall.function.name) {
    case 'dad_joke':
      return dadJoke(input)
    case 'generate_image':
      return generateImage(input)
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
