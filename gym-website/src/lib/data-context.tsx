import { createContext, useContext, useEffect, useState } from 'react'
import {
  getSite, getContact, getNews, getFacilities, getDifferentials,
  getPlans, getSchedules, getReviews, getFAQs, getActivities, getServices, getPortfolio, getPendingReviews, getRoutineImages,
  DEFAULT_SITE, DEFAULT_CONTACT, DEFAULT_FACILITIES,
  DEFAULT_DIFFERENTIALS, DEFAULT_SCHEDULES, DEFAULT_REVIEWS, DEFAULT_FAQS,
  DEFAULT_ACTIVITIES, DEFAULT_SERVICES, DEFAULT_PORTFOLIO, DEFAULT_PENDING_REVIEWS, DEFAULT_ROUTINE,
} from './store'
import type {
  SiteInfo, ContactInfo, NewsItem, FacilityItem, DifferentialItem,
  PlanType, ScheduleItem, ReviewItem, FAQItem, ActivityItem, ServiceItem, PortfolioItem, PendingReview, RoutineImage,
} from './store'

interface SiteData {
  site: SiteInfo
  contact: ContactInfo
  news: NewsItem[]
  facilities: FacilityItem[]
  differentials: DifferentialItem[]
  plans: PlanType[]
  schedules: ScheduleItem[]
  reviews: ReviewItem[]
  faqs: FAQItem[]
  activities: ActivityItem[]
  services: ServiceItem[]
  portfolio: PortfolioItem[]
  pendingReviews: PendingReview[]
  routineImages: RoutineImage[]
  /** false hasta que los datos reales de Supabase terminan de cargar */
  loaded: boolean
}

// Estado inicial: los datos que el usuario edita (planes, novedades) arrancan
// VACÍOS para que nunca se muestren los valores por defecto del código (ej.
// "Plan VIP") mientras carga o si la carga falla. El resto mantiene defaults
// porque algunos componentes asumen que no están vacíos.
const INITIAL: SiteData = {
  site: DEFAULT_SITE,
  contact: DEFAULT_CONTACT,
  news: [],
  facilities: DEFAULT_FACILITIES,
  differentials: DEFAULT_DIFFERENTIALS,
  plans: [],
  schedules: DEFAULT_SCHEDULES,
  reviews: DEFAULT_REVIEWS,
  faqs: DEFAULT_FAQS,
  activities: DEFAULT_ACTIVITIES,
  services: DEFAULT_SERVICES,
  portfolio: DEFAULT_PORTFOLIO,
  pendingReviews: DEFAULT_PENDING_REVIEWS,
  routineImages: DEFAULT_ROUTINE,
  loaded: false,
}

const DataContext = createContext<SiteData>(INITIAL)

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(INITIAL)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // Reintenta ante errores de red para no quedarse pegado en datos vacíos.
      for (let attempt = 0; attempt < 6; attempt++) {
        try {
          const [site, contact, news, facilities, differentials, plans, schedules, reviews, faqs, activities, services, portfolio, pendingReviews, routineImages] = await Promise.all([
            getSite(), getContact(), getNews(), getFacilities(),
            getDifferentials(), getPlans(), getSchedules(), getReviews(), getFAQs(),
            getActivities(), getServices(), getPortfolio(), getPendingReviews(), getRoutineImages(),
          ])
          if (!cancelled) {
            setData({ site, contact, news, facilities, differentials, plans, schedules, reviews, faqs, activities, services, portfolio, pendingReviews, routineImages, loaded: true })
          }
          return
        } catch {
          if (cancelled) return
          await sleep(1000 * (attempt + 1))
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
