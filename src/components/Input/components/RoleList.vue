<script setup lang="ts">
import type { RolePayload } from '@/types'
const { t } = useI18n()
const roleStore = useRoleStore()
const { getRoleList, updateRole, deleteRole, addRole } = roleStore
const { currentRole, roleList, filterRoleList, popoverVisible, isEdit } =
  storeToRefs(roleStore)

const { sessionDataList, currentSession } = storeToRefs(useSessionStore())

const isAdd = ref(false)

const renderList = computed(() => {
  return filterRoleList.value.length && !isAdd.value
    ? filterRoleList.value
    : roleList.value
})

watch(renderList, () => handleVisible(!!renderList.value.length))

const handleVisible = (value: boolean) => {
  if (sessionDataList.value.length || isAdd.value || isEdit.value) return

  popoverVisible.value = value
}

const handleAdd = () => {
  isAdd.value = true
  filterRoleList.value = []
  roleList.value = [{ name: '', description: '', isEdit: true }]
}

const handleClick = () => {
  if (sessionDataList.value.length) {
    Message.info({ content: t('message.role.roleUnique') })

    return
  }

  if (isAdd.value || isEdit.value) {
    const action = isAdd.value ? t('common.add') : t('common.edit')

    Message.info(t('message.role.closeFail', { action }))

    return
  }

  popoverVisible.value = !popoverVisible.value
}

const handleSelect = (item: RolePayload) => {
  if (item.isEdit) return

  if (isEdit.value) {
    Message.info(t('message.role.changeFail'))

    return
  }

  if (!currentSession.value || !item.id) return

  currentRole.value = item
  currentSession.value.role_id = item.id

  popoverVisible.value = false
}

const handleEdit = (item: RolePayload) => {
  if (isEdit.value) {
    Message.info(t('message.role.editUnique'))

    return
  }

  item.isEdit = true
}

const handleUpdate = (item: RolePayload) => {
  const { name, description } = item

  if (!name.trim() || !description.trim()) {
    Message.error(t('message.role.emptyError'))

    return
  }

  if (isAdd.value) {
    addRole({ name, description })

    isAdd.value = false
  } else {
    delete item.isEdit

    updateRole(item)
  }
}

const handleClose = () => {
  isAdd.value = false

  getRoleList()
}
</script>

<template>
  <a-popover
    :title="$t('session.role.select')"
    class="role-popover w-full"
    trigger="click"
    :popup-visible="popoverVisible"
    @popup-visible-change="handleVisible"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <span>{{
          isAdd
            ? $t('session.role.pleaseType')
            : $t('session.role.pleaseSelect')
        }}</span>
        <a-button type="outline" @click="handleAdd" v-if="!isAdd">
          {{ $t('session.role.add') }}
        </a-button>
      </div>
    </template>

    <a-tooltip :content="$t('tips.role')" position="tl">
      <Avatar
        class="w-12! cursor-pointer"
        :value="currentRole?.name"
        @click="handleClick"
      />
    </a-tooltip>

    <template #content>
      <ul>
        <li
          v-for="item in renderList"
          class="transition-300 flex cursor-pointer items-center gap-4 bg-transparent p-4 text-[var(--color-text-1)] hover:bg-[var(--color-fill-2)]"
          :class="{
            'bg-[rgb(var(--blue-6))]!': currentRole?.id === item.id,
            'bg-transparent!': item.isEdit,
            'text-white': currentRole?.id === item.id && !item.isEdit
          }"
          :key="item.id"
          @click="handleSelect(item)"
        >
          <div class="flex flex-1 items-center gap-4">
            <Avatar class="w-10!" :value="item.name" />

            <div class="flex flex-1 flex-col gap-2">
              <template v-if="!item.isEdit">
                <span>
                  {{ item.name }}
                </span>
                <span>
                  {{ item.description }}
                </span>
              </template>

              <template v-else>
                <a-input
                  v-model="item.name"
                  :placeholder="$t('session.role.namePlaceholder')"
                  allow-clear
                  auto-focus
                />

                <a-textarea
                  v-model="item.description"
                  :placeholder="$t('session.role.descriptionPlaceholder')"
                  auto-size
                  allow-clear
                />
              </template>
            </div>
          </div>

          <div v-if="!item.is_default" @click.stop>
            <div v-if="!item.isEdit" class="text-5 flex gap-5">
              <icon-edit @click="handleEdit(item)" />
              <a-popconfirm
                type="error"
                position="tr"
                :content="$t('session.role.confirmDelete')"
                @ok="deleteRole(item.id!)"
                :ok-text="$t('common.confirm')"
                :cancel-text="$t('common.cancel')"
              >
                <icon-delete />
              </a-popconfirm>
            </div>
            <div v-else class="text-5 flex gap-5">
              <icon-check @click="handleUpdate(item)" />
              <icon-close @click="handleClose" />
            </div>
          </div>
        </li>
      </ul>
    </template>
  </a-popover>
</template>

<style lang="scss">
.role-popover {
  .arco-trigger-content {
    --uno: flex max-h-[calc(100vh-56px)] flex-col rounded-t-xl py-4 px-0;

    .arco-popover-title {
      --uno: p-4 pt-0;
    }

    .arco-popover-content {
      --uno: flex-1 overflow-auto;
    }
  }
}
</style>
