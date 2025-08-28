import { Suspense } from 'react'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  getTopMetrics,
  generateUserGrowthData,
  generateRevenueData,
  createUserGrowthChart,
  createRevenueChart,
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
    const topMetrics = getTopMetrics(users, sessions, revenue)
    const userGrowthData = generateUserGrowthData(users)
    const revenueData = generateRevenueData(revenue)

    const userGrowthChart = createUserGrowthChart(userGrowthData)
    const revenueChart = createRevenueChart(revenueData)

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into your platform metrics and performance trends
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change={`${userMetrics.activeUsers} active`}
            trend="up"
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Pro Users"
            value={formatNumber(userMetrics.proUsers)}
            change={`${userMetrics.freeUsers} free users`}
            trend="up"
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(topMetrics.growth.revenue)}
            change="Monthly recurring"
            trend="up"
            icon={<DollarSign size={24} />}
          />
          <MetricCard
            title="Growth"
            value={`${topMetrics.growth.users}`}
            change="New users this month"
            trend="up"
            icon={<Activity size={24} />}
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="User Growth Trends"
            data={userGrowthChart}
            type="line"
            height={400}
          />
          <ChartCard
            title="Revenue Analytics"
            data={revenueChart}
            type="line"
            height={400}
          />
        </div>

        {/* Top Metrics Summary */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMetrics.topMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {typeof metric.value === 'number' && metric.label.includes('Revenue') 
                    ? formatCurrency(metric.value)
                    : formatNumber(metric.value)
                  }
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Analytics error:', error)
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