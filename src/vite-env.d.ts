/// <reference types="vite/client" />

// 只有前缀为 VITE_ 的变量才会被 Vite 客户端暴露在浏览器中
interface ImportMetaEnv {
  readonly VITE_CONFIG_PATH: string
  readonly VITE_APP_NAME: string
  readonly VITE_OPEN_AI_URL: string
  readonly VITE_OPEN_AI_API_KEY: string
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}
