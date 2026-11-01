(() => {
  const initGallery = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const apply = () => {
      try {
        const doc = iframe.contentDocument
        const gallery = doc?.getElementById('gallery')
        const grid = gallery?.querySelector('.gallery-grid')
        if (!doc || !gallery || !grid) return false

        if (!doc.getElementById('taha-munira-gallery-fix-style')) {
          const style = doc.createElement('style')
          style.id = 'taha-munira-gallery-fix-style'
          style.textContent = `
            .gallery .section-bg-media,
            .gallery .section-bg-overlay{display:none!important}
            .gallery .section-inner{width:100%!important;max-width:600px!important}
            .gallery-grid{display:block!important;width:100%!important;margin:34px auto 0!important}
            .gallery-photo-stage{position:relative!important;width:100%!important;max-width:560px!important;margin:0 auto!important;aspect-ratio:4/3!important;overflow:hidden!important;border:1px solid var(--glass-border)!important;background:#10271d!important;box-shadow:0 18px 40px rgba(0,0,0,.28)!important}
            .gallery-photo-stage::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(4,18,12,.04),rgba(4,18,12,.28))!important;z-index:2!important}
            .gallery-photo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;object-fit:cover!important;object-position:center!important;opacity:0!important;transition:opacity .65s ease!important}
            .gallery-photo.is-active{opacity:1!important}
            @media(max-width:640px){
              .gallery-grid{margin-top:28px!important}
              .gallery-photo-stage{width:100%!important;aspect-ratio:4/3!important;max-height:330px!important}
            }
          `
          doc.head.appendChild(style)
        }

        grid.innerHTML = `
          <div class="gallery-photo-stage" aria-label="Wedding memories">
            <img class="gallery-photo is-active" src="assets/wedding-photos/bg-story.jpg" alt="Wedding memory" loading="eager" decoding="async">
            <img class="gallery-photo" src="assets/wedding-photos/bg-gallery.jpg" alt="Wedding memory" loading="lazy" decoding="async">
            <img class="gallery-photo" src="assets/wedding-photos/bg-ending.jpg" alt="Wedding memory" loading="lazy" decoding="async">
          </div>
        `

        const photos = Array.from(grid.querySelectorAll('.gallery-photo'))
        let index = 0
        window.clearInterval(doc.__galleryLoopTimer)
        doc.__galleryLoopTimer = window.setInterval(() => {
          if (!photos.length) return
          photos[index].classList.remove('is-active')
          index = (index + 1) % photos.length
          photos[index].classList.add('is-active')
        }, 2000)

        return true
      } catch {
        return false
      }
    }

    if (apply()) return true
    iframe.addEventListener('load', apply, { once: true })
    window.setTimeout(apply, 300)
    return true
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery, { once: true })
  } else {
    initGallery()
  }
})()
