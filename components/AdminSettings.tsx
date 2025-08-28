import { useState } from 'react'
import { Save, AlertTriangle } from 'lucide-react'

interface UserMetrics {
  totalUsers: number
  activeUsers: number
  freeUsers: number
  proUsers: number
}

interface AdminSettingsProps {
  userMetrics: UserMetrics
}

export default function AdminSettings({ userMetrics }: AdminSettingsProps) {
  const [settings, setSettings] = useState({
    maxUsers: 10000,
    enableRegistration: true,
    maintenanceMode: false,
    backupFrequency: 'daily'
  })

  const handleSave = () => {
    // Save settings logic would go here
    console.log('Saving admin settings:', settings)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-bold">{userMetrics.totalUsers}</div>
        </div>
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Active Users</div>
          <div className="text-2xl font-bold">{userMetrics.activeUsers}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Maximum Users
          </label>
          <input
            type="number"
            value={settings.maxUsers}
            onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableRegistration}
              onChange={(e) => setSettings(prev => ({ ...prev, enableRegistration: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm font-medium">Enable User Registration</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm font-medium">Maintenance Mode</span>
          </label>
          {settings.maintenanceMode && (
            <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
              <AlertTriangle size={16} />
              <span>This will prevent new users from accessing the platform</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Backup Frequency
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Save size={16} />
        Save Settings
      </button>
    </div>
  )
}