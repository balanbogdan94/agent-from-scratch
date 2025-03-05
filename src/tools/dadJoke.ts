import { z } from 'zod'
import type { ToolFn } from '../../types'

export const dadJokeToolDefinition = {
  name: 'dad_joke',
  parameters: z.object({}),
}

type Args = z.infer<typeof dadJokeToolDefinition.parameters>

type TDadJokeResponse = {
  id: string
  joke: string
  status: number
}

export const dadJoke: ToolFn<Args, string> = async () => {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch dad joke')
  }
  const jokeResp = (await res.json()) as TDadJokeResponse
  return jokeResp.joke
}
