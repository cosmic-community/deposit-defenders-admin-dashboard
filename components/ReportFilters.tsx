'use client'

import { useState } from 'react'
import { Filter, Calendar, Users, DollarSign } from 'lucide-react'

export default function ReportFilters() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  const [selectedMetrics, setSelectedMetrics] = useState(['users', 'revenue', 'activity'])
  const [isOpen, setIsOpen] = useState(false)

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const metrics = [
    { value: 'users', label: 'User Analytics', icon: Users },
    { value: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
    { value: 'activity', label: 'Activity Analytics', icon: Calendar }
  ]

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
      >
        <Filter size={16} />
        <span className="text-sm font-medium">Filters</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-4">
            {/* Period Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Time Period
              </label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Metrics Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Report Sections
              </label>
              <div className="space-y-2">
                {metrics.map(metric => {
                  const Icon = metric.icon
                  const isSelected = selectedMetrics.includes(metric.value)
                  
                  return (
                    <label 
                      key={metric.value}
                      className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded-lg p-2"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMetricToggle(metric.value)}
                        className="rounded border-border focus:ring-primary"
                      />
                      <Icon size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{metric.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Custom Date Range (if custom is selected) */}
            {selectedPeriod === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => {
                  setSelectedPeriod('30days')
                  setSelectedMetrics(['users', 'revenue', 'activity'])
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Apply filters logic would go here
                    setIsOpen(false)
                  }}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
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