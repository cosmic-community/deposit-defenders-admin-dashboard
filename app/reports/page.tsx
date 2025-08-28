import { Suspense } from 'react'
import { FileText, Download, Filter, Calendar } from 'lucide-react'
import ReportFilters from '@/components/ReportFilters'
import ReportExport from '@/components/ReportExport'
import ChartCard from '@/components/ChartCard'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateDashboardMetrics,
  generateUserGrowthData,
  generateRevenueData,
  createUserGrowthChart,
  createRevenueChart,
  formatCurrency,
  formatNumber
} from '@/lib/analytics'

async function ReportsContent() {
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

    // Fix: Create proper report data with all required properties
    const reportData = {
      users: users,
      sessions: sessions,
      revenue: revenue
    }

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate comprehensive reports and export your platform data
          </p>
        </div>

        {/* Report Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Report Filters</h2>
            </div>
            <ReportFilters />
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Export Data</h2>
            </div>
            <ReportExport data={reportData} />
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Report Summary</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">{formatNumber(metrics.totalUsers)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-xl font-bold">{formatNumber(sessions.length)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="User Growth Report"
            data={userGrowthChart}
            type="line"
            height={400}
          />
          <ChartCard
            title="Revenue Report"
            data={revenueChart}
            type="line"
            height={400}
          />
        </div>

        {/* Detailed Report Table */}
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Detailed Report Data</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(metrics.totalUsers)}
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(sessions.length)}
                </div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3">Metric</th>
                    <th className="text-left p-3">Value</th>
                    <th className="text-left p-3">Change</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3">Total Users</td>
                    <td className="p-3 font-semibold">{formatNumber(metrics.totalUsers)}</td>
                    <td className="p-3 text-green-500">+{metrics.newUsersThisMonth}</td>
                    <td className="p-3">Active</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Pro Subscribers</td>
                    <td className="p-3 font-semibold">{formatNumber(metrics.proUsers)}</td>
                    <td className="p-3 text-blue-500">{metrics.conversionRate.toFixed(1)}%</td>
                    <td className="p-3">Growing</td>
                  </tr>
                  <tr>
                    <td className="p-3">Monthly Revenue</td>
                    <td className="p-3 font-semibold">{formatCurrency(metrics.monthlyRecurringRevenue)}</td>
                    <td className="p-3 text-green-500">+12.5%</td>
                    <td className="p-3">Healthy</td>
                  </tr>
                </tbody>
              </table>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <div className="h-6 bg-accent rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-accent rounded animate-pulse" />
              <div className="h-4 bg-accent rounded animate-pulse" />
              <div className="h-4 bg-accent rounded animate-pulse w-1/2" />
            </div>
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