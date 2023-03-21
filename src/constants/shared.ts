export enum THEME {
  light = 'light',
  dark = 'dark'
}

export enum DEFAULT_ROLE {
  name = '问答机器人',
  description = '请以 markdown 的形式返回答案！'
}

export const DEFAULT_SHORTCUT_KEY = ['Alt', 'X']

export const OPEN_AI_MODEL = 'gpt-3.5-turbo-0301'

export const OPENAI_CHAT_URL = `${
  import.meta.env.VITE_OPEN_AI_URL
}/v1/chat/completions`

export const OPENAI_CREDIT_URL = `${
  import.meta.env.VITE_OPEN_AI_URL
}/dashboard/billing/credit_grants`
