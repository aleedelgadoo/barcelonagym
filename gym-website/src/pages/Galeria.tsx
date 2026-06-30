import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DataProvider } from '../lib/data-context'
import { useData } from '../lib/data-context'
import type { PortfolioItem } from '../lib/store'

function Lightbox({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 960, width: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative' }}
      >
        {item.type === 'video'
          ? <video src={item.url} controls autoPlay style={{ width: '100%', display: 'block', maxHeight: '82vh', background: '#000' }} />
          : <img src={item.url} alt={item.caption} style={{ width: '100%', display: 'block', maxHeight: '88vh', objectFit: 'contain' }} />
        }
        {item.caption && (
          <div style={{ background: 'rgba(0,0,0,0.75)', padding: '12px 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', fontWeight: 300 }}>{item.caption}</p>
          </div>
        )}
      </motion.div>
      <button
        onClick={onClose}
        style={{ position: 'fixed', top: 20, right: 20, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >×</button>
    </motion.div>
  )
}

function GaleriaContent() {
  const { portfolio } = useData()
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  return (
    <div className="min-h-screen bg-black" style={{ paddingBlock: 'clamp(48px, 7vw, 96px)' }}>
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase', marginBottom: 40, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 16 }}>Barcelona GYM</p>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Galería</h1>
        </motion.div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>
        {portfolio.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', fontWeight: 300, textAlign: 'center', paddingBlock: 80 }}>Próximamente...</p>
        ) : (
          <div style={{ columns: 'clamp(180px, 26vw, 320px)', columnGap: 12 }}>
            {portfolio.map((item, i) => (
              <motion.div
                key={item.id}
                onClick={() => setSelected(item)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 5) * 0.06 }}
                style={{ breakInside: 'avoid', marginBottom: 12, cursor: 'pointer', borderRadius: 10, overflow: 'hidden', position: 'relative', background: '#111' }}
              >
                {item.type === 'video' ? (
                  <>
                    <video src={`${item.url}#t=0.1`} muted preload="metadata" playsInline style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={16} height={16} fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt={item.caption} loading="lazy" decoding="async" style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default function Galeria() {
  return (
    <DataProvider>
      <GaleriaContent />
    </DataProvider>
  )
}
