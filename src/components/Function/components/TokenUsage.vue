<script setup lang="ts">
const { currentRole, textAreaValue } = storeToRefs(useRoleStore())
const { isMemory } = storeToRefs(useSettingsStore())

const tokenUsage = ref(0)

const tokenExceed = computed(
  () => !!textAreaValue.value && tokenUsage.value > 3800
)

watch([textAreaValue, isMemory], async () => {
  // 角色描述字符数
  const roleTokens = estimateTokens(currentRole.value!.description)

  // 输入字符数
  const textAreaTokens = estimateTokens(textAreaValue.value)

  // 记忆模式下额外消耗的字符数
  const memoryList = await getMemoryList()

  const memoryTokens = estimateTokens(
    memoryList.map((item) => item.content).join('')
  )

  tokenUsage.value = textAreaTokens + roleTokens + memoryTokens
})
</script>

<template>
  <div
    class="transition-300 opacity-0"
    :class="textAreaValue.length && 'opacity-100!'"
  >
    {{ isMemory ? '记忆模式：' : '' }}预计消耗
    <a-tooltip
      mini
      :popup-visible="tokenExceed"
      content="已超出 token 最大阈值"
    >
      <span :class="tokenExceed ? 'text-[rgb(var(--danger-6))]' : 'mark'">
        {{ tokenUsage }}
      </span>
    </a-tooltip>
    TK
  </div>
</template>
