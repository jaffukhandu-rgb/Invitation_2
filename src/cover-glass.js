(() => {
  const GLASS_STYLE_ID = 'taha-munira-cover-glass-style'

  const apply = (doc) => {
    if (!doc?.head) return false
    const heroCover = doc.querySelector('.hero-main-cover')
    if (!heroCover) return false

    if (!doc.getElementById(GLASS_STYLE_ID)) {
      const style = doc.createElement('style')
      style.id = GLASS_STYLE_ID
      style.textContent = `
        .hero-main-cover-video{
          filter:brightness(.78) saturate(1.08) contrast(1.05)!important;
          opacity:1!important;
          transform:scale(1.015)!important;
        }

        .hero-main-cover-wash{
          background:
            linear-gradient(180deg,rgba(5,24,15,.10),rgba(5,24,15,.18) 48%,rgba(5,24,15,.30)),
            radial-gradient(circle at 50% 42%,rgba(212,180,108,.07),transparent 56%)!important;
        }

        .hero-main-cover-content{
          position:relative!important;
          width:min(82%,420px)!important;
          padding:25px 22px 27px!important;
          border:1px solid rgba(245,240,228,.30)!important;
          border-radius:20px!important;
          background:linear-gradient(145deg,rgba(245,240,228,.15),rgba(11,33,23,.20))!important;
          backdrop-filter:blur(10px) saturate(1.18)!important;
          -webkit-backdrop-filter:blur(10px) saturate(1.18)!important;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.20),inset 0 0 34px rgba(245,240,228,.045),0 18px 50px rgba(0,0,0,.20)!important;
          text-shadow:0 2px 16px rgba(0,0,0,.40)!important;
        }

        .hero-main-cover-content:before{
          content:"";
          position:absolute;
          inset:1px;
          border-radius:19px;
          pointer-events:none;
          background:linear-gradient(115deg,rgba(255,255,255,.12),transparent 30%,transparent 70%,rgba(212,180,108,.07));
          opacity:.8;
        }

        .hero-main-cover-bismillah,
        .hero-main-cover-eyebrow,
        .hero-main-cover-script,
        .hero-main-cover-names,
        .hero-main-cover-date,
        .hero-main-cover-divider,
        .hero-main-cover-cue{
          position:relative!important;
          z-index:1!important;
        }

        @media(max-width:640px){
          .hero-main-cover-content{
            width:min(82%,350px)!important;
            padding:20px 16px 22px!important;
            border-radius:17px!important;
            backdrop-filter:blur(8px) saturate(1.12)!important;
            -webkit-backdrop-filter:blur(8px) saturate(1.12)!important;
          }
          .hero-main-cover-content:before{border-radius:16px}
        }

        @media(prefers-reduced-motion:reduce){
          .hero-main-cover-video{transform:none!important}
        }
      `
      doc.head.appendChild(style)
    }

    return true
  }

  const bindIframe = (iframe) => {
    if (!iframe || iframe.dataset.coverGlassBound === 'true') return
    iframe.dataset.coverGlassBound = 'true'

    const tryApply = () => {
      try {
        return apply(iframe.contentDocument)
      } catch {
        return false
      }
    }

    const observeDocument = () => {
      try {
        const doc = iframe.contentDocument
        if (!doc?.body) return
        tryApply()
        const observer = new MutationObserver(() => {
          if (tryApply()) observer.disconnect()
        })
        observer.observe(doc.body, { childList:true, subtree:true })
        window.setTimeout(() => observer.disconnect(), 15000)
      } catch {}
    }

    iframe.addEventListener('load', observeDocument)
    observeDocument()
  }

  const watch = () => {
    const root = document.getElementById('root') || document.body
    if (!root) return

    const scan = () => {
      const iframe = document.querySelector('.invitation-iframe')
      if (iframe) bindIframe(iframe)
    }

    scan()
    const observer = new MutationObserver(scan)
    observer.observe(root, { childList:true, subtree:true })
    window.setTimeout(() => observer.disconnect(), 30000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once:true })
  } else {
    watch()
  }
})()
