'use client'

import { useState } from 'react'
import { Save, AlertTriangle } from 'lucide-react'
import { DashboardMetrics } from '@/types'

export interface AdminSettingsProps {
  userMetrics: DashboardMetrics
}

export default function AdminSettings({ userMetrics }: AdminSettingsProps) {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newUserRegistration: true,
    emailNotifications: true,
    analyticsTracking: true,
    dataRetentionDays: 365,
    maxUsersPerPlan: {
      free: 1000,
      pro: 10000
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleNestedInputChange = (parentKey: string, childKey: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey as keyof typeof prev],
        [childKey]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">System Status</h4>
          <p className="text-sm text-muted-foreground">
            {userMetrics.totalUsers} total users • {userMetrics.activeUsers} active users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-foreground">Operational</span>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Maintenance Mode</label>
          <p className="text-xs text-muted-foreground">Temporarily disable access to the platform</p>
        </div>
        <button
          onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.maintenanceMode ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.maintenanceMode && (
        <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-orange-700">
            Maintenance mode is enabled. Users cannot access the platform.
          </span>
        </div>
      )}

      {/* User Registration */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">New User Registration</label>
          <p className="text-xs text-muted-foreground">Allow new users to sign up</p>
        </div>
        <button
          onClick={() => handleInputChange('newUserRegistration', !settings.newUserRegistration)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.newUserRegistration ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.newUserRegistration ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Email Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Email Notifications</label>
          <p className="text-xs text-muted-foreground">Send system emails to users</p>
        </div>
        <button
          onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.emailNotifications ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Data Retention */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Data Retention (days)
        </label>
        <input
          type="number"
          value={settings.dataRetentionDays}
          onChange={(e) => handleInputChange('dataRetentionDays', parseInt(e.target.value))}
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          min="30"
          max="3650"
        />
        <p className="text-xs text-muted-foreground mt-1">
          How long to keep user data and analytics
        </p>
      </div>

      {/* User Limits */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          User Limits per Plan
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Free Plan</label>
            <input
              type="number"
              value={settings.maxUsersPerPlan.free}
              onChange={(e) => handleNestedInputChange('maxUsersPerPlan', 'free', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Pro Plan</label>
            <input
              type="number"
              value={settings.maxUsersPerPlan.pro}
              onChange={(e) => handleNestedInputChange('maxUsersPerPlan', 'pro', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}