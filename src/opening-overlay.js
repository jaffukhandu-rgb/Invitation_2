(() => {
  const init = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return

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

    iframe.addEventListener('load', hideLegacyIntro, { once: true })
    hideLegacyIntro()

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

    let finished = false
    const revealInvitation = () => {
      if (finished) return
      finished = true
      hideLegacyIntro()
      overlay.classList.add('is-ending')
      iframe.classList.add('is-ready')
      window.setTimeout(() => overlay.remove(), 1100)
    }

    video.addEventListener('ended', revealInvitation, { once: true })
    video.addEventListener('error', revealInvitation, { once: true })

    video.play().catch(() => {
      window.addEventListener('load', () => video.play().catch(revealInvitation), { once: true })
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
