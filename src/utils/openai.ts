import { getOpenAIResultApi } from '@/api'
import { useSessionStore, useRoleStore } from '@/stores'
import { RecordData } from '@/types'

export const getAiMessage = async (value?: string) => {
  const { currentRole } = useRoleStore()
  if (!currentRole) return
  if (!value) return

  const { isThinking } = storeToRefs(useSessionStore())
  const { addSessionData } = useSessionStore()

  isThinking.value = true

  const messages: RecordData[] = [
    {
      role: 'system',
      content: currentRole.description
    },
    {
      role: 'user',
      content: value
    }
  ]

  addSessionData(messages)
  const result = await getOpenAIResultApi(messages)

  isThinking.value = false

  if (!result) return

  addSessionData(result.message)
}
