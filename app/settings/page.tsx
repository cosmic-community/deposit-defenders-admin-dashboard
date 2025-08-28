import { Suspense } from 'react'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Mail,
  Key,
  Globe,
  Server,
  Save,
  RefreshCw
} from 'lucide-react'
import SettingsCard from '@/components/SettingsCard'
import AdminSettings from '@/components/AdminSettings'
import NotificationSettings from '@/components/NotificationSettings'
import SystemSettings from '@/components/SystemSettings'
import SecuritySettings from '@/components/SecuritySettings'
import { getUsers } from '@/lib/cosmic'
import { calculateUserMetrics } from '@/lib/analytics'

async function SettingsContent() {
  try {
    const users = await getUsers()
    const userMetrics = calculateUserMetrics(users)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings size={32} />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Deposit Defenders admin dashboard configuration and preferences
          </p>
        </div>

        {/* Settings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SettingsCard
            title="Admin Users"
            value={userMetrics.totalUsers.toString()}
            description="Total admin accounts"
            icon={<User size={24} />}
            href="#admin-settings"
          />
          <SettingsCard
            title="Notifications"
            value="12 active"
            description="Alert configurations"
            icon={<Bell size={24} />}
            href="#notification-settings"
          />
          <SettingsCard
            title="Security"
            value="High"
            description="Security level status"
            icon={<Shield size={24} />}
            href="#security-settings"
          />
          <SettingsCard
            title="System Health"
            value="Excellent"
            description="Overall system status"
            icon={<Server size={24} />}
            href="#system-settings"
          />
        </div>

        {/* Main Settings Sections */}
        <div className="space-y-8">
          {/* Admin Settings */}
          <div id="admin-settings" className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  Admin Configuration
                </h3>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                <Save size={16} />
                Save Changes
              </button>
            </div>
            <div className="p-6">
              <AdminSettings userMetrics={userMetrics} />
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notification-settings" className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  Notification Preferences
                </h3>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                <Save size={16} />
                Save Preferences
              </button>
            </div>
            <div className="p-6">
              <NotificationSettings />
            </div>
          </div>

          {/* Security Settings */}
          <div id="security-settings" className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  Security & Authentication
                </h3>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm">
                <RefreshCw size={16} />
                Reset Security
              </button>
            </div>
            <div className="p-6">
              <SecuritySettings />
            </div>
          </div>

          {/* System Settings */}
          <div id="system-settings" className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  System Configuration
                </h3>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm">
                <RefreshCw size={16} />
                Check System
              </button>
            </div>
            <div className="p-6">
              <SystemSettings />
            </div>
          </div>

          {/* Integration Settings */}
          <div className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  Integrations & API
                </h3>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                <Key size={16} />
                Manage API Keys
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Cosmic CMS</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Bucket Connection</p>
                        <p className="text-xs text-muted-foreground">Connected to production bucket</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Read Key</p>
                        <p className="text-xs text-muted-foreground">••••••••••••••••</p>
                      </div>
                      <button className="text-xs text-primary hover:underline">Update</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Write Key</p>
                        <p className="text-xs text-muted-foreground">••••••••••••••••</p>
                      </div>
                      <button className="text-xs text-primary hover:underline">Update</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Third-party Services</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Email Service</p>
                        <p className="text-xs text-muted-foreground">Configured for notifications</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Analytics</p>
                        <p className="text-xs text-muted-foreground">Tracking dashboard usage</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-yellow-600">Pending</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Monitoring</p>
                        <p className="text-xs text-muted-foreground">System health checks</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save All Settings */}
        <div className="flex justify-end pt-6 border-t border-border">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              <RefreshCw size={18} />
              Reset All Settings
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Save size={18} />
              Save All Changes
            </button>
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
            Settings Page Error
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
        <div className="h-8 bg-accent rounded animate-pulse w-48 mb-2" />
        <div className="h-4 bg-accent rounded animate-pulse w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-24" />
          </div>
        ))}
      </div>
      
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border">
              <div className="h-6 bg-accent rounded animate-pulse w-48" />
            </div>
            <div className="p-6">
              <div className="h-32 bg-accent rounded animate-pulse" />
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