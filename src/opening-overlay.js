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
    overlay.setAttribute('aria-label', 'Taha and Munira wedding invitation opening')

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

    const cover = document.createElement('div')
    cover.className = 'opening-cover'
    cover.innerHTML = `
      <div class="cover-ornament cover-ornament-tl" aria-hidden="true"></div>
      <div class="cover-ornament cover-ornament-tr" aria-hidden="true"></div>
      <div class="cover-ornament cover-ornament-bl" aria-hidden="true"></div>
      <div class="cover-ornament cover-ornament-br" aria-hidden="true"></div>
      <div class="cover-glow" aria-hidden="true"></div>
      <div class="cover-content">
        <p class="cover-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p class="cover-eyebrow">Together With Their Families</p>
        <p class="cover-script">The wedding of</p>
        <h1 class="cover-names"><span>Taha</span><i>&amp;</i><span>Munira</span></h1>
        <p class="cover-date">8 — 12 · January · 2027</p>
        <div class="cover-divider" aria-hidden="true"><span></span><b>✦</b><span></span></div>
        <p class="cover-prompt"><span>SCROLL TO DISCOVER</span><i></i></p>
      </div>
    `

    overlay.append(video, sheen, cover)
    document.body.appendChild(overlay)
    document.body.classList.add('opening-locked')

    iframe.addEventListener('load', hideLegacyIntro)
    hideLegacyIntro()

    let finished = false
    let coverOpen = false
    let touchStartY = null

    const handleWheel = (event) => {
      if (!coverOpen) return
      if (Math.abs(event.deltaY) < 6) return
      event.preventDefault()
      enterInvitation()
    }

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event) => {
      if (!coverOpen || touchStartY === null) return
      const currentY = event.touches[0]?.clientY ?? touchStartY
      if (Math.abs(touchStartY - currentY) > 14) {
        event.preventDefault()
        enterInvitation()
      }
    }

    const handleKeydown = (event) => {
      if (!coverOpen) return
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault()
        enterInvitation()
      }
    }

    const cleanup = () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeydown)
    }

    const revealInvitation = () => {
      if (finished || coverOpen) return
      finished = true
      video.pause()
      coverOpen = true
      overlay.classList.add('show-cover')
      iframe.classList.add('is-cover-ready')
    }

    function enterInvitation() {
      if (!coverOpen) return
      coverOpen = false
      cleanup()
      document.body.classList.remove('opening-locked')
      overlay.classList.add('is-entering')
      iframe.classList.add('is-ready')
      window.setTimeout(() => overlay.remove(), 1050)
    }

    video.addEventListener('ended', revealInvitation, { once: true })
    video.addEventListener('error', revealInvitation, { once: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('keydown', handleKeydown)

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
