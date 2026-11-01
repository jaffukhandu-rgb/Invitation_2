(() => {
  const PHOTOS = [
    '/assets/wedding-photos/bg-story.jpg',
    '/assets/wedding-photos/bg-gallery.jpg',
    '/assets/wedding-photos/bg-ending.jpg'
  ]
  const CHANGE_EVERY = 2000
  const CASCADE_MS = 900

  const installGalleryLoop = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const apply = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc) return false

        const gallerySection = doc.getElementById('gallery')
        const grid = gallerySection?.querySelector('.gallery-grid')
        if (!gallerySection || !grid) return false
        if (grid.dataset.tahaGalleryLoop === 'true') return true

        grid.dataset.tahaGalleryLoop = 'true'
        grid.innerHTML = ''

        const styleId = 'taha-gallery-loop-style'
        if (!doc.getElementById(styleId)) {
          const style = doc.createElement('style')
          style.id = styleId
          style.textContent = `
            .gallery .section-bg-media,
            .gallery .section-bg-overlay{display:none!important}
            .gallery .section-inner{width:100%!important;max-width:600px!important}
            .gallery-grid{display:block!important;width:100%!important;margin:34px auto 0!important}
            .taha-gallery-loop{
              position:relative!important;
              display:grid!important;
              grid-template-columns:repeat(3,minmax(0,1fr))!important;
              gap:8px!important;
              width:100%!important;
              max-width:560px!important;
              margin:0 auto!important;
              padding:8px!important;
              overflow:hidden!important;
              background:#102a20!important;
              border:1px solid var(--glass-border)!important;
              box-shadow:0 18px 40px rgba(0,0,0,.28)!important;
              perspective:900px!important;
            }
            .taha-gallery-slot{
              position:relative!important;
              aspect-ratio:3/4!important;
              min-width:0!important;
              overflow:hidden!important;
              background:rgba(245,238,227,.055)!important;
              border:1px solid rgba(199,164,106,.22)!important;
              transform:translate3d(0,0,0) scale(1) rotate(0deg)!important;
              transform-origin:center center!important;
              transition:
                transform .42s cubic-bezier(.22,.8,.25,1),
                box-shadow .42s ease,
                z-index 0s linear!important;
              will-change:transform!important;
            }
            .taha-gallery-slot img{
              position:absolute!important;
              inset:0!important;
              width:100%!important;
              height:100%!important;
              display:block!important;
              object-fit:contain!important;
              object-position:center!important;
              background:#102a20!important;
            }
            .taha-gallery-slot:nth-child(1){z-index:1!important}
            .taha-gallery-slot:nth-child(2){z-index:3!important}
            .taha-gallery-slot:nth-child(3){z-index:2!important}

            /* Physical photo-card cascade: each card briefly lifts, shifts and settles. */
            .taha-gallery-loop.is-cascading .taha-gallery-slot:nth-child(1){
              transform:translate3d(10px,-7px,0) rotate(1.8deg) scale(.98)!important;
              box-shadow:12px 16px 24px rgba(0,0,0,.28)!important;
              z-index:2!important;
            }
            .taha-gallery-loop.is-cascading .taha-gallery-slot:nth-child(2){
              transform:translate3d(0,-13px,0) rotate(-1.2deg) scale(1.045)!important;
              box-shadow:0 20px 30px rgba(0,0,0,.38)!important;
              z-index:4!important;
              transition-delay:.10s!important;
            }
            .taha-gallery-loop.is-cascading .taha-gallery-slot:nth-child(3){
              transform:translate3d(-10px,-7px,0) rotate(1.4deg) scale(.98)!important;
              box-shadow:-12px 16px 24px rgba(0,0,0,.28)!important;
              z-index:3!important;
              transition-delay:.20s!important;
            }

            @media(max-width:640px){
              .gallery-grid{margin-top:28px!important}
              .taha-gallery-loop{gap:6px!important;padding:6px!important}
              .taha-gallery-slot{aspect-ratio:3/4!important}
              .taha-gallery-loop.is-cascading .taha-gallery-slot:nth-child(1){transform:translate3d(5px,-5px,0) rotate(1.2deg) scale(.985)!important}
              .taha-gallery-loop.is-cascading .taha-gallery-slot:nth-child(2){transform:translate3d(0,-9px,0) rotate(-.9deg) scale(1.035)!important}
              .taha-gallery-loop.is-cascading .taha-gallery-slot:nth-child(3){transform:translate3d(-5px,-5px,0) rotate(1deg) scale(.985)!important}
            }

            @media(prefers-reduced-motion:reduce){
              .taha-gallery-slot{transition:none!important}
            }
          `
          doc.head.appendChild(style)
        }

        const loop = doc.createElement('div')
        loop.className = 'taha-gallery-loop'
        loop.setAttribute('aria-label', 'Wedding memories')

        const slots = PHOTOS.map((src, index) => {
          const slot = doc.createElement('div')
          slot.className = 'taha-gallery-slot'
          const img = doc.createElement('img')
          img.src = src
          img.alt = 'Wedding memory'
          img.loading = index === 0 ? 'eager' : 'lazy'
          img.decoding = 'async'
          slot.appendChild(img)
          loop.appendChild(slot)
          return slot
        })

        grid.appendChild(loop)

        const images = slots.map(slot => slot.querySelector('img'))
        let offset = 0
        let timer = null
        let animationTimer = null

        const showNextSet = () => {
          loop.classList.add('is-cascading')

          window.clearTimeout(animationTimer)
          animationTimer = window.setTimeout(() => {
            offset = (offset + 1) % PHOTOS.length

            images.forEach((img, slotIndex) => {
              const nextPhoto = (slotIndex + offset) % PHOTOS.length
              img.src = PHOTOS[nextPhoto]
            })

            loop.classList.remove('is-cascading')
          }, CASCADE_MS)
        }

        const start = () => {
          if (timer || images.length < 2) return
          timer = window.setInterval(showNextSet, CHANGE_EVERY)
        }

        const stop = () => {
          if (timer) {
            window.clearInterval(timer)
            timer = null
          }
          window.clearTimeout(animationTimer)
          animationTimer = null
          loop.classList.remove('is-cascading')
        }

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) stop()
          else start()
        })

        start()
        return true
      } catch {
        return false
      }
    }

    if (apply()) return true
    iframe.addEventListener('load', apply, { once: true })

    let attempts = 0
    const poll = window.setInterval(() => {
      if (apply() || ++attempts > 40) window.clearInterval(poll)
    }, 250)

    return true
  }

  const start = () => {
    if (installGalleryLoop()) return
    const observer = new MutationObserver(() => {
      if (installGalleryLoop()) observer.disconnect()
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
