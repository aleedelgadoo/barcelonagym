import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'
import CarouselArrows from './CarouselArrows'
import { getPendingReviews, savePendingReviews, uploadImage, imgUrl } from '../lib/store'
import type { PendingReview } from '../lib/store'

function ReviewForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  const submit = async () => {
    if (!name.trim() || !text.trim()) return
    setLoading(true)
    let imageUrl = ''
    if (imageFile) {
      try { imageUrl = await uploadImage(imageFile) } catch { imageUrl = '' }
    }
    const existing = await getPendingReviews()
    const newEntry: PendingReview = { id: Date.now(), name: name.trim(), text: text.trim(), image: imageUrl, submittedAt: new Date().toLocaleDateString('es-AR') }
    await savePendingReviews([...existing, newEntry])
    setSent(true)
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 36, maxWidth: 440, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        {sent ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: 12 }}>✓</p>
            <p style={{ color: '#fff', fontWeight: 500, marginBottom: 8 }}>¡Gracias por tu reseña!</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 300 }}>Tu comentario quedó pendiente de aprobación.</p>
            <button onClick={onClose} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none' }}>Cerrar</button>
          </div>
        ) : (
          <>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Dejá tu reseña</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 300 }}>Tu comentario será revisado antes de publicarse.</p>
            </div>

            {/* Foto + Nombre en fila */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
              <label style={{ flexShrink: 0, cursor: 'pointer', position: 'relative' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {imagePreview
                    ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <svg width={20} height={20} fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  }
                </div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={10} height={10} fill="none" stroke="#000" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
              </label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Nombre</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: '0.9rem', outline: 'none', fontWeight: 300 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Comentario</label>
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Contanos tu experiencia..."
                rows={4}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontWeight: 300 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 99, background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>Cancelar</button>
              <button
                onClick={submit}
                disabled={loading || !name.trim() || !text.trim()}
                style={{ flex: 2, padding: '12px', borderRadius: 99, background: (!name.trim() || !text.trim()) ? 'rgba(255,255,255,0.2)' : '#fff', color: '#000', fontSize: 13, fontWeight: 600, cursor: (!name.trim() || !text.trim()) ? 'not-allowed' : 'pointer', border: 'none', transition: 'background 0.2s' }}
              >
                {loading ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Reviews() {
  const { reviews } = useData()
  const [showForm, setShowForm] = useState(false)
  const [current, setCurrent] = useState(0)
  const len = reviews.length
  const prev = () => setCurrent(i => (i === 0 ? len - 1 : i - 1))
  const next = () => setCurrent(i => (i === len - 1 ? 0 : i + 1))
  const idx = len > 0 ? Math.min(current, len - 1) : 0

  return (
    <>
      <section id="reviews" style={{ background: '#0a0a0a', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
              Reseñas
            </p>
            <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Lo que dicen nuestros miembros
            </h2>
          </motion.div>

          {len > 0 && (
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              {/* Flechas arriba */}
              {len > 1 && (
                <CarouselArrows onPrev={prev} onNext={next} style={{ marginBottom: 20 }} />
              )}

              {/* Tarjeta */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(28px, 4vw, 44px)', display: 'flex', flexDirection: 'column', gap: 28 }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.85, fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', fontStyle: 'italic' }}>
                    "{reviews[idx].text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {reviews[idx].image
                      ? <img src={imgUrl(reviews[idx].image, 120)} alt={reviews[idx].name} loading="lazy" decoding="async" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(15%)' }} />
                      : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width={20} height={20} fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                    }
                    <div>
                      <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{reviews[idx].name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.1em', marginTop: 3 }}>★★★★★</p>
                    </div>
                    {len > 1 && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                        {idx + 1} / {len}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              {len > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 24 }}>
                  {reviews.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      style={{ borderRadius: 999, height: 5, transition: 'all 0.3s', cursor: 'pointer', border: 'none', background: i === idx ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.15)', width: i === idx ? 20 : 5 }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <motion.div
            className="text-center"
            style={{ marginTop: 48 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowForm(true)}
              style={{ fontSize: '0.85rem', letterSpacing: '0.04em', fontWeight: 500, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '13px 28px', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >
              Dejá tu reseña →
            </button>
          </motion.div>

        </div>
      </section>

      <AnimatePresence>
        {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </>
  )
}
