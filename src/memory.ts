import { v4 as getRandomUuid } from 'uuid'
import type { AIMessage } from '../types'
import { JSONFilePreset } from 'lowdb/node'

export type MessageWithMetadata = AIMessage & {
  id: string
  createdAt: string
}

export const addMetadata = (message: AIMessage): MessageWithMetadata => ({
  ...message,
  id: getRandomUuid(),
  createdAt: new Date().toISOString(),
})

export const removeMetadata = (message: MessageWithMetadata): AIMessage => {
  const { id, createdAt, ...rest } = message
  return rest
}

type Data = {
  messages: MessageWithMetadata[]
}

const initialData: Data = {
  messages: [],
}

const getDB = async () => {
  const db = await JSONFilePreset<Data>('db.json', initialData)
  return db
}

export const getMessages = async () => {
  const db = await getDB()
  return db.data.messages.map(removeMetadata)
}

export const addMessage = async (messages: AIMessage[]) => {
  const db = await getDB()
  db.data.messages.push(...messages.map(addMetadata))
  await db.write()
}

export const saveToolResponse = async (
  toolCallId: string,
  toolResponse: string
) => {
  return await addMessage([
    { role: 'tool', content: toolResponse, tool_call_id: toolCallId },
  ])
}
