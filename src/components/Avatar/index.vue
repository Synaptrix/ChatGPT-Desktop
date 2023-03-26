<script setup lang="ts">
import { getName } from '@tauri-apps/api/app'
import multiAvatar from '@multiavatar/multiavatar'

const props = defineProps<{ value?: string }>()

const appName = ref('')

const avatar = computed(() => multiAvatar(props.value || appName.value))

onMounted(async () => {
  appName.value = await getName()
})
</script>

<template>
  <div class="text-0 w-full rounded-full" v-html="avatar"></div>
</template>
