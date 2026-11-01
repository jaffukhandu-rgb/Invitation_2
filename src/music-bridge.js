(() => {
  let started = false
  let retryTimer = null
  let iframe = null
  let observer = null

  const cleanup = () => {
    window.removeEventListener('pointerdown', startLegacyMusic, true)
    window.removeEventListener('click', startLegacyMusic, true)
    window.removeEventListener('touchstart', startLegacyMusic, true)
    window.removeEventListener('wheel', startLegacyMusic, true)
    window.removeEventListener('touchmove', startLegacyMusic, true)
    window.removeEventListener('keydown', startLegacyMusic, true)
    window.removeEventListener('pageshow', startLegacyMusic, true)
    window.removeEventListener('focus', startLegacyMusic, true)
    document.removeEventListener('visibilitychange', startLegacyMusic, true)
    if (iframe) iframe.removeEventListener('load', startLegacyMusic)
    if (retryTimer) {
      window.clearInterval(retryTimer)
      retryTimer = null
    }
    observer?.disconnect()
    observer = null
  }

  const startLegacyMusic = () => {
    if (started) return

    iframe ||= document.querySelector('.invitation-iframe')
    if (!iframe) return

    // Tell the browser that this same-origin iframe is allowed to request autoplay.
    iframe.allow = 'autoplay'

    try {
      const doc = iframe.contentDocument
      const music = doc?.getElementById('bg-music')
      if (!music) return

      music.loop = true
      music.preload = 'auto'
      music.autoplay = true
      music.muted = false
      music.volume = 1
      music.load()

      const promise = music.play()
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          started = true
          cleanup()
        }).catch(() => {
          // Audible autoplay may still be rejected by the browser. Keep retrying
          // so the first real user gesture can start the same existing audio.
        })
      } else {
        started = true
        cleanup()
      }
    } catch {
      // The iframe may not be ready yet; load/observer/retry will try again.
    }
  }

  const init = () => {
    iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return

    iframe.allow = 'autoplay'

    // Capture the opening interaction before the overlay consumes it.
    window.addEventListener('pointerdown', startLegacyMusic, true)
    window.addEventListener('click', startLegacyMusic, true)
    window.addEventListener('touchstart', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('wheel', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('touchmove', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('keydown', startLegacyMusic, true)
    window.addEventListener('pageshow', startLegacyMusic, true)
    window.addEventListener('focus', startLegacyMusic, true)
    document.addEventListener('visibilitychange', startLegacyMusic, true)
    iframe.addEventListener('load', startLegacyMusic)

    // Attempt immediately on link open, when the iframe becomes ready, and during
    // the opening animation. If autoplay is allowed, music starts without a tap.
    startLegacyMusic()
    retryTimer = window.setInterval(startLegacyMusic, 1000)

    observer = new MutationObserver(() => {
      if (!started) startLegacyMusic()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
