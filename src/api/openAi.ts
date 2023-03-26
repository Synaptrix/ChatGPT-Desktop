import { HOST_URL } from '@/constants'
import type { MessageData } from '@/types'
import { getOpenAIKey } from '@/utils'
import {
  fetchEventSource,
  type EventSourceMessage
} from '@microsoft/fetch-event-source'
import { Body } from '@tauri-apps/api/http'

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

        sessionDataList.value.at(-1)!.message.content +=
          choices[0].delta.content
      }
    },
    onclose() {
      updateSessionData(sessionDataList.value.at(-1)!)
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
 * ### 获取图片信息
 * @date 2023/3/25 - 11:36:29
 *
 * @async
 * @param {?string} [value]
 * @returns {*}
 */
export const getAiImagesMessage = async (value?: string) => {
  const apiKey = getOpenAIKey()
  if (!apiKey) return

  const { isThinking, sessionDataList } = storeToRefs(useSessionStore())
  const { updateSessionData, addSessionData } = useSessionStore()
  const { chatController } = storeToRefs(useSessionStore())

  isThinking.value = true

  try {
    const { currentRole } = useRoleStore()

    if (!currentRole) return

    const messages: MessageData[] = []

    const lastQuestion = sessionDataList.value
      .filter((item) => item.is_ask)
      .at(-1)

    // 再次生成上一次问题
    if (!value) {
      if (!lastQuestion) return

      // 为了保证统一，这之后的内容全部删掉
      const deleteSql = `DELETE FROM session_data WHERE session_id = '${lastQuestion?.session_id}' AND id >= ${lastQuestion?.id};`
      await executeSQL(deleteSql)

      messages.push(lastQuestion?.message)
    } else {
      messages.push({
        role: 'user',
        content: value
      })
    }

    await addSessionData({
      isAsk: true,
      data: messages.at(-1)!
    })

    await addSessionData({
      isAsk: false,
      data: {
        role: 'assistant',
        content: ''
      },
      messageType: 'image'
    })

    // 创建一个新的 AbortController
    const abortController = new AbortController()
    chatController.value = abortController

    const sessionData = sessionDataList.value.at(-1)!

    const result: ImageResultType = await fetch(OPENAI_IMAGES_URL, {
      method: 'POST',
      body: JSON.stringify({
        prompt: value || messages.at(-1)?.content,
        n: 1,
        size: '256x256'
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: abortController.signal
    })
      .then((res) => res.json())
      .catch((err) => {
        sessionData.message.content = err
      })

    if (result.data instanceof Array) {
      result.data.forEach(
        ({ url }) => (sessionData.message.content += `![图片](${url}) \n\n`)
      )
    }

    updateSessionData(sessionDataList.value.at(-1)!)

    isThinking.value = false
  } catch ({ message }: any) {
    sessionDataList.value.at(-1)!.message.content = message as any

    updateSessionData(sessionDataList.value.at(-1)!)

    isThinking.value = false
  }
}

type ImageResultType = {
  created: number
  data: {
    url: string
  }[]
}
