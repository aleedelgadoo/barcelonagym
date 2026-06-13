import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../lib/data-context'

export default function FAQ() {
  const { faqs } = useData()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" style={{ background: '#000', paddingBlock: 'clamp(36px, 5vw, 68px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', paddingInline: 'clamp(24px, 5vw, 80px)' }}>

        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 20 }}>
            FAQ
          </p>
          <h2 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Preguntas frecuentes
          </h2>
        </motion.div>

        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.06 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '22px 0', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', textAlign: 'left', gap: 24,
                }}
              >
                <span style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', fontWeight: 400, color: open === i ? '#fff' : 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em', transition: 'color 0.3s', fontFamily: 'inherit' }}>
                  {faq.q}
                </span>
                <span style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.35s, border-color 0.3s', transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', borderColor: open === i ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)' }}>
                  <svg width={10} height={10} fill="none" stroke="rgba(255,255,255,0.5)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{ padding: '16px 0 24px', color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.75, maxWidth: 600 }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
