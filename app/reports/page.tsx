import { Suspense } from 'react'
import { FileText, TrendingUp, Calendar, Download } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ReportFilters from '@/components/ReportFilters'
import ReportExport from '@/components/ReportExport'
import { getUsers, getRevenueRecords } from '@/lib/cosmic'
import { formatCurrency, formatNumber } from '@/lib/analytics'

async function ReportsContent() {
  try {
    const [users, revenue] = await Promise.all([
      getUsers(),
      getRevenueRecords()
    ])

    const totalRevenue = revenue.reduce((sum, record) => {
      return record.metadata.status === 'paid' ? sum + record.metadata.amount : sum
    }, 0)

    const conversions = users.filter(user => user.metadata.subscription_plan === 'pro').length
    const conversionRate = users.length > 0 ? (conversions / users.length) * 100 : 0

    const reportData = {
      users: users.length,
      revenue: totalRevenue,
      conversions: conversions,
      period: new Date().toISOString().split('T')[0]
    }

    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const monthlyUsers = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date)
      return signupDate >= thisMonth
    }).length

    const monthlyRevenue = revenue.filter(record => {
      const paymentDate = new Date(record.metadata.payment_date)
      return paymentDate >= thisMonth && record.metadata.status === 'paid'
    }).reduce((sum, record) => sum + record.metadata.amount, 0)

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate detailed reports and export your platform data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(users.length)}
            change={`+${monthlyUsers} this month`}
            trend={monthlyUsers > 0 ? 'up' : 'neutral'}
            icon={<FileText size={24} />}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change={formatCurrency(monthlyRevenue)}
            trend={monthlyRevenue > 0 ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(1)}%`}
            change={`${conversions} conversions`}
            trend={conversionRate > 0 ? 'up' : 'neutral'}
            icon={<Calendar size={24} />}
          />
          <MetricCard
            title="Reports Generated"
            value="24"
            change="this month"
            trend="up"
            icon={<Download size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ReportFilters />
          </div>
          <div className="lg:col-span-2">
            <ReportExport reportData={reportData} />
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
      
      <div className="h-96 bg-accent rounded animate-pulse" />
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