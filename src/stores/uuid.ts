// @unocss-include
export const useUuidStore = defineStore(
  'uuidStore',
  () => {
    const uuid = ref('')

    onMounted(() => {
      if (uuid.value) return

      uuid.value = crypto.randomUUID()
    })

    return { uuid }
  },
  {
    persist: true
  }
)
