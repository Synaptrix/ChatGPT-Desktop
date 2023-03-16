import { fetch, Body } from '@tauri-apps/api/http'
import { dialogErrorMessage } from '@/utils'
import type { FetchOptions } from '@tauri-apps/api/http'
import type { RecordData } from '@/types'
import { useSettingsStore } from '@/stores'

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
  } catch (error: any) {
    console.log('error', error)
    dialogErrorMessage('请求出错：' + error.message)
  }
}

/**
 * 获取 openai 对话消息
 * @param messages 消息列表
 */
export const getOpenAIResultApi = async (messages: RecordData[]) => {
  if (!messages.length) return

  const { apiKey } = useSettingsStore()

  return await request(import.meta.env.VITE_OPEN_AI_URL, {
    method: 'POST',
    body: Body.json({
      model: 'gpt-3.5-turbo-0301',
      messages,
      stream: false
    }),
    headers: {
      Authorization: `Bearer ${apiKey || import.meta.env.VITE_OPEN_AI_API_KEY}`
    }
  })
}
