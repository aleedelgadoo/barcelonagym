import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getNews, getFacilities, getDifferentials, getPlans, getSchedules, getReviews, getFAQs, getContact, getSite, getActivities, getServices, getPortfolio, getPendingReviews,
  saveNews, saveFacilities, saveDifferentials, savePlans, saveSchedules, saveReviews, saveFAQs, saveContact, saveSite, saveActivities, saveServices, savePortfolio, savePendingReviews, todayString, uploadImage, uploadWithProgress,
  DEFAULT_SITE, DEFAULT_CONTACT, DEFAULT_NEWS, DEFAULT_FACILITIES, DEFAULT_DIFFERENTIALS, DEFAULT_PLANS, DEFAULT_SCHEDULES, DEFAULT_REVIEWS, DEFAULT_FAQS, DEFAULT_ACTIVITIES, DEFAULT_SERVICES, DEFAULT_PORTFOLIO, DEFAULT_PENDING_REVIEWS,
} from '../lib/store'
import type { NewsItem, FacilityItem, DifferentialItem, PlanType, PlanOption, ScheduleItem, ReviewItem, FAQItem, ContactInfo, SiteInfo, ActivityItem, ActivitySchedule, ServiceItem, PortfolioItem, PendingReview } from '../lib/store'

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

function AdminPanel() {
  type Tab = 'general' | 'contact' | 'news' | 'facilities' | 'services' | 'differentials' | 'plans' | 'schedule' | 'activities' | 'reviews' | 'faq' | 'portfolio'
  const [tab, setTab] = useState<Tab>('general')
  const [loading, setLoading]                   = useState(true)
  const [site, setSiteState]                    = useState<SiteInfo>       (DEFAULT_SITE)
  const [contact, setContactState]              = useState<ContactInfo>    (DEFAULT_CONTACT)
  const [news, setNewsState]                    = useState<NewsItem[]>     (DEFAULT_NEWS)
  const [facilities, setFacilitiesState]        = useState<FacilityItem[]>(DEFAULT_FACILITIES)
  const [differentials, setDifferentialsState]  = useState<DifferentialItem[]>(DEFAULT_DIFFERENTIALS)
  const [plans, setPlansState]                  = useState<PlanType[]>    (DEFAULT_PLANS)
  const [schedules, setSchedulesState]          = useState<ScheduleItem[]>(DEFAULT_SCHEDULES)
  const [reviews, setReviewsState]              = useState<ReviewItem[]>  (DEFAULT_REVIEWS)
  const [faqs, setFaqsState]                    = useState<FAQItem[]>     (DEFAULT_FAQS)
  const [activities, setActivitiesState]        = useState<ActivityItem[]>(DEFAULT_ACTIVITIES)
  const [services, setServicesState]            = useState<ServiceItem[]>   (DEFAULT_SERVICES)
  const [portfolio, setPortfolioState]          = useState<PortfolioItem[]> (DEFAULT_PORTFOLIO)
  const [pendingReviews, setPendingReviewsState] = useState<PendingReview[]>(DEFAULT_PENDING_REVIEWS)
  const [isDirty, setIsDirty]                   = useState(false)
  const [saved, setSaved]                       = useState(false)
  const [saveError, setSaveError]               = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    Promise.all([
      getSite(), getContact(), getNews(), getFacilities(),
      getDifferentials(), getPlans(), getSchedules(), getReviews(), getFAQs(), getActivities(), getServices(), getPortfolio(), getPendingReviews(),
    ]).then(([s, c, n, f, d, p, sc, r, fq, act, svc, port, pending]) => {
      setSiteState(s)
      setContactState(c)
      setNewsState(n)
      setFacilitiesState(f)
      setDifferentialsState(d)
      setPlansState(p)
      setSchedulesState(sc)
      setReviewsState(r)
      setFaqsState(fq)
      setActivitiesState(act)
      setServicesState(svc)
      setPortfolioState(port)
      setPendingReviewsState(pending)
      setLoading(false)
    }).catch(err => {
      console.error('Error loading data:', err)
      setLoading(false)
    })
  }, [])

  const markDirty = () => { setIsDirty(true); setSaved(false); setSaveError(null) }

  const handleSave = async () => {
    const results = await Promise.all([
      saveSite(site), saveContact(contact), saveNews(news),
      saveDifferentials(differentials), saveFacilities(facilities),
      savePlans(plans), saveSchedules(schedules), saveReviews(reviews), saveFAQs(faqs), saveActivities(activities), saveServices(services), savePortfolio(portfolio), savePendingReviews(pendingReviews),
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
  const addPlan = () => {
    setPlansState(prev => [...prev, { id: Date.now(), name: '', description: '', features: [], options: [{ id: Date.now() + 1, duration: 'Mensual', price: '', highlighted: true }] }]);
    markDirty()
  }
  const updatePlanType = (id: number, field: keyof Omit<PlanType, 'options'>, value: string | string[]) => {
    setPlansState(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    markDirty()
  }
  const addPlanOption = (planId: number) => {
    setPlansState(prev => prev.map(p => p.id === planId ? { ...p, options: [...p.options, { id: Date.now(), duration: '', price: '', highlighted: false }] } : p))
    markDirty()
  }
  const updatePlanOption = (planId: number, optionId: number, field: keyof PlanOption, value: string | boolean) => {
    setPlansState(prev => prev.map(p => p.id === planId ? { ...p, options: p.options.map(o => o.id === optionId ? { ...o, [field]: value } : o) } : p))
    markDirty()
  }
  const deletePlanOption = (planId: number, optionId: number) => {
    setPlansState(prev => prev.map(p => p.id === planId ? { ...p, options: p.options.filter(o => o.id !== optionId) } : p))
    markDirty()
  }
  const deletePlan = (id: number) => { setPlansState(prev => prev.filter(p => p.id !== id)); markDirty() }

  // Schedules
  const addSchedule          = () => { setSchedulesState(prev => [...prev, { id: Date.now(), day: '', hours: [''] }]); markDirty() }
  const updateScheduleDay    = (id: number, value: string) => { setSchedulesState(prev => prev.map(s => s.id === id ? { ...s, day: value } : s)); markDirty() }
  const deleteSchedule       = (id: number) => { setSchedulesState(prev => prev.filter(s => s.id !== id)); markDirty() }
  const addScheduleRange     = (id: number) => { setSchedulesState(prev => prev.map(s => s.id === id ? { ...s, hours: [...(Array.isArray(s.hours) ? s.hours : [s.hours as string]), ''] } : s)); markDirty() }
  const updateScheduleRange  = (id: number, ri: number, value: string) => { setSchedulesState(prev => prev.map(s => s.id === id ? { ...s, hours: (Array.isArray(s.hours) ? s.hours : [s.hours as string]).map((h, j) => j === ri ? value : h) } : s)); markDirty() }
  const deleteScheduleRange  = (id: number, ri: number) => { setSchedulesState(prev => prev.map(s => s.id === id ? { ...s, hours: (Array.isArray(s.hours) ? s.hours : [s.hours as string]).filter((_, j) => j !== ri) } : s)); markDirty() }

  // Reviews
  const addReview    = () => { setReviewsState(prev => [{ id: Date.now(), name: '', image: '', text: '' }, ...prev]); markDirty() }
  const updateReview = (id: number, field: keyof ReviewItem, value: string) => { setReviewsState(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r)); markDirty() }
  const deleteReview = (id: number) => { setReviewsState(prev => prev.filter(r => r.id !== id)); markDirty() }

  // FAQ
  const addFaq    = () => { setFaqsState(prev => [...prev, { id: Date.now(), q: '', a: '' }]); markDirty() }
  const updateFaq = (id: number, field: keyof FAQItem, value: string) => { setFaqsState(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f)); markDirty() }
  const deleteFaq = (id: number) => { setFaqsState(prev => prev.filter(f => f.id !== id)); markDirty() }

  // Activities
  const addActivity    = () => { setActivitiesState(prev => [...prev, { id: Date.now(), name: '', description: '', image: '', schedules: [] }]); markDirty() }
  const updateActivity = (id: number, field: keyof Omit<ActivityItem, 'schedules'>, value: string) => { setActivitiesState(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a)); markDirty() }
  const deleteActivity = (id: number) => { setActivitiesState(prev => prev.filter(a => a.id !== id)); markDirty() }
  const addActivitySchedule = (actId: number) => { setActivitiesState(prev => prev.map(a => a.id === actId ? { ...a, schedules: [...a.schedules, { day: '', hours: [''] }] } : a)); markDirty() }
  const updateActivityScheduleDay = (actId: number, idx: number, value: string) => { setActivitiesState(prev => prev.map(a => a.id === actId ? { ...a, schedules: a.schedules.map((s, i) => i === idx ? { ...s, day: value } : s) } : a)); markDirty() }
  const deleteActivitySchedule = (actId: number, idx: number) => { setActivitiesState(prev => prev.map(a => a.id === actId ? { ...a, schedules: a.schedules.filter((_, i) => i !== idx) } : a)); markDirty() }
  const addActivityScheduleRange = (actId: number, idx: number) => { setActivitiesState(prev => prev.map(a => a.id === actId ? { ...a, schedules: a.schedules.map((s, i) => i === idx ? { ...s, hours: [...(Array.isArray(s.hours) ? s.hours : [s.hours as unknown as string]), ''] } : s) } : a)); markDirty() }
  const updateActivityScheduleRange = (actId: number, idx: number, ri: number, value: string) => { setActivitiesState(prev => prev.map(a => a.id === actId ? { ...a, schedules: a.schedules.map((s, i) => i === idx ? { ...s, hours: (Array.isArray(s.hours) ? s.hours : [s.hours as unknown as string]).map((h, j) => j === ri ? value : h) } : s) } : a)); markDirty() }
  const deleteActivityScheduleRange = (actId: number, idx: number, ri: number) => { setActivitiesState(prev => prev.map(a => a.id === actId ? { ...a, schedules: a.schedules.map((s, i) => i === idx ? { ...s, hours: (Array.isArray(s.hours) ? s.hours : [s.hours as unknown as string]).filter((_, j) => j !== ri) } : s) } : a)); markDirty() }

  // Services
  const addService    = () => { setServicesState(prev => [...prev, { id: Date.now(), name: '', image: '' }]); markDirty() }
  const updateService = (id: number, field: keyof ServiceItem, value: string) => { setServicesState(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s)); markDirty() }
  const deleteService = (id: number) => { setServicesState(prev => prev.filter(s => s.id !== id)); markDirty() }

  // Portfolio
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; pct: number }[]>([])
  const deletePortfolioItem = (id: number) => { setPortfolioState(prev => prev.filter(p => p.id !== id)); markDirty() }
  const updatePortfolioCaption = (id: number, caption: string) => { setPortfolioState(prev => prev.map(p => p.id === id ? { ...p, caption } : p)); markDirty() }

  // Pending reviews
  const approveReview = (pr: PendingReview) => {
    const newReview: ReviewItem = { id: Date.now(), name: pr.name, image: pr.image ?? '', text: pr.text }
    setReviewsState(prev => [newReview, ...prev])
    setPendingReviewsState(prev => prev.filter(p => p.id !== pr.id))
    markDirty()
  }
  const rejectReview = (id: number) => { setPendingReviewsState(prev => prev.filter(p => p.id !== id)); markDirty() }

  const tabLabels: Record<Tab, string> = { general: 'General', contact: 'Contacto', news: 'Novedades', facilities: 'Instalaciones', services: 'Servicios', differentials: 'Diferenciales', plans: 'Planes', schedule: 'Horarios', activities: 'Actividades', reviews: 'Reseñas', faq: 'Preguntas', portfolio: 'Portfolio' }

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
          {(['general', 'contact', 'news', 'facilities', 'services', 'differentials', 'plans', 'schedule', 'activities', 'reviews', 'faq', 'portfolio'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ paddingBlock: 20, fontSize: 13, fontWeight: tab === t ? 500 : 400, color: (t === 'reviews' && pendingReviews.length > 0) ? '#fff' : tab === t ? '#fff' : 'rgba(255,255,255,0.28)', borderBottom: `1px solid ${tab === t ? '#fff' : 'transparent'}`, background: 'none', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 7 }}>
              {tabLabels[t]}
              {t === 'reviews' && pendingReviews.length > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 99, background: '#fff', color: '#000', fontSize: 10, fontWeight: 700, padding: '0 5px' }}>
                  {pendingReviews.length}
                </span>
              )}
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

            {/* Planes */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Sección Planes</p>
              <Field label="Texto inferior del título" value={site.plansSubtitle ?? ''} onChange={v => updateSite('plansSubtitle', v)} multiline />
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
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{plans.length} tipo{plans.length !== 1 ? 's' : ''} de plan</p>
              <button onClick={addPlan} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nuevo tipo de plan</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {plans.map(planType => (
                <div key={planType.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Field label="Nombre del tipo de plan" value={planType.name} onChange={v => updatePlanType(planType.id, 'name', v)} />
                    </div>
                    <button onClick={() => deletePlan(planType.id)} style={delBtn}>Eliminar</button>
                  </div>
                  <Field label="Descripción" value={planType.description} onChange={v => updatePlanType(planType.id, 'description', v)} />
                  <div>
                    <span style={label}>Características (una por línea)</span>
                    <textarea
                      value={planType.features.join('\n')}
                      onChange={e => updatePlanType(planType.id, 'features', e.target.value.split('\n'))}
                      style={{ ...input, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
                      placeholder="Acceso 24/7&#10;Clases grupales&#10;Vestuarios"
                    />
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{planType.options.length} opción{planType.options.length !== 1 ? 'es' : ''}</p>
                      <button onClick={() => addPlanOption(planType.id)} style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer' }}>+ Opción</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {planType.options.map(option => (
                        <div key={option.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end' }}>
                          <Field label="Duración" value={option.duration} onChange={v => updatePlanOption(planType.id, option.id, 'duration', v)} />
                          <Field label="Precio (sin $)" value={option.price} onChange={v => updatePlanOption(planType.id, option.id, 'price', v)} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none', marginTop: 22 }}>
                            <div
                              onClick={() => updatePlanOption(planType.id, option.id, 'highlighted', !option.highlighted)}
                              style={{ width: 24, height: 14, borderRadius: 999, background: option.highlighted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)', transition: 'background 0.25s', position: 'relative', flexShrink: 0, cursor: 'pointer' }}
                            >
                              <div style={{ position: 'absolute', top: 1, left: option.highlighted ? 11 : 1, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left 0.25s' }} />
                            </div>
                            <span style={{ fontSize: 9, color: option.highlighted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Popular</span>
                          </label>
                          <button onClick={() => deletePlanOption(planType.id, option.id)} style={{ ...delBtn, marginTop: 22, padding: '6px 10px', fontSize: 11 }}>-</button>
                        </div>
                      ))}
                    </div>
                  </div>
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
              {schedules.map(s => {
                const ranges = Array.isArray(s.hours) ? s.hours : [s.hours as string]
                return (
                  <div key={s.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}><Field label="Día / Rango" value={s.day} onChange={v => updateScheduleDay(s.id, v)} /></div>
                      <button onClick={() => deleteSchedule(s.id)} style={{ ...delBtn, alignSelf: 'flex-end' }}>Eliminar</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 4 }}>
                      {ranges.map((r, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <div style={{ flex: 1 }}><Field label={`Horario${ranges.length > 1 ? ` ${ri + 1}` : ''} (ej: 6:00 — 22:00)`} value={r} onChange={v => updateScheduleRange(s.id, ri, v)} /></div>
                          {ranges.length > 1 && <button onClick={() => deleteScheduleRange(s.id, ri)} style={{ ...delBtn, marginTop: 22 }}>×</button>}
                        </div>
                      ))}
                      <button onClick={() => addScheduleRange(s.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', alignSelf: 'flex-start', marginTop: 2 }}>+ rango horario</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!loading && tab === 'reviews' && (
          <div>
            {/* Pendientes */}
            {pendingReviews.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', marginBottom: 16 }}>
                  Pendientes de aprobación — {pendingReviews.length}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pendingReviews.map(pr => (
                    <div key={pr.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          {pr.image && <img src={pr.image} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />}
                          <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{pr.name}</span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>{pr.submittedAt}</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.6 }}>"{pr.text}"</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => approveReview(pr)} style={{ padding: '7px 16px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>Aprobar</button>
                        <button onClick={() => rejectReview(pr.id)} style={delBtn}>Rechazar</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginTop: 32, marginBottom: 28 }} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{reviews.length} reseñas</p>
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

        {!loading && tab === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{portfolio.length} elementos</p>
              <label style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>
                + Subir foto / video
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={async e => {
                    const files = Array.from(e.target.files ?? [])
                    e.target.value = ''
                    for (const file of files) {
                      const entry = { name: file.name, pct: 0 }
                      setUploadingFiles(prev => [...prev, entry])
                      try {
                        const url = await uploadWithProgress(file, pct => {
                          setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, pct } : f))
                        })
                        const type: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image'
                        setPortfolioState(prev => [...prev, { id: Date.now() + Math.random(), type, url, caption: '' }])
                        markDirty()
                      } catch { /* ignore */ }
                      setUploadingFiles(prev => prev.filter(f => f.name !== file.name))
                    }
                  }}
                />
              </label>
            </div>
            {uploadingFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
                {uploadingFiles.map(f => (
                  <div key={f.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{f.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500, flexShrink: 0 }}>{f.pct}%</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#fff', borderRadius: 99, width: `${f.pct}%`, transition: 'width 0.2s ease' }} />
                    </div>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6, letterSpacing: '0.05em' }}>
                      {f.pct < 100 ? 'Subiendo...' : 'Procesando...'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {portfolio.map(item => (
                <div key={item.id} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: 140, background: '#000', overflow: 'hidden' }}>
                    {item.type === 'video'
                      ? <video src={item.url} muted preload="metadata" playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    }
                    {item.type === 'video' && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <svg width={28} height={28} fill="rgba(255,255,255,0.7)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <Field label="Descripción (opcional)" value={item.caption} onChange={v => updatePortfolioCaption(item.id, v)} />
                    <button onClick={() => deletePortfolioItem(item.id)} style={{ ...delBtn, marginTop: 0 }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{services.length} servicios</p>
              <button onClick={addService} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nuevo servicio</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {services.map(svc => (
                <div key={svc.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {svc.image
                      ? <img src={svc.image} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span style={{ fontSize: 20, opacity: 0.2 }}>?</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}><Field label="Nombre" value={svc.name} onChange={v => updateService(svc.id, 'name', v)} /></div>
                  <label style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 11, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                    PNG
                    <input type="file" accept="image/png,image/svg+xml,image/webp" style={{ display: 'none' }} onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadImage(f); updateService(svc.id, 'image', url) }} />
                  </label>
                  <button onClick={() => deleteService(svc.id)} style={delBtn}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'activities' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{activities.length} actividades</p>
              <button onClick={addActivity} style={{ padding: '9px 20px', borderRadius: 99, background: '#fff', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>+ Nueva actividad</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {activities.map(act => (
                <div key={act.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}><Field label="Nombre" value={act.name} onChange={v => updateActivity(act.id, 'name', v)} /></div>
                    <button onClick={() => deleteActivity(act.id)} style={delBtn}>Eliminar</button>
                  </div>
                  <Field label="Descripción" value={act.description} onChange={v => updateActivity(act.id, 'description', v)} multiline />
                  <div>
                    <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Imagen</span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const }}>
                      {act.image && <img src={act.image} alt="" style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />}
                      <label style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        Subir foto
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadImage(f); updateActivity(act.id, 'image', url) }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)' }}>Horarios</span>
                      <button onClick={() => addActivitySchedule(act.id)} style={{ fontSize: 11, padding: '5px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Día</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {act.schedules.map((s, i) => {
                        const ranges = Array.isArray(s.hours) ? s.hours : [s.hours as unknown as string]
                        return (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <div style={{ flex: 1 }}><Field label="Día" value={s.day} onChange={v => updateActivityScheduleDay(act.id, i, v)} /></div>
                              <button onClick={() => deleteActivitySchedule(act.id, i)} style={{ ...delBtn, marginTop: 22 }}>×</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 4 }}>
                              {ranges.map((r, ri) => (
                                <div key={ri} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}><Field label={`Rango ${ri + 1}`} value={r} onChange={v => updateActivityScheduleRange(act.id, i, ri, v)} /></div>
                                  {ranges.length > 1 && <button onClick={() => deleteActivityScheduleRange(act.id, i, ri)} style={{ ...delBtn, marginTop: 22 }}>×</button>}
                                </div>
                              ))}
                              <button onClick={() => addActivityScheduleRange(act.id, i)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', alignSelf: 'flex-start', marginTop: 2 }}>+ rango horario</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
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

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('bcngym_auth') === '1')
  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />
  return <AdminPanel />
}
