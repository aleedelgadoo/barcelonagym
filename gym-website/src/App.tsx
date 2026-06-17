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

function App() {
  if (window.location.pathname === '/admin') {
    return <Admin />
  }

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
    </div>
    </DataProvider>
  )
}

export default App
