(() => {
  let started = false
  let retryTimer = null

  const cleanup = () => {
    window.removeEventListener('wheel', startLegacyMusic)
    window.removeEventListener('touchstart', startLegacyMusic)
    window.removeEventListener('touchmove', startLegacyMusic)
    window.removeEventListener('keydown', startLegacyMusic)
    if (retryTimer) {
      window.clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  const startLegacyMusic = () => {
    if (started) return

    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      const music = doc?.getElementById('bg-music')
      if (!music) return

      music.autoplay = true
      music.loop = true
      music.preload = 'auto'
      music.muted = false

      const promise = music.play()
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          started = true
          music.muted = false
          cleanup()
        }).catch(() => {
          // Browser autoplay policy may reject audible autoplay.
          // Keep retrying and also listen for the first user gesture.
          retryTimer = window.setTimeout(startLegacyMusic, 1200)
        })
      } else {
        started = true
        cleanup()
      }
    } catch {
      retryTimer = window.setTimeout(startLegacyMusic, 1200)
    }
  }

  const init = () => {
    window.addEventListener('wheel', startLegacyMusic, { passive: true })
    window.addEventListener('touchstart', startLegacyMusic, { passive: true })
    window.addEventListener('touchmove', startLegacyMusic, { passive: true })
    window.addEventListener('keydown', startLegacyMusic)

    const iframe = document.querySelector('.invitation-iframe')
    iframe?.addEventListener('load', startLegacyMusic, { once: false })

    // Try immediately when the link/page opens, then retry while the iframe loads.
    startLegacyMusic()
    retryTimer = window.setTimeout(startLegacyMusic, 500)
    window.setTimeout(startLegacyMusic, 1500)
    window.setTimeout(startLegacyMusic, 3000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
