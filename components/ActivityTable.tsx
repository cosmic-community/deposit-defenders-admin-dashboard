import { UserSession } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface ActivityTableProps {
  sessions: UserSession[]
}

export default function ActivityTable({ sessions }: ActivityTableProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-muted-foreground">
          No recent activity found
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Device</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-border hover:bg-accent/50">
                <td className="py-3 px-4">
                  <div className="font-medium">{session.metadata.user_id}</div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Login
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground capitalize">
                    {session.metadata.device_type}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {formatDistanceToNow(new Date(session.metadata.login_date), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}