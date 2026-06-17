import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'
import CarouselArrows from './CarouselArrows'

export default function News() {
  const { news, loaded } = useData()
  const [current, setCurrent] = useState(0)
  const len = news.length
  const idx = len > 0 ? Math.min(current, len - 1) : 0
  const prev = () => setCurrent(() => (idx === 0 ? len - 1 : idx - 1))
  const next = () => setCurrent(() => (idx === len - 1 ? 0 : idx + 1))

  // No mostrar la sección si ya cargó y no hay novedades
  if (loaded && len === 0) return null

  return (
    <section id="news" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Novedades
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Novedades
          </h2>
        </motion.div>

        {!loaded ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 280 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)', borderTopColor: 'rgba(255,255,255,0.6)', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
        <>
        {len > 1 && (
          <CarouselArrows onPrev={prev} onNext={next} style={{ marginBottom: 28 }} />
        )}
        <motion.div
          style={{ maxWidth: 760, margin: '0 auto' }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 32, aspectRatio: '16/9' }}>
                <img
                  src={news[idx].image}
                  alt={news[idx].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.82)' }}
                />
              </div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>{news[idx].date}</p>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 16 }}>
                {news[idx].title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75 }}>
                {news[idx].description}
              </p>
            </motion.article>
          </AnimatePresence>

          {/* Contador */}
          {len > 1 && (
            <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginTop: 32 }}>{idx + 1} / {len}</p>
          )}
        </motion.div>
        </>
        )}

      </div>
    </section>
  )
}
