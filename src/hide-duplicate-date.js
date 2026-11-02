(() => {
  const hideDuplicateDateBlock = () => {
    const iframe = document.querySelector('.invitation-iframe')
    const doc = iframe?.contentDocument
    const venue = doc?.getElementById('venue')

    if (!venue) return false

    venue.style.display = 'none'
    return true
  }

  const watchIframe = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    iframe.addEventListener('load', () => {
      hideDuplicateDateBlock()
      window.setTimeout(hideDuplicateDateBlock, 0)
    }, { passive: true })

    hideDuplicateDateBlock()
    return true
  }

  if (watchIframe()) return

  const observer = new MutationObserver(() => {
    if (watchIframe()) observer.disconnect()
  })

  observer.observe(document.body, { childList: true, subtree: true })
  window.setTimeout(() => observer.disconnect(), 10000)
})()
