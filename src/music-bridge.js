(() => {
  let started = false
  let retryTimer = null
  let iframe = null
  let observer = null

  const cleanup = () => {
    window.removeEventListener('pointerdown', startLegacyMusic, true)
    window.removeEventListener('click', startLegacyMusic, true)
    window.removeEventListener('touchstart', startLegacyMusic, true)
    window.removeEventListener('keydown', startLegacyMusic, true)
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

    // Keep autoplay permission on the iframe. This does not bypass browser policy,
    // but it removes the iframe permission as a possible blocker.
    iframe.allow = 'autoplay'

    try {
      const music = iframe.contentDocument?.getElementById('bg-music')
      if (!music) return

      music.loop = true
      music.preload = 'auto'
      music.autoplay = true
      music.muted = false
      music.volume = 1

      // IMPORTANT: do not call load() here. Calling load() immediately before play()
      // can break the transient user-activation window on some mobile browsers.
      const promise = music.play()
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          started = true
          cleanup()
        }).catch(() => {
          // Expected when the browser blocks audible autoplay. The next real gesture
          // will call play() again while preserving the same existing audio element.
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

    // Capture the user's very first interaction at the parent level. The opening
    // overlay sits above the iframe, so the iframe itself cannot reliably receive it.
    window.addEventListener('pointerdown', startLegacyMusic, true)
    window.addEventListener('click', startLegacyMusic, true)
    window.addEventListener('touchstart', startLegacyMusic, { passive: true, capture: true })
    window.addEventListener('keydown', startLegacyMusic, true)
    iframe.addEventListener('load', startLegacyMusic)

    // Best-effort audible autoplay on page open. If the browser permits it, this
    // starts immediately. If not, the first user gesture starts it reliably.
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
