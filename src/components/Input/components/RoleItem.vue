<script lang="ts" setup>
import type { RolePayload } from '@/types'
import { IconEdit, IconDelete, IconCheck } from '@arco-design/web-vue/es/icon'

const props = defineProps<{
  data: RolePayload
}>()

const data = ref(props.data)
const isEdit = ref(false)

const updateItem = () => {
  isEdit.value = false
  updateRole(data.value)
}

const deleteRole = inject('deleteRole') as (id: number) => Promise<void>
const updateRole = inject('updateRole') as (data: RolePayload) => Promise<void>
</script>

<template>
  <a-list-item>
    <a-list-item-meta>
      <template #title>
        <a-input v-model="data.name" v-if="isEdit" />
        <p v-else>{{ data.name }}</p>
      </template>
      <template #description>
        <!-- TODO 这里的textarea填充不满 -->
        <div class="w-600px">
          <a-textarea
            v-model="data.description"
            v-if="isEdit"
            auto-size
            :error="isEdit"
          />
          <p v-else>{{ data.description }}</p>
        </div>
      </template>
      <template #avatar>
        <Avatar :value="data.name" />
      </template>
    </a-list-item-meta>
    <template #actions>
      <icon-edit @click="isEdit = true" v-if="!isEdit" />
      <icon-check @click="updateItem" v-else />
      <icon-delete @click="deleteRole(data.id)" />
    </template>
  </a-list-item>
</template>

<style lang="scss" scoped></style>
