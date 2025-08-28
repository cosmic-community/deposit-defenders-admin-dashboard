import { Suspense } from 'react'
import { Settings, Shield, Bell, Database, Users, Cog } from 'lucide-react'
import SettingsCard from '@/components/SettingsCard'
import AdminSettings from '@/components/AdminSettings'
import SecuritySettings from '@/components/SecuritySettings'
import NotificationSettings from '@/components/NotificationSettings'
import SystemSettings from '@/components/SystemSettings'
import MetricCard from '@/components/MetricCard'
import { getUsers } from '@/lib/cosmic'
import { calculateUserMetrics, formatNumber } from '@/lib/analytics'

async function SettingsContent() {
  try {
    const users = await getUsers()
    const userMetrics = calculateUserMetrics(users)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Settings & Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your admin dashboard settings, security, and system configuration
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Admin Users"
            value="3"
            change="active accounts"
            icon={<Users size={24} />}
          />
          <MetricCard
            title="System Status"
            value="Online"
            change="all services"
            trend="up"
            icon={<Database size={24} />}
          />
          <MetricCard
            title="Security Level"
            value="High"
            change="2FA enabled"
            trend="up"
            icon={<Shield size={24} />}
          />
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change="platform users"
            icon={<Cog size={24} />}
          />
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SettingsCard
              title="Admin Settings"
              description="Manage admin accounts, roles, and permissions"
              icon={<Settings size={20} />}
            >
              <AdminSettings />
            </SettingsCard>

            <SettingsCard
              title="Security Settings"
              description="Configure security policies and access controls"
              icon={<Shield size={20} />}
            >
              <SecuritySettings />
            </SettingsCard>
          </div>

          <div className="space-y-6">
            <SettingsCard
              title="Notification Settings"
              description="Configure alerts, emails, and notifications"
              icon={<Bell size={20} />}
            >
              <NotificationSettings />
            </SettingsCard>

            <SettingsCard
              title="System Settings"
              description="Manage system configuration and maintenance"
              icon={<Database size={20} />}
            >
              <SystemSettings />
            </SettingsCard>
          </div>
        </div>

        {/* Configuration Overview */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Configuration Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Database</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cosmic CMS</span>
                  <span className="text-green-500">Connected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Read Key</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Write Key</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bucket Slug</span>
                  <span className="text-green-500">Configured</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Security</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HTTPS</span>
                  <span className="text-green-500">Enabled</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CORS</span>
                  <span className="text-green-500">Configured</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate Limiting</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Auth Tokens</span>
                  <span className="text-green-500">Valid</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="text-green-500">125ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="text-green-500">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cache Hit Rate</span>
                  <span className="text-green-500">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className="text-green-500">0.1%</span>
                </div>
              </div>
            </div>
          </div>
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
            Unable to load settings page. Please check your configuration.
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="chart-container">
            <div className="h-6 bg-accent rounded animate-pulse mb-4 w-48" />
            <div className="h-32 bg-accent rounded animate-pulse" />
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