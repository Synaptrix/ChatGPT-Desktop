<script setup lang="ts">
import multiAvatar from '@multiavatar/multiavatar'

const props = withDefaults(defineProps<{ value?: string }>(), {
  value: import.meta.env.VITE_APP_NAME
})

const avatar = ref('')

watchEffect(() => {
  avatar.value = multiAvatar(props.value)
})
</script>

<template>
  <div class="avatar">
    <div class="w-10 rounded-full" v-html="avatar"></div>
  </div>
</template>

<style scoped lang="scss"></style>
