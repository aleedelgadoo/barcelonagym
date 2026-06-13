import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getNews, getFacilities, getDifferentials, getPlans, getSchedules, getReviews, getFAQs, getContact, getSite,
  saveNews, saveFacilities, saveDifferentials, savePlans, saveSchedules, saveReviews, saveFAQs, saveContact, saveSite, todayString, uploadImage,
  DEFAULT_SITE, DEFAULT_CONTACT, DEFAULT_NEWS, DEFAULT_FACILITIES, DEFAULT_DIFFERENTIALS, DEFAULT_PLANS, DEFAULT_SCHEDULES, DEFAULT_REVIEWS, DEFAULT_FAQS,
} from '../lib/store'
import type { NewsItem, FacilityItem, DifferentialItem, PlanItem, ScheduleItem, ReviewItem, FAQItem, ContactInfo, SiteInfo } from '../lib/store'

const input: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)',
  marginBottom: 6,
}

function Field({ label: l, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <span style={label}>{l}</span>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} style={{ ...input, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={input} />
      }
    </div>
  )
}

function compressToBlob(file: File, maxWidth = 1200, quality = 0.82): Promise<File> {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob(blob => resolve(new File([blob!], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality)
    }
    img.src = url
  })
}

function ImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const compressed = await compressToBlob(file)
      const url = await uploadImage(compressed)
      onChange(url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Imagen</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={value}
          placeholder="URL de la imagen"
          onChange={e => onChange(e.target.value)}
          style={{ ...input, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: uploading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)', fontSize: 12, cursor: uploading ? 'default' : 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0 }}
        >
          {uploading ? 'Subiendo…' : 'Subir archivo'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {uploadError && <p style={{ fontSize: 11, color: 'rgba(255,100,100,0.8)', marginTop: 4 }}>{uploadError}</p>}
    </div>
  )
}

const delBtn: React.CSSProperties = { marginTop: 22, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.15)', color: 'rgba(255,100,100,0.7)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }

