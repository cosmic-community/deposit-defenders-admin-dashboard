'use client'

import { useState } from 'react'

interface AdminSettingsProps {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    freeUsers: number;
    proUsers: number;
  }
}

export default function AdminSettings({ userMetrics }: AdminSettingsProps) {
  const [settings, setSettings] = useState({
    maxUsers: 10000,
    allowRegistration: true,
    requireEmailVerification: true,
    enableProUpgrades: true,
    maxPropertiesPerUser: 100,
    enableApiAccess: true
  })

  const handleSettingChange = (key: keyof typeof settings, value: boolean | number) => {
    // Fix: Use proper type-safe object update
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* User Limits */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">User Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Maximum Users
              </label>
              <p className="text-xs text-muted-foreground">
                Current: {userMetrics.totalUsers} users
              </p>
            </div>
            <input
              type="number"
              value={settings.maxUsers}
              onChange={(e) => handleSettingChange('maxUsers', parseInt(e.target.value))}
              className="w-24 px-3 py-1 text-sm border border-input bg-background rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Allow New Registrations
              </label>
              <p className="text-xs text-muted-foreground">
                Enable user signup
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
              className="rounded border-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Email Verification Required
              </label>
              <p className="text-xs text-muted-foreground">
                Require email confirmation
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
              className="rounded border-input"
            />
          </div>
        </div>
      </div>

      {/* Subscription Settings */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Subscription Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Enable Pro Upgrades
              </label>
              <p className="text-xs text-muted-foreground">
                Current: {userMetrics.proUsers} Pro users
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableProUpgrades}
              onChange={(e) => handleSettingChange('enableProUpgrades', e.target.checked)}
              className="rounded border-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Max Properties per User
              </label>
              <p className="text-xs text-muted-foreground">
                Limit for free users
              </p>
            </div>
            <input
              type="number"
              value={settings.maxPropertiesPerUser}
              onChange={(e) => handleSettingChange('maxPropertiesPerUser', parseInt(e.target.value))}
              className="w-24 px-3 py-1 text-sm border border-input bg-background rounded"
            />
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">API Configuration</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Enable API Access
              </label>
              <p className="text-xs text-muted-foreground">
                Allow external API calls
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableApiAccess}
              onChange={(e) => handleSettingChange('enableApiAccess', e.target.checked)}
              className="rounded border-input"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-border">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  )
}