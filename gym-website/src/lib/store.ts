import { supabase } from './supabase'

export interface SiteInfo {
  logoSrc: string
  heroBg: string
  heroTitle: string
  heroSubtitle: string
  locationPhoto: string
  locationAddress: string
  mapsEmbed: string
  plansSubtitle: string
}

export const DEFAULT_SITE: SiteInfo = {
  logoSrc: '/logo.png',
  heroBg: '/hero-bg.jpg',
  heroTitle: 'Una década\ncreciendo juntos',
  heroSubtitle: 'Cada historia que entra por nuestras puertas tiene un objetivo. Nos inspira ayudar a convertirlo en realidad.',
  locationPhoto: '/fotomapa.png',
  locationAddress: 'Barcelona 1929',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.414550304101!2d-64.1570201!3d-31.430252499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2c856823349%3A0x71d2893d5dca038a!2sBARCELONA%20GYM!5e0!3m2!1ses-419!2sar!4v1781119169760!5m2!1ses-419!2sar',
  plansSubtitle: 'Todos los pases incluyen acceso a Lockers, baños con vestuario y ducha, zona de hidratación y cobertura médica ante urgencias',
}

export interface DifferentialItem {
  id: number
  name: string
  description: string
  image: string
}

export interface ContactInfo {
  phone: string
  instagram: string
}

export const DEFAULT_CONTACT: ContactInfo = {
  phone: '+54 9 3513 06-9896',
  instagram: 'bcngym',
}

export interface NewsItem {
  id: number
  title: string
  date: string
  image: string
  description: string
}

export interface FacilityItem {
  id: number
  name: string
  description: string
  image: string
}

export interface PlanOption {
  id: number
  duration: string
  price: string
  highlighted: boolean
}

export interface PlanType {
  id: number
  name: string
  description: string
  features: string[]
  options: PlanOption[]
}

export interface ScheduleItem {
  id: number
  day: string
  hours: string | string[]
}

export interface ServiceItem {
  id: number
  name: string
  image: string
}

export interface ActivitySchedule {
  day: string
  hours: string[]
}

export interface ActivityItem {
  id: number
  name: string
  description: string
  image: string
  schedules: ActivitySchedule[]
}

export interface ReviewItem {
  id: number
  name: string
  image: string
  text: string
}

export interface FAQItem {
  id: number
  q: string
  a: string
}

// Los contenidos que el usuario edita (con fotos/textos reales) NO tienen
// valores de ejemplo hardcodeados: arrancan vacíos y solo muestran los datos
// reales de Supabase, para que nunca aparezca una "segunda versión" ficticia.
export const DEFAULT_DIFFERENTIALS: DifferentialItem[] = []

export const DEFAULT_NEWS: NewsItem[] = []

export const DEFAULT_FACILITIES: FacilityItem[] = []

export const DEFAULT_PLANS: PlanType[] = []

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  { id: 1, day: 'Lunes a Viernes', hours: '6:00 — 22:00' },
  { id: 2, day: 'Sábado',          hours: '8:00 — 20:00' },
  { id: 3, day: 'Domingo',         hours: '8:00 — 18:00' },
]

export const DEFAULT_ACTIVITIES: ActivityItem[] = []

export const DEFAULT_REVIEWS: ReviewItem[] = []

