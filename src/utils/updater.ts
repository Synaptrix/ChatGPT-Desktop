import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { Modal } from '@arco-design/web-vue'
import MarkdownIt from 'markdown-it'

const marked = new MarkdownIt({
  linkify: true,
  html: true
})

export const checkVersion = async () => {
  const updateInfo = await checkUpdate()

  if (!updateInfo || !updateInfo.manifest) return

  if (updateInfo.shouldUpdate) {
    const unlisten = await onUpdaterEvent(({ status }) => {
      switch (status) {
        case 'PENDING':
          Message.loading('正在下载更新包')
          break
        case 'DONE':
          Message.success('更新完成，即将重启应用')
          unlisten()
          relaunch()
          break
        case 'UPTODATE':
          unlisten()
          Message.success('当前已是最新版本')
      }
    })

    Modal.info({
      title: '检查到可用更新',
      maskClosable: false,
      hideCancel: false,
      content: () =>
        h('div', { class: 'info-modal-content' }, [
          h(
            'span',
            { style: 'margin-bottom: 10px;' },
            `发现新的版本: v${updateInfo.manifest?.version}，是否更新？`
          ),
          marked.render(updateInfo.manifest!.body || '暂无更新内容')
          //   h(
          //     'div',
          //     {},
          //     marked.render(updateInfo.manifest!.body || '暂无更新内容')
          //   )
        ]),
      okText: '立即更新',
      onOk: async () => {
        await installUpdate()
      },
      cancelText: '稍后更新',
      onCancel: () => {
        unlisten()
      }
    })
  }
}
