import { supabase } from './supabase'

export interface SiteInfo {
  logoSrc: string
  heroBg: string
  heroTitle: string
  heroSubtitle: string
  locationPhoto: string
  locationAddress: string
  mapsEmbed: string
}

export const DEFAULT_SITE: SiteInfo = {
  logoSrc: '/logo.png',
  heroBg: '/fondo.avif',
  heroTitle: 'Una década\ncreciendo juntos',
  heroSubtitle: 'Cada historia que entra por nuestras puertas tiene un objetivo. Nos inspira ayudar a convertirlo en realidad.',
  locationPhoto: '/fotomapa.png',
  locationAddress: 'Barcelona 1929',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.414550304101!2d-64.1570201!3d-31.430252499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2c856823349%3A0x71d2893d5dca038a!2sBARCELONA%20GYM!5e0!3m2!1ses-419!2sar!4v1781119169760!5m2!1ses-419!2sar',
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
  hours: string
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

export const DEFAULT_DIFFERENTIALS: DifferentialItem[] = [
  { id: 1, name: 'Tecnología de Punta',     description: 'Equipamiento de ultima generación. Nuestras máquinas están diseñadas para maximizar tu rendimiento y minimizar el riesgo de lesiones.', image: 'https://images.unsplash.com/photo-1576091160550-112173fbb446?w=1400&q=85' },
  { id: 2, name: 'Espacios Cómodos',        description: 'Instalaciones modernas y limpias con aire acondicionado, vestuarios amplios, duchas privadas y zonas de descanso relajantes para tu comodidad.',        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=85' },
  { id: 3, name: 'Resultados Garantizados', description: 'Entrenadores certificados crean planes personalizados según tus objetivos. Seguimiento semanal de progreso y ajustes constantes para máximos resultados.',  image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=1400&q=85' },
  { id: 4, name: 'Comunidad Motivadora',    description: 'Únete a una comunidad de personas comprometidas con su salud. Clases grupales, desafíos mensuales y eventos sociales para mantener la motivación.',       image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85' },
]

export const DEFAULT_NEWS: NewsItem[] = [
  { id: 1, title: 'Nueva clase de entrenamiento HIIT', date: '10 de Junio, 2024', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=85', description: 'Hemos lanzado una nueva clase de alta intensidad. Lunes y miércoles a las 7 PM con nuestro mejor entrenador.' },
  { id: 2, title: 'Renovación de equipamiento', date: '5 de Junio, 2024', image: 'https://images.unsplash.com/photo-1576091160550-112173fbb446?w=700&q=85', description: 'Nuevas máquinas de cardio de última generación. ¡Ven a probarlas y mejora tu experiencia de entrenamiento!' },
  { id: 3, title: 'Programa de nutrición gratuito', date: '1 de Junio, 2024', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85', description: 'Los miembros VIP ahora reciben asesoramiento nutricional personalizado. Programa disponible todo el mes.' },
]

export const DEFAULT_FACILITIES: FacilityItem[] = [
  { id: 1, name: 'Zona de Pesas', description: 'Mancuernas y máquinas de última generación para un entrenamiento completo.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85' },
  { id: 2, name: 'Cardio', description: 'Cintas de correr, bicicletas estáticas y elípticas de primer nivel.', image: 'https://images.unsplash.com/photo-1576091160550-112173fbb446?w=1400&q=85' },
  { id: 3, name: 'Baños y Vestuarios Unisex', description: 'Instalaciones cómodas y funcionales equipadas con baños, duchas y bancos de descanso. Un espacio diseñado para brindarte comodidad, higiene y bienestar antes y después de cada entrenamiento.', image: '/baños.jpeg' },
  { id: 4, name: 'Comunidad y Descanso', description: 'Más que un gimnasio, un lugar para conectar con otras personas, compartir un mate y disfrutar de un ambiente cercano y familiar.', image: '/mesa.jpeg' },
  { id: 5, name: 'Lockers Personales', description: 'Guardá tus pertenencias con tranquilidad mientras entrenás. Contamos con lockers prácticos y seguros para que disfrutes tu rutina con total comodidad.', image: '/locker.jpeg' },
  { id: 6, name: 'Duchas y Vestuarios', description: 'Instalaciones modernas con todas las comodidades para tu higiene personal.', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=85' },
]

export const DEFAULT_PLANS: PlanType[] = [
  { id: 1, name: 'Plan Básico', description: 'Perfecto para comenzar tu viaje fitness', features: ['Acceso a todas las áreas del gym', 'Horario: 6am - 10pm', 'Apoyo en línea', 'Acceso a app móvil'], options: [
    { id: 101, duration: 'Mensual', price: '29.99', highlighted: true },
    { id: 102, duration: 'Anual', price: '299.99', highlighted: false },
    { id: 103, duration: '3 meses', price: '74.99', highlighted: false },
  ]},
  { id: 2, name: 'Plan Premium', description: 'Lo más popular entre nuestros miembros', features: ['Acceso 24/7 al gym', 'Clases grupales ilimitadas', 'Entrenador personal (2 sesiones/mes)', 'Acceso a sauna', 'Agua y toallas incluidas', 'Acceso a app móvil'], options: [
    { id: 201, duration: 'Mensual', price: '49.99', highlighted: true },
    { id: 202, duration: 'Anual', price: '499.99', highlighted: false },
    { id: 203, duration: '3 meses', price: '124.99', highlighted: false },
  ]},
  { id: 3, name: 'Plan VIP', description: 'Experiencia completa con máximos beneficios', features: ['Acceso 24/7 al gym', 'Clases grupales ilimitadas', 'Entrenador personal (8 sesiones/mes)', 'Acceso a sauna y spa', 'Nutricionista consultas', 'Ropa y accesorios gym', 'Prioridad en reservas', 'Acceso a app móvil premium'], options: [
    { id: 301, duration: 'Mensual', price: '79.99', highlighted: true },
    { id: 302, duration: 'Anual', price: '799.99', highlighted: false },
    { id: 303, duration: '3 meses', price: '199.99', highlighted: false },
  ]},
]

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  { id: 1, day: 'Lunes a Viernes', hours: '6:00 — 22:00' },
  { id: 2, day: 'Sábado',          hours: '8:00 — 20:00' },
  { id: 3, day: 'Domingo',         hours: '8:00 — 18:00' },
]

export const DEFAULT_REVIEWS: ReviewItem[] = [
  { id: 1, name: 'Juan García',     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', text: 'El mejor equipamiento de la ciudad. Los entrenadores son muy profesionales y el ambiente es increíblemente motivador.' },
  { id: 2, name: 'María López',     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', text: 'Las instalaciones son impecables y los precios muy competitivos. Totalmente recomendado para cualquier nivel.' },
  { id: 3, name: 'Carlos Martínez', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', text: 'He logrado mis objetivos de fitness aquí. El personal es atento y siempre dispuesto a ayudar. 5 estrellas.' },
  { id: 4, name: 'Ana Rodríguez',   image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', text: 'Ambiente familiar y profesional. Las clases son variadas y motivadoras. Muy satisfecha con mi membresía.' },
]

export const DEFAULT_FAQS: FAQItem[] = [
  { id: 1, q: '¿Cuáles son los horarios del gimnasio?', a: 'De lunes a viernes de 7:00 a 22:00 hs. Sábados de 8:00 a 20:00 hs. Domingos y feriados de 9:00 a 14:00 hs.' },
  { id: 2, q: '¿Puedo probar el gimnasio antes de inscribirme?', a: 'Por supuesto. Ofrecemos una clase de prueba gratuita para que conozcas las instalaciones y te sientas cómodo antes de decidir.' },
  { id: 3, q: '¿Cómo me inscribo?', a: 'Podés inscribirte directamente en el gimnasio o contactarnos por WhatsApp. El proceso es rápido y sin trámites complicados.' },
  { id: 4, q: '¿Los planes incluyen acceso a todas las instalaciones?', a: 'Sí, todos los planes incluyen acceso libre a sala de pesas, cardio, vestuarios y lockers. Las clases grupales pueden tener costo adicional según el plan.' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

async function dbGet<T>(key: string, defaults: T): Promise<T> {
  const { data, error } = await supabase
    .from('site_data')
    .select('value')
    .eq('key', key)
    .single()
  if (error || !data) return defaults
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
  if (error || !data) return defaults
  return data.value as T[]
}

// ─── Image upload ────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('fotos').upload(path, file, { upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('fotos').getPublicUrl(path)
  return data.publicUrl
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

export const getFAQs    = () => dbGetArray<FAQItem>    ('bcngym_faqs',       DEFAULT_FAQS)
export const saveFAQs   = (d: FAQItem[])    => dbSet('bcngym_faqs', d)

export function todayString(): string {
  const d = new Date()
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  return `${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()}`
}
