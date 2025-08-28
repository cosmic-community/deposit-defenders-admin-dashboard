import { Suspense } from 'react'
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import ReportFilters from '@/components/ReportFilters'
import ReportExport from '@/components/ReportExport'
import UserTable from '@/components/UserTable'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  generateActivityData,
  createHourlyActivityChart,
  createActivityChart,
  formatNumber,
  formatCurrency,
  calculateGrowthPercentage
} from '@/lib/analytics'

async function ReportsContent() {
  try {
    const [users, sessions, revenue] = await Promise.all([
      getUsers(),
      getUserSessions(),
      getRevenueRecords()
    ])

    const userMetrics = calculateUserMetrics(users)
    const activityData = generateActivityData(users, sessions)
    const hourlyChart = createHourlyActivityChart(sessions)
    const dailyChart = createActivityChart(activityData)

    // Calculate report metrics
    const totalRevenue = revenue
      .filter(record => record.metadata.status === 'paid')
      .reduce((sum, record) => sum + record.metadata.amount, 0)
    
    const monthlyRevenue = revenue
      .filter(record => {
        const paymentDate = new Date(record.metadata.payment_date || record.created_at)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return record.metadata.status === 'paid' && paymentDate >= thirtyDaysAgo
      })
      .reduce((sum, record) => sum + record.metadata.amount, 0)

    const growthPercentage = calculateGrowthPercentage(monthlyRevenue, Math.max(1, totalRevenue - monthlyRevenue))

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate comprehensive reports and export your analytics data
          </p>
        </div>

        {/* Report Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ReportFilters />
          </div>
          <div className="lg:w-80">
            <ReportExport />
          </div>
        </div>

        {/* Report Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change={`${userMetrics.activeUsers} active`}
            icon={<FileText size={24} />}
          />
          <MetricCard
            title="Monthly Revenue"
            value={formatCurrency(monthlyRevenue)}
            change={growthPercentage}
            trend={monthlyRevenue > 0 ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Total Sessions"
            value={formatNumber(sessions.length)}
            change="all time"
            icon={<Calendar size={24} />}
          />
          <MetricCard
            title="Export Ready"
            value={formatNumber(users.length + sessions.length + revenue.length)}
            change="total records"
            icon={<Download size={24} />}
          />
        </div>

        {/* Report Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Hourly Usage Patterns"
            data={hourlyChart}
            type="bar"
            height={350}
          />
          <ChartCard
            title="Activity Overview"
            data={dailyChart}
            type="line"
            height={350}
          />
        </div>

        {/* Detailed User Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Detailed User Report
          </h3>
          <UserTable users={users} showActions={true} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Reports page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Reports Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load reports data. Please check your configuration.
          </p>
        </div>
      </div>
    )
  }
}

function ReportsLoading() {
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

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsLoading />}>
      <ReportsContent />
    </Suspense>
  )
}