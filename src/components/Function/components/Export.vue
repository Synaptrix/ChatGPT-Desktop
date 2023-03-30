<script setup lang="ts">
const { isThinking, sessionDataList } = storeToRefs(useSessionStore())

const disabled = computed(
  () => isThinking.value || !sessionDataList.value.length
)

const handleSelect = (value: string) => {
  if (value === 'image') {
    saveImage('session-list')
  }
}
</script>

<template>
  <a-dropdown
    trigger="hover"
    @select="(value: any) => handleSelect(value)"
    position="top"
  >
    <a-button type="text" :disabled="disabled">
      <template #icon>
        <icon-download />
      </template>
    </a-button>
    <template #content>
      <a-doption value="image">导出图片</a-doption>
      <!-- <a-doption value="markdown">导出 Markdown</a-doption> -->
    </template>
  </a-dropdown>
</template>
