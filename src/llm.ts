import { zodFunction } from 'openai/helpers/zod.mjs'
import type { AIMessage } from '../types'
import { openai } from './ai'

export const runLLM = async ({
  model = 'gpt-4o-mini',
  messages,
  temperature = 0.1,
  tools,
}: {
  messages: AIMessage[]
  temperature?: number
  model?: string
  tools?: any[]
}) => {
  const formattedTools = tools?.map(zodFunction)
  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    tools: formattedTools,
    parallel_tool_calls: false,
    tool_choice: 'auto',
  })

  return response.choices[0].message
}
