import { getOpenAIResultApi } from '@/api'
import { executeSQL } from '@/sqls'
import { useSessionStore, useRoleStore } from '@/stores'
import { RecordData } from '@/types'

export const getAiMessage = async (value?: string) => {
  const { currentRole } = useRoleStore()
  if (!currentRole) return

  let messages: RecordData[]

  // 再次生成上一次问题
  if (!value) {
    const { sessionDataList } = useSessionStore()
    const lastQuestion = sessionDataList.filter((item) => item.is_ask).at(-1)

    if (!lastQuestion) return

    // 为了保证统一，这之后的内容全部删掉
    const deleteSql = `DELETE FROM session_data WHERE session_id = '${lastQuestion?.session_id}' AND id >= ${lastQuestion?.id};`

    await executeSQL(deleteSql)

    messages = JSON.parse(lastQuestion?.messages as any) || []
  } else {
    // TODO 这里可以优化，如何携带上一次的对话内容
    messages = [
      {
        role: 'system',
        content: currentRole.description
      },
      {
        role: 'user',
        content: value
      }
    ]
  }

  const { isThinking } = storeToRefs(useSessionStore())
  const { addSessionData } = useSessionStore()

  isThinking.value = true

  addSessionData(true, '', messages)
  const result = await getOpenAIResultApi(messages)

  isThinking.value = false

  console.log('result', result)

  if (!result) return

  // TODO 处理流式输出的结果
  addSessionData(false, '', result.message)
}
