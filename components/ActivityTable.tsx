import { UserSession } from '@/types'
import { format } from 'date-fns'

export interface ActivityTableProps {
  sessions: UserSession[]
}

export default function ActivityTable({ sessions }: ActivityTableProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <p className="text-muted-foreground">No activity data available.</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Latest user sessions and login activity
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">User ID</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Login Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Device</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {sessions.slice(0, 10).map((session) => (
              <tr key={session.id} className="border-b border-border hover:bg-accent/20">
                <td className="p-4 text-sm text-foreground font-mono">
                  {session.metadata.user_id.slice(0, 8)}...
                </td>
                <td className="p-4 text-sm text-foreground">
                  {format(new Date(session.metadata.login_date), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="p-4 text-sm text-foreground capitalize">
                  {session.metadata.device_type}
                </td>
                <td className="p-4 text-sm text-foreground">
                  {session.metadata.session_duration 
                    ? `${Math.round(session.metadata.session_duration / 60)}m`
                    : 'Active'
                  }
                </td>
                <td className="p-4 text-sm text-muted-foreground font-mono">
                  {session.metadata.ip_address || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}