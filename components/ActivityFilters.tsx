'use client'

import { useState } from 'react'
import { Filter, Calendar, User, Activity } from 'lucide-react'

export default function ActivityFilters() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h')
  const [selectedUser, setSelectedUser] = useState<string>('all')

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'login', label: 'Logins' },
    { value: 'registration', label: 'Registrations' },
    { value: 'subscription', label: 'Subscriptions' },
    { value: 'payment', label: 'Payments' }
  ]

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filters:</span>
      </div>
      
      {/* Activity Type Filter */}
      <div className="flex items-center gap-2">
        <Activity size={14} className="text-muted-foreground" />
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-sm bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {activityTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-muted-foreground" />
        <select 
          value={selectedTimeRange} 
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="text-sm bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* User Filter */}
      <div className="flex items-center gap-2">
        <User size={14} className="text-muted-foreground" />
        <select 
          value={selectedUser} 
          onChange={(e) => setSelectedUser(e.target.value)}
          className="text-sm bg-background border border-border rounded px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="pro">Pro Users</option>
          <option value="new">New Users</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button 
        onClick={() => {
          setSelectedType('all')
          setSelectedTimeRange('24h')
          setSelectedUser('all')
        }}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
      >
        Clear Filters
      </button>
    </div>
  )
}