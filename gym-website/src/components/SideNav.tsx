import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero',          label: 'Inicio' },
  { id: 'contact',       label: 'Contacto' },
  { id: 'news',          label: 'Novedades' },
  { id: 'schedule',      label: 'Horarios' },
  { id: 'facilities',    label: 'Instalaciones' },
  { id: 'activities',    label: 'Actividades' },
  { id: 'plans',         label: 'Planes' },
  { id: 'differentials', label: 'Diferenciales' },
  { id: 'location',      label: 'Ubicación' },
  { id: 'faq',           label: 'FAQ' },
  { id: 'reviews',       label: 'Reseñas' },
]

export default function SideNav() {
  const [active, setActive] = useState('hero')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const scanLine = window.innerHeight * 0.38

    const onScroll = () => {
      let current = sections[0].id
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= scanLine) current = s.id
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      {/* Hamburger móvil */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed right-5 top-6 z-50 md:hidden flex flex-col gap-[5px] items-end"
        aria-label="Menú"
      >
        <span className={`block h-px bg-white/70 transition-all duration-300 ${open ? 'w-5 rotate-45 translate-y-[7px]' : 'w-5'}`} />
        <span className={`block h-px bg-white/70 transition-all duration-300 ${open ? 'w-5 -rotate-45' : 'w-4'}`} />
      </button>

      {/* Overlay móvil */}
      {open && <div className="fixed inset-0 z-30 md:hidden" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />}

      {/* Nav lateral desktop */}
      <nav className="hidden md:flex fixed right-0 top-0 h-screen z-40 flex-col items-end justify-center pr-7">
        <ul className="flex flex-col gap-[18px]">
          {sections.map(s => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className="block text-right transition-all duration-300"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: active === s.id ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  fontWeight: active === s.id ? 600 : 400,
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menú móvil desplegable */}
      <nav
        className="fixed right-0 top-0 h-screen z-40 flex flex-col justify-center px-10 transition-transform duration-400 md:hidden"
        style={{
          background: '#050505',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          width: 220,
        }}
      >
        <ul className="flex flex-col gap-7">
          {sections.map(s => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className="block text-left transition-all duration-300"
                style={{
                  fontSize: 13,
                  letterSpacing: '0.05em',
                  color: active === s.id ? '#ffffff' : 'rgba(255,255,255,0.25)',
                  fontWeight: active === s.id ? 600 : 300,
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
