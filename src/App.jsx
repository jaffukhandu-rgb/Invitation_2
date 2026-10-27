import { useEffect, useRef } from 'react'
import './App.css'

const EVENTS = [
  ['I', 'Nikah', 'Friday · 8 January 2027 · At 9:52 AM', '1st Shabanul Karim 1448H · Venue — At Home', 'Had Solemnised On Dast Mubarak Of His Holiness Dr. Syedna Abu Jafarussadiq Ali Qadar Mufaddal Saifuddin (T.U.S.)'],
  ['II', 'Mehendi', 'Friday · 8 January 2027 · 2:30 PM Onwards', 'Venue — At Fakhri Baug'],
  ['III', 'Ladies Majlis', 'Saturday · 9 January 2027 · From 7:30 PM', '2nd Shabanul Karim 1448H · Venue — At Badri Hall'],
  ['IV', 'Mama Musala & Darees', 'Monday · 11 January 2027 · From 7:30 PM', '4th Shabanul Karim 1448H · Venue — At Evan-e-Fakhri'],
  ['V', 'Procession', 'Tuesday · 12 January 2027 · From 3:45 PM', '5th Shabanul Karim 1448H · Venue — From Home'],
]

const eventsMarkup = () => EVENTS.map(([mark, label, title, detail, note]) => `
  <div class="t-item">
    <span class="t-mark">${mark}</span>
    <div class="t-card">
      <p class="caps" style="margin-bottom:6px;">${label}</p>
      <h3 class="t-name">${title}</h3>
      <p class="t-meta">${detail}</p>
      ${note ? `<p class="t-note">${note}</p>` : ''}
    </div>
  </div>
`).join('')

