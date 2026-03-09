import { useEffect, useRef, useState, useCallback } from 'react'
import { PROFILE } from './lib/profile'

// ─── THEME ────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])
  return { dark, toggle: () => setDark(d => !d) }
}

// ─── SCROLL REVEAL ────────────────────────────────────────────
function Reveal({ children, delay = 0, className = 'rev', style = {} }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.transitionDelay = `${delay}s`; el.classList.add('vis') }
    }, { threshold: 0.05 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return <div ref={ref} className={className} style={style}>{children}</div>
}

// ─── COUNTER ──────────────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        let i = 0
        const iv = setInterval(() => {
          i++; const t = i / 55
          setN(Math.round((1 - Math.pow(1 - t, 3)) * end))
          if (i >= 55) clearInterval(iv)
        }, 1400 / 55)
      }
    }, { threshold: 0.5 })
    obs.observe(el); return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>
}

// ─── ACTIVE SECTION ───────────────────────────────────────────
const SECTIONS = ['about','experience','education','projects','skills','publications','contact']

function useActive() {
  const [active, setActive] = useState('about')
  useEffect(() => {
    const fn = () => {
      // Default to 'about' when near the very top
      if (window.scrollY < 80) { setActive('about'); return }
      const threshold = window.innerHeight * 0.35
      for (const id of [...SECTIONS].reverse()) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top <= threshold) { setActive(id); return }
        }
      }
      setActive('about')
    }
    window.addEventListener('scroll', fn, { passive: true }); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return active
}

// ─── NAV ──────────────────────────────────────────────────────
function Nav({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const active = useActive()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 40px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <a href="#about" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', fontStyle: 'italic' }}>HG</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Portfolio</span>
        </a>

        <nav className="hide-md" style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {SECTIONS.map(id => (
            <a key={id} href={`#${id}`} style={{
              fontFamily: 'var(--sans)', fontSize: '0.76rem', fontWeight: active === id ? 700 : 400,
              color: active === id ? 'var(--accent)' : 'var(--muted)',
              background: active === id ? 'var(--accent-bg)' : 'transparent',
              textDecoration: 'none', padding: '5px 11px', borderRadius: 7,
              transition: 'all 0.2s', textTransform: 'capitalize',
            }}>{id}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: '0.88rem' }}>{dark ? '🌙' : '☀️'}</span>
          <button onClick={toggle} className="toggle" aria-label="Toggle theme">
            <div className="knob" />
          </button>
          <a href="#contact" className="hide-md"
            style={{ fontFamily: 'var(--sans)', fontSize: '0.76rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-bg)', padding: '7px 18px', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--accent-bd)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'white' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}>
            Contact
          </a>
          <button onClick={() => setOpen(v => !v)} className="show-md"
            style={{ display: 'none', background: 'none', border: '1px solid var(--border2)', borderRadius: 7, cursor: 'pointer', padding: '6px 11px', color: 'var(--ink)', fontSize: '1rem', lineHeight: 1 }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 40px 20px', background: 'var(--bg)' }}>
          {SECTIONS.map(id => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
              style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '0.9rem', color: active === id ? 'var(--accent)' : 'var(--ink2)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border)', textTransform: 'capitalize' }}>
              {id}
            </a>
          ))}
          <a href={`mailto:${PROFILE.contact.email}`}
            style={{ display: 'block', marginTop: 14, fontFamily: 'var(--sans)', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>→ Hire Me</a>
        </div>
      )}
    </header>
  )
}

