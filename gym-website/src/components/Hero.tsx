import { motion } from 'framer-motion'
import { useData } from '../lib/data-context'
import { imgUrl } from '../lib/store'

const ease = 'easeOut' as const

export default function Hero() {
  const { site } = useData()

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center" id="hero">

      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: '#000' }}>
        <img
          src={imgUrl(site.heroBg, 1920, 72)}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.85) 100%)' }} />
      </div>

      {/* Logo superior centrado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease }}
        className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
      >
        <img src={site.logoSrc} alt="BCN Gym" className="h-[8rem] md:h-[9.6rem] w-auto" />
      </motion.div>

      {/* Contenido central */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-8 md:px-6" style={{ marginTop: '34vh' }}>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
          className="text-[clamp(1.8rem,4.6vw,4.1rem)] font-bold text-white leading-[0.92] tracking-tighter mb-8"
        >
          {site.heroTitle.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          style={{ fontSize: 'clamp(1rem,1.5vw,1.25rem)', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.7, maxWidth: 560, margin: '0 auto', textAlign: 'center', marginTop: '0.8rem' }}
        >
          {site.heroSubtitle}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-5 h-5 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
