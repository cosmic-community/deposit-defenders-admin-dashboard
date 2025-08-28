'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function UserFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    dateRange: '30days'
  })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'canceled', label: 'Canceled' }
  ]

  const planOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' }
  ]

  const dateOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-background border border-input rounded-lg text-foreground hover:bg-accent transition-colors"
      >
        <span>Filters</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subscription Plan
              </label>
              <select
                value={filters.plan}
                onChange={(e) => setFilters({...filters, plan: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {planOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply/Clear Buttons */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
              <button 
                onClick={() => {
                  setFilters({ status: 'all', plan: 'all', dateRange: '30days' })
                  setIsOpen(false)
                }}
                className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/80 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}