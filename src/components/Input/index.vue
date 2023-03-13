<script lang="ts" setup>
const textAreaValue = ref('')
</script>

<template>
  <div class="app-input flex items-center gap-2 p-2">
    <!-- 角色选择 -->
    <RoleList />

    <a-textarea
      class="bordered bg-transparent!"
      placeholder="有什么问题尽管问我"
      allow-clear
      v-model="textAreaValue"
    ></a-textarea>
  </div>
</template>

<style lang="scss" scoped>
.app-input {
  .arco-textarea-wrapper {
    height: 32px;

    transition: all 0.3s;

    border-radius: 32px;
    &.arco-textarea-focus {
      height: 96px;

      border-radius: 0;
    }
  }
}
</style>
