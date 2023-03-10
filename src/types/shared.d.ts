export interface RecordData {
  role: string
  content: string
}

export interface HistoryRecord {
  id?: number
  title?: string
  data?: RecordData[]
  time?: string
}
