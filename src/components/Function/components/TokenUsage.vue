<script setup lang="ts">
const { currentRole, textAreaValue } = storeToRefs(useRoleStore())
const { isMemory, tokenUnit } = storeToRefs(useSettingsStore())
const { currentSession, imageParams } = storeToRefs(useSessionStore())

const tokenUsage = ref(0)

const tokenExceed = computed(
  () =>
    currentSession.value?.type === 'text' &&
    !!textAreaValue.value &&
    tokenUsage.value > 3800
)

watchEffect(async () => {
  if (currentSession.value?.type === 'image') {
    const size = imageParams.value.size as keyof typeof ImageCost
    const cost = ImageCost[size] * imageParams.value.number

    tokenUsage.value =
      tokenUnit.value === 'TK' ? cost : Number((cost * 0.0002).toFixed(3))

    return
  }
  // 角色描述字符数
  const roleTokens = estimateTokens(currentRole.value!.description)

  // 输入字符数
  const textAreaTokens = estimateTokens(textAreaValue.value)

  // 记忆模式下额外消耗的字符数
  const memoryList = await getMemoryList()

  const memoryTokens = estimateTokens(
    memoryList.map((item) => item.content).join('')
  )

  const cost = textAreaTokens + roleTokens + memoryTokens

  tokenUsage.value = tokenUnit.value === 'TK' ? cost : Number(cost.toFixed(3))
})

const showTipsToUsage = () => {
  const tipStr =
    currentSession.value?.type === 'image'
      ? '图像模式：'
      : isMemory.value
      ? '记忆模式：'
      : ''
  return tipStr + '预计消耗'
}
</script>

<template>
  <div
    class="transition-300 opacity-0"
    :class="textAreaValue.length && 'opacity-100!'"
  >
    {{ showTipsToUsage() }}
    <a-tooltip
      mini
      :popup-visible="tokenExceed"
      content="已超出 token 最大阈值"
    >
      <span :class="tokenExceed ? 'text-[rgb(var(--danger-6))]' : 'mark'">
        {{ tokenUsage }} {{ tokenUnit }}
      </span>
    </a-tooltip>
  </div>
</template>
