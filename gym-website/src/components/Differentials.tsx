import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function Differentials() {
  const { differentials } = useData()
  const [current, setCurrent] = useState(0)
  const len = Math.max(1, differentials.length)
  const safeIndex = Math.min(current, len - 1)
  const prev = () => setCurrent(i => (i === 0 ? len - 1 : i - 1))
  const next = () => setCurrent(i => (i === len - 1 ? 0 : i + 1))

  if (differentials.length === 0) return null

  return (
    <section id="differentials" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        <motion.div
          className="text-center" style={{ marginBottom: 'clamp(3rem, 10vw, 12rem)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Diferenciales
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Tecnología, Comodidad y Resultados
          </h2>
        </motion.div>

        <motion.div
          style={{ maxWidth: 960, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <div style={{ position: 'relative', height: 'clamp(260px, 52vw, 480px)', background: '#000' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={safeIndex}
                src={differentials[safeIndex].image}
                alt={differentials[safeIndex].name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              />
            </AnimatePresence>

            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 52%)' }} />

            {differentials.length > 1 && [{ dir: 'prev', action: prev, path: 'M15 19l-7-7 7-7', pos: { left: 20 } }, { dir: 'next', action: next, path: 'M9 5l7 7-7 7', pos: { right: 20 } }].map(btn => (
              <button key={btn.dir} onClick={btn.action}
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...btn.pos, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                <svg width={16} height={16} fill="none" stroke="#fff" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.path} />
                </svg>
              </button>
            ))}

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 40px' }}>
              <AnimatePresence mode="wait">
                <motion.div key={safeIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 8 }}>{safeIndex + 1} / {differentials.length}</p>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>{differentials[safeIndex].name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.65, maxWidth: 500 }}>{differentials[safeIndex].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {differentials.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '20px 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {differentials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  style={{ borderRadius: 999, height: 6, transition: 'all 0.35s', cursor: 'pointer', background: i === safeIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)', width: i === safeIndex ? 22 : 6 }} />
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  )
}
