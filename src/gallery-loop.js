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
              width:100%!important;
              max-width:560px!important;
              aspect-ratio:4/3!important;
              margin:0 auto!important;
              overflow:hidden!important;
              background:#102a20!important;
              border:1px solid var(--glass-border)!important;
              box-shadow:0 18px 40px rgba(0,0,0,.28)!important;
            }
            .taha-gallery-loop img{
              position:absolute!important;
              inset:0!important;
              width:100%!important;
              height:100%!important;
              object-fit:cover!important;
              object-position:center!important;
              opacity:0!important;
              transition:opacity .65s ease!important;
              will-change:opacity!important;
            }
            .taha-gallery-loop img.is-active{opacity:1!important}
            .taha-gallery-loop::after{
              content:"";
              position:absolute;
              inset:0;
              pointer-events:none;
              background:linear-gradient(180deg,rgba(5,25,17,.08),rgba(5,25,17,.28) 55%,rgba(5,25,17,.58));
            }
            @media(max-width:640px){
              .gallery-grid{margin-top:28px!important}
              .taha-gallery-loop{width:100%!important;aspect-ratio:4/3!important;max-height:330px!important}
            }
          `
          doc.head.appendChild(style)
        }

        const loop = doc.createElement('div')
        loop.className = 'taha-gallery-loop'
        loop.setAttribute('aria-label', 'Wedding memories')

        PHOTOS.forEach((src, index) => {
          const img = doc.createElement('img')
          img.src = src
          img.alt = 'Wedding memory'
          img.loading = index === 0 ? 'eager' : 'lazy'
          img.decoding = 'async'
          if (index === 0) img.classList.add('is-active')
          loop.appendChild(img)
        })

        grid.appendChild(loop)

        const images = [...loop.querySelectorAll('img')]
        let active = 0
        let timer = null

        const showNext = () => {
          images[active]?.classList.remove('is-active')
          active = (active + 1) % images.length
          images[active]?.classList.add('is-active')
        }

        const start = () => {
          if (timer || images.length < 2) return
          timer = window.setInterval(showNext, CHANGE_EVERY)
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
