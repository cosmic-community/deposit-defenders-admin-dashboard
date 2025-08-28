import { User, UserSession, RevenueRecord, DashboardMetrics, UserGrowthData, RevenueData, ChartData } from '../types'

// Calculate comprehensive dashboard metrics
export function calculateDashboardMetrics(
  users: User[], 
  sessions: UserSession[], 
  revenue: RevenueRecord[]
): DashboardMetrics {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  
  const newUsersToday = users.filter(user => 
    user.metadata.signup_date === todayStr
  ).length
  
  // Fix: Add explicit check for signup_date and thisMonthStart
  const newUsersThisMonth = users.filter(user => 
    user.metadata.signup_date && thisMonthStart && user.metadata.signup_date >= thisMonthStart
  ).length
  
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const activeUsers = users.filter(user => user.metadata.status === 'active').length
  
  const totalRevenue = revenue.reduce((sum, record) => sum + record.metadata.amount, 0)
  const monthlyRecurringRevenue = proUsers * 5 // Assuming $5/month for pro
  
  const conversionRate = users.length > 0 ? (proUsers / users.length) * 100 : 0
  
  return {
    totalUsers: users.length,
    newUsersToday,
    newUsersThisMonth,
    totalRevenue,
    monthlyRecurringRevenue,
    freeUsers,
    proUsers,
    conversionRate,
    totalLogins: sessions.length,
    activeUsers
  }
}

// Generate user growth data for charts
export function generateUserGrowthData(users: User[]): UserGrowthData[] {
  const growthMap = new Map<string, number>()
  
  users.forEach(user => {
    const date = user.metadata.signup_date
    if (date) {
      growthMap.set(date, (growthMap.get(date) || 0) + 1)
    }
  })
  
  const sortedDates = Array.from(growthMap.keys()).sort()
  const growthData: UserGrowthData[] = []
  let totalUsers = 0
  
  sortedDates.forEach(date => {
    const signups = growthMap.get(date) || 0
    totalUsers += signups
    growthData.push({
      date,
      signups,
      totalUsers
    })
  })
  
  return growthData.slice(-30) // Last 30 days
}

// Generate revenue data for charts
export function generateRevenueData(revenue: RevenueRecord[]): RevenueData[] {
  const revenueMap = new Map<string, number>()
  
  revenue.forEach(record => {
    const date = record.metadata.payment_date
    if (date) {
      revenueMap.set(date, (revenueMap.get(date) || 0) + record.metadata.amount)
    }
  })
  
  const sortedDates = Array.from(revenueMap.keys()).sort()
  const revenueData: RevenueData[] = []
  let totalMRR = 0
  
  sortedDates.forEach(date => {
    const dailyRevenue = revenueMap.get(date) || 0
    totalMRR += dailyRevenue
    revenueData.push({
      date,
      revenue: dailyRevenue,
      mrr: totalMRR
    })
  })
  
  return revenueData.slice(-30) // Last 30 days
}

// Create chart data for user growth
export function createUserGrowthChart(data: UserGrowthData[]): ChartData {
  return {
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Daily Signups',
        data: data.map(d => d.signups),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Total Users',
        data: data.map(d => d.totalUsers),
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

// Create chart data for revenue trends
export function createRevenueChart(data: RevenueData[]): ChartData {
  return {
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Daily Revenue',
        data: data.map(d => d.revenue),
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Cumulative MRR',
        data: data.map(d => d.mrr),
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgb(168, 85, 247)',
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
        label: 'Subscription Distribution',
        data: [freeUsers, proUsers],
        backgroundColor: [
          'rgba(107, 114, 128, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }
}

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Fix: Add explicit validation for dateString parameter
export function formatDate(dateString: string): string {
  // Check if dateString is valid before creating Date
  if (!dateString || typeof dateString !== 'string') {
    return 'Invalid Date'
  }
  
  const date = new Date(dateString)
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function calculateGrowthPercentage(current: number, previous: number): string {
  if (previous === 0) return '0%'
  const growth = ((current - previous) / previous) * 100
  const sign = growth >= 0 ? '+' : ''
  return `${sign}${growth.toFixed(1)}%`
}

// Date range utilities
export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

// Analytics helper for filtering data by date range
export function filterByDateRange<T extends { metadata: { [key: string]: any } }>(
  data: T[],
  dateField: string,
  startDate: string,
  endDate: string
): T[] {
  return data.filter(item => {
    const itemDate = item.metadata[dateField]
    return itemDate && itemDate >= startDate && itemDate <= endDate
  })
}

// Calculate conversion funnel metrics
export interface ConversionFunnel {
  signups: number
  activations: number
  subscriptions: number
  conversionToActive: number
  conversionToPaid: number
}

export function calculateConversionFunnel(users: User[]): ConversionFunnel {
  const signups = users.length
  const activations = users.filter(user => user.metadata.status === 'active').length
  const subscriptions = users.filter(user => user.metadata.subscription_plan === 'pro').length
  
  const conversionToActive = signups > 0 ? (activations / signups) * 100 : 0
  const conversionToPaid = activations > 0 ? (subscriptions / activations) * 100 : 0
  
  return {
    signups,
    activations,
    subscriptions,
    conversionToActive,
    conversionToPaid
  }
}