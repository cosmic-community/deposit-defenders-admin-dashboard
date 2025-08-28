import { User, UserSession, RevenueRecord, DashboardMetrics, UserGrowthData, RevenueData, ActivityData, ChartData } from '@/types'

// Ensure environment variables are defined with proper typing
const bucketSlug = process.env.COSMIC_BUCKET_SLUG
const readKey = process.env.COSMIC_READ_KEY

if (!bucketSlug) {
  throw new Error('COSMIC_BUCKET_SLUG environment variable is required')
}

if (!readKey) {
  throw new Error('COSMIC_READ_KEY environment variable is required')
}

// Helper function to format dates consistently
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper function to get date string, with fallback
function getDateString(dateInput: string | Date | undefined): string {
  if (!dateInput) {
    return formatDate(new Date())
  }
  
  if (typeof dateInput === 'string') {
    return dateInput.split('T')[0] // Extract date part from ISO string
  }
  
  return formatDate(dateInput)
}

// Calculate user-specific metrics (exported function that was missing)
export function calculateUserMetrics(users: User[]): {
  totalUsers: number;
  activeUsers: number;
  freeUsers: number;
  proUsers: number;
  conversionRate: number;
} {
  const totalUsers = users.length
  const activeUsers = users.filter(user => user.metadata.status === 'active').length
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0

  return {
    totalUsers,
    activeUsers,
    freeUsers,
    proUsers,
    conversionRate
  }
}

// Calculate key dashboard metrics from raw data
export function calculateDashboardMetrics(
  users: User[],
  sessions: UserSession[],
  revenue: RevenueRecord[]
): DashboardMetrics {
  const now = new Date()
  const today = formatDate(now)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // User metrics
  const totalUsers = users.length
  const newUsersToday = users.filter(user => {
    const signupDate = getDateString(user.metadata.signup_date)
    return signupDate === today
  }).length
  
  const newUsersThisMonth = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date || user.created_at)
    return signupDate >= thirtyDaysAgo
  }).length
  
  // Subscription metrics
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0
  
  // Revenue metrics
  const totalRevenue = revenue
    .filter(record => record.metadata.status === 'paid')
    .reduce((sum, record) => sum + record.metadata.amount, 0)
  
  const monthlyRevenue = revenue
    .filter(record => {
      const paymentDate = new Date(record.metadata.payment_date || record.created_at)
      return record.metadata.status === 'paid' && paymentDate >= thirtyDaysAgo
    })
    .reduce((sum, record) => sum + record.metadata.amount, 0)
  
  // Assuming pro plan is $5/month for MRR calculation
  const monthlyRecurringRevenue = proUsers * 5
  
  // Activity metrics
  const totalLogins = sessions.length
  const activeUsers = new Set(sessions.map(session => session.metadata.user_id)).size
  
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

// Generate user growth data for charts (last 30 days)
export function generateUserGrowthData(users: User[]): UserGrowthData[] {
  const data: UserGrowthData[] = []
  const now = new Date()
  
  // Generate data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = formatDate(date)
    
    // Count signups on this date
    const signupsOnDate = users.filter(user => {
      const signupDate = getDateString(user.metadata.signup_date)
      return signupDate === dateString
    }).length
    
    // Count total users up to this date
    const totalUsersUpToDate = users.filter(user => {
      const signupDate = getDateString(user.metadata.signup_date)
      return signupDate <= dateString
    }).length
    
    data.push({
      date: dateString,
      signups: signupsOnDate,
      totalUsers: totalUsersUpToDate
    })
  }
  
  return data
}

// Generate revenue data for charts (last 30 days)
export function generateRevenueData(revenue: RevenueRecord[]): RevenueData[] {
  const data: RevenueData[] = []
  const now = new Date()
  
  // Generate data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = formatDate(date)
    
    // Calculate revenue for this date
    const dailyRevenue = revenue
      .filter(record => {
        const paymentDate = getDateString(record.metadata.payment_date)
        return record.metadata.status === 'paid' && paymentDate === dateString
      })
      .reduce((sum, record) => sum + record.metadata.amount, 0)
    
    // Calculate running MRR (simplified - assumes $5 per active subscription)
    const totalPaidCustomers = revenue
      .filter(record => {
        const paymentDate = getDateString(record.metadata.payment_date)
        return record.metadata.status === 'paid' && paymentDate <= dateString
      })
      .length
    
    const mrr = totalPaidCustomers * 5 // $5 per pro user
    
    data.push({
      date: dateString,
      revenue: dailyRevenue,
      mrr: mrr
    })
  }
  
  return data
}

// Generate activity data for analytics (last 30 days)
export function generateActivityData(users: User[], sessions: UserSession[]): ActivityData[] {
  const data: ActivityData[] = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = formatDate(date)
    
    // Count logins on this date
    const loginsOnDate = sessions.filter(session => {
      const loginDate = getDateString(session.metadata.login_date)
      return loginDate === dateString
    }).length
    
    // Count registrations on this date
    const registrationsOnDate = users.filter(user => {
      const signupDate = getDateString(user.metadata.signup_date)
      return signupDate === dateString
    }).length
    
    const totalActivities = loginsOnDate + registrationsOnDate
    
    data.push({
      date: dateString,
      logins: loginsOnDate,
      registrations: registrationsOnDate,
      totalActivities
    })
  }
  
  return data
}