function NewsCard({ item, onUpdate, onDelete }: {
  item: NewsItem
  onUpdate: (id: number, field: keyof NewsItem, value: string) => void
  onDelete: (id: number) => void
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: 100, height: 70, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
          {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{item.date}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Título" value={item.title} onChange={v => onUpdate(item.id, 'title', v)} />
          </div>
          <button onClick={() => onDelete(item.id)} style={delBtn}>Eliminar</button>
        </div>
        <Field label="Descripción" value={item.description} onChange={v => onUpdate(item.id, 'description', v)} multiline />
        <ImageUpload value={item.image} onChange={v => onUpdate(item.id, 'image', v)} />
      </div>
    </div>
  )
}

function FacilityCard({ item, onUpdate, onDelete }: {
  item: FacilityItem
  onUpdate: (id: number, field: keyof FacilityItem, value: string) => void
  onDelete: (id: number) => void
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24, alignItems: 'start' }}>
      <div style={{ width: 100, height: 70, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
        {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Nombre" value={item.name} onChange={v => onUpdate(item.id, 'name', v)} />
          </div>
          <button onClick={() => onDelete(item.id)} style={delBtn}>Eliminar</button>
        </div>
        <Field label="Descripción" value={item.description} onChange={v => onUpdate(item.id, 'description', v)} multiline />
        <ImageUpload value={item.image} onChange={v => onUpdate(item.id, 'image', v)} />
      </div>
    </div>
  )
}

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === 'Barcelona2026' && pass === 'Brasil2014') {
      sessionStorage.setItem('bcngym_auth', '1')
      onAuth()
    } else {
      setError(true)
      setPass('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={submit} style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 8 }}>BCN Gym</p>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Panel de Control</h1>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Usuario</span>
          <input
            value={user} onChange={e => { setUser(e.target.value); setError(false) }}
            autoComplete="username"
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Contraseña</span>
          <input
            type="password" value={pass} onChange={e => { setPass(e.target.value); setError(false) }}
            autoComplete="current-password"
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }}
          />
          {error && <p style={{ fontSize: 11, color: 'rgba(255,80,80,0.8)', marginTop: 6 }}>Usuario o contraseña incorrectos</p>}
        </div>
        <button type="submit" style={{ padding: '12px', borderRadius: 8, background: '#fff', color: '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', letterSpacing: '-0.01em' }}>
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('bcngym_auth') === '1')

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />

  type Tab = 'general' | 'contact' | 'news' | 'facilities' | 'differentials' | 'plans' | 'schedule' | 'reviews' | 'faq'
  const [tab, setTab] = useState<Tab>('general')
  const [loading, setLoading]                   = useState(true)
  const [site, setSiteState]                    = useState<SiteInfo>       (DEFAULT_SITE)
  const [contact, setContactState]              = useState<ContactInfo>    (DEFAULT_CONTACT)
  const [news, setNewsState]                    = useState<NewsItem[]>     (DEFAULT_NEWS)
  const [facilities, setFacilitiesState]        = useState<FacilityItem[]>(DEFAULT_FACILITIES)
  const [differentials, setDifferentialsState]  = useState<DifferentialItem[]>(DEFAULT_DIFFERENTIALS)
  const [plans, setPlansState]                  = useState<PlanItem[]>    (DEFAULT_PLANS)
  const [schedules, setSchedulesState]          = useState<ScheduleItem[]>(DEFAULT_SCHEDULES)
  const [reviews, setReviewsState]              = useState<ReviewItem[]>  (DEFAULT_REVIEWS)
  const [faqs, setFaqsState]                    = useState<FAQItem[]>     (DEFAULT_FAQS)
  const [isDirty, setIsDirty]                   = useState(false)
  const [saved, setSaved]                       = useState(false)
  const [saveError, setSaveError]               = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    Promise.all([
      getSite(), getContact(), getNews(), getFacilities(),
      getDifferentials(), getPlans(), getSchedules(), getReviews(), getFAQs(),
    ]).then(([s, c, n, f, d, p, sc, r, fq]) => {
      setSiteState(s)
      setContactState(c)
      setNewsState(n)
      setFacilitiesState(f)
      setDifferentialsState(d)
      setPlansState(p)
      setSchedulesState(sc)
      setReviewsState(r)
      setFaqsState(fq)
      setLoading(false)
    })
  }, [])

  const markDirty = () => { setIsDirty(true); setSaved(false); setSaveError(null) }

  const handleSave = async () => {
    const results = await Promise.all([
      saveSite(site), saveContact(contact), saveNews(news),
      saveDifferentials(differentials), saveFacilities(facilities),
      savePlans(plans), saveSchedules(schedules), saveReviews(reviews), saveFAQs(faqs),
    ])
    const err = results.find(r => r !== null) ?? null
    if (err) { setSaveError(err); return }
    setIsDirty(false); setSaved(true); setSaveError(null)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaved(false), 2500)
  }

  // Site
  const updateSite = (field: keyof SiteInfo, value: string) => { setSiteState(prev => ({ ...prev, [field]: value })); markDirty() }

  // Contact
  const updateContact = (field: keyof ContactInfo, value: string) => { setContactState(prev => ({ ...prev, [field]: value })); markDirty() }

  // News
  const addNews    = () => { setNewsState(prev => [{ id: Date.now(), title: '', date: todayString(), image: '', description: '' }, ...prev]); markDirty() }
  const updateNews = (id: number, field: keyof NewsItem, value: string) => { setNewsState(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n)); markDirty() }
  const deleteNews = (id: number) => { setNewsState(prev => prev.filter(n => n.id !== id)); markDirty() }

  // Differentials
  const addDifferential    = () => { setDifferentialsState(prev => [...prev, { id: Date.now(), name: '', description: '', image: '' }]); markDirty() }
  const updateDifferential = (id: number, field: keyof DifferentialItem, value: string) => { setDifferentialsState(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d)); markDirty() }
  const deleteDifferential = (id: number) => { setDifferentialsState(prev => prev.filter(d => d.id !== id)); markDirty() }

  // Facilities
  const addFacility    = () => { setFacilitiesState(prev => [...prev, { id: Date.now(), name: '', description: '', image: '' }]); markDirty() }
  const updateFacility = (id: number, field: keyof FacilityItem, value: string) => { setFacilitiesState(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f)); markDirty() }
  const deleteFacility = (id: number) => { setFacilitiesState(prev => prev.filter(f => f.id !== id)); markDirty() }

  // Plans
  const addPlan    = () => { setPlansState(prev => [...prev, { id: Date.now(), name: '', price: '', period: '/mes', description: '', highlighted: false, features: [] }]); markDirty() }
  const updatePlan = (id: number, field: keyof PlanItem, value: string | boolean | string[]) => { setPlansState(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p)); markDirty() }
  const deletePlan = (id: number) => { setPlansState(prev => prev.filter(p => p.id !== id)); markDirty() }

  // Schedules
  const addSchedule    = () => { setSchedulesState(prev => [...prev, { id: Date.now(), day: '', hours: '' }]); markDirty() }
  const updateSchedule = (id: number, field: keyof ScheduleItem, value: string) => { setSchedulesState(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s)); markDirty() }
  const deleteSchedule = (id: number) => { setSchedulesState(prev => prev.filter(s => s.id !== id)); markDirty() }

  // Reviews
  const addReview    = () => { setReviewsState(prev => [{ id: Date.now(), name: '', image: '', text: '' }, ...prev]); markDirty() }
  const updateReview = (id: number, field: keyof ReviewItem, value: string) => { setReviewsState(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r)); markDirty() }
  const deleteReview = (id: number) => { setReviewsState(prev => prev.filter(r => r.id !== id)); markDirty() }

  // FAQ
  const addFaq    = () => { setFaqsState(prev => [...prev, { id: Date.now(), q: '', a: '' }]); markDirty() }
  const updateFaq = (id: number, field: keyof FAQItem, value: string) => { setFaqsState(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f)); markDirty() }
  const deleteFaq = (id: number) => { setFaqsState(prev => prev.filter(f => f.id !== id)); markDirty() }

  const tabLabels: Record<Tab, string> = { general: 'General', contact: 'Contacto', news: 'Novedades', facilities: 'Instalaciones', differentials: 'Diferenciales', plans: 'Planes', schedule: 'Horarios', reviews: 'Testimonios', faq: 'Preguntas' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif', WebkitFontSmoothing: 'antialiased' }}>

      {/* Header */}
      <header style={{ padding: '28px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 5 }}>BCN Gym</p>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 600, letterSpacing: '-0.02em', color: '#fff' }}>Panel de Control</h1>
          </div>
          <a href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            ← Volver al sitio
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 28, minWidth: 'max-content' }}>
          {(['general', 'contact', 'news', 'facilities', 'differentials', 'plans', 'schedule', 'reviews', 'faq'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ paddingBlock: 20, fontSize: 13, fontWeight: tab === t ? 500 : 400, color: tab === t ? '#fff' : 'rgba(255,255,255,0.28)', borderBottom: `1px solid ${tab === t ? '#fff' : 'transparent'}`, background: 'none', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '44px 40px 120px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13, letterSpacing: '0.1em' }}>
            Cargando datos…
          </div>
        )}

        {!loading && tab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Portada */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Portada principal</p>

              <ImageUpload value={site.logoSrc} onChange={v => updateSite('logoSrc', v)} />
              <div>
                <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Foto de portada (fondo)</span>
                <ImageUpload value={site.heroBg} onChange={v => updateSite('heroBg', v)} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Título principal</span>
                <textarea
                  value={site.heroTitle}
                  onChange={e => updateSite('heroTitle', e.target.value)}
                  style={{ ...input, resize: 'vertical', minHeight: 72, lineHeight: 1.6 }}
                  placeholder={'Una década\ncreciendo juntos'}
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 5 }}>Cada salto de línea se convierte en un quiebre en el título.</p>
              </div>
              <Field label="Subtítulo" value={site.heroSubtitle} onChange={v => updateSite('heroSubtitle', v)} multiline />
            </div>

            {/* Ubicación */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Sección Ubicación</p>
              <div>
                <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Foto junto al mapa</span>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <ImageUpload value={site.locationPhoto} onChange={v => updateSite('locationPhoto', v)} />
                  </div>
                  {site.locationPhoto && (
                    <div style={{ width: 80, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <img src={site.locationPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>
              <Field label="Dirección (texto junto al mapa)" value={site.locationAddress} onChange={v => updateSite('locationAddress', v)} />
              <div>
                <Field label="URL embed de Google Maps" value={site.mapsEmbed} onChange={v => updateSite('mapsEmbed', v)} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 5 }}>En Google Maps → Compartir → Insertar un mapa → copiá la URL del atributo src del iframe.</p>
              </div>
            </div>

          </div>
        )}

        {!loading && tab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 4 }}>Datos de contacto visibles en la sección Contacto del sitio.</p>
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <Field label="Número de WhatsApp" value={contact.phone} onChange={v => updateContact('phone', v)} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 6, letterSpacing: '0.02em' }}>
                  Se usa como número visible y para generar el enlace wa.me/… (se eliminan los caracteres no numéricos automáticamente).
                </p>
              </div>
              <div>
                <Field label="Usuario de Instagram (sin @)" value={contact.instagram} onChange={v => updateContact('instagram', v)} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 6, letterSpacing: '0.02em' }}>
                  Solo el nombre de usuario, sin el símbolo @. Ej: bcngym
                </p>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)' }}>Vista previa</span>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.12)' }}>
                    <span style={{ fontSize: 13, color: '#25D366' }}>WhatsApp</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>{contact.phone || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: 'rgba(225,48,108,0.06)', border: '1px solid rgba(225,48,108,0.12)' }}>
                    <span style={{ fontSize: 13, color: '#e1306c' }}>Instagram</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>@{contact.instagram || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && tab === 'news' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: '0.05em' }}>
                {news.length} novedad{news.length !== 1 ? 'es' : ''}
              </p>
              <button onClick={addNews}
                style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', letterSpacing: '0.01em' }}>
                + Nueva novedad
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {news.map(item => (
                <NewsCard key={item.id} item={item} onUpdate={updateNews} onDelete={deleteNews} />
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'facilities' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: '0.05em' }}>
                {facilities.length} instalaciones
              </p>
              <button onClick={addFacility} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nueva instalación</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {facilities.map(item => (
                <FacilityCard key={item.id} item={item} onUpdate={updateFacility} onDelete={deleteFacility} />
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'differentials' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{differentials.length} diferencial{differentials.length !== 1 ? 'es' : ''}</p>
              <button onClick={addDifferential} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nuevo diferencial</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {differentials.map(item => (
                <div key={item.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24, alignItems: 'start' }}>
                  <div style={{ width: 100, height: 70, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <Field label="Nombre" value={item.name} onChange={v => updateDifferential(item.id, 'name', v)} />
                      </div>
                      <button onClick={() => deleteDifferential(item.id)} style={delBtn}>Eliminar</button>
                    </div>
                    <Field label="Descripción" value={item.description} onChange={v => updateDifferential(item.id, 'description', v)} multiline />
                    <ImageUpload value={item.image} onChange={v => updateDifferential(item.id, 'image', v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'plans' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{plans.length} plan{plans.length !== 1 ? 'es' : ''}</p>
              <button onClick={addPlan} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nuevo plan</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {plans.map(plan => (
                <div key={plan.id} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${plan.highlighted ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Field label="Nombre del plan" value={plan.name} onChange={v => updatePlan(plan.id, 'name', v)} />
                    </div>
                    <button onClick={() => deletePlan(plan.id)} style={delBtn}>Eliminar</button>
                  </div>
                  <Field label="Descripción" value={plan.description} onChange={v => updatePlan(plan.id, 'description', v)} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Precio (sin $)" value={plan.price} onChange={v => updatePlan(plan.id, 'price', v)} />
                    <Field label="Período (ej: /mes)" value={plan.period} onChange={v => updatePlan(plan.id, 'period', v)} />
                  </div>
                  <div>
                    <span style={label}>Características (una por línea)</span>
                    <textarea
                      value={plan.features.join('\n')}
                      onChange={e => updatePlan(plan.id, 'features', e.target.value.split('\n'))}
                      style={{ ...input, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                      placeholder="Acceso 24/7&#10;Clases grupales&#10;Vestuarios"
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                    <div
                      onClick={() => updatePlan(plan.id, 'highlighted', !plan.highlighted)}
                      style={{ width: 36, height: 20, borderRadius: 99, background: plan.highlighted ? '#fff' : 'rgba(255,255,255,0.12)', transition: 'background 0.25s', position: 'relative', flexShrink: 0, cursor: 'pointer' }}
                    >
                      <div style={{ position: 'absolute', top: 2, left: plan.highlighted ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: plan.highlighted ? '#000' : 'rgba(255,255,255,0.5)', transition: 'left 0.25s' }} />
                    </div>
                    <span style={{ fontSize: 12, color: plan.highlighted ? '#fff' : 'rgba(255,255,255,0.38)', letterSpacing: '0.05em' }}>
                      {plan.highlighted ? 'Marcado como "Más popular"' : 'Marcar como "Más popular"'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'schedule' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{schedules.length} horario{schedules.length !== 1 ? 's' : ''}</p>
              <button onClick={addSchedule} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nuevo horario</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {schedules.map(s => (
                <div key={s.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                  <Field label="Día / Rango" value={s.day} onChange={v => updateSchedule(s.id, 'day', v)} />
                  <Field label="Horario (ej: 6:00 — 22:00)" value={s.hours} onChange={v => updateSchedule(s.id, 'hours', v)} />
                  <button onClick={() => deleteSchedule(s.id)} style={{ ...delBtn, marginTop: 0, alignSelf: 'flex-end' }}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{reviews.length} testimonios</p>
              <button onClick={addReview} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nuevo testimonio</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(item => (
                <div key={item.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                      {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}><Field label="Nombre" value={item.name} onChange={v => updateReview(item.id, 'name', v)} /></div>
                      <button onClick={() => deleteReview(item.id)} style={delBtn}>Eliminar</button>
                    </div>
                    <Field label="Testimonio" value={item.text} onChange={v => updateReview(item.id, 'text', v)} multiline />
                    <ImageUpload value={item.image} onChange={v => updateReview(item.id, 'image', v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'faq' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{faqs.length} preguntas</p>
              <button onClick={addFaq} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nueva pregunta</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map(item => (
                <div key={item.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}><Field label="Pregunta" value={item.q} onChange={v => updateFaq(item.id, 'q', v)} /></div>
                    <button onClick={() => deleteFaq(item.id)} style={delBtn}>Eliminar</button>
                  </div>
                  <Field label="Respuesta" value={item.a} onChange={v => updateFaq(item.id, 'a', v)} multiline />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Error toast */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', padding: '14px 24px', borderRadius: 12, background: 'rgba(220,60,60,0.95)', color: '#fff', fontSize: 13, fontWeight: 500, zIndex: 101, maxWidth: 420, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          >
            ⚠ {saveError}
            <button onClick={() => setSaveError(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Save Button */}
      <AnimatePresence>
        {(isDirty || saved) && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={handleSave}
            style={{
              position: 'fixed', bottom: 32, right: 32,
              padding: '14px 28px', borderRadius: 99,
              background: saved ? 'rgba(255,255,255,0.9)' : '#fff',
              color: '#000', fontSize: 13, fontWeight: 600,
              cursor: saved ? 'default' : 'pointer', border: 'none',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              zIndex: 100, letterSpacing: '-0.01em',
              pointerEvents: saved ? 'none' : 'auto',
            }}
          >
            {saved ? '✓ Guardado' : 'Guardar cambios'}
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  )
}