export const DEFAULT_FAQS: FAQItem[] = [
  { id: 1, q: '¿Cuáles son los horarios del gimnasio?', a: 'De lunes a viernes de 7:00 a 22:00 hs. Sábados de 8:00 a 20:00 hs. Domingos y feriados de 9:00 a 14:00 hs.' },
  { id: 2, q: '¿Puedo probar el gimnasio antes de inscribirme?', a: 'Por supuesto. Ofrecemos una clase de prueba gratuita para que conozcas las instalaciones y te sientas cómodo antes de decidir.' },
  { id: 3, q: '¿Cómo me inscribo?', a: 'Podés inscribirte directamente en el gimnasio o contactarnos por WhatsApp. El proceso es rápido y sin trámites complicados.' },
  { id: 4, q: '¿Los planes incluyen acceso a todas las instalaciones?', a: 'Sí, todos los planes incluyen acceso libre a sala de pesas, cardio, vestuarios y lockers. Las clases grupales pueden tener costo adicional según el plan.' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

// PGRST116 = no se encontró fila (0 resultados). Cualquier otro error es de
// red/servidor: lo lanzamos para que el caller pueda reintentar en vez de
// caer silenciosamente en los valores por defecto.
function isNoRow(error: { code?: string } | null): boolean {
  return error?.code === 'PGRST116'
}

async function dbGet<T>(key: string, defaults: T): Promise<T> {
  const { data, error } = await supabase
    .from('site_data')
    .select('value')
    .eq('key', key)
    .single()
  if (error) {
    if (isNoRow(error)) return defaults
    throw new Error(error.message)
  }
  if (!data) return defaults
  return { ...defaults as object, ...data.value } as T
}

async function dbSet(key: string, value: unknown): Promise<string | null> {
  const { error } = await supabase
    .from('site_data')
    .upsert({ key, value }, { onConflict: 'key' })
  return error ? error.message : null
}

async function dbGetArray<T>(key: string, defaults: T[]): Promise<T[]> {
  const { data, error } = await supabase
    .from('site_data')
    .select('value')
    .eq('key', key)
    .single()
  if (error) {
    if (isNoRow(error)) return defaults
    throw new Error(error.message)
  }
  if (!data) return defaults
  return data.value as T[]
}

// ─── Image upload ────────────────────────────────────────────────────────────

// El endpoint de transformación de imágenes de Supabase Storage
// (/storage/v1/render/image/public/...) solo está disponible en el plan Pro
// en adelante. En el plan Free devuelve 403 "FeatureNotEnabled" y la imagen
// nunca carga. Por eso servimos siempre la URL original del bucket, que sí
// funciona en cualquier plan. Si en el futuro se actualiza a un plan que
// soporte transformaciones, se puede volver a reescribir la URL acá.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- width/quality se
// mantienen en la firma para no tener que tocar todos los call-sites existentes.
export function imgUrl(url: string | undefined, _width: number, _quality = 68): string {
  return url ?? ''
}

// Redimensiona y comprime imágenes en el navegador antes de subirlas, para que
// pesen mucho menos y carguen rápido. Mantiene PNG (transparencia) como PNG;
// el resto se convierte a JPEG. Si algo falla, sube el archivo original.
export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  const isPng = file.type === 'image/png'
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
    // Ya es chica y liviana: no vale la pena recomprimir.
    if (scale === 1 && file.size < 300 * 1024) { bitmap.close?.(); return file }
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) { bitmap.close?.(); return file }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()
    const outType = isPng ? 'image/png' : 'image/jpeg'
    const blob: Blob | null = await new Promise(res => canvas.toBlob(res, outType, quality))
    if (!blob || blob.size >= file.size) return file
    const name = file.name.replace(/\.[^.]+$/, '') + (isPng ? '.png' : '.jpg')
    return new File([blob], name, { type: outType })
  } catch {
    return file
  }
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file)
  const ext = compressed.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('fotos').upload(path, compressed, { upsert: false, contentType: compressed.type })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('fotos').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadWithProgress(file: File, onProgress: (pct: number) => void): Promise<string> {
  // Comprime imágenes (los videos se suben tal cual).
  const toUpload = file.type.startsWith('image/') ? await compressImage(file) : file
  const ext = toUpload.name.split('.').pop() ?? 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)) }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error(`Error ${xhr.status}`))
    xhr.onerror = () => reject(new Error('Error de red'))
    xhr.open('POST', `${supabaseUrl}/storage/v1/object/fotos/${path}`)
    xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`)
    xhr.setRequestHeader('Content-Type', toUpload.type)
    xhr.setRequestHeader('x-upsert', 'false')
    xhr.send(toUpload)
  })

  return `${supabaseUrl}/storage/v1/object/public/fotos/${path}`
}

// ─── Site ────────────────────────────────────────────────────────────────────

export const getSite    = () => dbGet<SiteInfo>('bcngym_site', DEFAULT_SITE)
export const saveSite   = (d: SiteInfo) => dbSet('bcngym_site', d)

// ─── Contact ─────────────────────────────────────────────────────────────────

export const getContact  = () => dbGet<ContactInfo>('bcngym_contact', DEFAULT_CONTACT)
export const saveContact = (d: ContactInfo) => dbSet('bcngym_contact', d)

// ─── Collections ─────────────────────────────────────────────────────────────

export const getDifferentials  = () => dbGetArray<DifferentialItem>('bcngym_differentials', DEFAULT_DIFFERENTIALS)
export const saveDifferentials = (d: DifferentialItem[]) => dbSet('bcngym_differentials', d)

export const getNews    = () => dbGetArray<NewsItem>    ('bcngym_news',       DEFAULT_NEWS)
export const saveNews   = (d: NewsItem[])    => dbSet('bcngym_news', d)

export const getFacilities  = () => dbGetArray<FacilityItem> ('bcngym_facilities',  DEFAULT_FACILITIES)
export const saveFacilities = (d: FacilityItem[])  => dbSet('bcngym_facilities', d)

export const getPlans = async (): Promise<PlanType[]> => {
  const data = await dbGetArray<PlanType>('bcngym_plans', DEFAULT_PLANS)
  // Si el dato guardado es el formato viejo (tiene 'price' directo), descartarlo
  if (data.length > 0 && !('options' in (data[0] as object))) return DEFAULT_PLANS
  return data
}
export const savePlans   = (d: PlanType[])    => dbSet('bcngym_plans', d)

export const getSchedules  = () => dbGetArray<ScheduleItem> ('bcngym_schedules',  DEFAULT_SCHEDULES)
export const saveSchedules = (d: ScheduleItem[])  => dbSet('bcngym_schedules', d)

export const getReviews  = () => dbGetArray<ReviewItem>  ('bcngym_reviews',    DEFAULT_REVIEWS)
export const saveReviews = (d: ReviewItem[])  => dbSet('bcngym_reviews', d)

export interface PendingReview {
  id: number
  name: string
  text: string
  image: string
  submittedAt: string
}

export const DEFAULT_PENDING_REVIEWS: PendingReview[] = []
export const getPendingReviews  = () => dbGetArray<PendingReview>('bcngym_pending_reviews', DEFAULT_PENDING_REVIEWS)
export const savePendingReviews = (d: PendingReview[]) => dbSet('bcngym_pending_reviews', d)

export const getFAQs       = () => dbGetArray<FAQItem>      ('bcngym_faqs',       DEFAULT_FAQS)
export const saveFAQs      = (d: FAQItem[])      => dbSet('bcngym_faqs', d)

export const getActivities  = () => dbGetArray<ActivityItem> ('bcngym_activities', DEFAULT_ACTIVITIES)
export const saveActivities = (d: ActivityItem[]) => dbSet('bcngym_activities', d)

export interface PortfolioItem {
  id: number
  type: 'image' | 'video'
  url: string
  caption: string
}

export const DEFAULT_PORTFOLIO: PortfolioItem[] = []

export const getPortfolio  = () => dbGetArray<PortfolioItem>('bcngym_portfolio', DEFAULT_PORTFOLIO)
export const savePortfolio = (d: PortfolioItem[]) => dbSet('bcngym_portfolio', d)

export const DEFAULT_SERVICES: ServiceItem[] = []

export const getServices  = () => dbGetArray<ServiceItem> ('bcngym_services', DEFAULT_SERVICES)
export const saveServices = (d: ServiceItem[]) => dbSet('bcngym_services', d)

export interface RoutineImage {
  id: number
  url: string
}

export const DEFAULT_ROUTINE: RoutineImage[] = []
export const getRoutineImages  = () => dbGetArray<RoutineImage>('bcngym_routine', DEFAULT_ROUTINE)
export const saveRoutineImages = (d: RoutineImage[]) => dbSet('bcngym_routine', d)

export function todayString(): string {
  const d = new Date()
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  return `${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()}`
}
