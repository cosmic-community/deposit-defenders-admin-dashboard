import { Suspense } from 'react'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  UserPlus,
  CreditCard
} from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import UserTable from '@/components/UserTable'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateDashboardMetrics,
  generateUserGrowthData,
  generateRevenueData,
  createUserGrowthChart,
  createRevenueChart,
  createSubscriptionChart,
  formatCurrency,
  formatNumber,
  calculateGrowthPercentage
} from '@/lib/analytics'

async function DashboardContent() {
  try {
    const [users, sessions, revenue] = await Promise.all([
      getUsers(),
      getUserSessions(),
      getRevenueRecords()
    ])

    const metrics = calculateDashboardMetrics(users, sessions, revenue)
    const userGrowthData = generateUserGrowthData(users)
    const revenueData = generateRevenueData(revenue)

    const userGrowthChart = createUserGrowthChart(userGrowthData)
    const revenueChart = createRevenueChart(revenueData)
    const subscriptionChart = createSubscriptionChart(metrics.freeUsers, metrics.proUsers)

    // Calculate growth percentages (using mock previous data for demo)
    const prevTotalUsers = metrics.totalUsers - metrics.newUsersThisMonth
    const userGrowth = calculateGrowthPercentage(metrics.totalUsers, prevTotalUsers)
    const revenueGrowth = calculateGrowthPercentage(metrics.totalRevenue, Math.max(0, metrics.totalRevenue - 500))

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your Deposit Defenders platform growth and performance
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(metrics.totalUsers)}
            change={userGrowth}
            trend={metrics.totalUsers > prevTotalUsers ? 'up' : 'neutral'}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Monthly Revenue"
            value={formatCurrency(metrics.monthlyRecurringRevenue)}
            change={revenueGrowth}
            trend={metrics.totalRevenue > 0 ? 'up' : 'neutral'}
            icon={<DollarSign size={24} />}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            change={metrics.conversionRate > 10 ? '+2.1%' : '0%'}
            trend={metrics.conversionRate > 10 ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(metrics.activeUsers)}
            change={`${metrics.totalLogins} logins`}
            trend={metrics.activeUsers > 0 ? 'up' : 'neutral'}
            icon={<Activity size={24} />}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="New Users Today"
            value={formatNumber(metrics.newUsersToday)}
            change="vs yesterday"
            icon={<UserPlus size={24} />}
          />
          <MetricCard
            title="Pro Subscribers"
            value={formatNumber(metrics.proUsers)}
            change={`${metrics.freeUsers} free users`}
            icon={<CreditCard size={24} />}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            change="all time"
            icon={<DollarSign size={24} />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="User Growth (30 Days)"
            data={userGrowthChart}
            type="line"
            height={350}
          />
          <ChartCard
            title="Revenue Trends"
            data={revenueChart}
            type="line"
            height={350}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ChartCard
              title="Subscription Distribution"
              data={subscriptionChart}
              type="doughnut"
              height={300}
            />
          </div>
          <div className="lg:col-span-2">
            <UserTable users={users.slice(0, 10)} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Dashboard Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load dashboard data. Please check your Cosmic configuration.
          </p>
        </div>
      </div>
    )
  }
}

function DashboardLoading() {
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}