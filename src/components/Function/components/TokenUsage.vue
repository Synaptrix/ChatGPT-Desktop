<script setup lang="ts">
const { currentRole, textAreaValue } = storeToRefs(useRoleStore())
const { isMemory } = storeToRefs(useSettingsStore())
const { currentSession, imageParams } = storeToRefs(useSessionStore())

const tokenUsage = ref(0)

const tokenExceed = computed(
  () => !!textAreaValue.value && tokenUsage.value > 3800
)

const ImagePrices = {
  '256x256': 0.016,
  '512x512': 0.018,
  '1024x1024': 0.02
}

watch([textAreaValue, isMemory], async () => {
  if (currentSession.value?.type === 'image') {
    generateUsage()
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

  tokenUsage.value = textAreaTokens + roleTokens + memoryTokens
})

watch([imageParams.value], () => {
  if (currentSession.value?.type === 'image') {
    generateUsage()
  }
})

const generateUsage = () => {
  const size = imageParams.value.size as keyof typeof ImagePrices
  tokenUsage.value = ImagePrices[size] * imageParams.value.number
}

const showTipsToUsage = () => {
  let tipStr =
    currentSession.value?.type === 'image'
      ? '图像模式：'
      : isMemory.value
      ? '记忆模式：'
      : ''
  return tipStr + '预计消耗'
}
const getUnit = () => {
  const typeList: (string | undefined)[] = ['image', 'voice']
  return typeList.includes(currentSession.value?.type) ? '$' : 'TK'
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
        {{ tokenUsage }}
      </span>
    </a-tooltip>
    {{ getUnit() }}
  </div>
</template>
