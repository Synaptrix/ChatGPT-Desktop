import { Body } from '@tauri-apps/api/http'
import {
  fetchEventSource,
  type EventSourceMessage
} from '@microsoft/fetch-event-source'
import type { MessageData, ImageData } from '@/types'

/**
 * 获取 openai 对话消息
 * @param messages 消息列表
 */
export const getOpenAIResultApi = async (messages: MessageData[]) => {
  if (!messages.length) return

  const apiKey = getOpenAIKey()
  if (!apiKey) return

  return await request(`/v1/chat/completions`, {
    method: 'POST',
    body: Body.json({
      model: OPEN_AI_MODEL,
      messages
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })
}

/**
 * 获取 openai 对话消息(流)
 * @param messages 消息列表
 */
export const getOpenAIResultStreamApi = async (messages: MessageData[]) => {
  if (!messages.length) return

  const apiKey = getOpenAIKey()
  if (!apiKey) return

  const { updateSessionData } = useSessionStore()
  const { sessionDataList, chatController } = storeToRefs(useSessionStore())
  const {
    proxy: { bypass, url: proxyURL },
    modalParams: { temperature, max_tokens }
  } = useSettingsStore()

  let url = '/v1/chat/completions'

  if (bypass && proxyURL) {
    url = proxyURL + url
  } else {
    url = HOST_URL.OPENAI + url
  }

  // 创建一个新的 AbortController
  const abortController = new AbortController()
  chatController.value = abortController

  await fetchEventSource(url, {
    method: 'POST',
    body: JSON.stringify({
      model: OPEN_AI_MODEL,
      messages,
      temperature,
      max_tokens,
      stream: true
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    signal: abortController.signal,
    async onopen(response) {
      if (response.ok) return

      if (response.status === 429) {
        throw new Error('请求的 key 超出限制')
      } else if (response.status === 401) {
        throw new Error('请求的 API KEY 无效')
      } else {
        throw new Error('请求出错')
      }
    },
    onmessage(msg: EventSourceMessage) {
      if (msg.data !== '[DONE]') {
        const { choices } = JSON.parse(msg.data)

        if (!choices[0].delta.content) return

        getLastItem(sessionDataList.value).message.content +=
          choices[0].delta.content
      }
    },
    onclose() {
      updateSessionData(getLastItem(sessionDataList.value!))
    },
    onerror({ message }: any) {
      throw new Error(message)
    }
  })
}

/**
 * 获取账号余额信息
 */
export const getOpenAICreditApi = async () => {
  try {
    const apiKey = getOpenAIKey()
    if (!apiKey) return

    const result = await request('/dashboard/billing/credit_grants', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        HostUrl: HOST_URL.OPENAI
      }
    })

    return result
  } catch ({ message }: any) {
    const { isThinking } = useSessionStore()

    if (isThinking) {
      return '请求的 API KEY 无效'
    }
  }
}

/**
 * 根据提示创建图像
 * @param messages 图像参数
 */
export const getOpenAIImage = async (imageData: ImageData) => {
  if (!imageData) return

  const apiKey = getOpenAIKey()
  if (!apiKey) return

  return await request('/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      HostUrl: HOST_URL.OPENAI
    },
    body: Body.json(imageData)
  })
}
