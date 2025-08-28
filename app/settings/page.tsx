import { Suspense } from 'react'
import { Settings, Users, Shield, Bell, Database } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import SettingsCard from '@/components/SettingsCard'
import AdminSettings from '@/components/AdminSettings'
import SecuritySettings from '@/components/SecuritySettings'
import NotificationSettings from '@/components/NotificationSettings'
import SystemSettings from '@/components/SystemSettings'
import { getUsers, getUserSessions, getRevenueRecords } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  formatNumber
} from '@/lib/analytics'

async function SettingsContent() {
  try {
    const [users, sessions, revenue] = await Promise.all([
      getUsers(),
      getUserSessions(),
      getRevenueRecords()
    ])

    const userMetrics = calculateUserMetrics(users)

    // Calculate system stats
    const totalRecords = users.length + sessions.length + revenue.length
    const activeConnections = sessions.filter(session => {
      const loginDate = new Date(session.metadata.login_date || session.created_at)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return loginDate >= oneDayAgo
    }).length

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Settings & Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your dashboard settings, security, and system configuration
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change={`${userMetrics.activeUsers} active`}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="System Records"
            value={formatNumber(totalRecords)}
            change="total stored"
            icon={<Database size={24} />}
          />
          <MetricCard
            title="Active Sessions"
            value={formatNumber(activeConnections)}
            change="last 24h"
            icon={<Shield size={24} />}
          />
          <MetricCard
            title="Settings Status"
            value="Healthy"
            change="all systems operational"
            trend="up"
            icon={<Settings size={24} />}
          />
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingsCard
            title="Admin Configuration"
            description="Manage admin users, permissions, and access controls"
            icon={<Users size={24} />}
          >
            <AdminSettings />
          </SettingsCard>

          <SettingsCard
            title="Security Settings"
            description="Configure authentication, API keys, and security policies"
            icon={<Shield size={24} />}
          >
            <SecuritySettings />
          </SettingsCard>

          <SettingsCard
            title="Notifications"
            description="Set up alerts, email notifications, and reporting schedules"
            icon={<Bell size={24} />}
          >
            <NotificationSettings />
          </SettingsCard>

          <SettingsCard
            title="System Configuration"
            description="Database settings, performance tuning, and maintenance"
            icon={<Settings size={24} />}
          >
            <SystemSettings />
          </SettingsCard>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Settings page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Settings Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load settings data. Please check your configuration.
          </p>
        </div>
      </div>
    )
  }
}

function SettingsLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-border pb-6">
        <div className="h-8 bg-accent rounded animate-pulse w-80 mb-2" />
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  )
}