function applyCardTheme(frame) {
  const doc = frame.contentDocument
  if (!doc) return

  const style = doc.createElement('style')
  style.id = 'taha-munira-card-theme'
  style.textContent = `
    :root{
      --ivory:#F5F0E4!important;--ivory-deep:#E8DECA!important;--paper:#F3EBDD!important;
      --paper-deep:#D9C49A!important;--cream:#FCF8EF!important;--ink:#2B2117!important;
      --ink-soft:#665B4D!important;--gold:#B88A3B!important;--gold-line:#B88A3B!important;
      --gold-light:#D4B46C!important;--gold-pale:#E7D5AA!important;--espresso:#17392B!important;
      --espresso-deep:#0B2117!important;--burgundy:#234B38!important;--burgundy-deep:#102D20!important;
      --text-ivory:rgba(245,240,228,.95)!important;--text-ivory-soft:rgba(245,240,228,.72)!important;
      --glass:rgba(245,240,228,.055)!important;--glass-deep:rgba(245,240,228,.09)!important;
      --glass-border:rgba(212,180,108,.34)!important;
    }
    html,body{scrollbar-width:none!important;-ms-overflow-style:none!important;}
    html::-webkit-scrollbar,body::-webkit-scrollbar{width:0!important;height:0!important;display:none!important;}
    body{background:linear-gradient(180deg,#17392B 0%,#0B2117 100%)!important}
    #intro{background:radial-gradient(circle at 50% 42%,#28533D 0%,#17392B 56%,#0B2117 100%)!important}

    /* The wedding cover is a real full-size hero, not a shrinking header. It stays
       pinned to the viewport while the invitation content scrolls over/after it. */
    #hero{
      position:sticky!important;
      top:0!important;
      z-index:1!important;
      min-height:100svh!important;
      height:100svh!important;
      overflow:hidden!important;
    }
    #hero .hero-main-cover{z-index:1!important;}
    #hero .hero-main-cover-content{z-index:4!important;}
    #tm-mini-cover{display:none!important;}
    #story,#events,#countdown,#venue,#gallery,#rsvp,#ending{
      position:relative!important;
      z-index:2!important;
    }

    .hero{background:#17392B!important}
    .hero-video{
      transform:scale(1.04);
      transform-origin:center center;
      animation:tmHeroKenBurns 12s ease-in-out infinite alternate;
      will-change:transform;
    }
    @keyframes tmHeroKenBurns{
      from{transform:scale(1.04) translate3d(0,0,0)}
      to{transform:scale(1.10) translate3d(0,-.8%,0)}
    }
    .hero-overlay{background:linear-gradient(180deg,rgba(9,30,20,.25),rgba(9,30,20,.84))!important}
    .hero-date,.hero-tagline,.ending-date{color:var(--gold-light)!important}
    #nav-trigger,#music-toggle{background:#FCF8EF!important;border-color:rgba(184,138,59,.45)!important}
    #nav-trigger span{background:var(--gold)!important}
    .t-card,.venue-card{border-color:rgba(212,180,108,.34)!important;background:rgba(245,240,228,.045)!important}
    .t-card:hover,.venue-card:hover{background:rgba(245,240,228,.08)!important;border-color:rgba(212,180,108,.62)!important}
    .t-note{margin-top:14px;color:rgba(245,240,228,.58);font-size:.82rem;line-height:1.65;font-style:italic}
    .royal-copy,.royal-request{margin:28px auto 0;max-width:48ch;color:var(--text-ivory-soft);line-height:1.8}
    .royal-copy p+p{margin-top:12px}.family-emphasis{color:var(--gold-light);font-family:var(--font-serif);font-size:1.15rem}
    .royal-request{padding-top:18px;border-top:1px solid rgba(212,180,108,.2)}.royal-request .caps{margin-bottom:8px}
    .royal-request p:last-child{color:var(--text-ivory)}
    @media(max-width:640px){.section{padding-left:20px!important;padding-right:20px!important}.t-card{padding:21px 20px!important}.venue-grid{gap:16px!important}.venue-card{padding:24px 21px!important}}
  `
  doc.head.appendChild(style)

  const setText = (selector, text) => {
    const el = doc.querySelector(selector)
    if (el) el.textContent = text
  }

  setText('.hero-date', '8 — 12 · January · 2027')
  setText('.hero-tagline', 'With the blessings of our families, we invite you to celebrate our wedding festivities.')
  setText('.ending-date', '12 · 01 · 2027')

  const story = doc.getElementById('story')
  if (story) story.innerHTML = `
    <div class="section-bg-media"></div><div class="section-bg-overlay"></div>
    <div class="royal-divider"><span class="rd-line"></span><span class="rd-dot"></span><span class="rd-line right"></span></div>
    <div class="section-inner">
      <p class="caps eyebrow reveal in">In The Name Of Allah</p>
      <p class="script-heading reveal in">Alhamdulillah</p>
      <h2 class="section-title reveal in">Taha Weds Munira</h2>
      <p class="section-lede reveal in">In The Name Of Allah Ta'ala, Wasila-e-panjaitan Paak {A.S.}, Janabe Abbas Syedna Mohammed Burhanuddin Saheb (R.A.) &amp; Kind Benediction Of His Holiness Syedna Aali Qadar Mufaddal Saifuddin (T.U.S.)</p>
      <div class="royal-copy reveal in">
        <p>Mrs. Sharfia Ben &amp; Late Mr. Abbas Bhai Khandu wala</p>
        <p>Requests The Pleasure Of Your Gracious Presence On The Auspicious Occasion Of The Wedding Ceremony Of Her Grand Son</p>
        <p class="family-emphasis">S O Mrs. Munira &amp; Mr. Kutbuddin Khandu wala</p>
      </div>
      <div class="royal-request reveal in"><p class="caps">Special Request</p><p>Hussain &amp; Mufaddal Tabran<br>Hussaina Lulia<br>Hussaina Gheewala</p></div>
      <div class="royal-request reveal in"><p class="caps">With Best Compliments From</p><p>Jiji &amp; Fuwwai<br>Masi &amp; Masaji<br>Khanduwala &amp; Lulia Family</p></div>
    </div>`

  const events = doc.getElementById('events')
  if (events) events.innerHTML = `
    <div class="section-bg-media"></div><div class="section-bg-overlay"></div>
    <div class="royal-divider"><span class="rd-line"></span><span class="rd-dot"></span><span class="rd-line right"></span></div>
    <div class="section-inner">
      <p class="caps eyebrow reveal in">Programme Insha Allah</p>
      <p class="script-heading reveal in">Our Wedding Festivities</p>
      <h2 class="section-title reveal in">Days of Celebration</h2>
      <p class="section-lede reveal in">With the blessings of our families, we invite you to join us for these special occasions.</p>
      <div class="timeline reveal in">${eventsMarkup()}</div>
    </div>`

  const venue = doc.getElementById('venue')
  if (venue) venue.innerHTML = `
    <div class="section-bg-media"></div><div class="section-bg-overlay"></div>
    <div class="royal-divider"><span class="rd-line"></span><span class="rd-dot"></span><span class="rd-line right"></span></div>
    <div class="section-inner">
      <p class="caps eyebrow reveal in">Our Wedding</p><p class="script-heading reveal in">Save The Date</p>
      <h2 class="section-title reveal in">Taha &amp; Munira</h2>
      <p class="section-lede reveal in">8 — 12 January 2027 · Banswara (Raj.)</p>
      <div class="venue-grid reveal in">
        <div class="venue-card"><p class="venue-city">Nikah</p><h3 class="venue-name">At Home</h3><p class="venue-addr">8 January · 9:52 AM</p></div>
        <div class="venue-card"><p class="venue-city">Mehendi</p><h3 class="venue-name">At Fakhri Baug</h3><p class="venue-addr">8 January · 2:30 PM Onwards</p></div>
        <div class="venue-card"><p class="venue-city">Ladies Majlis</p><h3 class="venue-name">At Badri Hall</h3><p class="venue-addr">9 January · From 7:30 PM</p></div>
        <div class="venue-card"><p class="venue-city">Mama Musala &amp; Darees</p><h3 class="venue-name">At Evan-e-Fakhri</h3><p class="venue-addr">11 January · From 7:30 PM</p></div>
        <div class="venue-card"><p class="venue-city">Procession</p><h3 class="venue-name">From Home</h3><p class="venue-addr">12 January · From 3:45 PM</p></div>
      </div>
    </div>`

  const countdown = doc.getElementById('countdown')
  if (countdown) countdown.innerHTML = `
    <div class="section-bg-media"></div><div class="section-bg-overlay"></div>
    <div class="royal-divider"><span class="rd-line"></span><span class="rd-dot"></span><span class="rd-line right"></span></div>
    <div class="section-inner">
      <p class="caps eyebrow reveal in">The Celebrations Begin In</p>
      <p class="script-heading reveal in">Almost There</p>
      <h2 class="section-title reveal in">Counting the Days</h2>
      <p class="section-lede reveal in">The festivities begin with Mehendi on 8th January at Fakhri Baug.</p>
      <div class="cd-row reveal in">
        <div class="cd-unit"><span class="cd-num" id="cd-days">00</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">·</span>
        <div class="cd-unit"><span class="cd-num" id="cd-hours">00</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">·</span>
        <div class="cd-unit"><span class="cd-num" id="cd-mins">00</span><span class="cd-label">Minutes</span></div>
        <span class="cd-sep">·</span>
        <div class="cd-unit"><span class="cd-num" id="cd-secs">00</span><span class="cd-label">Seconds</span></div>
      </div>
      <p class="countdown-note reveal in">Until we gather at Fakhri Baug for Mehendi.</p>
    </div>`

  const target = new Date('2027-01-08T14:30:00+05:30').getTime()
  const updateCountdown = () => {
    const total = Math.max(0, Math.floor((target - Date.now()) / 1000))
    const values = {
      '#cd-days': Math.floor(total / 86400),
      '#cd-hours': Math.floor((total % 86400) / 3600),
      '#cd-mins': Math.floor((total % 3600) / 60),
      '#cd-secs': total % 60,
    }
    Object.entries(values).forEach(([selector, value]) => setText(selector, String(value).padStart(2, '0')))
  }
  updateCountdown()
  const countdownTimer = window.setInterval(updateCountdown, 1000)

  try { frame.contentWindow.localStorage.removeItem('wedding_intro_seen_v8') } catch {}

  return () => window.clearInterval(countdownTimer)
}

export default function App() {
  const iframeRef = useRef(null)
  const cleanupRef = useRef(null)

  useEffect(() => {
    try { localStorage.removeItem('wedding_intro_seen_v8') } catch {}
    return () => cleanupRef.current?.()
  }, [])

  const handleLoad = () => {
    cleanupRef.current?.()
    cleanupRef.current = applyCardTheme(iframeRef.current)
  }

  return (
    <main className="invitation-frame">
      <iframe
        ref={iframeRef}
        title="Taha & Munira Wedding Invitation"
        src="/legacy.html"
        className="invitation-iframe"
        onLoad={handleLoad}
      />
    </main>
  )
}
