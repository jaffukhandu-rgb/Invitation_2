(() => {
  const removeVenueDateBlock = () => {
    const iframe = document.querySelector('.invitation-iframe')
    const doc = iframe?.contentDocument
    const venue = doc?.getElementById('venue')
    const inner = venue?.querySelector('.section-inner')

    if (!inner) return false

    inner.querySelector('.royal-divider')?.remove()
    inner.querySelector('.eyebrow')?.remove()
    inner.querySelector('.script-heading')?.remove()
    inner.querySelector('.section-title')?.remove()
    inner.querySelector('.section-lede')?.remove()

    return true
  }

  const watchIframe = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const handleLoad = () => {
      if (removeVenueDateBlock()) {
        const doc = iframe.contentDocument
        const venue = doc?.getElementById('venue')
        if (venue) {
          const observer = new MutationObserver(removeVenueDateBlock)
          observer.observe(venue, { childList: true, subtree: true })
          window.setTimeout(() => observer.disconnect(), 10000)
        }
      }
    }

    iframe.addEventListener('load', handleLoad, { once: true })
    handleLoad()
    return true
  }

  if (watchIframe()) return

  const observer = new MutationObserver(() => {
    if (watchIframe()) observer.disconnect()
  })

  observer.observe(document.body, { childList: true, subtree: true })
  window.setTimeout(() => observer.disconnect(), 10000)
})()
