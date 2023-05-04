<script setup lang="ts">
const { apiKey, isMemory, modalParams, isTokenUsage, tokenUnit, showTime } =
  storeToRefs(useSettingsStore())

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
      <i>API KEY:</i>
      <a-input-password
        v-model="apiKey"
        :placeholder="$t('setting.model.apikey')"
      />
    </li>

    <li>
      <i>{{ $t('setting.model.showTime') }}<span>:</span></i>
      <a-switch v-model="showTime" type="round" />
    </li>

    <li>
      <i>{{ $t('setting.model.memory') }}<span>:</span></i>
      <a-switch v-model="isMemory" type="round" />
      <span class="text-sm text-[var(--color-text-3)]">
        {{ $t('setting.model.memoryTip') }}
      </span>
    </li>

    <li>
      <i>{{ $t('setting.model.tokenUsage') }}<span>:</span></i>
      <a-switch v-model="isTokenUsage" type="round" />
      <a-radio-group type="button" v-model="tokenUnit">
        <a-radio value="TK">Token</a-radio>
        <a-radio value="￠">{{ $t('setting.model.cents') }}</a-radio>
      </a-radio-group>
    </li>

    <li>
      <a-tooltip :content="$t('setting.tip.reset')" mini position="right">
        <i @dblclick="modalParams.temperature = 0.6">
          {{ $t('setting.model.divergenceOfThinking') }}<span>:</span>
        </i>
      </a-tooltip>
      <a-slider
        v-model="modalParams.temperature"
        :max="2"
        :step="0.1"
        show-input
      />
    </li>

    <li>
      <a-tooltip :content="$t('setting.tip.reset')" mini position="right">
        <i @dblclick="modalParams.max_tokens = 2000">
          {{ $t('setting.model.maxLengthOfReturn') }}<span>:</span>
        </i>
      </a-tooltip>
      <a-slider
        v-model="modalParams.max_tokens"
        :min="100"
        :max="3500"
        show-input
      />
    </li>

    <div class="flex justify-between text-sm text-[var(--color-text-3)]">
      <!-- <div>
        {{ $t('setting.model.balance') }} &dollar;
        {{ usedCredit }} / {{ totalCredit }}
      </div> -->
      <div>{{ $t('setting.model.balanceTip') }}</div>
      <i18n-t keypath="setting.model.aiModelTip" tag="label" scope="global">
        <span class="mark">gpt-3.5-turbo-0301</span>
      </i18n-t>
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
