'use client'

import { useState } from 'react'
import { Download, FileText, Table, PieChart } from 'lucide-react'
import { User, UserSession, RevenueRecord } from '@/types'

export interface ReportExportProps {
  data: {
    users: User[]
    sessions: UserSession[]
    revenue: RevenueRecord[]
  }
}

export default function ReportExport({ data }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'json'>('csv')

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true)
    setExportFormat(format)

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would:
      // 1. Process the data based on format
      // 2. Generate the file
      // 3. Trigger download

      console.log(`Exporting ${format.toUpperCase()} with data:`, {
        users: data.users.length,
        sessions: data.sessions.length,
        revenue: data.revenue.length
      })

      // Mock download trigger
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `deposit-defenders-report.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportOptions = [
    {
      format: 'csv' as const,
      icon: <Table size={20} />,
      title: 'CSV Export',
      description: 'Export data as comma-separated values for spreadsheet analysis'
    },
    {
      format: 'pdf' as const,
      icon: <FileText size={20} />,
      title: 'PDF Report',
      description: 'Generate a formatted PDF report with charts and summaries'
    },
    {
      format: 'json' as const,
      icon: <PieChart size={20} />,
      title: 'JSON Data',
      description: 'Export raw data in JSON format for API integration'
    }
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Download size={24} className="text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Export Reports</h3>
          <p className="text-sm text-muted-foreground">
            Download your analytics data in various formats
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {exportOptions.map((option) => (
          <div
            key={option.format}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground">
                {option.icon}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{option.title}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isExporting && exportFormat === option.format
                  ? 'bg-primary/20 text-primary cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isExporting && exportFormat === option.format ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </div>
              ) : (
                'Export'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Data Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Users:</span>
            <span className="ml-2 font-medium text-foreground">{data.users.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sessions:</span>
            <span className="ml-2 font-medium text-foreground">{data.sessions.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Revenue Records:</span>
            <span className="ml-2 font-medium text-foreground">{data.revenue.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}