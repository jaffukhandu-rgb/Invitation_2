(() => {
  const hideDuplicateDate = () => {
    const iframe = document.querySelector('.invitation-iframe')
    const doc = iframe?.contentDocument
    const heroDate = doc?.querySelector('.hero-date')

    if (!heroDate) return false

    heroDate.style.display = 'none'
    return true
  }

  const watchIframe = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    iframe.addEventListener('load', () => {
      hideDuplicateDate()
      window.setTimeout(hideDuplicateDate, 0)
    })

    hideDuplicateDate()
    return true
  }

  if (watchIframe()) return

  const observer = new MutationObserver(() => {
    if (watchIframe()) observer.disconnect()
  })

  observer.observe(document.body, { childList: true, subtree: true })
  window.setTimeout(() => observer.disconnect(), 10000)
})()
