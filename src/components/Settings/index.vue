<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'

const { modalMaskStyle } = useModalStyle()

const visible = ref(false)

onMounted(async () => {
  listen('open-settings', () => {
    visible.value = true
  })
})
</script>

<template>
  <a-modal
    simple
    class="settings-modal"
    :visible="visible"
    width="70%"
    :mask-style="modalMaskStyle"
    :footer="false"
    @ok="visible = false"
    @cancel="visible = false"
  >
    <a-tabs type="rounded" size="large" animation>
      <a-tab-pane key="1">
        <template #title>
          <icon-settings />
          <span>通用</span>
        </template>
        <General />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #title>
          <icon-bulb />
          <span>模型</span>
        </template>
        <Modal />
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #title>
          <icon-info-circle />
          <span>关于</span>
        </template>
        <About />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style lang="scss">
.settings-modal {
  .arco-modal {
    .arco-modal-header {
      --uno: m0;
    }

    .arco-tabs {
      .arco-tabs-nav {
        .arco-tabs-nav-tab {
          --uno: flex justify-center;
          .arco-tabs-tab {
            --uno: rounded-xl;
            .arco-tabs-tab-title {
              --uno: grid place-items-center gap-1;
              .arco-icon {
                --uno: text-6;
              }
            }
          }
        }
      }
      .arco-tabs-content {
        .arco-tabs-content-item {
          opacity: 0;
          &-active {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
