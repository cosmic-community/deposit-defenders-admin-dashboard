import { User, UserSession, RevenueRecord, DashboardMetrics, ChartData, UserGrowthData, RevenueData } from '@/types'
import { differenceInDays, format, parseISO, startOfDay, subDays } from 'date-fns'

export function calculateDashboardMetrics(
  users: User[], 
  sessions: UserSession[], 
  revenue: RevenueRecord[]
): DashboardMetrics {
  const now = new Date()
  const today = startOfDay(now)
  const thirtyDaysAgo = subDays(today, 30)
  
  // User metrics
  const totalUsers = users.length
  const newUsersToday = users.filter(user => {
    if (!user.metadata?.signup_date) return false
    const signupDate = parseISO(user.metadata.signup_date)
    return differenceInDays(today, signupDate) === 0
  }).length
  
  const newUsersThisMonth = users.filter(user => {
    if (!user.metadata?.signup_date) return false
    const signupDate = parseISO(user.metadata.signup_date)
    return signupDate >= thirtyDaysAgo
  }).length
  
  // Subscription metrics
  const freeUsers = users.filter(user => user.metadata?.subscription_plan === 'free' || !user.metadata?.subscription_plan).length
  const proUsers = users.filter(user => user.metadata?.subscription_plan === 'pro').length
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0
  
  // Revenue metrics
  const totalRevenue = revenue.reduce((sum, record) => sum + (record.metadata?.amount || 0), 0)
  const monthlyRecurringRevenue = proUsers * 29.99 // Assuming $29.99/month for pro plan
  
  // Activity metrics
  const totalLogins = sessions.length
  const activeUsers = users.filter(user => user.metadata?.status === 'active').length
  
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

export function calculateUserMetrics(users: User[]) {
  const totalUsers = users.length
  const activeUsers = users.filter(user => user.metadata?.status === 'active').length
  const inactiveUsers = users.filter(user => user.metadata?.status === 'inactive').length
  const proUsers = users.filter(user => user.metadata?.subscription_plan === 'pro').length
  const freeUsers = users.filter(user => user.metadata?.subscription_plan === 'free' || !user.metadata?.subscription_plan).length
  
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)
  
  const newUsersThisMonth = users.filter(user => {
    if (!user.metadata?.signup_date) return false
    const signupDate = parseISO(user.metadata.signup_date)
    return signupDate >= thirtyDaysAgo
  }).length
  
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0
  
  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    proUsers,
    freeUsers,
    newUsersThisMonth,
    conversionRate
  }
}

export function generateUserGrowthData(users: User[]): UserGrowthData[] {
  const data: { [date: string]: { signups: number; totalUsers: number } } = {}
  const now = new Date()
  
  // Initialize last 30 days with zero values
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(now, i), 'yyyy-MM-dd')
    data[date] = { signups: 0, totalUsers: 0 }
  }
  
  // Count signups by date
  users.forEach(user => {
    if (user.metadata?.signup_date) {
      const signupDate = format(parseISO(user.metadata.signup_date), 'yyyy-MM-dd')
      if (data[signupDate]) {
        data[signupDate].signups++
      }
    }
  })
  
  // Calculate cumulative total users
  let runningTotal = 0
  const sortedDates = Object.keys(data).sort()
  
  return sortedDates.map(date => {
    const dateData = data[date]
    if (dateData) {
      runningTotal += dateData.signups
      dateData.totalUsers = runningTotal
      
      return {
        date,
        signups: dateData.signups,
        totalUsers: dateData.totalUsers
      }
    }
    
    return {
      date,
      signups: 0,
      totalUsers: runningTotal
    }
  })
}

export function generateRevenueData(revenue: RevenueRecord[]): RevenueData[] {
  const data: { [date: string]: { revenue: number; count: number } } = {}
  const now = new Date()
  
  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(now, i), 'yyyy-MM-dd')
    data[date] = { revenue: 0, count: 0 }
  }
  
  // Sum revenue by date
  revenue.forEach(record => {
    if (record.metadata?.payment_date) {
      const paymentDate = format(parseISO(record.metadata.payment_date), 'yyyy-MM-dd')
      const dayData = data[paymentDate]
      if (dayData) {
        dayData.revenue += record.metadata.amount || 0
        dayData.count++
      }
    }
  })
  
  // Calculate MRR (assuming pro plan is $29.99/month)
  const proUsers = revenue.filter(r => r.metadata?.subscription_plan === 'pro').length
  const mrr = proUsers * 29.99
  
  return Object.keys(data).sort().map(date => {
    const dayData = data[date]
    return {
      date,
      revenue: dayData ? dayData.revenue : 0,
      mrr
    }
  })
}

export function createUserGrowthChart(data: UserGrowthData[]): ChartData {
  return {
    labels: data.map(d => format(parseISO(d.date), 'MMM dd')),
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

export function createRevenueChart(data: RevenueData[]): ChartData {
  return {
    labels: data.map(d => format(parseISO(d.date), 'MMM dd')),
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
        label: 'Monthly Recurring Revenue',
        data: data.map(d => d.mrr),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

export function createSubscriptionChart(freeUsers: number, proUsers: number): ChartData {
  return {
    labels: ['Free Users', 'Pro Users'],
    datasets: [
      {
        label: 'User Distribution',
        data: [freeUsers, proUsers],
        backgroundColor: ['#94a3b8', '#3b82f6'],
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
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function calculateGrowthPercentage(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%'
  const growth = ((current - previous) / previous) * 100
  const sign = growth >= 0 ? '+' : ''
  return `${sign}${growth.toFixed(1)}%`
}