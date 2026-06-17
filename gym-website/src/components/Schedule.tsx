import { motion } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function Schedule() {
  const { schedules } = useData()
  return (
    <section id="schedule" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        {/* Header centrado */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Horarios
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Horario de Apertura
          </h2>
        </motion.div>

        {/* Filas centradas */}
        <div style={{ maxWidth: 680, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {schedules.map((s, i) => {
            const ranges = Array.isArray(s.hours) ? s.hours : [s.hours]
            return (
              <motion.div
                key={s.id}
                className="group flex items-center justify-between"
                style={{ padding: '28px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'default', gap: 16 }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <span style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', fontWeight: 300, color: 'rgba(255,255,255,0.45)', transition: 'color 0.4s' }}
                  className="group-hover:text-white/80">
                  {s.day}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {ranges.map((r, ri) => (
                    <span key={ri} style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', fontWeight: 300, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                      {r}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="text-center"
          style={{ marginTop: 48 }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ fontSize: '0.85rem', letterSpacing: '0.04em', fontWeight: 500, color: '#000', background: '#fff', border: 'none', borderRadius: 999, padding: '13px 28px', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(255,255,255,0.15)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,255,255,0.15)' }}
          >
            Horario actividades especiales →
          </button>
        </motion.div>

      </div>
    </section>
  )
}
