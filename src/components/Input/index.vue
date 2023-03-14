<script lang="ts" setup>
const textAreaValue = ref('')

const onKeydown = (event: KeyboardEvent) => {
  const keyName = event.key.toLowerCase()

  if (keyName === 'enter') {
    if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()

      const value = textAreaValue.value.trim()
      if (!value) return

      // TODO: 请求接口

      event.target?.blur()
      textAreaValue.value = ''
    }
  }
}
</script>

<template>
  <div class="app-input flex items-center gap-2">
    <RoleList />

    <a-textarea
      class="bordered bg-transparent!"
      placeholder="有什么问题尽管问我"
      allow-clear
      v-model="textAreaValue"
      @keydown="onKeydown"
    ></a-textarea>
  </div>
</template>

<style lang="scss" scoped>
.app-input {
  .arco-textarea-wrapper {
    height: 32px;

    transition: all 0.3s;

    border-radius: 32px;

    &:hover {
      border-color: var(--color-neutral-4);
    }
    &.arco-textarea-focus {
      height: 96px;

      border-color: rgb(var(--arcoblue-6));
      border-radius: 0;
    }
  }
}
</style>
