(() => {
  const GLASS_STYLE_ID = 'taha-munira-cover-glass-style'

  const apply = (doc) => {
    if (!doc?.head || !doc?.querySelector('.hero-main-cover')) return false
    if (doc.getElementById(GLASS_STYLE_ID)) return true

    const style = doc.createElement('style')
    style.id = GLASS_STYLE_ID
    style.textContent = `
      .hero-main-cover-video{
        filter:brightness(.68) saturate(1.06) contrast(1.04)!important;
        opacity:1!important;
        transform:scale(1.015)!important;
      }

      .hero-main-cover-wash{
        background:
          linear-gradient(180deg,rgba(5,24,15,.14),rgba(5,24,15,.26) 48%,rgba(5,24,15,.42)),
          radial-gradient(circle at 50% 42%,rgba(212,180,108,.08),transparent 56%)!important;
      }

      .hero-main-cover-content{
        width:min(86%,430px)!important;
        padding:24px 22px 26px!important;
        border:1px solid rgba(245,240,228,.18)!important;
        border-radius:18px!important;
        background:linear-gradient(145deg,rgba(245,240,228,.12),rgba(20,57,43,.20))!important;
        backdrop-filter:blur(8px) saturate(1.12)!important;
        -webkit-backdrop-filter:blur(8px) saturate(1.12)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 0 32px rgba(245,240,228,.035),0 18px 50px rgba(0,0,0,.22)!important;
        text-shadow:0 2px 16px rgba(0,0,0,.42)!important;
      }

      .hero-main-cover-content:before{
        content:"";
        position:absolute;
        inset:1px;
        border-radius:17px;
        pointer-events:none;
        background:linear-gradient(115deg,rgba(255,255,255,.10),transparent 28%,transparent 72%,rgba(212,180,108,.055));
        opacity:.7;
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
          width:min(84%,360px)!important;
          padding:20px 16px 22px!important;
          border-radius:16px!important;
          backdrop-filter:blur(7px) saturate(1.08)!important;
          -webkit-backdrop-filter:blur(7px) saturate(1.08)!important;
        }
        .hero-main-cover-content:before{border-radius:15px}
      }

      @media(prefers-reduced-motion:reduce){
        .hero-main-cover-video{transform:none!important}
      }
    `
    doc.head.appendChild(style)
    return true
  }

  const watch = () => {
    const iframe = document.querySelector('.invitation-iframe')
    if (!iframe) return false

    const tryApply = () => {
      try {
        const doc = iframe.contentDocument
        return apply(doc)
      } catch {
        return false
      }
    }

    iframe.addEventListener('load', () => {
      tryApply()
      const doc = iframe.contentDocument
      if (!doc?.body) return
      const observer = new MutationObserver(() => {
        if (tryApply()) observer.disconnect()
      })
      observer.observe(doc.body, { childList:true, subtree:true })
      window.setTimeout(() => observer.disconnect(), 10000)
    })

    tryApply()
    return true
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once:true })
  } else if (!watch()) {
    const observer = new MutationObserver(() => {
      if (watch()) observer.disconnect()
    })
    observer.observe(document.getElementById('root') || document.body, { childList:true, subtree:true })
    window.setTimeout(() => observer.disconnect(), 10000)
  }
})()
