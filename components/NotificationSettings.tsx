'use client'

import { useState } from 'react'
import { Bell, Mail, Smartphone, Globe, Volume2, AlertTriangle } from 'lucide-react'

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    soundNotifications: true,
    desktopNotifications: true
  })

  const [alertSettings, setAlertSettings] = useState({
    newUserSignup: true,
    newSubscription: true,
    paymentFailed: true,
    systemErrors: true,
    securityAlerts: true,
    maintenanceMode: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true
  })

  const [emailSettings, setEmailSettings] = useState({
    fromEmail: 'admin@depositdefenders.com',
    replyToEmail: 'noreply@depositdefenders.com',
    emailTemplate: 'default',
    frequency: 'immediate'
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleAlert = (key: keyof typeof alertSettings) => {
    setAlertSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Notification Channels */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notification Channels
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => toggleNotification('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Mobile push alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={() => toggleNotification('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Browser Notifications</p>
                  <p className="text-sm text-muted-foreground">Web browser alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.browserNotifications}
                  onChange={() => toggleNotification('browserNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Sound Notifications</p>
                  <p className="text-sm text-muted-foreground">Audio alerts for events</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.soundNotifications}
                  onChange={() => toggleNotification('soundNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Desktop Notifications</p>
                  <p className="text-sm text-muted-foreground">System tray alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.desktopNotifications}
                  onChange={() => toggleNotification('desktopNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Categories */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle size={20} />
          Alert Categories
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(alertSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <p className="font-medium text-foreground text-sm">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleAlert(key as keyof typeof alertSettings)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Email Configuration */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Mail size={20} />
          Email Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">From Email</label>
              <input
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reply-To Email</label>
              <input
                type="email"
                value={emailSettings.replyToEmail}
                onChange={(e) => setEmailSettings({...emailSettings, replyToEmail: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Template</label>
              <select
                value={emailSettings.emailTemplate}
                onChange={(e) => setEmailSettings({...emailSettings, emailTemplate: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
              >
                <option value="default">Default Template</option>
                <option value="minimal">Minimal Template</option>
                <option value="branded">Branded Template</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notification Frequency</label>
              <select
                value={emailSettings.frequency}
                onChange={(e) => setEmailSettings({...emailSettings, frequency: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}