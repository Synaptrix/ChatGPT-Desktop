import { getOpenAIResultStream } from '@/api'
import { executeSQL } from '@/sqls'
import { useSessionStore, useRoleStore, useSettingsStore } from '@/stores'
import { RecordData, SessionData } from '@/types'

export const getAiMessage = async (value?: string) => {
  const { currentRole } = useRoleStore()
  if (!currentRole) return

  const messages: RecordData[] = []

  const { sessionDataList, currentSession } = useSessionStore()
  const { isMemory } = useSettingsStore()

  const lastQuestion = sessionDataList.filter((item) => item.is_ask).at(-1)

  // 记忆模式，或者是第一次对话，都要生成角色描述
  if (sessionDataList.length < 3 || isMemory)
    messages.push({
      role: 'system',
      content: currentRole.description
    })

  // 获取记忆（限制5条），往前推直到出现is_momery为false的
  // TODO 应该进行限流，防止出现过多的记忆，导致token超出
  const addMemory = async () => {
    if (isMemory) {
      const sql = `SELECT * FROM session_data WHERE session_id = '${currentSession?.id}' ORDER BY id DESC LIMIT 5;`
      const memoryList = (await executeSQL(sql)) as SessionData[]

      let count = 0
      const arr = []
      while (count < memoryList.length) {
        if (!memoryList[count].is_memory) break
        arr.push(JSON.parse(memoryList[count++].message as any))
      }
      messages.push(...arr.reverse())
    }
  }

  // 再次生成上一次问题
  if (!value) {
    if (!lastQuestion) return

    // 为了保证统一，这之后的内容全部删掉
    const deleteSql = `DELETE FROM session_data WHERE session_id = '${lastQuestion?.session_id}' AND id >= ${lastQuestion?.id};`
    await executeSQL(deleteSql)

    await addMemory()
    messages.push(JSON.parse(lastQuestion?.message as any))
  } else {
    await addMemory()
    messages.push({
      role: 'user',
      content: value
    })
  }

  const { isThinking } = storeToRefs(useSessionStore())
  const { addSessionData } = useSessionStore()

  isThinking.value = true

  addSessionData(true, '', messages.at(-1)!)
  await getOpenAIResultStream(messages)

  isThinking.value = false
}
