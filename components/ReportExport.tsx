'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, FileImage, Mail } from 'lucide-react'

interface ReportExportProps {
  reportData: {
    generatedAt: string
    period: string
    summary: {
      totalUsers: number
      activeUsers: number
      totalRevenue: number
      totalSessions: number
      conversionRate: number
    }
    userGrowth: Array<{
      date: string
      signups: number
      totalUsers: number
    }>
    revenueData: Array<{
      date: string
      revenue: number
      mrr: number
    }>
    activityData: Array<{
      date: string
      logins: number
      registrations: number
      totalActivities: number
    }>
    deviceStats: {
      desktop: number
      mobile: number
      tablet: number
    }
    paymentAnalytics: {
      successful: number
      failed: number
      refunded: number
    }
  }
}

export default function ReportExport({ reportData }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const exportFormats = [
    {
      id: 'pdf',
      label: 'PDF Report',
      description: 'Complete report with charts and analysis',
      icon: FileText,
      action: exportToPDF
    },
    {
      id: 'excel',
      label: 'Excel Spreadsheet',
      description: 'Raw data for further analysis',
      icon: FileSpreadsheet,
      action: exportToExcel
    },
    {
      id: 'csv',
      label: 'CSV Data',
      description: 'Comma-separated values for data import',
      icon: FileText,
      action: exportToCSV
    },
    {
      id: 'email',
      label: 'Email Report',
      description: 'Send report summary via email',
      icon: Mail,
      action: emailReport
    }
  ]

  async function exportToPDF() {
    setIsExporting(true)
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a simple text-based PDF content
      const pdfContent = `
DEPOSIT DEFENDERS - ANALYTICS REPORT
Generated: ${new Date(reportData.generatedAt).toLocaleString()}
Period: ${reportData.period}

EXECUTIVE SUMMARY
================
Total Users: ${reportData.summary.totalUsers.toLocaleString()}
Active Users: ${reportData.summary.activeUsers.toLocaleString()}
Total Revenue: $${reportData.summary.totalRevenue.toLocaleString()}
Total Sessions: ${reportData.summary.totalSessions.toLocaleString()}
Conversion Rate: ${reportData.summary.conversionRate.toFixed(1)}%

USER GROWTH DATA
================
${reportData.userGrowth.slice(-7).map(day => 
  `${day.date}: ${day.signups} signups, ${day.totalUsers} total users`
).join('\n')}

REVENUE DATA
============
${reportData.revenueData.slice(-7).map(day => 
  `${day.date}: $${day.revenue.toLocaleString()} revenue, $${day.mrr.toLocaleString()} MRR`
).join('\n')}

DEVICE ANALYTICS
================
Desktop: ${reportData.deviceStats.desktop} sessions
Mobile: ${reportData.deviceStats.mobile} sessions  
Tablet: ${reportData.deviceStats.tablet} sessions

PAYMENT ANALYTICS
=================
Successful: ${reportData.paymentAnalytics.successful}
Failed: ${reportData.paymentAnalytics.failed}
Refunded: ${reportData.paymentAnalytics.refunded}
      `
      
      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `deposit-defenders-report-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  async function exportToExcel() {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create CSV-style content that can be opened in Excel
      const csvContent = [
        // Summary sheet data
        'SUMMARY DATA',
        'Metric,Value',
        `Total Users,${reportData.summary.totalUsers}`,
        `Active Users,${reportData.summary.activeUsers}`,
        `Total Revenue,${reportData.summary.totalRevenue}`,
        `Total Sessions,${reportData.summary.totalSessions}`,
        `Conversion Rate,${reportData.summary.conversionRate.toFixed(1)}%`,
        '',
        'USER GROWTH DATA',
        'Date,Signups,Total Users',
        ...reportData.userGrowth.map(day => `${day.date},${day.signups},${day.totalUsers}`),
        '',
        'REVENUE DATA', 
        'Date,Revenue,MRR',
        ...reportData.revenueData.map(day => `${day.date},${day.revenue},${day.mrr}`),
        '',
        'ACTIVITY DATA',
        'Date,Logins,Registrations,Total Activities',
        ...reportData.activityData.map(day => `${day.date},${day.logins},${day.registrations},${day.totalActivities}`)
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `deposit-defenders-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting Excel:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  async function exportToCSV() {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const csvContent = [
        'Date,Signups,Total Users,Revenue,MRR,Logins,Registrations',
        ...reportData.userGrowth.map((day, index) => {
          const revenueDay = reportData.revenueData[index] || { revenue: 0, mrr: 0 }
          const activityDay = reportData.activityData[index] || { logins: 0, registrations: 0 }
          return `${day.date},${day.signups},${day.totalUsers},${revenueDay.revenue},${revenueDay.mrr},${activityDay.logins},${activityDay.registrations}`
        })
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `deposit-defenders-analytics-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  async function emailReport() {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const subject = `Deposit Defenders Analytics Report - ${new Date().toLocaleDateString()}`
      const body = `
Analytics Report Summary:

📊 Total Users: ${reportData.summary.totalUsers.toLocaleString()}
✅ Active Users: ${reportData.summary.activeUsers.toLocaleString()}  
💰 Total Revenue: $${reportData.summary.totalRevenue.toLocaleString()}
🔄 Total Sessions: ${reportData.summary.totalSessions.toLocaleString()}
📈 Conversion Rate: ${reportData.summary.conversionRate.toFixed(1)}%

Generated on: ${new Date(reportData.generatedAt).toLocaleString()}
Period: ${reportData.period}

This automated report was generated from your Deposit Defenders admin dashboard.
      `
      
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.location.href = mailtoLink
      
    } catch (error) {
      console.error('Error preparing email:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download size={16} />
        <span className="text-sm font-medium">
          {isExporting ? 'Exporting...' : 'Export Report'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Export Report
            </h3>
            
            <div className="space-y-3">
              {exportFormats.map(format => {
                const Icon = format.icon
                
                return (
                  <button
                    key={format.id}
                    onClick={format.action}
                    disabled={isExporting}
                    className="w-full flex items-start gap-3 p-3 text-left hover:bg-accent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon size={20} className="text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {format.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="border-t border-border mt-4 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}