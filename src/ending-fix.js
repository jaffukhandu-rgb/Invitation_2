(() => {
  const apply = (iframe) => {
    try {
      const doc = iframe.contentDocument
      const ending = doc?.getElementById('ending')
      if (!ending) return false
      if (ending.dataset.tahaEndingFix === 'true') return true

      ending.dataset.tahaEndingFix = 'true'

      const styleId = 'taha-ending-fix-style'
      if (!doc.getElementById(styleId)) {
        const style = doc.createElement('style')
        style.id = styleId
        style.textContent = `
          #ending.taha-ending-fixed{
            min-height:min(92svh,760px)!important;
            display:flex!important;
            flex-direction:column!important;
            align-items:center!important;
            justify-content:center!important;
            overflow:hidden!important;
            isolation:isolate!important;
            background:#0B2117!important;
          }
          #ending.taha-ending-fixed .ending-photo{
            position:absolute!important;
            inset:0!important;
            width:100%!important;
            height:100%!important;
            object-fit:cover!important;
            object-position:center!important;
            z-index:0!important;
            opacity:.72!important;
            filter:saturate(.78) contrast(.96) brightness(.62)!important;
          }
          #ending.taha-ending-fixed .ending-wash{
            position:absolute!important;
            inset:0!important;
            z-index:1!important;
            background:linear-gradient(180deg,rgba(5,25,16,.48),rgba(5,25,16,.72)),radial-gradient(circle at 50% 40%,rgba(199,164,106,.14),transparent 52%)!important;
          }
          #ending.taha-ending-fixed .ending-content{
            position:relative!important;
            z-index:3!important;
            width:min(88%,560px)!important;
            text-align:center!important;
            display:flex!important;
            flex-direction:column!important;
            align-items:center!important;
          }
          #ending.taha-ending-fixed .ending-mono-mark{
            width:72px!important;
            height:72px!important;
            border:1px solid rgba(212,180,108,.58)!important;
            border-radius:50%!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            color:#D4B46C!important;
            font-family:var(--font-serif)!important;
            font-size:22px!important;
            letter-spacing:.08em!important;
            margin-bottom:24px!important;
            background:rgba(11,33,23,.38)!important;
            box-shadow:0 12px 32px rgba(0,0,0,.28)!important;
          }
          #ending.taha-ending-fixed .ending-line{
            color:#F5F0E4!important;
            font-size:clamp(1.2rem,3vw,1.55rem)!important;
            line-height:1.65!important;
            text-shadow:0 3px 18px rgba(0,0,0,.45)!important;
          }
          #ending.taha-ending-fixed .ending-signoff{
            margin-top:24px!important;
            color:#D4B46C!important;
            font-size:11px!important;
            letter-spacing:.22em!important;
            line-height:1.9!important;
          }
          #ending.taha-ending-fixed .ending-date{
            margin-top:14px!important;
            color:#D4B46C!important;
            font-size:10px!important;
            letter-spacing:.3em!important;
          }
          #ending.taha-ending-fixed .replay-link{
            margin-top:28px!important;
            color:rgba(245,240,228,.72)!important;
            border-bottom-color:rgba(212,180,108,.5)!important;
          }
        `
        doc.head.appendChild(style)
      }

      ending.classList.add('taha-ending-fixed')
      ending.innerHTML = `
        <img class="ending-photo" src="/assets/wedding-photos/bg-ending.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <div class="ending-wash" aria-hidden="true"></div>
        <div class="royal-divider"><span class="rd-line"></span><span class="rd-dot"></span><span class="rd-line right"></span></div>
        <div class="ending-content">
          <div class="ending-mono-mark" aria-hidden="true">T&amp;M</div>
          <p class="ending-line">The next chapter<br>begins here.</p>
          <p class="ending-signoff">With love,<br>Taha &amp; Munira</p>
          <p class="ending-date">12 · 01 · 2027</p>
          <button class="replay-link" id="replay" type="button">Replay Invitation</button>
        </div>
      `

      const replay = doc.getElementById('replay')
      replay?.addEventListener('click', () => {
        try { doc.defaultView.localStorage.removeItem('wedding_intro_seen_v8') } catch {}
        doc.defaultView.scrollTo({ top: 0, behavior: 'auto' })
        const intro = doc.getElementById('intro')
        const skip = doc.getElementById('skip-intro')
        const portal = doc.getElementById('portal')
        const hint = doc.getElementById('portal-hint')
        const wash = doc.getElementById('light-wash')
        const hero = doc.getElementById('hero')
        intro?.classList.remove('hidden')
        skip?.classList.remove('hide')
        portal?.classList.remove('fade')
        hint?.classList.remove('hide')
        wash?.classList.remove('wash')
        hero?.classList.remove('play')
        doc.body.classList.add('locked')
      })

      return true
    } catch {
      return false
    }
  }

  const bind = (iframe) => {
    if (!iframe || iframe.dataset.tahaEndingFixBound === 'true') return
    iframe.dataset.tahaEndingFixBound = 'true'

    const tryApply = () => apply(iframe)
    iframe.addEventListener('load', tryApply)

    let attempts = 0
    const poll = window.setInterval(() => {
      if (tryApply() || ++attempts > 40) window.clearInterval(poll)
    }, 250)
  }

  const watch = () => {
    const scan = () => {
      const iframe = document.querySelector('.invitation-iframe')
      if (iframe) bind(iframe)
    }
    scan()
    const observer = new MutationObserver(scan)
    observer.observe(document.getElementById('root') || document.body, { childList:true, subtree:true })
    window.setTimeout(() => observer.disconnect(), 30000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once:true })
  } else {
    watch()
  }
})()
