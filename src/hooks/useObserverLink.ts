import { open } from '@tauri-apps/api/shell'

export const useObserverLink = () => {
  const handleElement = (element: HTMLElement) => {
    if (element.tagName === 'A') {
      element.onclick = (event) => {
        event.preventDefault()

        const url = element.getAttribute('href')
        if (!url) return

        open(url)
      }
    } else {
      Array.from(element.children).forEach((item) =>
        handleElement(item as HTMLElement)
      )
    }
  }

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      handleElement(mutation.target as HTMLElement)
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
