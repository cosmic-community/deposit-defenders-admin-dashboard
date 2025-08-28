import { User, UserSession, RevenueRecord, DashboardMetrics, UserGrowthData, RevenueData, ChartData } from '@/types'
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

// Ensure environment variables are strings with fallbacks
const bucketSlug: string = process.env.COSMIC_BUCKET_SLUG || 'default-bucket'
const readKey: string = process.env.COSMIC_READ_KEY || 'default-read-key'

// Initialize analytics configuration
const config = {
  bucketSlug,
  readKey,
  trackingEnabled: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
}

// Calculate comprehensive dashboard metrics
export function calculateDashboardMetrics(
  users: User[], 
  sessions: UserSession[], 
  revenue: RevenueRecord[]
): DashboardMetrics {
  const totalUsers = users.length
  const today = startOfDay(new Date())
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  // Calculate user metrics
  const newUsersToday = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return isAfter(signupDate, today) || 
           (signupDate.toDateString() === today.toDateString())
  }).length

  const newUsersThisMonth = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return isAfter(signupDate, thisMonth)
  }).length

  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0

  // Calculate revenue metrics
  const totalRevenue = revenue.reduce((sum, record) => {
    return record.metadata.status === 'paid' ? sum + record.metadata.amount : sum
  }, 0)

  const monthlyRevenue = revenue.filter(record => {
    const paymentDate = new Date(record.metadata.payment_date)
    return isAfter(paymentDate, thisMonth) && record.metadata.status === 'paid'
  })

  const monthlyRecurringRevenue = monthlyRevenue.reduce((sum, record) => {
    return sum + record.metadata.amount
  }, 0)

  // Calculate activity metrics
  const activeUsers = users.filter(user => {
    if (!user.metadata.last_login) return false
    const lastLogin = new Date(user.metadata.last_login)
    const weekAgo = subDays(new Date(), 7)
    return isAfter(lastLogin, weekAgo)
  }).length

  const totalLogins = sessions.length

  return {
    totalUsers,
    newUsersToday,
    newUsersThisMonth,
    totalRevenue,
    monthlyRecurringRevenue,
    freeUsers,
    proUsers,
    conversionRate,
    totalLogins,
    activeUsers
  }
}

// Generate user growth data for charts
export function generateUserGrowthData(users: User[]): UserGrowthData[] {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return {
      date: format(date, 'MMM dd'),
      signups: 0,
      totalUsers: 0
    }
  })

  users.forEach(user => {
    const signupDate = new Date(user.metadata.signup_date)
    
    last30Days.forEach((day, index) => {
      const dayDate = subDays(new Date(), 29 - index)
      
      // Count signups for this specific day
      if (signupDate.toDateString() === dayDate.toDateString()) {
        day.signups += 1
      }
      
      // Count total users up to this day
      if (isBefore(signupDate, endOfDay(dayDate)) || 
          signupDate.toDateString() === dayDate.toDateString()) {
        day.totalUsers += 1
      }
    })
  })

  return last30Days
}

// Generate revenue data for charts
export function generateRevenueData(revenue: RevenueRecord[]): RevenueData[] {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return {
      date: format(date, 'MMM dd'),
      revenue: 0,
      mrr: 0
    }
  })

  revenue.forEach(record => {
    if (record.metadata.status !== 'paid') return
    
    const paymentDate = new Date(record.metadata.payment_date)
    
    last30Days.forEach((day, index) => {
      const dayDate = subDays(new Date(), 29 - index)
      
      if (paymentDate.toDateString() === dayDate.toDateString()) {
        day.revenue += record.metadata.amount
        if (record.metadata.subscription_plan === 'pro') {
          day.mrr += record.metadata.amount
        }
      }
    })
  })

  return last30Days
}

// Create chart data for user growth
export function createUserGrowthChart(data: UserGrowthData[]): ChartData {
  return {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'New Signups',
        data: data.map(d => d.signups),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Total Users',
        data: data.map(d => d.totalUsers),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

// Create chart data for revenue
export function createRevenueChart(data: RevenueData[]): ChartData {
  return {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Daily Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'MRR',
        data: data.map(d => d.mrr),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

// Create subscription distribution chart
export function createSubscriptionChart(freeUsers: number, proUsers: number): ChartData {
  return {
    labels: ['Free Users', 'Pro Users'],
    datasets: [
      {
        data: [freeUsers, proUsers],
        backgroundColor: ['#94A3B8', '#3B82F6'],
        borderWidth: 0
      }
    ]
  }
}

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function calculateGrowthPercentage(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%'
  
  const growth = ((current - previous) / previous) * 100
  const sign = growth >= 0 ? '+' : ''
  return `${sign}${growth.toFixed(1)}%`
}

// Analytics tracking functions
export function trackUserAction(userId: string, action: string, metadata?: Record<string, any>): void {
  if (!config.trackingEnabled) return
  
  console.log(`User ${userId} performed action: ${action}`, metadata)
  // In a real implementation, this would send data to an analytics service
}

export function trackPageView(path: string, userId?: string): void {
  if (!config.trackingEnabled) return
  
  console.log(`Page view: ${path}`, { userId, timestamp: new Date().toISOString() })
  // In a real implementation, this would send data to an analytics service
}

// Session management
export function createSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function isSessionActive(lastActivity: string): boolean {
  const lastActivityDate = new Date(lastActivity)
  const now = new Date()
  return (now.getTime() - lastActivityDate.getTime()) < config.sessionTimeout
}

// Date range utilities for filtering
export function getDateRange(range: 'today' | 'week' | 'month' | 'year'): { start: Date; end: Date } {
  const end = new Date()
  let start: Date

  switch (range) {
    case 'today':
      start = startOfDay(new Date())
      break
    case 'week':
      start = subDays(new Date(), 7)
      break
    case 'month':
      start = subDays(new Date(), 30)
      break
    case 'year':
      start = subDays(new Date(), 365)
      break
    default:
      start = subDays(new Date(), 30)
  }

  return { start, end }
}

// Filter functions for analytics
export function filterUsersByDateRange(users: User[], dateRange: { start: Date; end: Date }): User[] {
  return users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return isAfter(signupDate, dateRange.start) && isBefore(signupDate, dateRange.end)
  })
}

export function filterRevenueByDateRange(revenue: RevenueRecord[], dateRange: { start: Date; end: Date }): RevenueRecord[] {
  return revenue.filter(record => {
    const paymentDate = new Date(record.metadata.payment_date)
    return isAfter(paymentDate, dateRange.start) && isBefore(paymentDate, dateRange.end)
  })
}