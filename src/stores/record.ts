import { selectSQL, insertSQL, updateSQL, deleteSQL } from '@/sqls'
import type { TablePayload } from '@/types'

export const useRecordStore = defineStore('recordStore', () => {
  const currentRecord = ref<TablePayload>()

  const recordList = ref<TablePayload[]>([])

  const createNewRecord = () => {
    currentRecord.value = undefined
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

  const deleteRecord = async (id?: number) => {
    await deleteSQL('history', id)

    getRecord()
  }

  onMounted(getRecord)

  return {
    currentRecord,
    recordList,
    createNewRecord,
    addRecord,
    updateRecord,
    deleteRecord
  }
})
