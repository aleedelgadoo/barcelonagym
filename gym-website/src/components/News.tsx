import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function News() {
  const { news } = useData()
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(i => (i === 0 ? news.length - 1 : i - 1))
  const next = () => setCurrent(i => (i === news.length - 1 ? 0 : i + 1))

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

        <motion.div
          style={{ maxWidth: 760, margin: '0 auto' }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 32, aspectRatio: '16/9' }}>
                <img
                  src={news[current].image}
                  alt={news[current].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.82)' }}
                />
              </div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>{news[current].date}</p>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 16 }}>
                {news[current].title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75 }}>
                {news[current].description}
              </p>
            </motion.article>
          </AnimatePresence>

          {/* Controles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ action: prev, path: 'M15 19l-7-7 7-7' }, { action: next, path: 'M9 5l7 7-7 7' }].map((btn, i) => (
                <button key={i} onClick={btn.action}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width={16} height={16} fill="none" stroke="#fff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.path} />
                  </svg>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>{current + 1} / {news.length}</p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
