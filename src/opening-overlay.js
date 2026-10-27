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

    const syncHeroCover = () => {
      try {
        const doc = iframe.contentDocument
        const hero = doc?.getElementById('hero')
        if (!doc || !hero) return

        if (!doc.getElementById('taha-munira-main-cover-style')) {
          const style = doc.createElement('style')
          style.id = 'taha-munira-main-cover-style'
          style.textContent = `
            /* The royal cover is one normal first-page section. It does not shrink or stick. */
            .hero{
              position:relative!important;
              width:100%!important;
              height:72svh!important;
              min-height:520px!important;
              max-height:760px!important;
              display:flex!important;
              align-items:center!important;
              justify-content:center!important;
              overflow:hidden!important;
              padding:0!important;
              background:#0B2117!important;
            }
            .hero-main-cover{
              position:absolute!important;
              inset:0!important;
              width:100%!important;
              height:100%!important;
              display:flex!important;
              align-items:center!important;
              justify-content:center!important;
              overflow:hidden!important;
              background:#0B2117!important;
            }
            .hero-main-cover-video{
              position:absolute!important;
              inset:-2%!important;
              width:104%!important;
              height:104%!important;
              object-fit:cover!important;
              object-position:center center!important;
              filter:blur(1.5px) brightness(.48) saturate(.82)!important;
              transform:scale(1.015)!important;
              opacity:.96!important;
            }
            .hero-main-cover-wash{
              position:absolute!important;
              inset:0!important;
              z-index:1!important;
              background:
                linear-gradient(180deg,rgba(7,28,18,.30),rgba(7,28,18,.48) 42%,rgba(5,24,15,.78)),
                radial-gradient(circle at 50% 42%,rgba(199,164,106,.11),transparent 50%)!important;
            }
            .hero-main-cover-frame{
              position:absolute!important;
              inset:10px!important;
              z-index:3!important;
              border:1px solid rgba(212,180,108,.44)!important;
              pointer-events:none!important;
              box-shadow:inset 0 0 0 1px rgba(212,180,108,.08),0 0 35px rgba(0,0,0,.18)!important;
            }
            .hero-main-cover-frame:before,.hero-main-cover-frame:after{
              content:"";position:absolute;width:48px;height:48px;border-color:rgba(212,180,108,.7);border-style:solid;
            }
            .hero-main-cover-frame:before{top:0;left:0;border-width:1px 0 0 1px}
            .hero-main-cover-frame:after{right:0;bottom:0;border-width:0 1px 1px 0}
            .hero-main-cover-corner-tr,.hero-main-cover-corner-bl{
              position:absolute;width:48px;height:48px;border-color:rgba(212,180,108,.7);border-style:solid;
            }
            .hero-main-cover-corner-tr{top:0;right:0;border-width:1px 1px 0 0}
            .hero-main-cover-corner-bl{left:0;bottom:0;border-width:0 0 1px 1px}
            .hero-main-cover-content{
              position:relative;z-index:4;width:min(90%,430px);text-align:center;padding:28px 20px 30px;color:#F5F0E4;
              display:flex;flex-direction:column;align-items:center;text-shadow:0 2px 20px rgba(0,0,0,.38);
            }
            .hero-main-cover-bismillah{font-family:var(--font-serif);font-size:clamp(.9rem,3.8vw,1.15rem);color:#D4B46C;margin-bottom:16px;direction:rtl}
            .hero-main-cover-eyebrow{font-family:var(--font-caps);font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:rgba(212,180,108,.9);margin-bottom:10px}
            .hero-main-cover-script{font-family:var(--font-script);font-size:clamp(1.45rem,5.5vw,2rem);line-height:1;color:#D4B46C;margin-bottom:0}
            .hero-main-cover-names{font-family:var(--font-serif);font-weight:400;font-size:clamp(3.6rem,15vw,6rem);line-height:.78;letter-spacing:-.035em;color:#F5F0E4;display:flex;flex-direction:column;align-items:center;margin:0}
            .hero-main-cover-names i{font-family:var(--font-script);font-style:normal;font-size:.40em;line-height:1.2;color:#D4B46C}
            .hero-main-cover-date{font-family:var(--font-caps);font-size:8px;letter-spacing:.26em;color:#D4B46C;margin-top:18px;text-transform:uppercase}
            .hero-main-cover-divider{display:flex;align-items:center;gap:10px;margin-top:16px}
            .hero-main-cover-divider span{width:38px;height:1px;background:linear-gradient(90deg,transparent,rgba(212,180,108,.72))}
            .hero-main-cover-divider span:last-child{background:linear-gradient(90deg,rgba(212,180,108,.72),transparent)}
            .hero-main-cover-divider b{font-size:8px;color:#D4B46C;font-weight:400}
            .hero-main-cover-cue{margin-top:25px;font-family:var(--font-caps);font-size:7px;letter-spacing:.30em;color:rgba(245,240,228,.68);display:flex;flex-direction:column;align-items:center;gap:7px}
            .hero-main-cover-cue:after{content:"";width:1px;height:22px;background:linear-gradient(180deg,rgba(212,180,108,.8),transparent)}
            @media(max-width:640px){
              .hero{height:72svh!important;min-height:500px!important;max-height:none!important}
              .hero-main-cover-frame{inset:9px!important}
              .hero-main-cover-content{padding:24px 18px 28px!important}
              .hero-main-cover-bismillah{margin-bottom:13px!important}
              .hero-main-cover-eyebrow{margin-bottom:8px!important}
              .hero-main-cover-date{margin-top:16px!important}
              .hero-main-cover-divider{margin-top:14px!important}
              .hero-main-cover-cue{margin-top:21px!important}
            }
          `
          doc.head.appendChild(style)
        }

        hero.innerHTML = `
          <div class="hero-main-cover">
            <video class="hero-main-cover-video" muted playsinline webkit-playsinline preload="auto" aria-hidden="true">
              <source src="/assets/opening-video.mp4" type="video/mp4">
            </video>
            <div class="hero-main-cover-wash"></div>
            <div class="hero-main-cover-frame">
              <span class="hero-main-cover-corner-tr"></span>
              <span class="hero-main-cover-corner-bl"></span>
            </div>
            <div class="hero-main-cover-content">
              <p class="hero-main-cover-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <p class="hero-main-cover-eyebrow">Together With Their Families</p>
              <p class="hero-main-cover-script">The wedding of</p>
              <h1 class="hero-main-cover-names"><span>Taha</span><i>&amp;</i><span>Munira</span></h1>
              <p class="hero-main-cover-date">8 — 12 · January · 2027</p>
              <div class="hero-main-cover-divider" aria-hidden="true"><span></span><b>✦</b><span></span></div>
              <p class="hero-main-cover-cue">SCROLL TO DISCOVER</p>
            </div>
          </div>
        `

        const coverVideo = hero.querySelector('.hero-main-cover-video')
        if (!coverVideo) return

        const freezeLastFrame = () => {
          if (!Number.isFinite(coverVideo.duration) || coverVideo.duration <= 0) return
          try {
            coverVideo.currentTime = Math.max(0, coverVideo.duration - 0.08)
            coverVideo.pause()
          } catch {}
        }

        if (coverVideo.readyState >= 1) freezeLastFrame()
        else coverVideo.addEventListener('loadedmetadata', freezeLastFrame, { once: true })
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

    const handleTouchStart = (event) => { touchStartY = event.touches[0]?.clientY ?? null }

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
      if (['ArrowDown','PageDown',' ','Enter'].includes(event.key)) {
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
      syncHeroCover()
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
      window.setTimeout(() => overlay.remove(), 1250)
    }

    video.addEventListener('ended', revealInvitation, { once:true })
    video.addEventListener('error', revealInvitation, { once:true })
    window.addEventListener('wheel', handleWheel, { passive:false })
    window.addEventListener('touchstart', handleTouchStart, { passive:true })
    window.addEventListener('touchmove', handleTouchMove, { passive:false })
    window.addEventListener('keydown', handleKeydown)

    const playVideo = () => video.play().catch(() => {})
    if (video.readyState >= 2) playVideo()
    else video.addEventListener('canplay', playVideo, { once:true })

    return true
  }

  const start = () => {
    if (init()) return
    const observer = new MutationObserver(() => {
      if (init()) observer.disconnect()
    })
    observer.observe(document.getElementById('root') || document.body, { childList:true, subtree:true })
    window.setTimeout(() => observer.disconnect(), 10000)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true })
  else start()
})()