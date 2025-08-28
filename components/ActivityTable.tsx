'use client'

import { Activity, LogIn, Users, CreditCard, Clock } from 'lucide-react'

interface ActivityRecord {
  id: string
  type: 'login' | 'registration' | 'subscription' | 'payment'
  user_email: string
  timestamp: string
  details: string
  ip_address?: string | null
}

interface ActivityTableProps {
  activities: ActivityRecord[]
}

export default function ActivityTable({ activities }: ActivityTableProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LogIn size={16} className="text-blue-500" />
      case 'registration':
        return <Users size={16} className="text-green-500" />
      case 'subscription':
        return <CreditCard size={16} className="text-purple-500" />
      case 'payment':
        return <CreditCard size={16} className="text-orange-500" />
      default:
        return <Activity size={16} className="text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-blue-100 text-blue-800'
      case 'registration':
        return 'bg-green-100 text-green-800'
      case 'subscription':
        return 'bg-purple-100 text-purple-800'
      case 'payment':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (activities.length === 0) {
    return (
      <div className="p-8 text-center">
        <Activity size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Activities</h3>
        <p className="text-muted-foreground">
          No recent activities to display. Activities will appear here as users interact with the platform.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-accent/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Activity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              IP Address
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-accent/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-foreground">
                  {activity.user_email}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-muted-foreground max-w-xs">
                  {activity.details}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} />
                  {formatTimestamp(activity.timestamp)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-muted-foreground font-mono">
                  {activity.ip_address || 'N/A'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}