'use client'

import { useState } from 'react'
import { Shield, Key, Lock, Eye, AlertTriangle, Clock, UserCheck } from 'lucide-react'

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    ipWhitelist: false,
    auditLogging: true,
    autoLockout: true
  })

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5
  })

  const [auditLogs] = useState([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      action: 'User Login',
      user: 'john@depositdefenders.com',
      ip: '192.168.1.1',
      status: 'Success'
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:25:00Z',
      action: 'Settings Changed',
      user: 'admin@depositdefenders.com',
      ip: '192.168.1.10',
      status: 'Success'
    },
    {
      id: '3',
      timestamp: '2024-01-15T09:45:00Z',
      action: 'Failed Login',
      user: 'unknown@example.com',
      ip: '203.0.113.1',
      status: 'Failed'
    },
    {
      id: '4',
      timestamp: '2024-01-15T09:30:00Z',
      action: 'Password Reset',
      user: 'jane@depositdefenders.com',
      ip: '192.168.1.5',
      status: 'Success'
    }
  ])

  const updateSecuritySetting = (key: keyof typeof securitySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-green-500" />
            <h4 className="font-medium text-foreground">Security Level</h4>
          </div>
          <p className="text-2xl font-bold text-green-500">High</p>
          <p className="text-sm text-muted-foreground">All security measures active</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-yellow-500" />
            <h4 className="font-medium text-foreground">Security Alerts</h4>
          </div>
          <p className="text-2xl font-bold text-yellow-500">2</p>
          <p className="text-sm text-muted-foreground">Require attention</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Last Security Scan</h4>
          </div>
          <p className="text-lg font-bold text-foreground">2 hours ago</p>
          <p className="text-sm text-muted-foreground">No issues found</p>
        </div>
      </div>

      {/* Authentication Settings */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <UserCheck size={20} />
          Authentication & Access
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => updateSecuritySetting('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <p className="font-medium text-foreground">Auto Lockout</p>
              <p className="text-sm text-muted-foreground">Lock accounts after failed attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.autoLockout}
                onChange={(e) => updateSecuritySetting('autoLockout', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <p className="font-medium text-foreground">IP Whitelist</p>
              <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.ipWhitelist}
                onChange={(e) => updateSecuritySetting('ipWhitelist', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <p className="font-medium text-foreground">Audit Logging</p>
              <p className="text-sm text-muted-foreground">Track all admin activities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.auditLogging}
                onChange={(e) => updateSecuritySetting('auditLogging', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Session & Password Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-background border border-input p-4 rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-accent border border-input rounded text-foreground"
              min="5"
              max="480"
            />
          </div>

          <div className="bg-background border border-input p-4 rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => updateSecuritySetting('maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-accent border border-input rounded text-foreground"
              min="1"
              max="10"
            />
          </div>

          <div className="bg-background border border-input p-4 rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">Password Expiry (days)</label>
            <input
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => updateSecuritySetting('passwordExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-accent border border-input rounded text-foreground"
              min="30"
              max="365"
            />
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock size={20} />
          Password Policy
        </h4>
        
        <div className="bg-accent p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Length: {passwordPolicy.minLength} characters
              </label>
              <input
                type="range"
                min="6"
                max="20"
                value={passwordPolicy.minLength}
                onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: parseInt(e.target.value)})}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Previous Passwords to Remember: {passwordPolicy.preventReuse}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={passwordPolicy.preventReuse}
                onChange={(e) => setPasswordPolicy({...passwordPolicy, preventReuse: parseInt(e.target.value)})}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'requireUppercase', label: 'Uppercase Letters' },
              { key: 'requireLowercase', label: 'Lowercase Letters' },
              { key: 'requireNumbers', label: 'Numbers' },
              { key: 'requireSpecialChars', label: 'Special Characters' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={passwordPolicy[key as keyof typeof passwordPolicy] as boolean}
                  onChange={(e) => setPasswordPolicy({
                    ...passwordPolicy,
                    [key]: e.target.checked
                  })}
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                />
                <label htmlFor={key} className="text-sm text-foreground">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Security Activity */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye size={20} />
          Recent Security Activity
        </h4>
        
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-accent">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === 'Success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}