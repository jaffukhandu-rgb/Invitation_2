(() => {
  const hideDuplicateDateBlock = () => {
    const iframe = document.querySelector('.invitation-iframe')
    const doc = iframe?.contentDocument
    const venue = doc?.getElementById('venue')

    if (!venue) return false

    const duplicateHeader = venue.querySelector('.section-inner')
    if (!duplicateHeader) return false

    venue.querySelector('.royal-divider')?.remove()
    venue.querySelector('.eyebrow')?.remove()
    venue.querySelector('.script-heading')?.remove()
    venue.querySelector('.section-title')?.remove()
    venue.querySelector('.section-lede')?.remove()
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
