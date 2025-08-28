'use client'

import { useState } from 'react'
import { Download, FileText, Calendar } from 'lucide-react'
import { User, UserSession, RevenueRecord } from '@/types'

export interface ReportExportProps {
  reportData: {
    users: User[]
    sessions: UserSession[]
    revenue: RevenueRecord[]
  }
}

type ExportFormat = 'csv' | 'json' | 'pdf'
type ReportType = 'users' | 'revenue' | 'activity' | 'summary'

export default function ReportExport({ reportData }: ReportExportProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')
  const [reportType, setReportType] = useState<ReportType>('summary')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would generate and download the actual report
      const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${exportFormat}`
      
      // Create mock data based on report type
      let data: any
      switch (reportType) {
        case 'users':
          data = reportData.users.map(user => ({
            id: user.id,
            email: user.metadata.email,
            plan: user.metadata.subscription_plan,
            signup_date: user.metadata.signup_date,
            total_spent: user.metadata.total_spent,
            status: user.metadata.status
          }))
          break
        case 'revenue':
          data = reportData.revenue.map(record => ({
            id: record.id,
            user_id: record.metadata.user_id,
            amount: record.metadata.amount,
            plan: record.metadata.subscription_plan,
            payment_date: record.metadata.payment_date,
            status: record.metadata.status
          }))
          break
        case 'activity':
          data = reportData.sessions.map(session => ({
            id: session.id,
            user_id: session.metadata.user_id,
            login_date: session.metadata.login_date,
            device_type: session.metadata.device_type,
            session_duration: session.metadata.session_duration
          }))
          break
        default:
          data = {
            summary: {
              total_users: reportData.users.length,
              total_revenue: reportData.revenue.reduce((sum, r) => sum + (r.metadata.status === 'paid' ? r.metadata.amount : 0), 0),
              total_sessions: reportData.sessions.length,
              generated_at: new Date().toISOString()
            }
          }
      }

      // Convert to selected format
      let content: string
      let mimeType: string
      
      switch (exportFormat) {
        case 'csv':
          if (Array.isArray(data)) {
            const headers = Object.keys(data[0] || {})
            const csvRows = [
              headers.join(','),
              ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
            ]
            content = csvRows.join('\n')
          } else {
            content = JSON.stringify(data, null, 2)
          }
          mimeType = 'text/csv'
          break
        case 'json':
          content = JSON.stringify(data, null, 2)
          mimeType = 'application/json'
          break
        default:
          content = JSON.stringify(data, null, 2)
          mimeType = 'application/json'
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Export Reports</h3>
      </div>

      <div className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="summary">Summary Report</option>
            <option value="users">User Report</option>
            <option value="revenue">Revenue Report</option>
            <option value="activity">Activity Report</option>
          </select>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['csv', 'json', 'pdf'] as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  exportFormat === format
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
                disabled={format === 'pdf'} // PDF not implemented in this demo
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
          {exportFormat === 'pdf' && (
            <p className="text-xs text-muted-foreground mt-1">
              PDF export coming soon
            </p>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date Range
          </label>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || exportFormat === 'pdf'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : `Export ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
        </button>
      </div>

      <div className="mt-4 p-3 bg-accent/30 rounded-md">
        <p className="text-xs text-muted-foreground">
          <strong>Data Summary:</strong> {reportData.users.length} users, {reportData.sessions.length} sessions, {reportData.revenue.length} revenue records
        </p>
      </div>
    </div>
  )
}