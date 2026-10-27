(() => {
  const init = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const hideLegacyIntro = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc) return
        const intro = doc.getElementById('intro')
        if (intro) intro.classList.add('hidden')
        doc.body.classList.remove('locked')
        doc.getElementById('nav-trigger')?.classList.add('show')
      } catch {}
    }

    const overlay = document.createElement('div')
    overlay.className = 'opening-overlay'

    const video = document.createElement('video')
    video.className = 'opening-video'
    video.src = '/assets/opening-video.mp4'
    video.muted = true
    video.autoplay = true
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('aria-hidden', 'true')

    const sheen = document.createElement('div')
    sheen.className = 'opening-sheen'

    overlay.append(video, sheen)
    document.body.appendChild(overlay)

    iframe.addEventListener('load', hideLegacyIntro)
    hideLegacyIntro()

    let finished = false
    const revealInvitation = () => {
      if (finished) return
      finished = true
      hideLegacyIntro()
      iframe.classList.add('is-ready')
      overlay.classList.add('is-ending')
      window.setTimeout(() => overlay.remove(), 1100)
    }

    video.addEventListener('ended', revealInvitation, { once: true })
    video.addEventListener('error', revealInvitation, { once: true })

    const playVideo = () => video.play().catch(() => {})
    if (video.readyState >= 2) playVideo()
    else video.addEventListener('canplay', playVideo, { once: true })

    return true
  }

  const start = () => {
    if (init()) return

    const observer = new MutationObserver(() => {
      if (init()) observer.disconnect()
    })
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true })

    window.setTimeout(() => observer.disconnect(), 10000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
})()
