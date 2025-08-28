import { User, UserSession, RevenueRecord, DashboardMetrics, ChartData, UserGrowthData, RevenueData } from '@/types'

// Calculate key dashboard metrics from data
export function calculateDashboardMetrics(
  users: User[], 
  sessions: UserSession[], 
  revenue: RevenueRecord[]
): DashboardMetrics {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
  
  // User metrics
  const totalUsers = users.length
  const newUsersToday = users.filter(user => user.metadata.signup_date === today).length
  const newUsersThisMonth = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return signupDate >= thirtyDaysAgo
  }).length
  
  // Revenue metrics
  const totalRevenue = revenue.reduce((sum, record) => sum + record.metadata.amount, 0)
  const monthlyRevenue = revenue.filter(record => {
    const paymentDate = new Date(record.metadata.payment_date)
    return paymentDate >= thirtyDaysAgo
  })
  const monthlyRecurringRevenue = monthlyRevenue.reduce((sum, record) => sum + record.metadata.amount, 0)
  
  // Subscription metrics
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0
  
  // Activity metrics
  const totalLogins = sessions.length
  const recentLogins = sessions.filter(session => {
    const loginDate = new Date(session.metadata.login_date)
    return loginDate >= thirtyDaysAgo
  }).length
  const activeUsers = recentLogins // Users who logged in within last 30 days
  
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

// Generate user growth data for charting
export function generateUserGrowthData(users: User[]): UserGrowthData[] {
  const growthMap = new Map<string, { signups: number; totalUsers: number }>()
  const sortedUsers = users.sort((a, b) => 
    new Date(a.metadata.signup_date).getTime() - new Date(b.metadata.signup_date).getTime()
  )
  
  let cumulativeUsers = 0
  
  sortedUsers.forEach(user => {
    const date = user.metadata.signup_date
    const existing = growthMap.get(date) || { signups: 0, totalUsers: 0 }
    existing.signups += 1
    cumulativeUsers += 1
    existing.totalUsers = cumulativeUsers
    growthMap.set(date, existing)
  })
  
  return Array.from(growthMap.entries()).map(([date, data]) => ({
    date,
    signups: data.signups,
    totalUsers: data.totalUsers
  }))
}

// Generate revenue data for charting
export function generateRevenueData(revenue: RevenueRecord[]): RevenueData[] {
  const revenueMap = new Map<string, { revenue: number; mrr: number }>()
  
  revenue.forEach(record => {
    const date = record.metadata.payment_date
    const existing = revenueMap.get(date) || { revenue: 0, mrr: 0 }
    existing.revenue += record.metadata.amount
    
    // Calculate MRR (assuming pro plan is monthly subscription)
    if (record.metadata.subscription_plan === 'pro') {
      existing.mrr += record.metadata.amount
    }
    
    revenueMap.set(date, existing)
  })
  
  return Array.from(revenueMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    mrr: data.mrr
  }))
}

// Create Chart.js compatible data for user growth
export function createUserGrowthChart(data: UserGrowthData[]): ChartData {
  // Sort data by date to ensure proper chronological order
  const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  return {
    labels: sortedData.map(d => formatDateForChart(d.date)),
    datasets: [
      {
        label: 'Daily Signups',
        data: sortedData.map(d => d.signups),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Total Users',
        data: sortedData.map(d => d.totalUsers),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  }
}

// Create Chart.js compatible data for revenue trends
export function createRevenueChart(data: RevenueData[]): ChartData {
  // Sort data by date to ensure proper chronological order
  const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  return {
    labels: sortedData.map(d => formatDateForChart(d.date)),
    datasets: [
      {
        label: 'Daily Revenue',
        data: sortedData.map(d => d.revenue),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Monthly Recurring Revenue',
        data: sortedData.map(d => d.mrr),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
        backgroundColor: [
          '#6b7280', // Gray for free
          '#3b82f6'  // Blue for pro
        ],
        borderWidth: 0
      }
    ]
  }
}

// Format date for chart labels (MM/DD format)
export function formatDateForChart(dateString: string): string {
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString // Return original string if invalid date
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

// Format currency values
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format number values with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Calculate growth percentage
export function calculateGrowthPercentage(current: number, previous: number): string {
  if (previous === 0) return '0%'
  
  const growth = ((current - previous) / previous) * 100
  const sign = growth >= 0 ? '+' : ''
  
  return `${sign}${growth.toFixed(1)}%`
}

// Generate date range for analytics (last N days)
export function generateDateRange(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// Calculate average session duration
export function calculateAverageSessionDuration(sessions: UserSession[]): number {
  const sessionsWithDuration = sessions.filter(s => s.metadata.session_duration)
  
  if (sessionsWithDuration.length === 0) return 0
  
  const totalDuration = sessionsWithDuration.reduce((sum, session) => {
    return sum + (session.metadata.session_duration || 0)
  }, 0)
  
  return totalDuration / sessionsWithDuration.length
}

// Get top performing metrics
export function getTopMetrics(users: User[]): {
  topSpender: User | null;
  mostActiveUser: User | null;
  recentSignups: User[];
} {
  // Find top spender
  const topSpender = users.length > 0 
    ? users.reduce((prev, current) => 
        (prev.metadata.total_spent > current.metadata.total_spent) ? prev : current
      )
    : null

  // Most active user (by properties count)
  const mostActiveUser = users.length > 0
    ? users.reduce((prev, current) => 
        (prev.metadata.properties_count > current.metadata.properties_count) ? prev : current
      )
    : null

  // Recent signups (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000))
  const recentSignups = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return signupDate >= sevenDaysAgo
  }).slice(0, 5) // Top 5 recent signups

  return {
    topSpender,
    mostActiveUser,
    recentSignups
  }
}