// ─── HERO ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 40px 80px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>

        {/* Text */}
        <div>
          <div className="a1" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 500, color: 'var(--dim)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Michigan, USA</span>
            <span style={{ width: 28, height: 1, background: 'var(--border2)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', fontWeight: 500, color: 'var(--dim)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>M.S. Computer Science</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="a1">
              <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(2.6rem,7vw,6rem)', color: 'var(--ink)', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                Harshita
              </h1>
            </div>
            <div className="a2">
              <h1 className="grad-text" style={{ fontFamily: 'var(--serif)', fontWeight: 900, fontSize: 'clamp(2.6rem,7vw,6rem)', letterSpacing: '-0.05em', lineHeight: 0.95 }}>
                Guduru
              </h1>
            </div>
            <div className="a3" style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
              <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.1rem,2.4vw,1.9rem)', color: 'var(--muted)', letterSpacing: '-0.02em' }}>
                ML Researcher &amp; Full-Stack Developer
              </h1>
            </div>
          </div>

          <p className="a4" style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: 'clamp(0.88rem,1.3vw,1rem)', color: 'var(--muted)', lineHeight: 1.9, maxWidth: 520, marginBottom: 36 }}>
            {PROFILE.tagline} M.S. Computer Science at Lawrence Technological University.{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Peer-reviewed published researcher</span> — American Journal of Civil Engineering, Oct 2025.
          </p>

          <div className="a5" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
            <a href={`mailto:${PROFILE.contact.email}`}
              style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.86rem', color: 'white', background: 'var(--accent)', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', transition: 'opacity 0.2s', boxShadow: '0 4px 20px var(--accent-bg)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Get in touch →
            </a>
            {[{ l: 'GitHub ↗', h: PROFILE.contact.github }, { l: 'LinkedIn ↗', h: PROFILE.contact.linkedin }].map(({ l, h }) => (
              <a key={l} href={h} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '0.86rem', color: 'var(--ink2)', padding: '12px 22px', borderRadius: 10, textDecoration: 'none', border: '1px solid var(--border2)', transition: 'all 0.2s', background: 'var(--surface)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-bd)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink2)' }}>
                {l}
              </a>
            ))}
          </div>

          {/* Stats */}
          <div className="a5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', maxWidth: 540 }}>
            {[
              { n: 84, s: '%', l: 'CNN-LSTM Accuracy' },
              { n: 10000, s: '+', l: 'Seismic Records' },
              { n: 100000, s: '+', l: 'Tweets Analyzed' },
              { n: 1000, s: '+', l: 'Platform Users' },
            ].map((st, i) => (
              <div key={i} style={{ background: 'var(--surface)', padding: '18px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 'clamp(1.2rem,2vw,1.7rem)', color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  <Counter end={st.n} suffix={st.s} />
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.59rem', color: 'var(--dim)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.4 }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo — Option 4: glowing spinning arcs */}
        <div className="hide-md a6" style={{ flexShrink: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Animation wrapper */}
          <div style={{ position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Glow pulse ring */}
            <div style={{
              position: 'absolute', width: 278, height: 278, borderRadius: '50%',
              boxShadow: '0 0 0 3px rgba(26,107,74,0.45), 0 0 22px rgba(26,107,74,0.28), 0 0 48px rgba(26,107,74,0.12)',
              animation: 'glowPulse 2.6s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            {/* Spinning arc 1 — green, fast */}
            <div style={{
              position: 'absolute', width: 288, height: 288, borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#1A6B4A',
              borderRightColor: 'rgba(26,107,74,0.25)',
              animation: 'spinCW 3s linear infinite',
              pointerEvents: 'none',
            }} />

            {/* Spinning arc 2 — gold, slow reverse */}
            <div style={{
              position: 'absolute', width: 302, height: 302, borderRadius: '50%',
              border: '2px solid transparent',
              borderBottomColor: '#C4851A',
              borderLeftColor: 'rgba(196,133,26,0.2)',
              animation: 'spinCCW 5s linear infinite',
              pointerEvents: 'none',
            }} />

            {/* Outer faint ring */}
            <div style={{
              position: 'absolute', width: 314, height: 314, borderRadius: '50%',
              border: '1px solid rgba(26,107,74,0.1)',
              pointerEvents: 'none',
            }} />

            {/* Photo */}
            <div style={{ width: 270, height: 270, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(26,107,74,0.35)', flexShrink: 0, position: 'relative', zIndex: 1 }}>
              <img src="/profile.jpg" alt="Harshita Guduru"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                onError={e => {
                  const t = e.currentTarget as HTMLImageElement; t.style.display = 'none'
                  const p = t.parentElement!; p.style.display = 'flex'; p.style.alignItems = 'center'; p.style.justifyContent = 'center'; p.style.background = 'var(--surf2)'
                  p.innerHTML = `<span style="font-family:var(--serif);font-size:3.5rem;font-weight:700;color:var(--accent);font-style:italic">HG</span>`
                }}
              />
            </div>
          </div>

          {/* Name card */}
          <div style={{ marginTop: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 18px', textAlign: 'center', width: 270, boxShadow: '0 4px 16px var(--shadow)' }}>
            <p style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '0.98rem', color: 'var(--ink)', fontStyle: 'italic' }}>Harshita Guduru</p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', color: 'var(--accent)', fontWeight: 700, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>M.S. Computer Science · LTU</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────
const STRIP = ['React.js','Spring Boot','TensorFlow','Keras','CNN-LSTM','Python','FastAPI','PostgreSQL','Ethereum','Solidity','PyTorch','Node.js','XGBoost','JWT','MongoDB','Scikit-learn','Pandas','Web3.js','TypeScript','Java','MySQL','REST APIs','Prophet','NumPy']

function Marquee() {
  const doubled = [...STRIP, ...STRIP]
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', overflow: 'hidden', background: 'var(--surf2)' }}>
      <div className="mq">
        {doubled.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 20px', fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {s} <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', opacity: 0.5 }} />
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── SECTION HEAD ─────────────────────────────────────────────
function SH({ id, tag, title, sub }: { id: string; tag: string; title: string; sub?: string }) {
  return (
    <div id={id} style={{ paddingTop: 88, marginBottom: 52 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.24em' }}>{tag}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 'clamp(1.9rem,4vw,3rem)', color: 'var(--ink)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: sub ? 12 : 0 }}>
          {title}
        </h2>
        {sub && <p style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 520 }}>{sub}</p>}
      </Reveal>
    </div>
  )
}

// ─── EXPERIENCE (separate from education) ─────────────────────
function Experience() {
  return (
    <section id="experience" style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto', paddingBottom: 20 }}>
      <SH id="" tag="Work History" title="Experience" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {PROFILE.experience.map((exp, i) => (
          <Reveal key={exp.company} delay={i * 0.1}>
            <div style={{ display: 'flex', gap: 24, paddingBottom: 32 }}>
              {/* Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                <div className="tl-dot" />
                {i < PROFILE.experience.length - 1 && <div className="tl-line" style={{ marginTop: 8 }} />}
              </div>
              {/* Card */}
              <div className="card" style={{ flex: 1, padding: '28px 32px', marginBottom: i < PROFILE.experience.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)', marginBottom: 3, letterSpacing: '-0.02em' }}>{exp.role}</h3>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.84rem', color: 'var(--accent)', fontWeight: 700 }}>{exp.company}</p>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: 'var(--dim)', marginTop: 2 }}>{exp.location}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.66rem', color: 'var(--muted)', background: 'var(--surf2)', border: '1px solid var(--border)', padding: '3px 12px', borderRadius: 100, whiteSpace: 'nowrap' }}>{exp.period}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.63rem', color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-bd)', padding: '2px 10px', borderRadius: 100 }}>{exp.type}</span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', gap: 10, fontFamily: 'var(--sans)', fontSize: '0.81rem', color: 'var(--muted)', lineHeight: 1.78 }}>
                      <span style={{ marginTop: 9, width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />{b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {exp.tags.map(t => <span key={t} style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', padding: '3px 10px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-bd)', fontWeight: 500 }}>{t}</span>)}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── EDUCATION (separate section) ─────────────────────────────
function Education() {
  return (
    <section id="education" style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto', paddingBottom: 20 }}>
      <SH id="" tag="Academic Background" title="Education" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
        {PROFILE.education.map((edu, i) => (
          <Reveal key={edu.school} delay={i * 0.12}>
            <div className="card" style={{ padding: '28px 32px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-bg)', border: '1px solid var(--accent-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>
                🎓
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.63rem', color: 'var(--dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{edu.period}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: 2, letterSpacing: '-0.02em' }}>{edu.degree}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>{edu.school}</p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: 'var(--dim)', marginBottom: 14 }}>{edu.location}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {edu.courses.map(c => <span key={c} style={{ fontFamily: 'var(--sans)', fontSize: '0.63rem', padding: '3px 9px', borderRadius: 100, background: 'var(--surf2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{c}</span>)}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── PROJECT MODAL ────────────────────────────────────────────
type Proj = typeof PROFILE.projects[0] & { publication?: string }

function ProjectModal({ p, onClose }: { p: Proj; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: '2rem' }}>{p.icon}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.03em', marginBottom: 3 }}>{p.title}</h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.76rem', color: 'var(--accent)', fontWeight: 600 }}>{p.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--surf2)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: '6px 10px', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1, transition: 'all 0.2s', flexShrink: 0 }}>✕</button>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.66rem', color: 'var(--dim)', background: 'var(--surf2)', border: '1px solid var(--border)', padding: '3px 12px', borderRadius: 100 }}>{p.period}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.66rem', color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-bd)', padding: '3px 12px', borderRadius: 100, fontWeight: 600 }}>{p.category}</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

        {/* Description */}
        <p style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.85, marginBottom: 24 }}>{p.description}</p>

        {/* Highlights */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 14 }}>Key Highlights</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {p.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, fontFamily: 'var(--sans)', fontSize: '0.83rem', color: 'var(--ink2)', lineHeight: 1.7 }}>
                <span style={{ marginTop: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />{h}
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 12 }}>Tech Stack</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.tags.map(t => <span key={t} style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', padding: '4px 12px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-bd)', fontWeight: 500 }}>{t}</span>)}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <a href={p.github} target="_blank" rel="noreferrer"
            style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.84rem', color: 'white', background: 'var(--accent)', padding: '10px 22px', borderRadius: 9, textDecoration: 'none', transition: 'opacity 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            GitHub ↗
          </a>
          {p.publication && (
            <a href={p.publication} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent)', background: 'var(--accent-bg)', padding: '10px 22px', borderRadius: 9, textDecoration: 'none', border: '1px solid var(--accent-bd)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'white' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}>
              View Paper ↗
            </a>
          )}
          <button onClick={onClose} style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '0.84rem', color: 'var(--muted)', background: 'var(--surf2)', padding: '10px 22px', borderRadius: 9, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CURSOR GLOW ──────────────────────────────────────────────
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px'
        glowRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])
  return (
    <div ref={glowRef} style={{
      position: 'fixed', pointerEvents: 'none', zIndex: 0,
      width: 400, height: 400, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(26,107,74,0.07) 0%, transparent 70%)',
      transform: 'translate(-50%,-50%)',
      transition: 'left 0.08s ease, top 0.08s ease',
    }} />
  )
}

// ─── PROJECTS ─────────────────────────────────────────────────
const CATS = ['All','Full-Stack','ML','ML Research','Blockchain','Algorithms']

function ProjCard({ p, idx, delay, onClick }: { p: Proj; idx: number; delay: number; onClick: () => void }) {
  const [flipped, setFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el || flipped) return
    const rect = el.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width  // 0→1
    const cy = (e.clientY - rect.top) / rect.height
    setTilt({ x: (cy - 0.5) * -14, y: (cx - 0.5) * 14 })
    setSpotlight({ x: cx * 100, y: cy * 100 })
  }

  const handleMouseLeave = () => {
    setFlipped(false)
    setTilt({ x: 0, y: 0 })
    setSpotlight({ x: 50, y: 50 })
  }

  return (
    <Reveal delay={delay} style={{ height: '100%' }}>
      {/* Flip + tilt wrapper */}
      <div
        ref={cardRef}
        style={{
          perspective: '1000px', height: '100%', minHeight: 320, cursor: 'pointer',
          transform: !flipped ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
          transition: flipped ? 'transform 0.5s ease' : 'transform 0.12s ease',
        }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={onClick}
      >
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* ── FRONT ── */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18,
            padding: '26px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            boxShadow: flipped ? '0 20px 60px var(--shadow)' : '0 2px 12px var(--shadow)',
          }}>
            {/* Spotlight shimmer — follows mouse */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 18, pointerEvents: 'none',
              background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(26,107,74,0.10) 0%, transparent 65%)`,
              transition: 'background 0.08s ease',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.9rem', fontWeight: 400, color: 'var(--dim)', lineHeight: 1 }}>{String(idx + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 4 }}>{p.title}</h3>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, marginBottom: 14 }}>{p.subtitle}</p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.75, flex: 1 }}>{p.description}</p>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {p.tags.slice(0, 3).map(t => <span key={t} style={{ fontFamily: 'var(--sans)', fontSize: '0.63rem', padding: '3px 9px', borderRadius: 100, background: 'var(--surf2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{t}</span>)}
              {p.tags.length > 3 && <span style={{ fontFamily: 'var(--sans)', fontSize: '0.63rem', padding: '3px 9px', borderRadius: 100, background: 'var(--surf2)', color: 'var(--dim)', border: '1px solid var(--border)' }}>+{p.tags.length - 3}</span>}
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', color: 'var(--dim)' }}>Hover to explore</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>↻</span>
            </div>
          </div>

          {/* ── BACK ── always dark regardless of theme */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #1A3D2E 0%, #0F2018 100%)',
            borderRadius: 18, padding: '26px',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            border: '1px solid rgba(61,186,133,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{p.category} · {p.period}</span>
              <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 14 }}>{p.title}</h3>

            {/* highlights preview — first 3 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16, overflow: 'hidden' }}>
              {p.highlights.slice(0, 3).map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, fontFamily: 'var(--sans)' }}>
                  <span style={{ marginTop: 7, width: 5, height: 5, borderRadius: '50%', background: '#3DBA85', flexShrink: 0 }} />{h}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
              {p.tags.slice(0, 5).map(t => <span key={t} style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', padding: '3px 9px', borderRadius: 100, background: 'rgba(61,186,133,0.15)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(61,186,133,0.3)' }}>{t}</span>)}
            </div>

            <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.73rem', fontWeight: 700, color: '#3DBA85' }}>Click to open full details →</span>
              <span style={{ fontSize: '1rem', color: '#3DBA85' }}>↗</span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function Projects() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Proj | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; p: Proj } | null>(null)
  const filtered = filter === 'All' ? PROFILE.projects : PROFILE.projects.filter(p => p.category === filter)

  return (
    <section id="projects" style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto', paddingBottom: 80, position: 'relative' }}>
      <SH id="" tag="Portfolio" title="Selected Projects" sub="Hover cards to flip · Click for full details + GitHub" />

      <Reveal style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {CATS.map(cat => {
            const count = cat === 'All' ? PROFILE.projects.length : PROFILE.projects.filter(p => p.category === cat).length
            if (count === 0) return null
            const on = filter === cat
            return (
              <button key={cat} onClick={() => setFilter(cat)} style={{ fontFamily: 'var(--sans)', fontSize: '0.76rem', fontWeight: on ? 700 : 400, padding: '6px 16px', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s', background: on ? 'var(--ink)' : 'var(--surface)', border: `1px solid ${on ? 'var(--ink)' : 'var(--border2)'}`, color: on ? 'var(--bg)' : 'var(--muted)' }}>
                {cat} <span style={{ opacity: 0.55, fontSize: '0.67rem' }}>({count})</span>
              </button>
            )
          })}
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
        {(filtered as Proj[]).map((p, i) => (
          <ProjCard key={p.title} p={p} idx={PROFILE.projects.indexOf(p as any)} delay={i * 0.06} onClick={() => setSelected(p)} />
        ))}
      </div>

      {selected && <ProjectModal p={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

// ─── SKILLS ───────────────────────────────────────────────────
function SkillRow({ name, pct, items, delay }: { name: string; pct: number; items: string[]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return (
    <Reveal delay={delay}>
      <div ref={ref} className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>{name}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--border2)', borderRadius: 99, marginBottom: 14, overflow: 'hidden' }}>
          <div className="skill-fill" style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,var(--accent),var(--accent2))', width: on ? `${pct}%` : '0%', transitionDelay: `${delay * 0.5}s` }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {items.map(item => <span key={item} className="tag-pop" style={{ fontFamily: 'var(--sans)', fontSize: '0.64rem', padding: '3px 9px', borderRadius: 100, background: 'var(--surf2)', color: 'var(--muted)', border: '1px solid var(--border)', cursor: 'default' }}>{item}</span>)}
        </div>
      </div>
    </Reveal>
  )
}

function Skills() {
  return (
    <section id="skills" style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto', paddingBottom: 80 }}>
      <SH id="" tag="Technical Stack" title="Skills & Tools" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 12, marginBottom: 12 }}>
        {Object.entries(PROFILE.skills).map(([name, data], i) => <SkillRow key={name} name={name} pct={data.pct} items={data.items} delay={i * 0.08} />)}
      </div>
      <Reveal>
        <div className="card" style={{ padding: '22px 26px' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.61rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 14 }}>Programming Languages</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PROFILE.languages.map(l => (
              <span key={l} className="tag-pop" style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 500, padding: '7px 18px', borderRadius: 100, background: 'var(--surf2)', color: 'var(--ink2)', border: '1px solid var(--border)', cursor: 'default' }}>{l}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ─── PUBLICATIONS ─────────────────────────────────────────────
function Publications() {
  return (
    <section id="publications" style={{ padding: '0 40px', maxWidth: 1300, margin: '0 auto', paddingBottom: 80 }}>
      <SH id="" tag="Research" title="Publications" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PROFILE.publications.map((pub, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="card" style={{ padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic', fontSize: '1.7rem', color: 'var(--accent)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', color: 'var(--dim)', background: 'var(--surf2)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 100 }}>{pub.date}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '1.08rem', color: 'var(--ink)', lineHeight: 1.55, marginBottom: 4, letterSpacing: '-0.02em' }}>{pub.title}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.76rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: 14 }}>{pub.journal}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {pub.tags.map(t => <span key={t} style={{ fontFamily: 'var(--sans)', fontSize: '0.63rem', padding: '3px 9px', borderRadius: 100, background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-bd)', fontWeight: 500 }}>{t}</span>)}
                </div>
              </div>
              <a href={pub.url} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink2)', padding: '9px 20px', borderRadius: 9, border: '1px solid var(--border2)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0, alignSelf: 'flex-start', background: 'var(--surface)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)' }}>
                Read Paper ↗
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ padding: '0 40px 120px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ paddingTop: 88 }} />
      <SH id="" tag="Get in Touch" title="Contact" />
      <Reveal>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(32px,5vw,68px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 52, boxShadow: '0 8px 48px var(--shadow)' }}>
          <div style={{ maxWidth: 440 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,3rem)', color: 'var(--ink)', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 20 }}>
              I'd love to hear<br /><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>from you.</em>
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.95, marginBottom: 20 }}>
              Whether it's a role you think I'd be a good fit for, a research collaboration, or just a question — feel free to reach out through any of the channels here. I try to respond within a day or two.
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontWeight: 300, fontSize: '0.88rem', color: 'var(--dim)', lineHeight: 1.8 }}>
              You can also find my work on GitHub and connect on LinkedIn.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 260 }}>
            {[
              { label: 'Email',    v: PROFILE.contact.email,         h: `mailto:${PROFILE.contact.email}` },
              { label: 'LinkedIn', v: PROFILE.contact.linkedinLabel,  h: PROFILE.contact.linkedin },
              { label: 'GitHub',   v: PROFILE.contact.githubLabel,    h: PROFILE.contact.github },
              { label: 'Phone',    v: PROFILE.contact.phone,          h: `tel:+1${PROFILE.contact.phone.replace(/\./g,'')}` },
              { label: 'Location', v: PROFILE.location,               h: '#' },
            ].map(item => (
              <a key={item.label} href={item.h} target={item.h.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'center', transition: 'color 0.2s', padding: '14px 0', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.58rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.12em', width: 58, flexShrink: 0 }}>{item.label}</span>
                {item.v} ↗
              </a>
            ))}
            <a href={`mailto:${PROFILE.contact.email}`}
              style={{ marginTop: 20, fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.9rem', color: 'white', background: 'var(--accent)', padding: '14px 28px', borderRadius: 11, textDecoration: 'none', textAlign: 'center', transition: 'opacity 0.2s', boxShadow: '0 4px 20px var(--accent-bg)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Send an Email →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme()
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh', transition: 'background 0.5s, color 0.5s' }}>
      <CursorGlow />
      <Nav dark={dark} toggle={toggle} />
      <Hero />
      <Marquee />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <Publications />
      <Contact />
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', background: 'var(--surf2)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontStyle: 'italic', fontSize: '1rem', color: 'var(--ink)' }}>Harshita Guduru</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', color: 'var(--dim)' }}>© {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['GitHub', PROFILE.contact.github],['LinkedIn', PROFILE.contact.linkedin],['Email', `mailto:${PROFILE.contact.email}`]].map(([l,h]) => (
              <a key={l} href={h} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: 'var(--dim)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}>
                {l} ↗
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
