<script setup lang="ts">
import multiAvatar from '@multiavatar/multiavatar'

const props = defineProps<{ value: string }>()

const avatar = computed(() =>
  multiAvatar(props.value || import.meta.env.VITE_APP_NAME)
)
</script>

<template>
  <div class="text-0 w-full rounded-full" v-html="avatar"></div>
</template>
