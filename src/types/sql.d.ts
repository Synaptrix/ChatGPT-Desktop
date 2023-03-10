type Role = 'system' | 'user' | 'assistant'

export type TableName = 'history' | 'role' | 'credit'

export interface RecordData {
  role: Role
  content: string
}

export interface RolePayload {
  id: number
  name: string
  description: string
}

export interface TablePayload {
  id?: number
  title?: string
  data?: RecordData[]
  time?: Date | number
  name?: string
  description?: string
  history_id?: id
  token_cost?: id
  api_key?: id
}
