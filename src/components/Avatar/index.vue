<script setup lang="ts">
import multiAvatar from '@multiavatar/multiavatar'

const props = withDefaults(defineProps<{ value?: string }>(), {
  value: import.meta.env.VITE_APP_NAME
})

const avatar = computed(() => multiAvatar(props.value || '默认头像'))
</script>

<template>
  <div class="text-0 w-full rounded-full" v-html="avatar"></div>
</template>
