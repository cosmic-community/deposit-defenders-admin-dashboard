import { Suspense } from 'react'
import { FileText, Download, Calendar, Filter } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import ReportFilters from '@/components/ReportFilters'
import ReportExport from '@/components/ReportExport'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  generateActivityData,
  createHourlyActivityChart,
  formatNumber,
  formatCurrency,
  getTopMetrics
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
    const topMetrics = getTopMetrics(users, revenue)
    const hourlyActivityChart = createHourlyActivityChart(sessions)

    // Calculate total revenue
    const totalRevenue = revenue
      .filter(record => record.metadata.status === 'paid')
      .reduce((sum, record) => sum + record.metadata.amount, 0)

    // Calculate this month's data
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const monthlySignups = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date || user.created_at)
      return signupDate >= startOfMonth
    }).length

    const monthlyRevenue = revenue
      .filter(record => {
        const paymentDate = new Date(record.metadata.payment_date || record.created_at)
        return record.metadata.status === 'paid' && paymentDate >= startOfMonth
      })
      .reduce((sum, record) => sum + record.metadata.amount, 0)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate detailed reports and export data for analysis
          </p>
        </div>

        {/* Report Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Monthly Signups"
            value={formatNumber(monthlySignups)}
            change="this month"
            icon={<FileText size={24} />}
          />
          <MetricCard
            title="Monthly Revenue"
            value={formatCurrency(monthlyRevenue)}
            change="this month"
            icon={<Download size={24} />}
          />
          <MetricCard
            title="Reports Generated"
            value="47"
            change="+12 this week"
            trend="up"
            icon={<Calendar size={24} />}
          />
          <MetricCard
            title="Data Exports"
            value="23"
            change="this month"
            icon={<Filter size={24} />}
          />
        </div>

        {/* Report Filters and Export */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReportFilters />
          </div>
          <div>
            <ReportExport />
          </div>
        </div>

        {/* Activity Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Activity Report (Last 24 Hours)"
            data={hourlyActivityChart}
            type="line"
            height={350}
          />
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Report Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">{formatNumber(userMetrics.totalUsers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Sessions</span>
                <span className="font-semibold">{formatNumber(sessions.length)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Revenue Records</span>
                <span className="font-semibold">{formatNumber(revenue.length)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold">{userMetrics.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Reports
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Report Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Date Range
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Generated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm text-foreground">User Activity Report</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">Last 30 days</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">2 hours ago</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Ready
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-dark text-sm font-medium">
                      Download
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-foreground">Revenue Report</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">This month</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">5 hours ago</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Ready
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary-dark text-sm font-medium">
                      Download
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-foreground">User Conversion Report</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">Last 7 days</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">1 day ago</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Processing
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-muted-foreground text-sm font-medium cursor-not-allowed">
                      Pending
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsLoading />}>
      <ReportsContent />
    </Suspense>
  )
}