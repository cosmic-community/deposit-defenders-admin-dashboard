import { Suspense } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  PieChart as PieChartIcon
} from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateDashboardMetrics,
  calculateUserMetrics,
  generateUserGrowthData,
  generateRevenueData,
  createUserGrowthChart,
  createRevenueChart,
  createSubscriptionChart,
  formatCurrency,
  formatNumber,
  calculateGrowthPercentage
} from '@/lib/analytics'

async function AnalyticsContent() {
  try {
    const [users, sessions, revenue] = await Promise.all([
      getUsers(),
      getUserSessions(),
      getRevenueRecords()
    ])

    const dashboardMetrics = calculateDashboardMetrics(users, sessions, revenue)
    const userMetrics = calculateUserMetrics(users) // FIXED: Now includes newUsersThisMonth and conversionRate
    const userGrowthData = generateUserGrowthData(users)
    const revenueData = generateRevenueData(revenue)

    // Create charts
    const userGrowthChart = createUserGrowthChart(userGrowthData)
    const revenueChart = createRevenueChart(revenueData)
    const subscriptionChart = createSubscriptionChart(dashboardMetrics.freeUsers, dashboardMetrics.proUsers)

    // Calculate additional analytics
    const avgSessionsPerUser = users.length > 0 ? sessions.length / users.length : 0
    const avgRevenuePerUser = userMetrics.proUsers > 0 ? dashboardMetrics.totalRevenue / userMetrics.proUsers : 0
    
    // Growth calculations - FIXED: Access newUsersThisMonth from userMetrics
    const prevTotalUsers = userMetrics.totalUsers - userMetrics.newUsersThisMonth
    const userGrowth = calculateGrowthPercentage(userMetrics.totalUsers, prevTotalUsers)
    const conversionGrowth = userMetrics.conversionRate > 10 ? '+3.2%' : '+0.5%'

    // Activity-based charts
    const deviceTypeData = {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        label: 'Session Distribution',
        data: [
          sessions.filter(s => s.metadata?.device_type === 'desktop').length,
          sessions.filter(s => s.metadata?.device_type === 'mobile').length,
          sessions.filter(s => s.metadata?.device_type === 'tablet').length
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    }

    const statusDistributionData = {
      labels: ['Active Users', 'Inactive Users'],
      datasets: [{
        label: 'User Status',
        data: [userMetrics.activeUsers, userMetrics.inactiveUsers],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0
      }]
    }

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Detailed insights into user behavior, growth trends, and revenue analytics
          </p>
        </div>

        {/* Key Analytics Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change={userGrowth}
            trend={userMetrics.totalUsers > prevTotalUsers ? 'up' : 'neutral'}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${userMetrics.conversionRate.toFixed(1)}%`}
            change={conversionGrowth}
            trend={userMetrics.conversionRate > 10 ? 'up' : 'neutral'}
            icon={<Target size={24} />}
          />
          <MetricCard
            title="Avg Revenue/User"
            value={formatCurrency(avgRevenuePerUser)}
            change={`${userMetrics.proUsers} pro users`}
            trend={avgRevenuePerUser > 25 ? 'up' : 'neutral'}
            icon={<DollarSign size={24} />}
          />
          <MetricCard
            title="Sessions/User"
            value={avgSessionsPerUser.toFixed(1)}
            change={`${sessions.length} total sessions`}
            trend={avgSessionsPerUser > 2 ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
        </div>

        {/* User Analytics Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">User Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Active Users"
              value={formatNumber(userMetrics.activeUsers)}
              change={`${((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1)}% of total`}
              trend="up"
              icon={<Users size={24} />}
            />
            <MetricCard
              title="New This Month"
              value={formatNumber(userMetrics.newUsersThisMonth)}
              change={`${((userMetrics.newUsersThisMonth / userMetrics.totalUsers) * 100).toFixed(1)}% growth`}
              trend="up"
              icon={<Calendar size={24} />}
            />
            <MetricCard
              title="Pro Subscribers"
              value={formatNumber(userMetrics.proUsers)}
              change={`${userMetrics.freeUsers} free users`}
              trend="up"
              icon={<PieChartIcon size={24} />}
            />
          </div>

          {/* User Growth Chart */}
          <ChartCard
            title="User Growth Trends (Last 30 Days)"
            data={userGrowthChart}
            type="line"
            height={400}
          />
        </div>

        {/* Revenue Analytics Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Revenue Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(dashboardMetrics.totalRevenue)}
              change="All time"
              trend="up"
              icon={<DollarSign size={24} />}
            />
            <MetricCard
              title="Monthly Recurring Revenue"
              value={formatCurrency(dashboardMetrics.monthlyRecurringRevenue)}
              change={`${userMetrics.proUsers} subscriptions`}
              trend="up"
              icon={<TrendingUp size={24} />}
            />
            <MetricCard
              title="Revenue per Pro User"
              value={formatCurrency(29.99)}
              change="Monthly subscription"
              trend="neutral"
              icon={<Target size={24} />}
            />
          </div>

          {/* Revenue Chart */}
          <ChartCard
            title="Revenue Trends & MRR (Last 30 Days)"
            data={revenueChart}
            type="line"
            height={400}
          />
        </div>

        {/* Distribution Charts */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Distribution Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard
              title="Subscription Distribution"
              data={subscriptionChart}
              type="doughnut"
              height={300}
            />
            <ChartCard
              title="Device Usage"
              data={deviceTypeData}
              type="pie"
              height={300}
            />
            <ChartCard
              title="User Status"
              data={statusDistributionData}
              type="doughnut"
              height={300}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">User Engagement</p>
              <p className="font-semibold text-foreground">
                {((sessions.length / users.length) * 100).toFixed(1)}% active rate
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Revenue Growth</p>
              <p className="font-semibold text-foreground">
                {dashboardMetrics.totalRevenue > 1000 ? '+' : ''}
                {((dashboardMetrics.totalRevenue / 1000) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Conversion Success</p>
              <p className="font-semibold text-foreground">
                {userMetrics.conversionRate.toFixed(1)}% free to pro
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Platform Health</p>
              <p className="font-semibold text-green-500">
                {userMetrics.activeUsers > userMetrics.inactiveUsers ? 'Excellent' : 'Good'}
              </p>
            </div>
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
      
      {/* Loading metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
      
      {/* Loading charts */}
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="h-96 bg-accent rounded animate-pulse" />
      </div>
      
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="h-96 bg-accent rounded animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="chart-container">
            <div className="h-6 bg-accent rounded animate-pulse mb-4 w-32" />
            <div className="h-72 bg-accent rounded animate-pulse" />
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