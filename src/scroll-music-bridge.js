(() => {
  let started = false

  const startMusicFromScrollGesture = () => {
    if (started) return

    const overlay = document.querySelector('.opening-overlay.show-cover')
    const iframe = document.querySelector('.invitation-iframe')
    if (!overlay || !iframe) return

    try {
      const doc = iframe.contentDocument
      const music = doc?.getElementById('bg-music')
      if (!music) return

      music.loop = true
      music.autoplay = true
      music.muted = false
      music.volume = 1

      const promise = music.play()
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          started = true
          const button = doc.getElementById('music-toggle')
          if (button) {
            button.setAttribute('aria-pressed', 'true')
            button.style.borderColor = 'var(--gold)'
            button.style.opacity = '1'
          }
        }).catch(() => {})
      } else {
        started = true
      }
    } catch {}
  }

  const onTouchStart = () => startMusicFromScrollGesture()
  const onWheel = () => startMusicFromScrollGesture()
  const onKeydown = (event) => {
    if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) {
      startMusicFromScrollGesture()
    }
  }

  window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
  window.addEventListener('wheel', onWheel, { capture: true, passive: true })
  window.addEventListener('keydown', onKeydown, true)

  const resetWhenNewOpeningAppears = () => {
    if (!document.querySelector('.opening-overlay')) started = false
  }

  new MutationObserver(resetWhenNewOpeningAppears).observe(document.body, {
    childList: true,
    subtree: true,
  })
})()
