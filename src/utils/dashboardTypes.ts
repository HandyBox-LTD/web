export const DASHBOARD_TRADE_OPTIONS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Landscaping',
  'HVAC',
] as const

export type DashboardTrade = (typeof DASHBOARD_TRADE_OPTIONS)[number]

export type DashboardProfile = {
  fullName: string
  bio: string
  phoneNumber: string
  location: string
  preferredTrades: DashboardTrade[]
}

export type DashboardWorkerProfile = {
  isActive: boolean
  businessName: string
  tagline: string
  serviceArea: string
  yearsExperience: string
  hourlyRatePence: number
  skills: DashboardTrade[]
  verificationDocumentName: string
  joinedAt: string | null
}

export type ServiceHistoryEntry = {
  id: string
  title: string
  location: string
  completedAt: string
  valuePence: number
  summary: string
  role: 'customer' | 'worker'
}
