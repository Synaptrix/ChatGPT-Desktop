import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import { getOpenAIResultApi } from '@/api'
import { useRoleStore } from '.'
import type { SessionPayload } from '@/types'

export const useSessionStore = defineStore('sessionStore', () => {
  const currentSession = ref<SessionPayload>()

  const sessionList = ref<SessionPayload[]>([])

  const isThinking = ref(false)

  const createNewRecord = () => {
    currentSession.value = undefined
  }

  const getAiMessage = async (value?: string) => {
    isThinking.value = true

    if (!currentSession.value && value) {
      const { currentRole } = useRoleStore()

      if (!currentRole?.id) return

      const id = crypto.randomUUID()

      currentSession.value = {
        id,
        title: value,
        role_id: currentRole?.id,
        data: []
      }

      // addSession()

      // const newSessionList: SessionPayload[] = [
      //   {
      //     session_id: uuid,
      //     title: value,
      //     data: { role: 'system', content: currentRole.description },
      //     role_id: currentRole.id
      //   },
      //   {
      //     session_id: uuid,
      //     title: value,
      //     data: { role: 'user', content: value },
      //     role_id: currentRole.id
      //   }
      // ]
    } else if (!value) {
      const newRecord = { ...currentSession.value }
      newRecord.data?.pop()

      // currentSession.value = newRecord
    }

    const result = await getOpenAIResultApi()

    isThinking.value = false

    if (!result) return

    // currentRecord.value?.data?.push(result?.message)

    updateRecord()
  }

  const getRecord = async () => {
    sessionList.value = await selectSQL('session')

    currentSession.value = sessionList.value[0]
  }

  const addSession = async (payload: SessionPayload) => {
    await insertSQL('session', payload as any)

    getRecord()
  }

  const updateRecord = async () => {
    await updateSQL('session', currentSession.value as any)

    getRecord()
  }

  const deleteRecord = async (deleteAll = false) => {
    if (deleteAll) {
      // await deleteSQL('session')
    } else {
      // await deleteSQL('session', currentRecord.value?.id)
    }

    getRecord()
  }

  onMounted(getRecord)

  return {
    currentSession,
    isThinking,
    sessionList,
    createNewRecord,
    getAiMessage,
    addSession,
    updateRecord,
    deleteRecord
  }
})
