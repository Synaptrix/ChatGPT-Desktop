type Role = 'system' | 'user' | 'assistant'

export type TableName = 'session' | 'session_data' | 'role' | 'credit'

export interface RecordData {
  role: Role
  content: string
}
export interface RolePayload {
  id?: number
  name?: string
  description?: string
  is_default?: boolean
  is_deleted?: boolean
  isEdit?: boolean
}

export interface SessionData {
  id?: number
  session_id: string
  value: RecordData
  time?: string
}

export interface SessionPayload {
  id: string
  title: string
  data: SessionData[]
  role_id: number
}

export interface RolePayload {
  id?: number
  name: string
  description: string
  is_default?: boolean
}

export interface CreditPayload {
  id?: number
  history_id: number
  token_cost: number
  api_key: string
}

type MergedInterface = SessionData &
  SessionPayload &
  RolePayload &
  CreditPayload

export type TablePayload = Partial<MergedInterface>

export interface WherePayload {
  key: keyof TablePayload
  value: any
}
