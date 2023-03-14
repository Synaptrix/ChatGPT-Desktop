import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import { getOpenAIResultApi } from '@/api'
import { useRoleStore } from '.'
import type { TablePayload, RecordData } from '@/types'

export const useRecordStore = defineStore('recordStore', () => {
  const currentRecord = ref<TablePayload>()

  const isThinking = ref(false)

  const recordList = ref<TablePayload[]>([])

  const createNewRecord = () => {
    currentRecord.value = undefined
  }

  const getAiMessage = async (value?: string) => {
    isThinking.value = true

    if (!currentRecord.value) {
      const newRecord: TablePayload = {
        title: value,
        data: []
      }

      const { currentRole } = useRoleStore()

      newRecord.data?.push(
        {
          role: 'system',
          content: currentRole?.description || ''
        },
        {
          role: 'user',
          content: value
        }
      )

      currentRecord.value = newRecord
    } else if (!value) {
      value = currentRecord.value.data?.at(-1)?.content
    }

    const result = await getOpenAIResultApi()

    isThinking.value = false

    if (!result) return

    currentRecord.value.data?.push(result?.message)
  }

  const getRecord = async () => {
    recordList.value = await selectSQL('history')

    if (currentRecord.value) {
      // 检查聊天记录是否还存在于数据库
      const findRecord = recordList.value.find(
        (record) => record.id === currentRecord.value?.id
      )

      if (findRecord) return

      currentRecord.value = undefined
    }
  }

  const addRecord = async (payload: TablePayload) => {
    await insertSQL('history', payload)

    getRecord()
  }

  const updateRecord = async (payload: TablePayload) => {
    await updateSQL('history', payload)

    getRecord()
  }

  // TODO：删除这块有 bug，在新对话时考虑禁用或者其它方法
  const deleteRecord = async (id?: number) => {
    await deleteSQL('history', id)

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
