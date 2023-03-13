export const useFixedStore = defineStore('fixedStore', () => {
  const isFix = ref(false)

  return {
    isFix
  }
})
