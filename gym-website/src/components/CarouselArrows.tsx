interface Props {
  onPrev: () => void
  onNext: () => void
  style?: React.CSSProperties
}

/** Flechas de carrusel unificadas: círculos blancos centrados, fuera de las fotos. */
export default function CarouselArrows({ onPrev, onNext, style }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, ...style }}>
      {[
        { action: onPrev, path: 'M15 19l-7-7 7-7' },
        { action: onNext, path: 'M9 5l7 7-7 7' },
      ].map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          aria-label={i === 0 ? 'Anterior' : 'Siguiente'}
          style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 0.2s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <svg width={16} height={16} fill="none" stroke="#000" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={btn.path} />
          </svg>
        </button>
      ))}
    </div>
  )
}
