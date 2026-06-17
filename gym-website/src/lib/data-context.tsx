import { createContext, useContext, useEffect, useState } from 'react'
import {
  getSite, getContact, getNews, getFacilities, getDifferentials,
  getPlans, getSchedules, getReviews, getFAQs, getActivities, getServices, getPortfolio, getPendingReviews, getRoutineImages,
  DEFAULT_SITE, DEFAULT_CONTACT, DEFAULT_NEWS, DEFAULT_FACILITIES,
  DEFAULT_DIFFERENTIALS, DEFAULT_PLANS, DEFAULT_SCHEDULES, DEFAULT_REVIEWS, DEFAULT_FAQS,
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
}

const DataContext = createContext<SiteData>({
  site: DEFAULT_SITE,
  contact: DEFAULT_CONTACT,
  news: DEFAULT_NEWS,
  facilities: DEFAULT_FACILITIES,
  differentials: DEFAULT_DIFFERENTIALS,
  plans: DEFAULT_PLANS,
  schedules: DEFAULT_SCHEDULES,
  reviews: DEFAULT_REVIEWS,
  faqs: DEFAULT_FAQS,
  activities: DEFAULT_ACTIVITIES,
  services: DEFAULT_SERVICES,
  portfolio: DEFAULT_PORTFOLIO,
  pendingReviews: DEFAULT_PENDING_REVIEWS,
  routineImages: DEFAULT_ROUTINE,
})

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>({
    site: DEFAULT_SITE,
    contact: DEFAULT_CONTACT,
    news: DEFAULT_NEWS,
    facilities: DEFAULT_FACILITIES,
    differentials: DEFAULT_DIFFERENTIALS,
    plans: DEFAULT_PLANS,
    schedules: DEFAULT_SCHEDULES,
    reviews: DEFAULT_REVIEWS,
    faqs: DEFAULT_FAQS,
    activities: DEFAULT_ACTIVITIES,
    services: DEFAULT_SERVICES,
    portfolio: DEFAULT_PORTFOLIO,
    pendingReviews: DEFAULT_PENDING_REVIEWS,
    routineImages: DEFAULT_ROUTINE,
  })

  useEffect(() => {
    Promise.all([
      getSite(), getContact(), getNews(), getFacilities(),
      getDifferentials(), getPlans(), getSchedules(), getReviews(), getFAQs(),
      getActivities(), getServices(), getPortfolio(), getPendingReviews(), getRoutineImages(),
    ]).then(([site, contact, news, facilities, differentials, plans, schedules, reviews, faqs, activities, services, portfolio, pendingReviews, routineImages]) => {
      setData({ site, contact, news, facilities, differentials, plans, schedules, reviews, faqs, activities, services, portfolio, pendingReviews, routineImages })
    }).catch(() => {})
  }, [])

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
