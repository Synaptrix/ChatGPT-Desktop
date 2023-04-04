<script setup lang="ts">
const { apiKey, isMemory, modalParams, isTokenUsage, tokenUnit } = storeToRefs(
  useSettingsStore()
)

const totalCredit = ref(0)
const usedCredit = ref(0)

const getCredit = async () => {
  const credit = await getOpenAICreditApi()

  if (!credit) return

  totalCredit.value = parseFloat(credit.total_granted?.toFixed(2))
  usedCredit.value = parseFloat(credit.total_available?.toFixed(2))
}

watch(
  [apiKey],
  ([newValue]) => {
    if (newValue.length !== 51) return

    // getCredit()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <ul class="modal flex flex-col gap-4">
    <li>
      <i>OpenAI API KEY:</i>
      <a-input-password v-model="apiKey" placeholder="OpenAI API KEY" />
    </li>

    <li>
      <i>记忆模式:</i>
      <a-switch v-model="isMemory" type="round" />
      <span class="text-sm text-[var(--color-text-3)]"
        >开启记忆模式会加倍消耗 token</span
      >
    </li>

    <li>
      <i>Token 用量:</i>
      <a-switch v-model="isTokenUsage" type="round" />
      <a-radio-group type="button" v-model="tokenUnit">
        <a-radio value="TK">Token</a-radio>
        <a-radio value="￠">美分(￠)</a-radio>
      </a-radio-group>
    </li>

    <li>
      <a-tooltip content="双击重置为默认值" mini position="right">
        <i @dblclick="modalParams.temperature = 0.6">思维发散程度:</i>
      </a-tooltip>
      <a-slider
        v-model="modalParams.temperature"
        :max="2"
        :step="0.1"
        show-input
      />
    </li>

    <li>
      <a-tooltip content="双击重置为默认值" mini position="right">
        <i @dblclick="modalParams.max_tokens = 2000">返回最大长度:</i>
      </a-tooltip>
      <a-slider
        v-model="modalParams.max_tokens"
        :min="100"
        :max="3500"
        show-input
      />
    </li>

    <div class="flex justify-between text-sm text-[var(--color-text-3)]">
      <!-- <div>账户余额：&dollar; {{ usedCredit }} / {{ totalCredit }}</div> -->
      <div>余额查询暂不可用</div>
      <div>
        温馨提示：软件使用 <span class="mark">gpt-3.5-turbo-0301</span> 模型
      </div>
    </div>
  </ul>
</template>

<style scoped lang="scss">
.modal {
  li {
    --uno: flex items-center gap-3;
    > i {
      --uno: cursor-default min-w-50 text-right not-italic
        text-[var(--color-text-2)];
    }
  }
}
</style>
