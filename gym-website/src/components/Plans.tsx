import { motion } from 'framer-motion'
import { useData } from '../lib/data-context'

function gridConfig(count: number): { maxWidth: number; columns: string } {
  if (count === 1) return { maxWidth: 380,  columns: '1fr' }
  if (count === 2) return { maxWidth: 640,  columns: 'repeat(auto-fit, minmax(min(260px,100%), 1fr))' }
  if (count === 3) return { maxWidth: 960,  columns: 'repeat(auto-fit, minmax(min(240px,100%), 1fr))' }
  if (count === 4) return { maxWidth: 680,  columns: 'repeat(auto-fit, minmax(min(260px,100%), 1fr))' }
  return                  { maxWidth: 960,  columns: 'repeat(auto-fit, minmax(min(240px,100%), 1fr))' }
}

export default function Plans() {
  const { plans } = useData()
  const { maxWidth, columns } = gridConfig(plans.length)

  return (
    <section id="plans" style={{ background: '#0a0a0a', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Planes
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>
            Nuestros Planes
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300, fontSize: '1rem' }}>
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </motion.div>

        <div style={{ maxWidth, margin: '0 auto', display: 'grid', gridTemplateColumns: columns, gap: 16 }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.08 }}
              viewport={{ once: true }}
              style={{
                borderRadius: 20,
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...(plan.highlighted
                  ? { background: '#fff', border: '1px solid #fff' }
                  : { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }),
              }}
            >
              {plan.highlighted && (
                <span style={{ position: 'absolute', top: 20, right: 20, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, background: '#000', color: '#fff', padding: '4px 10px', borderRadius: 999 }}>
                  Más popular
                </span>
              )}

              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6, color: plan.highlighted ? '#000' : '#fff' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.83rem', fontWeight: 300, color: plan.highlighted ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.38)' }}>{plan.description}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 32 }}>
                <span style={{ fontSize: 'clamp(2.5rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.04em', color: plan.highlighted ? '#000' : '#fff' }}>${plan.price}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 300, color: plan.highlighted ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.28)' }}>{plan.period}</span>
              </div>

              <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <svg style={{ width: 14, height: 14, marginTop: 3, flexShrink: 0, color: plan.highlighted ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.28)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span style={{ fontSize: '0.83rem', fontWeight: 300, lineHeight: 1.55, color: plan.highlighted ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.45)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center"
          style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.75rem', fontWeight: 300, marginTop: 40, letterSpacing: '0.03em' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
          💳 Cancela tu membresía en cualquier momento, sin preguntas
        </motion.p>

      </div>
    </section>
  )
}
