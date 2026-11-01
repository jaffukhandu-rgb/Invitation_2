(() => {
  let started = false
  let retryTimer = null
  let iframe = null

  const cleanup = () => {
    window.removeEventListener('pointerdown', startLegacyMusic, true)
    window.removeEventListener('click', startLegacyMusic, true)
    window.removeEventListener('touchstart', startLegacyMusic, true)
    window.removeEventListener('wheel', startLegacyMusic, true)
    window.removeEventListener('touchmove', startLegacyMusic, true)
    window.removeEventListener('keydown', startLegacyMusic, true)
    if (iframe) iframe.removeEventListener('load', startLegacyMusic)
    if (retryTimer) {
      window.clearInterval(retryTimer)
      retryTimer = null
    }
  }

  const startLegacyMusic = () => {
    if (started) return

    iframe ||= document.querySelector('.invitation-iframe')
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      const music = doc?.getElementById('bg-music')
      if (!music) return

      music.loop = true
      music.preload = 'auto'
      music.autoplay = true

      const promise = music.play()
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          started = true
          music.muted = false
          cleanup()
        }).catch(() => {
          // Keep retrying. A pointer/click/touch event will also retry with user activation.
        })
      } else {
        started = true
        cleanup()
      }
    } catch {
      // The iframe may not be ready yet; the interval/load listener will retry.
    }
  }

  const init = () => {
    iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return

    // Capture pointer/touch/click before the opening overlay consumes the interaction.
    window.addEventListener('pointerdown', startLegacyMusic, true)
    window.addEventListener('click', startLegacyMusic, true)
    window.addEventListener('touchstart', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('wheel', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('touchmove', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('keydown', startLegacyMusic, true)
    iframe.addEventListener('load', startLegacyMusic)

    // Attempt immediately on page load and keep trying until autoplay succeeds.
    startLegacyMusic()
    retryTimer = window.setInterval(startLegacyMusic, 1000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
