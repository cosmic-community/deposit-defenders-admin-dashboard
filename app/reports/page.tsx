import { Suspense } from 'react'
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import ReportFilters from '@/components/ReportFilters'
import ReportExport from '@/components/ReportExport'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateDashboardMetrics,
  calculateUserMetrics,
  generateUserGrowthData,
  generateRevenueData,
  generateActivityData,
  createUserGrowthChart,
  createRevenueChart,
  createActivityChart,
  createHourlyActivityChart,
  formatCurrency,
  formatNumber,
  calculateGrowthPercentage
} from '@/lib/analytics'

async function ReportsContent() {
  try {
    const [users, sessions, revenue] = await Promise.all([
      getUsers(),
      getUserSessions(),
      getRevenueRecords()
    ])

    const dashboardMetrics = calculateDashboardMetrics(users, sessions, revenue)
    const userMetrics = calculateUserMetrics(users)
    const userGrowthData = generateUserGrowthData(users)
    const revenueData = generateRevenueData(revenue)
    const activityData = generateActivityData(sessions, users)

    // Create comprehensive charts
    const userGrowthChart = createUserGrowthChart(userGrowthData)
    const revenueChart = createRevenueChart(revenueData)
    const activityChart = createActivityChart(activityData)
    const hourlyActivityChart = createHourlyActivityChart(sessions)

    // Advanced analytics calculations
    const totalSessions = sessions.length
    const avgSessionsPerUser = users.length > 0 ? totalSessions / users.length : 0
    const topPerformingHour = sessions.reduce((acc, session) => {
      const hour = new Date(session.metadata?.login_date || session.created_at).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    // Fix: Add safe access with proper undefined checks for both sides of comparison
    const peakHour = Object.keys(topPerformingHour).length > 0 
      ? Object.keys(topPerformingHour).reduce((a, b) => {
          const aValue = topPerformingHour[parseInt(a)] || 0
          const bValue = topPerformingHour[parseInt(b)] || 0
          return aValue > bValue ? a : b
        }, '0')
      : '0'

    // Device analytics
    const deviceStats = {
      desktop: sessions.filter(s => s.metadata?.device_type === 'desktop').length,
      mobile: sessions.filter(s => s.metadata?.device_type === 'mobile').length,
      tablet: sessions.filter(s => s.metadata?.device_type === 'tablet').length
    }

    const deviceChartData = {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        label: 'Device Usage',
        data: [deviceStats.desktop, deviceStats.mobile, deviceStats.tablet],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    }

    // Subscription analytics
    const subscriptionTrends = {
      labels: ['Free Plan', 'Pro Plan'],
      datasets: [{
        label: 'Plan Distribution',
        data: [userMetrics.freeUsers, userMetrics.proUsers],
        backgroundColor: ['#94a3b8', '#3b82f6'],
        borderWidth: 0
      }]
    }

    // Payment status breakdown
    const paymentAnalytics = {
      successful: revenue.filter(r => r.metadata?.status === 'paid').length,
      failed: revenue.filter(r => r.metadata?.status === 'failed').length,
      refunded: revenue.filter(r => r.metadata?.status === 'refunded').length
    }

    const paymentChartData = {
      labels: ['Successful', 'Failed', 'Refunded'],
      datasets: [{
        label: 'Payment Status',
        data: [paymentAnalytics.successful, paymentAnalytics.failed, paymentAnalytics.refunded],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0
      }]
    }

    // Generate report data for export
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: 'Last 30 Days',
      summary: {
        totalUsers: userMetrics.totalUsers,
        activeUsers: userMetrics.activeUsers,
        totalRevenue: dashboardMetrics.totalRevenue,
        totalSessions,
        conversionRate: userMetrics.conversionRate
      },
      userGrowth: userGrowthData,
      revenueData,
      activityData,
      deviceStats,
      paymentAnalytics
    }

    return (
      <div className="p-8 space-y-8">
        {/* Header with Export Controls */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Reports Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analytics reports and data insights for Deposit Defenders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReportFilters />
            <ReportExport reportData={reportData} />
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Executive Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={formatNumber(userMetrics.totalUsers)}
              change={`+${userMetrics.newUsersThisMonth} this month`}
              trend="up"
              icon={<Users size={24} />}
            />
            <MetricCard
              title="Active Users"
              value={formatNumber(userMetrics.activeUsers)}
              change={`${((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1)}% of total`}
              trend={userMetrics.activeUsers > userMetrics.totalUsers * 0.7 ? 'up' : 'neutral'}
              icon={<TrendingUp size={24} />}
            />
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(dashboardMetrics.totalRevenue)}
              change={`${formatCurrency(dashboardMetrics.monthlyRecurringRevenue)} MRR`}
              trend="up"
              icon={<DollarSign size={24} />}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${userMetrics.conversionRate.toFixed(1)}%`}
              change={`${userMetrics.proUsers} pro users`}
              trend={userMetrics.conversionRate > 10 ? 'up' : 'neutral'}
              icon={<PieChart size={24} />}
            />
          </div>
        </div>

        {/* User Analytics Report */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">User Analytics Report</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="User Growth Trends (30 Days)"
              data={userGrowthChart}
              type="line"
              height={350}
            />
            
            <ChartCard
              title="Subscription Plan Distribution"
              data={subscriptionTrends}
              type="doughnut"
              height={350}
            />
          </div>

          {/* User Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="metric-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">User Status Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium text-green-500">{formatNumber(userMetrics.activeUsers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inactive Users</span>
                  <span className="font-medium text-yellow-500">{formatNumber(userMetrics.totalUsers - userMetrics.activeUsers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New This Month</span>
                  <span className="font-medium text-blue-500">{formatNumber(userMetrics.newUsersThisMonth)}</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-medium">{formatNumber(totalSessions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Sessions/User</span>
                  <span className="font-medium">{avgSessionsPerUser.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak Activity Hour</span>
                  <span className="font-medium">{peakHour}:00</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Users</span>
                  <span className="font-medium">{formatNumber(userMetrics.freeUsers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pro Users</span>
                  <span className="font-medium text-blue-500">{formatNumber(userMetrics.proUsers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-medium">{userMetrics.conversionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Engagement Report */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Activity & Engagement Report</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Daily Activity Trends (30 Days)"
              data={activityChart}
              type="line"
              height={350}
            />
            
            <ChartCard
              title="Hourly Usage Patterns"
              data={hourlyActivityChart}
              type="bar"
              height={350}
            />
          </div>

          <ChartCard
            title="Device Usage Distribution"
            data={deviceChartData}
            type="pie"
            height={300}
          />
        </div>

        {/* Revenue & Financial Report */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Revenue & Financial Report</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Revenue Trends & MRR (30 Days)"
              data={revenueChart}
              type="line"
              height={350}
            />
            
            <ChartCard
              title="Payment Status Analysis"
              data={paymentChartData}
              type="doughnut"
              height={350}
            />
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="metric-card text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(dashboardMetrics.totalRevenue)}</p>
            </div>
            <div className="metric-card text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Monthly Recurring Revenue</h3>
              <p className="text-2xl font-bold text-blue-500">{formatCurrency(dashboardMetrics.monthlyRecurringRevenue)}</p>
            </div>
            <div className="metric-card text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Successful Payments</h3>
              <p className="text-2xl font-bold text-green-500">{formatNumber(paymentAnalytics.successful)}</p>
            </div>
            <div className="metric-card text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Success Rate</h3>
              <p className="text-2xl font-bold text-foreground">
                {revenue.length > 0 ? ((paymentAnalytics.successful / revenue.length) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">User Engagement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {userMetrics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Free to Pro Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {avgSessionsPerUser.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Sessions per User</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {revenue.length > 0 ? ((paymentAnalytics.successful / revenue.length) * 100).toFixed(0) : '0'}%
              </div>
              <div className="text-sm text-muted-foreground">Payment Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Reports error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Reports Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load reports data. Please check your Cosmic configuration.
          </p>
        </div>
      </div>
    )
  }
}

function ReportsLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Header Loading */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <div className="h-8 bg-accent rounded animate-pulse w-64 mb-2" />
          <div className="h-4 bg-accent rounded animate-pulse w-96" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 bg-accent rounded animate-pulse w-32" />
          <div className="h-10 bg-accent rounded animate-pulse w-32" />
        </div>
      </div>
      
      {/* Executive Summary Loading */}
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
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
      
      {/* Charts Loading */}
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="chart-container">
              <div className="h-6 bg-accent rounded animate-pulse mb-4 w-32" />
              <div className="h-80 bg-accent rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* More sections loading */}
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="h-96 bg-accent rounded animate-pulse" />
      </div>
      
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="h-96 bg-accent rounded animate-pulse" />
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