import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'
import type { PortfolioItem } from '../lib/store'

function LightboxVideo({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 900, width: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative' }}
      >
        {item.type === 'video'
          ? <video src={item.url} controls autoPlay style={{ width: '100%', display: 'block', maxHeight: '80vh', background: '#000' }} />
          : <img src={item.url} alt={item.caption} style={{ width: '100%', display: 'block', maxHeight: '85vh', objectFit: 'contain' }} />
        }
        {item.caption && (
          <div style={{ background: 'rgba(0,0,0,0.7)', padding: '12px 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 300 }}>{item.caption}</p>
          </div>
        )}
      </motion.div>
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >×</button>
    </motion.div>
  )
}

export default function Portfolio() {
  const { portfolio } = useData()
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  if (portfolio.length === 0) return (
    <section id="portfolio" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>Portfolio</p>
        <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 32 }}>Galería</h2>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', fontWeight: 300 }}>Próximamente...</p>
      </div>
    </section>
  )

  return (
    <>
      <section id="portfolio" style={{ background: '#050505', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
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
              Portfolio
            </p>
            <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Galería
            </h2>
          </motion.div>

          <div style={{
            columns: 'clamp(200px, 28vw, 340px)',
            columnGap: 12,
          }}>
            {portfolio.map((item, i) => (
              <motion.div
                key={item.id}
                onClick={() => setSelected(item)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: (i % 4) * 0.07 }}
                viewport={{ once: true }}
                style={{ breakInside: 'avoid', marginBottom: 12, cursor: 'pointer', borderRadius: 12, overflow: 'hidden', position: 'relative', background: '#111' }}
              >
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      preload="metadata"
                      playsInline
                      style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={18} height={18} fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption}
                    style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                )}
                {item.caption && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 14px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)', opacity: 0, transition: 'opacity 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    <p style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 300 }}>{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <AnimatePresence>
        {selected && <LightboxVideo item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}
