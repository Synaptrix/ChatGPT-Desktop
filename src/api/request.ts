import { fetch, type FetchOptions } from '@tauri-apps/api/http'
import type { RequestHost } from '@/types'

/**
 * 普通请求
 * @param url 请求地址
 * @param options 请求参数
 */
export const request = async (
  url: string,
  options?: FetchOptions & { host?: RequestHost }
) => {
  try {
    const { method = 'GET', headers, host = 'OPENAI' } = options || {}

    const {
      proxy: { bypass, url: proxyURL }
    } = useSettingsStore()

    if (bypass && proxyURL) {
      url = proxyURL + url
    } else {
      url = HOST_URL[host] + url
    }

    const { data }: Record<string, any> = await fetch(url, {
      ...options,
      method,
      timeout: 1000 * 60,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
      }
    })

    const { error } = data

    if (error) throw new Error(error.message)

    return data
  } catch (error) {
    Message.error('网络似乎出了问题，请检查你的网络设置')
  }
}
