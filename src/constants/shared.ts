const { t } = i18n.global
export const DEFAULT_ROLE = {
  name: t('session.role.default.name'),
  description: t('session.role.default.description')
}

export const DEFAULT_SHORTCUT_KEY = ['Alt', 'X']

export const OPEN_AI_MODEL = 'gpt-3.5-turbo-0301'

export enum HOST_URL {
  OPENAI = 'https://api.openai.com',
  GITHUB = 'https://api.github.com'
}

export enum IMAGE_COST {
  '256x256' = 8000,
  '512x512' = 9000,
  '1024x1024' = 10000
}

export const SUPPORT_LANGUAGE = ['zh', 'en', 'es'] as const