// Create user growth chart data
export function createUserGrowthChart(data: UserGrowthData[]): ChartData {
  return {
    labels: data.map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Daily Signups',
        data: data.map(d => d.signups),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Total Users',
        data: data.map(d => d.totalUsers),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

// Create revenue chart data
export function createRevenueChart(data: RevenueData[]): ChartData {
  return {
    labels: data.map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Daily Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'MRR',
        data: data.map(d => d.mrr),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

// Create activity chart data (renamed from createHourlyActivityChart to createActivityChart)
export function createActivityChart(data: ActivityData[]): ChartData {
  return {
    labels: data.map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Logins',
        data: data.map(d => d.logins),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'New Registrations',
        data: data.map(d => d.registrations),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 2,
        fill: true
      }
    ]
  }
}

// Create hourly activity chart (the function name that was expected)
export function createHourlyActivityChart(sessions: UserSession[]): ChartData {
  // Generate hourly activity data for the last 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const activityCount = sessions.filter(session => {
      const loginDate = new Date(session.metadata.login_date || session.created_at)
      return loginDate.getHours() === hour
    }).length
    
    return activityCount
  })

  return {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Hourly Activity',
        data: hourlyData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        fill: true
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
        backgroundColor: ['#94a3b8', '#3b82f6'],
        borderColor: ['#64748b', '#2563eb'],
        borderWidth: 1
      }
    ]
  }
}

// Utility functions for formatting
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
  const sign = growth > 0 ? '+' : ''
  return `${sign}${growth.toFixed(1)}%`
}

// Generate mock data for development/testing
export function generateMockUserGrowthData(): UserGrowthData[] {
  const data: UserGrowthData[] = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = formatDate(date)
    
    // Generate mock data with some randomness
    const signups = Math.floor(Math.random() * 20) + 5
    const totalUsers = (30 - i) * 15 + Math.floor(Math.random() * 50)
    
    data.push({
      date: dateString,
      signups,
      totalUsers
    })
  }
  
  return data
}

export function generateMockRevenueData(): RevenueData[] {
  const data: RevenueData[] = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = formatDate(date)
    
    // Generate mock revenue data
    const revenue = Math.floor(Math.random() * 500) + 100
    const mrr = (30 - i) * 25 + Math.floor(Math.random() * 200)
    
    data.push({
      date: dateString,
      revenue,
      mrr
    })
  }
  
  return data
}

// Aggregate user data by time periods
export function aggregateUsersByPeriod(users: User[], period: 'day' | 'week' | 'month' = 'day'): Record<string, number> {
  const aggregation: Record<string, number> = {}
  
  users.forEach(user => {
    const signupDate = new Date(user.metadata.signup_date || user.created_at)
    let key: string
    
    switch (period) {
      case 'week':
        // Get the start of the week (Sunday)
        const weekStart = new Date(signupDate)
        weekStart.setDate(signupDate.getDate() - signupDate.getDay())
        key = formatDate(weekStart)
        break
      case 'month':
        key = `${signupDate.getFullYear()}-${String(signupDate.getMonth() + 1).padStart(2, '0')}`
        break
      default:
        key = formatDate(signupDate)
    }
    
    aggregation[key] = (aggregation[key] || 0) + 1
  })
  
  return aggregation
}

// Get top performing metrics for dashboard highlights
export function getTopMetrics(users: User[], revenue: RevenueRecord[]): {
  topRevenueDay: { date: string; amount: number }
  topSignupDay: { date: string; signups: number }
  averageDailySignups: number
  averageDailyRevenue: number
} {
  // Aggregate revenue by day
  const revenueByDay: Record<string, number> = {}
  revenue
    .filter(record => record.metadata.status === 'paid')
    .forEach(record => {
      const date = getDateString(record.metadata.payment_date)
      revenueByDay[date] = (revenueByDay[date] || 0) + record.metadata.amount
    })
  
  // Find top revenue day
  const topRevenueEntry = Object.entries(revenueByDay)
    .sort(([,a], [,b]) => b - a)[0]
  
  const topRevenueDay = topRevenueEntry 
    ? { date: topRevenueEntry[0], amount: topRevenueEntry[1] }
    : { date: formatDate(new Date()), amount: 0 }
  
  // Aggregate signups by day
  const signupsByDay = aggregateUsersByPeriod(users, 'day')
  
  // Find top signup day
  const topSignupEntry = Object.entries(signupsByDay)
    .sort(([,a], [,b]) => b - a)[0]
  
  const topSignupDay = topSignupEntry
    ? { date: topSignupEntry[0], signups: topSignupEntry[1] }
    : { date: formatDate(new Date()), signups: 0 }
  
  // Calculate averages
  const totalDays = Object.keys(signupsByDay).length || 1
  const averageDailySignups = users.length / totalDays
  
  const totalRevenue = Object.values(revenueByDay).reduce((sum, amount) => sum + amount, 0)
  const revenueDays = Object.keys(revenueByDay).length || 1
  const averageDailyRevenue = totalRevenue / revenueDays
  
  return {
    topRevenueDay,
    topSignupDay,
    averageDailySignups,
    averageDailyRevenue
  }
}