import './App.css'
import { lazy, Suspense } from 'react'
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

// Páginas aparte: no se necesitan para la home, se cargan bajo demanda.
const Admin = lazy(() => import('./pages/Admin'))
const Galeria = lazy(() => import('./pages/Galeria'))
const Rutina = lazy(() => import('./pages/Rutina'))

function PageFallback() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)', borderTopColor: 'rgba(255,255,255,0.6)', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function App() {
  const path = window.location.pathname
  // Rutas nuevas (las viejas /galeria y /rutina quedaron con un 308 cacheado en
  // Chrome, así que usamos URLs frescas). Se mantienen las viejas por compatibilidad.
  if (path === '/admin') return <Suspense fallback={<PageFallback />}><Admin /></Suspense>
  if (path === '/fotos' || path === '/galeria') return <Suspense fallback={<PageFallback />}><Galeria /></Suspense>
  if (path === '/plantilla' || path === '/rutina') return <Suspense fallback={<PageFallback />}><Rutina /></Suspense>

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
        href="/fotos"
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
