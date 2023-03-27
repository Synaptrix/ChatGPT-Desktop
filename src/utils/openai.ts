import GPT3Tokenizer from 'gpt3-tokenizer'
import type { MessageData, SessionData } from '@/types'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

/**
 *  估算字符串所需的token数量
 * @param str 需要估算的字符串
 */
export function estimateTokens(str: string): number {
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(str)
  return encoded.bpe.length
}

/**
 * 获取记忆（限制5条）
 * @returns 记忆列表
 *
 */
export async function getMemoryList() {
  const { isMemory } = useSettingsStore()

  if (!isMemory) return []

  const { currentSession } = useSessionStore()

  const sql = `SELECT * FROM session_data WHERE session_id = '${currentSession?.id}' ORDER BY id DESC LIMIT 5;`
  const memoryList = (await executeSQL(sql)) as SessionData[]

  return memoryList.reverse().map((item) => JSON.parse(item.message as any))
}

/**
 * 获取apiKey
 */
export const getOpenAIKey = () => {
  const { apiKey } = useSettingsStore()

  if (!apiKey) {
    Message.warning('请先填写 OpenAi API KEY')
    return false
  }

  return apiKey
}

/**
 * 获取 ai 回答
 * @param value 消息内容
 */
export const getAiMessage = async (value?: string) => {
  const apiKey = getOpenAIKey()
  if (!apiKey) return

  const { isThinking, sessionDataList } = storeToRefs(useSessionStore())
  const { updateSessionData, changeLastSessionContent } = useSessionStore()
  const { isMemory } = storeToRefs(useSettingsStore())

  try {
    const { currentRole } = useRoleStore()

    if (!currentRole) return

    const messages: MessageData[] = []

    // 添加角色描述
    messages.push({
      role: 'system',
      content: currentRole.description
    })

    if (!value) {
      // 重复上一次提问
      const { sessionDataList } = useSessionStore()

      const lastQuestion = sessionDataList.filter((item) => item.is_ask).at(-1)
      if (!lastQuestion) return

      const deleteSql = `DELETE FROM session_data WHERE session_id = '${lastQuestion?.session_id}' AND id >= ${lastQuestion?.id};`
      await executeSQL(deleteSql)

      // 记忆模式需要与上一次提问保持一致
      isMemory.value = lastQuestion?.is_memory

      // 添加记忆列表
      const memoryList = await getMemoryList()

      messages.push(...memoryList, lastQuestion?.message)
    } else {
      // 添加正常提问
      const memoryList = await getMemoryList()

      messages.push(...memoryList, {
        role: 'user',
        content: value
      })
    }

    const { addSessionData } = useSessionStore()

    isThinking.value = true

    await addSessionData({
      isAsk: true,
      data: messages.at(-1)!
    })

    await addSessionData({
      isAsk: false,
      data: {
        role: 'assistant',
        content: ''
      }
    })

    await getOpenAIResultStreamApi(messages)
  } catch (error: any) {
    changeLastSessionContent(error)

    updateSessionData(sessionDataList.value.at(-1)!)
  } finally {
    isThinking.value = false
  }
}

/**
 * 获取 ai 作图
 * @param value 消息内容
 */
export const getAiIamge = async (value?: string) => {
  const { isThinking, sessionDataList } = storeToRefs(useSessionStore())
  const { updateSessionData, changeLastSessionContent } = useSessionStore()

  try {
    // 获取图像的记忆模式 = 按照上一张图去修改生成
    let imageData

    if (!value) {
      // 重复上一次提问
      const { sessionDataList } = useSessionStore()

      const lastQuestion = sessionDataList.filter((item) => item.is_ask).at(-1)
      if (!lastQuestion) return

      const deleteSql = `DELETE FROM session_data WHERE session_id = '${lastQuestion?.session_id}' AND id >= ${lastQuestion?.id};`
      await executeSQL(deleteSql)

      imageData = lastQuestion?.message.content
    } else {
      // 添加正常提问
      const { imageValue } = useRoleStore()

      imageData = {
        n: imageValue.number,
        size: imageValue.size,
        prompt: value,
        response_format: 'b64_json'
      }
    }

    const { addSessionData } = useSessionStore()

    isThinking.value = true

    await addSessionData({
      isAsk: true,
      data: {
        role: 'user',
        content: imageData
      }
    })

    await addSessionData({
      isAsk: false,
      messageType: 'image',
      data: {
        role: 'assistant',
        content: ''
      }
    })

    const res = await getOpenAIImage(imageData)

    if (!res) return

    changeLastSessionContent(res.data)
    updateSessionData(sessionDataList.value.at(-1)!)
  } catch (error: any) {
    changeLastSessionContent('生成失败')
    updateSessionData({
      ...sessionDataList.value.at(-1)!,
      message_type: 'text'
    })
  } finally {
    isThinking.value = false
  }
}
