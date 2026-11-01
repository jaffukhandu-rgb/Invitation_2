(() => {
  const MUSIC_SRC = '/assets/music.mp3'

  const init = () => {
    if (document.getElementById('wedding-music')) return true

    const audio = document.createElement('audio')
    audio.id = 'wedding-music'
    audio.src = MUSIC_SRC
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.42
    audio.setAttribute('aria-hidden', 'true')

    const button = document.createElement('button')
    button.type = 'button'
    button.id = 'wedding-music-toggle'
    button.setAttribute('aria-label', 'Pause wedding music')
    button.setAttribute('aria-pressed', 'true')
    button.innerHTML = '<span aria-hidden="true">♫</span>'

    const style = document.createElement('style')
    style.id = 'wedding-music-style'
    style.textContent = `
      #wedding-music-toggle{
        position:fixed; right:20px; bottom:22px; z-index:1200;
        width:46px; height:46px; border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        background:rgba(255,253,248,.96);
        border:1px solid rgba(184,145,42,.42);
        color:#9B7440;
        box-shadow:0 8px 24px rgba(0,0,0,.18);
        cursor:pointer;
        opacity:0; transform:translateY(8px) scale(.96);
        transition:opacity .5s ease, transform .5s ease, background .25s ease;
      }
      #wedding-music-toggle.show{opacity:1; transform:translateY(0) scale(1)}
      #wedding-music-toggle:active{transform:scale(.92)}
      #wedding-music-toggle span{font-size:19px; line-height:1}
      #wedding-music-toggle.is-paused{background:rgba(255,253,248,.82)}
      @media(max-width:640px){#wedding-music-toggle{right:14px;bottom:14px;width:42px;height:42px}}
      @media(prefers-reduced-motion:reduce){#wedding-music-toggle{transition:none}}
    `

    document.head.appendChild(style)
    document.body.append(audio, button)

    const syncButton = () => {
      const playing = !audio.paused
      button.classList.toggle('is-paused', !playing)
      button.setAttribute('aria-label', playing ? 'Pause wedding music' : 'Play wedding music')
      button.setAttribute('aria-pressed', String(playing))
      button.innerHTML = `<span aria-hidden="true">${playing ? '♫' : '♪'}</span>`
    }

    button.addEventListener('click', async () => {
      if (audio.paused) {
        try { await audio.play() } catch {}
      } else {
        audio.pause()
      }
      syncButton()
    })

    window.startWeddingMusic = async () => {
      try {
        await audio.play()
        button.classList.add('show')
        syncButton()
        return true
      } catch {
        button.classList.add('show', 'is-paused')
        syncButton()
        return false
      }
    }

    const startAfterInvitationOpens = () => {
      if (document.body.classList.contains('opening-locked')) return
      window.startWeddingMusic?.()
      window.removeEventListener('wheel', startAfterInvitationOpens)
      window.removeEventListener('touchmove', startAfterInvitationOpens)
      window.removeEventListener('keydown', startAfterInvitationOpens)
    }

    window.addEventListener('wheel', startAfterInvitationOpens, { passive: true })
    window.addEventListener('touchmove', startAfterInvitationOpens, { passive: true })
    window.addEventListener('keydown', startAfterInvitationOpens)

    audio.addEventListener('play', syncButton)
    audio.addEventListener('pause', syncButton)
    audio.addEventListener('ended', syncButton)

    return true
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
