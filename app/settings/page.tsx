import { Suspense } from 'react'
import { Settings, Shield, Bell, Database } from 'lucide-react'
import SettingsCard from '@/components/SettingsCard'
import AdminSettings from '@/components/AdminSettings'
import SecuritySettings from '@/components/SecuritySettings'
import NotificationSettings from '@/components/NotificationSettings'
import SystemSettings from '@/components/SystemSettings'
import { getUsers } from '@/lib/cosmic'

async function SettingsContent() {
  try {
    const users = await getUsers()
    
    const userMetrics = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.metadata.status === 'active').length,
      freeUsers: users.filter(user => user.metadata.subscription_plan === 'free').length,
      proUsers: users.filter(user => user.metadata.subscription_plan === 'pro').length
    }

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your platform configuration and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingsCard
            title="Admin Settings"
            description="Manage user limits, registration settings, and platform configuration"
            icon={<Settings size={20} />}
          >
            <AdminSettings userMetrics={userMetrics} />
          </SettingsCard>

          <SettingsCard
            title="Security Settings"
            description="Configure authentication, API keys, and security policies"
            icon={<Shield size={20} />}
          >
            <SecuritySettings />
          </SettingsCard>

          <SettingsCard
            title="Notifications"
            description="Set up email alerts, webhooks, and notification preferences"
            icon={<Bell size={20} />}
          >
            <NotificationSettings />
          </SettingsCard>

          <SettingsCard
            title="System Settings"
            description="Database configuration, backups, and system maintenance"
            icon={<Database size={20} />}
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
            Unable to load settings. Please check your configuration.
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <div className="h-6 bg-accent rounded animate-pulse mb-2 w-48" />
            <div className="h-4 bg-accent rounded animate-pulse mb-4 w-64" />
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  )
}