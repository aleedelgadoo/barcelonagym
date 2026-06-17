import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function Activities() {
  const { activities } = useData()
  const [current, setCurrent] = useState(0)
  const len = Math.max(1, activities.length)
  const idx = Math.min(current, len - 1)
  const prev = () => setCurrent(i => (i === 0 ? len - 1 : i - 1))
  const next = () => setCurrent(i => (i === len - 1 ? 0 : i + 1))

  if (activities.length === 0) return null
  const activity = activities[idx]

  return (
    <section id="activities" style={{ background: '#0a0a0a', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        <motion.div
          className="text-center"
          style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Actividades
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Nuestras Actividades
          </h2>
        </motion.div>

        <motion.div
          style={{ maxWidth: 960, margin: '0 auto' }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Imagen con overlay */}
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 0 }}>
            <div style={{ position: 'relative', height: 'clamp(260px, 48vw, 440px)', background: '#000' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={idx}
                  src={activity.image}
                  alt={activity.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </AnimatePresence>

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />

              {/* Flechas */}
              {[
                { dir: 'prev', action: prev, path: 'M15 19l-7-7 7-7', side: { left: 20 } },
                { dir: 'next', action: next, path: 'M9 5l7 7-7 7',  side: { right: 20 } },
              ].map(btn => (
                <button key={btn.dir} onClick={btn.action}
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...btn.side, width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <svg width={16} height={16} fill="none" stroke="#fff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.path} />
                  </svg>
                </button>
              ))}

              {/* Info sobre la imagen */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px, 4vw, 40px)' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10 }}>
                      {idx + 1} / {len}
                    </p>
                    <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>
                      {activity.name}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', lineHeight: 1.7, maxWidth: 520 }}>
                      {activity.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Horarios en franja inferior */}
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 clamp(24px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                {activity.schedules.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBlock: 14, borderBottom: i < activity.schedules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>{s.day}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.hours}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {len > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {activities.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  style={{ borderRadius: 999, height: 6, transition: 'all 0.35s', cursor: 'pointer', border: 'none', background: i === idx ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)', width: i === idx ? 22 : 6 }}
                />
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  )
}
