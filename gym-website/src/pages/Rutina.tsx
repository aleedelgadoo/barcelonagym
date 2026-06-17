import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DataProvider, useData } from '../lib/data-context'

function RutinaContent() {
  const { routineImages } = useData()
  const [current, setCurrent] = useState(0)
  const len = routineImages.length
  const prev = () => setCurrent(i => (i === 0 ? len - 1 : i - 1))
  const next = () => setCurrent(i => (i === len - 1 ? 0 : i + 1))

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingInline: 'clamp(20px, 5vw, 64px)', paddingTop: 28, paddingBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'color 0.2s', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </button>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 3 }}>Barcelona GYM</p>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>Plantilla de entrenamiento</h1>
        </div>
      </div>

      {/* Carrusel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 3vw, 40px)', gap: 24 }}>
        {len === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', fontWeight: 300 }}>Próximamente...</p>
        ) : (
          <>
            {/* Imagen principal */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 860, borderRadius: 18, overflow: 'hidden', background: '#111', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={routineImages[current].url}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ width: '100%', display: 'block', maxHeight: '72vh', objectFit: 'contain' }}
                />
              </AnimatePresence>

              {len > 1 && (
                <>
                  {[
                    { action: prev, path: 'M15 19l-7-7 7-7', pos: { left: 14 } },
                    { action: next, path: 'M9 5l7 7-7 7',    pos: { right: 14 } },
                  ].map((btn, bi) => (
                    <button key={bi} onClick={btn.action}
                      style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...btn.pos, width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'background 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)' }}
                    >
                      <svg width={16} height={16} fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.path} /></svg>
                    </button>
                  ))}
                </>
              )}

              {len > 1 && (
                <div style={{ position: 'absolute', bottom: 14, right: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 99, backdropFilter: 'blur(6px)' }}>
                  {current + 1} / {len}
                </div>
              )}
            </div>

            {/* Dots */}
            {len > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 7 }}>
                {routineImages.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    style={{ borderRadius: 999, height: 5, transition: 'all 0.3s', cursor: 'pointer', border: 'none', background: i === current ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)', width: i === current ? 22 : 5 }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Rutina() {
  return (
    <DataProvider>
      <RutinaContent />
    </DataProvider>
  )
}
