export const useApiKeyStore = defineStore(
  'apiKeyStore',
  () => {
    const apiKey = ref('')

    return {
      apiKey
    }
  },
  {
    persist: true
  }
)
