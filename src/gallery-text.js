(() => {
  const apply = (doc) => {
    const gallery = doc?.querySelector('.gallery')
    if (!gallery) return false

    const title = gallery.querySelector('.section-title')
    const lede = gallery.querySelector('.section-lede')

    if (title) title.textContent = 'Moments to Remember'
    if (lede) lede.remove()

    return true
  }

  const bindIframe = (iframe) => {
    if (!iframe || iframe.dataset.galleryTextBound === 'true') return
    iframe.dataset.galleryTextBound = 'true'

    const tryApply = () => {
      try {
        if (apply(iframe.contentDocument)) return true
      } catch {}
      return false
    }

    const observeDocument = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc?.body) return
        if (tryApply()) return

        const observer = new MutationObserver(() => {
          if (tryApply()) observer.disconnect()
        })
        observer.observe(doc.body, { childList: true, subtree: true })
        window.setTimeout(() => observer.disconnect(), 15000)
      } catch {}
    }

    iframe.addEventListener('load', observeDocument)
    observeDocument()
  }

  const watch = () => {
    const root = document.getElementById('root') || document.body
    if (!root) return

    const scan = () => {
      const iframe = document.querySelector('.invitation-iframe')
      if (iframe) bindIframe(iframe)
    }

    scan()
    const observer = new MutationObserver(scan)
    observer.observe(root, { childList: true, subtree: true })
    window.setTimeout(() => observer.disconnect(), 30000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once: true })
  } else {
    watch()
  }
})()
