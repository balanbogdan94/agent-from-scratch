import { z } from 'zod'
import type { ToolFn } from '../../types'
import type { ImagesResponse } from 'openai/resources/images.mjs'
const endpoint = process.env.DALL_E_ENDPOINT || ''
const apiKey = process.env.DALL_E_API_KEY || ''

export const generateImageToolDefinition = {
  name: 'generate_image',
  parameters: z
    .object({
      prompt: z
        .string()
        .describe(
          'The prompt to use to generate the image with a diffusion model image generator like Dall-E'
        ),
    })
    .describe('Generates an image and returns the url of the image.'),
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImage: ToolFn<Args, string> = async ({
  toolArgs,
  userMessage,
}) => {
  const body = JSON.stringify(
    {
      prompt: toolArgs.prompt,
      size: '1024x1024',
      n: 1,
      quality: 'hd',
    },
    null,
    2
  )
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body,
  })
  const formattedResponse = (await response.json()) as ImagesResponse & {
    _request_id?: string | null
  }

  const url = formattedResponse.data.at(0)?.url
  return url ?? 'No image generated'
}
