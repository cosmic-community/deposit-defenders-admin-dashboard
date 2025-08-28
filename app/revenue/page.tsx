import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateDashboardMetrics, 
  generateRevenueData, 
  createRevenueChart,
  formatCurrency,
  formatNumber,
  calculateGrowthPercentage
} from '@/lib/analytics'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import RevenueTable from '@/components/RevenueTable'
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react'

export default async function RevenuePage() {
  try {
    const [users, sessions, revenueRecords] = await Promise.all([
      getUsers(),
      getUserSessions(), 
      getRevenueRecords()
    ])

    const metrics = calculateDashboardMetrics(users, sessions, revenueRecords)
    const revenueData = generateRevenueData(revenueRecords)
    const revenueChart = createRevenueChart(revenueData)

    // Calculate additional revenue metrics
    const totalTransactions = revenueRecords.length
    const averageRevenuePerUser = metrics.totalUsers > 0 ? metrics.totalRevenue / metrics.totalUsers : 0
    const paidTransactions = revenueRecords.filter(r => r.metadata?.status === 'paid').length
    const failedTransactions = revenueRecords.filter(r => r.metadata?.status === 'failed').length
    const refundedTransactions = revenueRecords.filter(r => r.metadata?.status === 'refunded').length
    
    // Calculate success rate
    const successRate = totalTransactions > 0 ? (paidTransactions / totalTransactions) * 100 : 0
    
    // Revenue growth calculation (comparing last 15 days vs previous 15 days)
    const now = new Date()
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const recentRevenue = revenueRecords
      .filter(r => r.metadata?.payment_date && new Date(r.metadata.payment_date) >= fifteenDaysAgo)
      .reduce((sum, r) => sum + (r.metadata?.amount || 0), 0)
    
    const previousRevenue = revenueRecords
      .filter(r => r.metadata?.payment_date && 
        new Date(r.metadata.payment_date) >= thirtyDaysAgo &&
        new Date(r.metadata.payment_date) < fifteenDaysAgo)
      .reduce((sum, r) => sum + (r.metadata?.amount || 0), 0)
    
    const revenueGrowth = calculateGrowthPercentage(recentRevenue, previousRevenue)
    const mrrGrowth = calculateGrowthPercentage(metrics.monthlyRecurringRevenue, metrics.monthlyRecurringRevenue * 0.9) // Mock calculation

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Revenue Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track revenue performance, subscriptions, and payment analytics
            </p>
          </div>
        </div>

        {/* Key Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            change={revenueGrowth}
            trend={recentRevenue > previousRevenue ? 'up' : recentRevenue < previousRevenue ? 'down' : 'neutral'}
            icon={<DollarSign size={24} />}
          />
          
          <MetricCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(metrics.monthlyRecurringRevenue)}
            change={mrrGrowth}
            trend="up"
            icon={<TrendingUp size={24} />}
          />
          
          <MetricCard
            title="Average Revenue Per User"
            value={formatCurrency(averageRevenuePerUser)}
            change="+8.2%"
            trend="up"
            icon={<Users size={24} />}
          />
          
          <MetricCard
            title="Payment Success Rate"
            value={`${successRate.toFixed(1)}%`}
            change="+2.1%"
            trend="up"
            icon={<CreditCard size={24} />}
          />
        </div>

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Revenue Over Time"
            data={revenueChart}
            type="line"
            height={350}
          />
          
          <ChartCard
            title="Payment Status Distribution"
            data={{
              labels: ['Successful', 'Failed', 'Refunded'],
              datasets: [{
                label: 'Transactions',
                data: [paidTransactions, failedTransactions, refundedTransactions],
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 0
              }]
            }}
            type="doughnut"
            height={350}
          />
        </div>

        {/* Additional Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Volume</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-medium">{formatNumber(totalTransactions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Successful</span>
                <span className="font-medium text-green-500">{formatNumber(paidTransactions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-medium text-red-500">{formatNumber(failedTransactions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Refunded</span>
                <span className="font-medium text-yellow-500">{formatNumber(refundedTransactions)}</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Subscription Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pro Subscribers</span>
                <span className="font-medium">{formatNumber(metrics.proUsers)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Users</span>
                <span className="font-medium">{formatNumber(metrics.freeUsers)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-medium">{metrics.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Churn Rate</span>
                <span className="font-medium">2.3%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Projections</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Month MRR</span>
                <span className="font-medium">{formatCurrency(metrics.monthlyRecurringRevenue * 1.05)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Run Rate</span>
                <span className="font-medium">{formatCurrency(metrics.monthlyRecurringRevenue * 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projected Growth</span>
                <span className="font-medium text-green-500">+15.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer LTV</span>
                <span className="font-medium">{formatCurrency(averageRevenuePerUser * 12)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Revenue Transactions
          </h3>
          <RevenueTable transactions={revenueRecords.slice(0, 10)} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading revenue data:', error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Revenue Data</h2>
          <p className="text-red-600 mt-1">
            Unable to load revenue analytics. Please check your connection and try again.
          </p>
        </div>
      </div>
    )
  }
}