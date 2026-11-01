(() => {
  const hideNavTrigger = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    try {
      const doc = iframe.contentDocument
      if (!doc) return false

      if (!doc.getElementById('hide-nav-trigger-style')) {
        const style = doc.createElement('style')
        style.id = 'hide-nav-trigger-style'
        style.textContent = '#nav-trigger{display:none!important;}'
        doc.head.appendChild(style)
      }

      doc.getElementById('nav-trigger')?.setAttribute('aria-hidden', 'true')
      return true
    } catch {
      return false
    }
  }

  const init = () => {
    if (hideNavTrigger()) return

    const observer = new MutationObserver(() => {
      if (hideNavTrigger()) observer.disconnect()
    })

    observer.observe(document.getElementById('root') || document.body, {
      childList: true,
      subtree: true,
    })

    window.setTimeout(() => observer.disconnect(), 10000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
