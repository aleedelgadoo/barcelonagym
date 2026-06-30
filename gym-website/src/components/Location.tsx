import { motion } from 'framer-motion'
import { useData } from '../lib/data-context'
import { imgUrl } from '../lib/store'

export default function Location() {
  const { site } = useData()
  return (
    <section id="location" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            Ubicación
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Nuestra Ubicación
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ maxWidth: 960, margin: '0 auto', gap: 16 }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Mapa */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', minHeight: 280 }}>
            <iframe
              src={site.mapsEmbed}
              width="100%" height="100%"
              style={{ border: 0, display: 'block', minHeight: 280 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Barcelona Gym ubicación"
            />
          </div>

          {/* Foto + dirección */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', flex: 1, border: '1px solid rgba(255,255,255,0.06)' }}>
              <img
                src={imgUrl(site.locationPhoto, 900)}
                alt="Barcelona Gym"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 200, filter: 'brightness(0.78)' }}
              />
            </div>

            {/* Tarjeta de dirección mejorada */}
            <div style={{ borderRadius: 20, padding: '24px 28px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={18} height={18} fill="none" stroke="rgba(255,255,255,0.6)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 5 }}>Dirección</p>
                <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 300, letterSpacing: '-0.01em' }}>{site.locationAddress}</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
