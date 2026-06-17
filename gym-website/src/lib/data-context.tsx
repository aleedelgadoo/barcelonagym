import { createContext, useContext, useEffect, useState } from 'react'
import {
  getSite, getContact, getNews, getFacilities, getDifferentials,
  getPlans, getSchedules, getReviews, getFAQs, getActivities,
  DEFAULT_SITE, DEFAULT_CONTACT, DEFAULT_NEWS, DEFAULT_FACILITIES,
  DEFAULT_DIFFERENTIALS, DEFAULT_PLANS, DEFAULT_SCHEDULES, DEFAULT_REVIEWS, DEFAULT_FAQS, DEFAULT_ACTIVITIES,
} from './store'
import type {
  SiteInfo, ContactInfo, NewsItem, FacilityItem, DifferentialItem,
  PlanType, ScheduleItem, ReviewItem, FAQItem, ActivityItem,
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
  })

  useEffect(() => {
    Promise.all([
      getSite(), getContact(), getNews(), getFacilities(),
      getDifferentials(), getPlans(), getSchedules(), getReviews(), getFAQs(), getActivities(),
    ]).then(([site, contact, news, facilities, differentials, plans, schedules, reviews, faqs, activities]) => {
      setData({ site, contact, news, facilities, differentials, plans, schedules, reviews, faqs, activities })
    }).catch(() => {})
  }, [])

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
