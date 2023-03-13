export const useFixedStore = defineStore('fixedStore', () => {
  const isFix = ref(true)

  return {
    isFix
  }
})
