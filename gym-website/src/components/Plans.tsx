import { motion } from 'framer-motion'
import { useData } from '../lib/data-context'
import { DEFAULT_SITE } from '../lib/store'

function gridConfig(count: number): { maxWidth: number; columns: string } {
  if (count === 1) return { maxWidth: 420,  columns: '1fr' }
  if (count === 2) return { maxWidth: 760,  columns: 'repeat(2, 1fr)' }
  if (count === 3) return { maxWidth: 1100, columns: 'repeat(3, 1fr)' }
  if (count === 4) return { maxWidth: 1300, columns: 'repeat(auto-fit, minmax(min(290px,100%), 1fr))' }
  return                  { maxWidth: 1300, columns: 'repeat(auto-fit, minmax(min(270px,100%), 1fr))' }
}

export default function Plans() {
  const { plans, site, loaded } = useData()
  const { maxWidth, columns } = gridConfig(plans.length)
  const plansSubtitle = site.plansSubtitle ?? DEFAULT_SITE.plansSubtitle

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
          <p style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 400, fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7, padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {plansSubtitle}
          </p>
        </motion.div>

        {!loaded ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 280, marginTop: 56 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)', borderTopColor: 'rgba(255,255,255,0.6)', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
        <div style={{ maxWidth, margin: '0 auto', display: 'grid', gridTemplateColumns: columns, gap: 24, marginTop: 56 }}>
          {plans.map((planType, i) => {
            const options = planType.options ?? []

            return (
              <motion.div
                key={planType.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  borderRadius: 20,
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* Nombre y descripción */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, color: '#fff' }}>
                    {planType.name}
                  </h3>
                  <p style={{ fontSize: '0.83rem', fontWeight: 300, color: 'rgba(255,255,255,0.38)' }}>
                    {planType.description}
                  </p>
                </div>

                {/* Features */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
                  {planType.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <svg style={{ width: 13, height: 13, marginTop: 3, flexShrink: 0, color: 'rgba(255,255,255,0.25)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span style={{ fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.5, color: 'rgba(255,255,255,0.4)' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Todas las opciones juntas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                  {options.map(option => (
                    <div key={option.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', borderRadius: 10, gap: 8,
                      ...(option.highlighted
                        ? { background: '#fff', border: '1px solid #fff' }
                        : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)' }),
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: option.highlighted ? 500 : 300, color: option.highlighted ? '#000' : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                          {option.duration}
                        </span>
                        {option.highlighted && (
                          <span style={{ fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, background: 'rgba(0,0,0,0.08)', color: '#000', padding: '2px 6px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            Popular
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: option.highlighted ? '1rem' : '0.9rem', fontWeight: option.highlighted ? 600 : 300, color: option.highlighted ? '#000' : 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        ${option.price}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
        )}


      </div>
    </section>
  )
}
