(() => {
  const PHOTOS = [
    '/assets/wedding-photos/bg-story.jpg',
    '/assets/wedding-photos/bg-gallery.jpg',
    '/assets/wedding-photos/bg-ending.jpg'
  ]
  const CHANGE_EVERY = 2000
  const FADE_MS = 750

  const installGalleryLoop = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const apply = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc) return false

        const sections = [...doc.querySelectorAll('section, .section')]
        const gallerySection = sections.find(section =>
          /celebrations\s+unfold/i.test(section.textContent || '')
        )
        if (!gallerySection) return false

        const media = gallerySection.querySelector('.section-bg-media')
        if (!media) return false
        if (media.dataset.tahaGalleryLoop === 'true') return true

        media.dataset.tahaGalleryLoop = 'true'
        media.innerHTML = ''

        const styleId = 'taha-gallery-loop-style'
        if (!doc.getElementById(styleId)) {
          const style = doc.createElement('style')
          style.id = styleId
          style.textContent = `
            .taha-gallery-loop{
              position:absolute!important;
              inset:0!important;
              width:100%!important;
              height:100%!important;
              overflow:hidden!important;
              background:#102a20!important;
            }
            .taha-gallery-loop img{
              position:absolute!important;
              inset:0!important;
              width:100%!important;
              height:100%!important;
              object-fit:cover!important;
              object-position:center!important;
              opacity:0!important;
              transform:scale(1.015)!important;
              transition:opacity .75s ease,transform 3.8s ease!important;
              will-change:opacity,transform!important;
            }
            .taha-gallery-loop img.is-active{
              opacity:1!important;
              transform:scale(1)!important;
            }
            .taha-gallery-loop::after{
              content:"";
              position:absolute;
              inset:0;
              pointer-events:none;
              background:linear-gradient(180deg,rgba(5,25,17,.18),rgba(5,25,17,.30) 55%,rgba(5,25,17,.72));
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
          img.alt = ''
          img.loading = index === 0 ? 'eager' : 'lazy'
          img.decoding = 'async'
          img.setAttribute('aria-hidden', 'true')
          if (index === 0) img.classList.add('is-active')
          loop.appendChild(img)
        })

        media.appendChild(loop)

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

        loop.addEventListener('mouseenter', stop)
        loop.addEventListener('mouseleave', start)
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) stop()
          else start()
        })

        images[0]?.addEventListener('load', start, { once: true })
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
