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

export enum ImageCost {
  '256x256' = 8000,
  '512x512' = 9000,
  '1024x1024' = 10000
}
