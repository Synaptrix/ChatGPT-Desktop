type Role = 'system' | 'user' | 'assistant'

export type TableName = 'history' | 'role' | 'credit'

export interface RecordData {
  role: Role
  content: string
}

export interface TablePayload {
  id?: number
  title?: string
  data?: RecordData[]
  name?: string
  description?: string
  history_id?: id
  token_cost?: id
  api_key?: id
  is_deleted?: boolean
}

export interface WherePayload {
  key: keyof TablePayload
  value: any
}
