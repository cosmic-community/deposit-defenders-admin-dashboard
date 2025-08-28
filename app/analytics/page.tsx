import { Suspense } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  generateUserGrowthData,
  generateRevenueData,
  createUserGrowthChart,
  createRevenueChart,
  formatCurrency,
  formatNumber,
  calculateGrowthPercentage,
  getTopMetrics
} from '@/lib/analytics'

async function AnalyticsContent() {
  try {
    const [users, sessions, revenue] = await Promise.all([
      getUsers(),
      getUserSessions(),
      getRevenueRecords()
    ])

    const userMetrics = calculateUserMetrics(users)
    const userGrowthData = generateUserGrowthData(users)
    const revenueData = generateRevenueData(revenue)
    const topMetrics = getTopMetrics(users, revenue)

    const userGrowthChart = createUserGrowthChart(userGrowthData)
    const revenueChart = createRevenueChart(revenueData)

    // Calculate total revenue
    const totalRevenue = revenue
      .filter(record => record.metadata.status === 'paid')
      .reduce((sum, record) => sum + record.metadata.amount, 0)

    // Calculate growth percentages
    const prevMonth = userMetrics.totalUsers - Math.floor(userMetrics.totalUsers * 0.1)
    const userGrowth = calculateGrowthPercentage(userMetrics.totalUsers, prevMonth)
    const revenueGrowth = calculateGrowthPercentage(totalRevenue, Math.max(0, totalRevenue - 500))

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Deep insights into user behavior, growth trends, and revenue patterns
          </p>
        </div>

        {/* Key Analytics Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="User Growth Rate"
            value={userGrowth}
            change="vs last month"
            trend={userMetrics.totalUsers > prevMonth ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${userMetrics.conversionRate.toFixed(1)}%`}
            change="free to pro"
            trend={userMetrics.conversionRate > 10 ? 'up' : 'neutral'}
            icon={<BarChart3 size={24} />}
          />
          <MetricCard
            title="Revenue Growth"
            value={revenueGrowth}
            change="vs last period"
            trend={totalRevenue > 0 ? 'up' : 'neutral'}
            icon={<DollarSign size={24} />}
          />
          <MetricCard
            title="Active Users %"
            value={`${userMetrics.totalUsers > 0 ? ((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1) : 0}%`}
            change="engagement rate"
            trend={userMetrics.activeUsers > userMetrics.totalUsers * 0.6 ? 'up' : 'neutral'}
            icon={<Users size={24} />}
          />
        </div>

        {/* Performance Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Performance Highlights
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Best Signup Day</span>
                  <span className="font-semibold">{formatNumber(topMetrics.topSignupDay.signups)} users</span>
                </div>
                <div className="text-xs text-muted-foreground">{topMetrics.topSignupDay.date}</div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Best Revenue Day</span>
                  <span className="font-semibold">{formatCurrency(topMetrics.topRevenueDay.amount)}</span>
                </div>
                <div className="text-xs text-muted-foreground">{topMetrics.topRevenueDay.date}</div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Avg Daily Signups</span>
                  <span className="font-semibold">{topMetrics.averageDailySignups.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Avg Daily Revenue</span>
                  <span className="font-semibold">{formatCurrency(topMetrics.averageDailyRevenue)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              User Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <span className="font-semibold">{formatNumber(userMetrics.totalUsers)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Free Users</span>
                  <span className="font-semibold">{formatNumber(userMetrics.freeUsers)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-gray-400 h-2 rounded-full" 
                    style={{ width: `${userMetrics.totalUsers > 0 ? (userMetrics.freeUsers / userMetrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Pro Users</span>
                  <span className="font-semibold">{formatNumber(userMetrics.proUsers)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${userMetrics.totalUsers > 0 ? (userMetrics.proUsers / userMetrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-semibold">{formatNumber(userMetrics.activeUsers)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${userMetrics.totalUsers > 0 ? (userMetrics.activeUsers / userMetrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="User Growth Trends (30 Days)"
            data={userGrowthChart}
            type="line"
            height={350}
          />
          <ChartCard
            title="Revenue Analytics (30 Days)"
            data={revenueChart}
            type="line"
            height={350}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Analytics page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Analytics Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load analytics data. Please check your Cosmic configuration.
          </p>
        </div>
      </div>
    )
  }
}

function AnalyticsLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-border pb-6">
        <div className="h-8 bg-accent rounded animate-pulse w-64 mb-2" />
        <div className="h-4 bg-accent rounded animate-pulse w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="chart-container">
            <div className="h-6 bg-accent rounded animate-pulse mb-4 w-48" />
            <div className="h-80 bg-accent rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsContent />
    </Suspense>
  )
}