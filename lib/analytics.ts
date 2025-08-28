import { User, UserSession, RevenueRecord, DashboardMetrics, ChartData, UserGrowthData, RevenueData, ActivityData } from '@/types'

// Calculate comprehensive dashboard metrics
export function calculateDashboardMetrics(
  users: User[], 
  sessions: UserSession[], 
  revenue: RevenueRecord[]
): DashboardMetrics {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // User metrics
  const totalUsers = users.length
  const newUsersToday = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return signupDate >= today
  }).length
  
  const newUsersThisMonth = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return signupDate >= thisMonth
  }).length

  // Subscription metrics
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  
  // Revenue metrics
  const totalRevenue = revenue
    .filter(record => record.metadata.status === 'paid')
    .reduce((sum, record) => sum + record.metadata.amount, 0)
  
  const monthlyRecurringRevenue = revenue
    .filter(record => {
      const paymentDate = new Date(record.metadata.payment_date)
      return paymentDate >= thisMonth && record.metadata.status === 'paid'
    })
    .reduce((sum, record) => sum + record.metadata.amount, 0)

  // Activity metrics
  const totalLogins = sessions.length
  const activeUsers = sessions.filter(session => {
    const loginDate = new Date(session.metadata.login_date)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return loginDate >= sevenDaysAgo
  }).length

  // Conversion rate (pro users / total users)
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0

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

// Calculate user-specific metrics
export function calculateUserMetrics(users: User[]) {
  const totalUsers = users.length
  const activeUsers = users.filter(user => user.metadata.status === 'active').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const inactiveUsers = users.filter(user => user.metadata.status === 'inactive').length
  const canceledUsers = users.filter(user => user.metadata.status === 'canceled').length

  return {
    totalUsers,
    activeUsers,
    proUsers,
    freeUsers,
    inactiveUsers,
    canceledUsers
  }
}

// Generate user growth data for charts
export function generateUserGrowthData(users: User[]): UserGrowthData[] {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })

  return last30Days.map(date => {
    const signupsOnDate = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date).toISOString().split('T')[0]
      return signupDate === date
    }).length

    const totalUsersUpToDate = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date)
      return signupDate <= new Date(date)
    }).length

    return {
      date,
      signups: signupsOnDate,
      totalUsers: totalUsersUpToDate
    }
  })
}

// Generate revenue data for charts
export function generateRevenueData(revenue: RevenueRecord[]): RevenueData[] {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })

  return last30Days.map(date => {
    const revenueOnDate = revenue
      .filter(record => {
        const paymentDate = new Date(record.metadata.payment_date).toISOString().split('T')[0]
        return paymentDate === date && record.metadata.status === 'paid'
      })
      .reduce((sum, record) => sum + record.metadata.amount, 0)

    const mrrUpToDate = revenue
      .filter(record => {
        const paymentDate = new Date(record.metadata.payment_date)
        return paymentDate <= new Date(date) && record.metadata.status === 'paid'
      })
      .reduce((sum, record) => sum + record.metadata.amount, 0)

    return {
      date,
      revenue: revenueOnDate,
      mrr: mrrUpToDate
    }
  })
}

// Generate activity data for charts
export function generateActivityData(users: User[], sessions: UserSession[]): ActivityData[] {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })

  return last30Days.map(date => {
    const loginsOnDate = sessions.filter(session => {
      const loginDate = new Date(session.metadata.login_date).toISOString().split('T')[0]
      return loginDate === date
    }).length

    const registrationsOnDate = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date).toISOString().split('T')[0]
      return signupDate === date
    }).length

    return {
      date,
      logins: loginsOnDate,
      registrations: registrationsOnDate,
      totalActivities: loginsOnDate + registrationsOnDate
    }
  })
}

// Create chart data for user growth
export function createUserGrowthChart(data: UserGrowthData[]): ChartData {
  return {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'New Signups',
        data: data.map(d => d.signups),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f640',
        fill: true
      },
      {
        label: 'Total Users',
        data: data.map(d => d.totalUsers),
        borderColor: '#10b981',
        backgroundColor: '#10b98140',
        fill: false
      }
    ]
  }
}

// Create chart data for revenue
export function createRevenueChart(data: RevenueData[]): ChartData {
  return {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b40',
        fill: true
      }
    ]
  }
}

// Create chart data for activity
export function createActivityChart(data: ActivityData[]): ChartData {
  return {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Logins',
        data: data.map(d => d.logins),
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf640',
        fill: true
      },
      {
        label: 'New Registrations',
        data: data.map(d => d.registrations),
        borderColor: '#06b6d4',
        backgroundColor: '#06b6d440',
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
        label: 'User Distribution',
        data: [freeUsers, proUsers],
        backgroundColor: ['#6b7280', '#3b82f6'],
        borderColor: ['#4b5563', '#2563eb'],
        borderWidth: 2
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
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`
}

export function getGrowthTrend(current: number, previous: number): 'up' | 'down' | 'neutral' {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'neutral'
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Format date for display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Calculate average session duration
export function calculateAverageSessionDuration(sessions: UserSession[]): number {
  const sessionsWithDuration = sessions.filter(s => s.metadata.session_duration)
  if (sessionsWithDuration.length === 0) return 0
  
  const totalDuration = sessionsWithDuration.reduce((sum, session) => {
    return sum + (session.metadata.session_duration || 0)
  }, 0)
  
  return Math.round(totalDuration / sessionsWithDuration.length)
}

// Get top performing metrics
export function getTopMetrics(users: User[], revenue: RevenueRecord[]) {
  const totalRevenue = revenue
    .filter(r => r.metadata.status === 'paid')
    .reduce((sum, r) => sum + r.metadata.amount, 0)
    
  const averageRevenuePerUser = users.length > 0 ? totalRevenue / users.length : 0
  const conversionRate = users.length > 0 
    ? (users.filter(u => u.metadata.subscription_plan === 'pro').length / users.length) * 100 
    : 0

  return {
    totalRevenue,
    averageRevenuePerUser,
    conversionRate
  }
}