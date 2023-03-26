export enum DEFAULT_ROLE {
  name = '问答机器人',
  description = '请以 markdown 的形式返回答案！'
}

export const DEFAULT_SHORTCUT_KEY = ['Alt', 'X']

export const OPEN_AI_MODEL = 'gpt-3.5-turbo-0301'

export enum HOST_URL {
  OPENAI = 'https://api.openai.com',
  GITHUB = 'https://api.github.com'
}

export const OPENAI_IMAGES_URL = `${
  import.meta.env.VITE_OPEN_AI_URL
}/v1/images/generations`
