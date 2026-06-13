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
          {schedules.map((s, i) => (
            <motion.div
              key={s.id}
              className="group flex items-center justify-between"
              style={{ padding: '28px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'default' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <span style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', fontWeight: 300, color: 'rgba(255,255,255,0.45)', transition: 'color 0.4s' }}
                className="group-hover:text-white/80">
                {s.day}
              </span>
              <span style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', fontWeight: 300, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                {s.hours}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
