(() => {
  let started = false

  const startLegacyMusic = () => {
    if (started || document.body.classList.contains('opening-locked')) return

    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      const music = doc?.getElementById('bg-music')
      if (!music) return

      const promise = music.play()
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          started = true
          music.muted = false
        }).catch(() => {})
      } else {
        started = true
      }
    } catch {}

    if (started) {
      window.removeEventListener('wheel', startLegacyMusic)
      window.removeEventListener('touchmove', startLegacyMusic)
      window.removeEventListener('keydown', startLegacyMusic)
    }
  }

  const init = () => {
    window.addEventListener('wheel', startLegacyMusic, { passive: true })
    window.addEventListener('touchmove', startLegacyMusic, { passive: true })
    window.addEventListener('keydown', startLegacyMusic)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
