import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function Facilities() {
  const { facilities, services } = useData()
  const [current, setCurrent] = useState(0)
  const len = Math.max(1, facilities.length)
  const prev = () => setCurrent(i => (i === 0 ? len - 1 : i - 1))
  const next = () => setCurrent(i => (i === len - 1 ? 0 : i + 1))

  return (
    <section id="facilities" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        {/* Header centrado */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Instalaciones
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Nuestras Instalaciones
          </h2>
        </motion.div>

        {/* Carrusel centrado */}
        <motion.div
          style={{ maxWidth: 960, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Imagen */}
          <div style={{ position: 'relative', height: 'clamp(260px, 52vw, 480px)', background: '#000' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={facilities[current].image}
                alt={facilities[current].name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              />
            </AnimatePresence>

            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 50%)' }} />

            {/* Flechas */}
            {[{ dir: 'prev', action: prev, path: 'M15 19l-7-7 7-7', pos: { left: 20 } }, { dir: 'next', action: next, path: 'M9 5l7 7-7 7', pos: { right: 20 } }].map(btn => (
              <button key={btn.dir} onClick={btn.action}
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...btn.pos, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.3s', zIndex: 10 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                <svg width={16} height={16} fill="none" stroke="#fff" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.path} />
                </svg>
              </button>
            ))}

            {/* Info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 40px' }}>
              <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 8 }}>{current + 1} / {facilities.length}</p>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>{facilities[current].name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 460 }}>{facilities[current].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Miniaturas */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${facilities.length}, 1fr)`, gap: 1, background: 'rgba(255,255,255,0.05)' }}>
            {facilities.map((f, i) => (
              <button key={f.id} onClick={() => setCurrent(i)}
                style={{ position: 'relative', height: 60, overflow: 'hidden', opacity: i === current ? 1 : 0.3, transition: 'opacity 0.3s', cursor: 'pointer' }}>
                <img src={f.image} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === current && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#fff' }} />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Subsección Rutina */}
        <motion.div
          style={{ maxWidth: 960, margin: '64px auto 0', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(28px, 4vw, 44px)', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width={16} height={16} fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>¿Me van a brindar una rutina de entrenamiento?</h3>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.7 }}>
            Sí. Cada miembro recibe una plantilla de entrenamiento diseñada por nuestros instructores, adaptada a tu nivel y objetivos.
          </p>
          <a
            href="/rutina"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 999, background: '#fff', color: '#000', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Visualizá nuestra plantilla
            <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </a>
        </motion.div>

        {/* Subsección Servicios */}
        {services.length > 0 && (
          <motion.div
            style={{ maxWidth: 960, margin: '64px auto 0' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 32, textAlign: 'center' }}>
              Servicios
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(24px, 4vw, 48px)' }}>
              {services.map((s, i) => (
                <motion.div
                  key={s.id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, minWidth: 80 }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.image
                      ? <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }} />
                    }
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.03em', textAlign: 'center' }}>
                    {s.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  )
}
