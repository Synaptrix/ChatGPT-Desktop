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

      addSession()

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

      addSession(newSession)
    } else if (!value) {
      const newRecord = { ...currentRecord.value }
      newRecord.data?.pop()

      currentRecord.value = newRecord
    }

    const result = await getOpenAIResultApi()

    isThinking.value = false

    if (!result) return

    currentRecord.value?.data?.push(result?.message)

    updateRecord()
  }

  const getRecord = async () => {
    sessionList.value = await selectSQL('session')

    currentSession.value = sessionList.value[0]
  }

  const addSession = async (payload: SessionPayload) => {
    await insertSQL('session', payload)

    getRecord()
  }

  const updateRecord = async () => {
    await updateSQL('history', currentRecord.value!)

    getRecord()
  }

  const deleteRecord = async (deleteAll = false) => {
    if (deleteAll) {
      await deleteSQL('history')
    } else {
      await deleteSQL('history', currentRecord.value?.id)
    }

    getRecord()
  }

  onMounted(getRecord)

  return {
    currentRecord,
    isThinking,
    recordList,
    createNewRecord,
    getAiMessage,
    addRecord,
    updateRecord,
    deleteRecord
  }
})
