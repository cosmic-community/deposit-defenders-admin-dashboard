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
  createSubscriptionChart,
  getTopMetrics,
  formatCurrency,
  formatNumber
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
    const subscriptionChart = createSubscriptionChart(userMetrics.freeUsers, userMetrics.proUsers)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Deep insights into user behavior, growth patterns, and business performance
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Conversion Rate"
            value={`${userMetrics.conversionRate.toFixed(1)}%`}
            change={userMetrics.conversionRate > 10 ? '+2.3%' : '0%'}
            trend={userMetrics.conversionRate > 10 ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Pro Users"
            value={formatNumber(userMetrics.proUsers)}
            change={`${userMetrics.freeUsers} free users`}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Top Revenue Day"
            value={formatCurrency(topMetrics.topRevenueDay.amount)}
            change={new Date(topMetrics.topRevenueDay.date).toLocaleDateString()}
            trend={topMetrics.topRevenueDay.amount > 0 ? 'up' : 'neutral'}
            icon={<DollarSign size={24} />}
          />
          <MetricCard
            title="Avg Daily Signups"
            value={topMetrics.averageDailySignups.toFixed(1)}
            change="per day"
            icon={<BarChart3 size={24} />}
          />
        </div>

        {/* Advanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="User Growth Analysis"
            data={userGrowthChart}
            type="line"
            height={400}
          />
          <ChartCard
            title="Revenue Performance"
            data={revenueChart}
            type="line"
            height={400}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Subscription Breakdown"
            data={subscriptionChart}
            type="doughnut"
            height={300}
          />
          <div className="lg:col-span-2">
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Performance Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Top Signup Day</h4>
                  <p className="text-2xl font-bold text-foreground">
                    {topMetrics.topSignupDay.signups}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(topMetrics.topSignupDay.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Avg Daily Revenue</h4>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(topMetrics.averageDailyRevenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per day average
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            Unable to load analytics data. Please check your configuration.
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