import { AzureOpenAI } from 'openai'

const endpoint = process.env.OPENAI_ENDPOINT || ''
const azureApiKey = process.env.OPENAI_API_KEY || ''
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o'

export const openai = new AzureOpenAI({
  endpoint: endpoint,
  apiKey: azureApiKey,
  apiVersion: '2025-01-01-preview',
  deployment: deployment,
})
