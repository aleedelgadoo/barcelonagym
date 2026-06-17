import './App.css'
import { DataProvider } from './lib/data-context'
import Hero from './components/Hero'
import Schedule from './components/Schedule'
import Reviews from './components/Reviews'
import Facilities from './components/Facilities'
import Plans from './components/Plans'
import Differentials from './components/Differentials'
import News from './components/News'
import Location from './components/Location'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Activities from './components/Activities'
import Divider from './components/Divider'
import SideNav from './components/SideNav'
import Admin from './pages/Admin'
import Galeria from './pages/Galeria'
import Rutina from './pages/Rutina'

function App() {
  const path = window.location.pathname
  if (path === '/admin') return <Admin />
  if (path === '/galeria') return <Galeria />
  if (path === '/rutina') return <Rutina />

  return (
    <DataProvider>
    <div className="min-h-screen bg-black">
      <SideNav />
      <div className="md:pr-16">
        <Hero />
        <Contact />
        <Divider index={0} />
        <News />
        <Divider index={1} />
        <Schedule />
        <Divider index={2} />
        <Facilities />
        <Divider index={3} />
        <Activities />
        <Divider index={4} />
        <Plans />
        <Divider index={5} />
        <Differentials />
        <Divider index={6} />
        <Location />
        <Divider index={7} />
        <FAQ />
        <Divider index={8} />
        <Reviews />
        <footer style={{ padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'center' }}>
          <a
            href="/admin"
            style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.12)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.12)'}
          >
            Panel de administración
          </a>
        </footer>
      </div>

      {/* Botón flotante Galería */}
      <a
        href="/galeria"
        title="Galería"
        className="gallery-fab"
        style={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 35,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 16px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.16)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.25s',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)' }}
      >
        <svg width={13} height={13} fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.8}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.06em', color: '#fff', textTransform: 'uppercase' }}>
          Mirá nuestras fotos y videos
        </span>
      </a>
    </div>
    </DataProvider>
  )
}

export default App
