'use client'

import { useState } from 'react'
import { Server, Database, Globe, Zap, HardDrive, Cpu, MemoryStick, Activity } from 'lucide-react'

export default function SystemSettings() {
  const [systemInfo] = useState({
    version: '1.2.3',
    uptime: '15 days, 4 hours',
    serverLoad: '23%',
    memoryUsage: '67%',
    diskUsage: '45%',
    activeConnections: 142,
    responseTime: '245ms',
    errorRate: '0.02%'
  })

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    compressionEnabled: true,
    httpsRedirect: true,
    corsEnabled: true,
    rateLimitEnabled: true,
    backupEnabled: true
  })

  const [performanceSettings, setPerformanceSettings] = useState({
    cacheTimeout: 3600,
    maxConnections: 1000,
    requestTimeout: 30,
    uploadLimit: 50
  })

  const [backupSettings, setBackupSettings] = useState({
    frequency: 'daily',
    retention: 30,
    compression: true,
    encryption: true
  })

  const toggleSystemSetting = (key: keyof typeof systemSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const updatePerformanceSetting = (key: keyof typeof performanceSettings, value: number) => {
    setPerformanceSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-8">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Cpu size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Server Load</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">{systemInfo.serverLoad}</p>
          <p className="text-sm text-muted-foreground">CPU usage</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <MemoryStick size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Memory</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">{systemInfo.memoryUsage}</p>
          <p className="text-sm text-muted-foreground">RAM usage</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Storage</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">{systemInfo.diskUsage}</p>
          <p className="text-sm text-muted-foreground">Disk usage</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={20} className="text-green-500" />
            <h4 className="font-medium text-foreground">Uptime</h4>
          </div>
          <p className="text-lg font-bold text-foreground">{systemInfo.uptime}</p>
          <p className="text-sm text-muted-foreground">System uptime</p>
        </div>
      </div>

      {/* System Information */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Server size={20} />
          System Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Application Version</span>
              <span className="font-medium text-foreground">{systemInfo.version}</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Active Connections</span>
              <span className="font-medium text-foreground">{systemInfo.activeConnections}</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Average Response Time</span>
              <span className="font-medium text-foreground">{systemInfo.responseTime}</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Error Rate</span>
              <span className="font-medium text-foreground">{systemInfo.errorRate}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Node.js Version</span>
              <span className="font-medium text-foreground">18.17.0</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Database Status</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Cache Status</span>
              <span className="font-medium text-green-600">Operational</span>
            </div>
            <div className="flex justify-between p-3 bg-accent rounded">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="font-medium text-foreground">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe size={20} />
          System Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(systemSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div>
                <p className="font-medium text-foreground">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-muted-foreground">
                  {key === 'maintenanceMode' && 'Enable maintenance mode for updates'}
                  {key === 'debugMode' && 'Enable debug logging for development'}
                  {key === 'cacheEnabled' && 'Enable response caching for performance'}
                  {key === 'compressionEnabled' && 'Enable gzip compression'}
                  {key === 'httpsRedirect' && 'Redirect HTTP traffic to HTTPS'}
                  {key === 'corsEnabled' && 'Enable Cross-Origin Resource Sharing'}
                  {key === 'rateLimitEnabled' && 'Enable API rate limiting'}
                  {key === 'backupEnabled' && 'Enable automatic data backups'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleSystemSetting(key as keyof typeof systemSettings)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Settings */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap size={20} />
          Performance Settings
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cache Timeout: {performanceSettings.cacheTimeout} seconds
              </label>
              <input
                type="range"
                min="300"
                max="7200"
                step="300"
                value={performanceSettings.cacheTimeout}
                onChange={(e) => updatePerformanceSetting('cacheTimeout', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 min</span>
                <span>2 hours</span>
              </div>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Request Timeout: {performanceSettings.requestTimeout} seconds
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={performanceSettings.requestTimeout}
                onChange={(e) => updatePerformanceSetting('requestTimeout', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10s</span>
                <span>5 min</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Connections: {performanceSettings.maxConnections}
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={performanceSettings.maxConnections}
                onChange={(e) => updatePerformanceSetting('maxConnections', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100</span>
                <span>5000</span>
              </div>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Limit: {performanceSettings.uploadLimit} MB
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={performanceSettings.uploadLimit}
                onChange={(e) => updatePerformanceSetting('uploadLimit', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10 MB</span>
                <span>500 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Configuration */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database size={20} />
          Backup Configuration
        </h4>
        
        <div className="bg-accent p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Backup Frequency</label>
                <select
                  value={backupSettings.frequency}
                  onChange={(e) => setBackupSettings({...backupSettings, frequency: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Retention Period: {backupSettings.retention} days
                </label>
                <input
                  type="range"
                  min="7"
                  max="365"
                  step="7"
                  value={backupSettings.retention}
                  onChange={(e) => setBackupSettings({...backupSettings, retention: parseInt(e.target.value)})}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 week</span>
                  <span>1 year</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Enable Compression</p>
                  <p className="text-sm text-muted-foreground">Compress backups to save storage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.compression}
                    onChange={(e) => setBackupSettings({...backupSettings, compression: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Enable Encryption</p>
                  <p className="text-sm text-muted-foreground">Encrypt backups for security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.encryption}
                    onChange={(e) => setBackupSettings({...backupSettings, encryption: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">Manual Backup</h5>
                <p className="text-sm text-muted-foreground">Create a backup now</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Database size={16} />
                Create Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}