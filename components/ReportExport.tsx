import { Download, FileText, Table } from 'lucide-react'

interface ReportData {
  users: number
  revenue: number
  conversions: number
  period: string
}

interface ReportExportProps {
  reportData: ReportData
}

export default function ReportExport({ reportData }: ReportExportProps) {
  const handleExportCSV = () => {
    const csvContent = `Report Period,${reportData.period}
Total Users,${reportData.users}
Total Revenue,$${reportData.revenue}
Conversions,${reportData.conversions}
`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${reportData.period}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    // PDF export functionality would go here
    console.log('PDF export not implemented yet')
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText size={20} />
        Export Reports
      </h3>
      
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Export your analytics data for external analysis or reporting.
        </div>
        
        <div className="grid gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Table size={16} />
            Export as CSV
            <Download size={16} />
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <FileText size={16} />
            Export as PDF
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}