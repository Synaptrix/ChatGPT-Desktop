import { fetch, Body } from '@tauri-apps/api/http'
import { dialogErrorMessage } from '@/utils'
import type { FetchOptions } from '@tauri-apps/api/http'
import type { RecordData } from '@/types'
import { useApiKeyStore, useRecordStore } from '@/stores'

/**
 * 请求总入口
 * @param url 请求地址
 * @param options 请求参数
 */
export const request = async (url: string, options?: FetchOptions) => {
  try {
    const { method, headers } = options || {}

    const { data }: Record<string, any> = await fetch(url, {
      ...options,
      method: method || 'GET',
      timeout: 1000 * 60,
      headers: {
        ...headers,
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
      }
    })

    const { error, usage, choices } = data

    if (error) throw new Error(error.message)

    return {
      usage,
      message: choices[0].message
    }
  } catch ({ message }: any) {
    dialogErrorMessage('请求出错：' + message)
  }
}

/**
 * 获取 openai 对话消息
 * @param messages 消息列表
 */
export const getOpenAIResultApi = async () => {
  const { apiKey } = useApiKeyStore()
  const { currentRecord } = useRecordStore()

  return await request(import.meta.env.VITE_OPEN_AI_URL, {
    method: 'POST',
    body: Body.json({
      model: 'gpt-3.5-turbo',
      messages: currentRecord?.data
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })
}
