import { motion } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function Reviews() {
  const { reviews } = useData()
  return (
    <section id="reviews" style={{ background: '#0a0a0a', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
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
            Testimonios
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Lo que dicen nuestros miembros
          </h2>
        </motion.div>

        {/* Grid centrada */}
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 16 }}>
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.07 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.75, fontSize: '0.93rem' }}>
                "{r.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={r.image} alt={r.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                <div>
                  <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>{r.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.08em', marginTop: 2 }}>★★★★★</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
