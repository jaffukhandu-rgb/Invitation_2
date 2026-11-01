(() => {
  const PHOTOS = [
    '/assets/wedding-photos/bg-story.jpg',
    '/assets/wedding-photos/bg-gallery.jpg',
    '/assets/wedding-photos/bg-ending.jpg'
  ]
  const CHANGE_EVERY = 2000

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
            }
            .taha-gallery-slot{
              position:relative!important;
              aspect-ratio:3/4!important;
              min-width:0!important;
              overflow:hidden!important;
              background:rgba(245,238,227,.055)!important;
              border:1px solid rgba(199,164,106,.22)!important;
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
              opacity:0!important;
              transition:opacity .65s ease!important;
              will-change:opacity!important;
            }
            .taha-gallery-slot img.is-active{opacity:1!important}
            @media(max-width:640px){
              .gallery-grid{margin-top:28px!important}
              .taha-gallery-loop{gap:6px!important;padding:6px!important}
              .taha-gallery-slot{aspect-ratio:3/4!important}
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
          img.classList.add('is-active')
          slot.appendChild(img)
          loop.appendChild(slot)
          return slot
        })

        grid.appendChild(loop)

        const images = slots.map(slot => slot.querySelector('img'))
        let offset = 0
        let timer = null

        const showNextSet = () => {
          images.forEach((img, slotIndex) => {
            img.classList.remove('is-active')
            const nextPhoto = (slotIndex + offset + 1) % PHOTOS.length
            img.src = PHOTOS[nextPhoto]
            window.requestAnimationFrame(() => img.classList.add('is-active'))
          })
          offset = (offset + 1) % PHOTOS.length
        }

        const start = () => {
          if (timer) return
          timer = window.setInterval(showNextSet, CHANGE_EVERY)
        }

        const stop = () => {
          if (!timer) return
          window.clearInterval(timer)
          timer = null
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
