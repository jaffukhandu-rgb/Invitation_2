(() => {
  const init = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const startReplay = () => {
      const existing = document.querySelector('.replay-opening-overlay')
      if (existing) return

      const frameDoc = iframe.contentDocument
      if (!frameDoc) return

      const overlay = document.createElement('div')
      overlay.className = 'replay-opening-overlay'
      overlay.setAttribute('aria-label', 'Replaying Taha and Munira wedding invitation')
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '2147483000',
        background: '#08170f',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: '1',
        transition: 'opacity 900ms ease',
      })

      const video = document.createElement('video')
      video.src = '/assets/opening-video.mp4'
      video.muted = true
      video.autoplay = true
      video.playsInline = true
      video.preload = 'auto'
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')
      Object.assign(video.style, {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      })

      overlay.appendChild(video)
      document.body.appendChild(overlay)
      document.body.classList.add('opening-locked')
      frameDoc.body.classList.add('locked')

      const finish = () => {
        try { frameDoc.body.classList.remove('locked') } catch {}
        try { iframe.contentWindow?.scrollTo({ top: 0, left: 0, behavior: 'auto' }) } catch {}
        overlay.style.opacity = '0'
        window.setTimeout(() => {
          overlay.remove()
          document.body.classList.remove('opening-locked')
        }, 900)
      }

      video.addEventListener('ended', finish, { once: true })
      video.addEventListener('error', finish, { once: true })
      video.play().catch(finish)
    }

    const handleReplayClick = (event) => {
      const target = event.target instanceof Element ? event.target : null
      const control = target?.closest('button, a, [role="button"]')
      if (!control) return
      const label = `${control.textContent || ''} ${control.getAttribute('aria-label') || ''}`.trim()
      if (!/replay/i.test(label)) return

      event.preventDefault()
      event.stopPropagation()
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation()
      startReplay()
    }

    const attach = () => {
      const doc = iframe.contentDocument
      if (!doc || doc.__tahaReplayFixAttached) return
      doc.__tahaReplayFixAttached = true
      doc.addEventListener('click', handleReplayClick, true)
    }

    iframe.addEventListener('load', attach)
    attach()
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()
})()
