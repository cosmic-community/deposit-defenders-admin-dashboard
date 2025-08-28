import { User } from '@/types'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { MoreVertical, Edit, Trash2, Eye, Mail } from 'lucide-react'

interface UserTableProps {
  users: User[]
  showActions?: boolean
}

export default function UserTable({ users, showActions = false }: UserTableProps) {
  if (!users || users.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Properties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Joined
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-accent/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {user.metadata?.email || user.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {user.id.slice(0, 8)}...
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.metadata?.subscription_plan === 'pro'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {user.metadata?.subscription_plan || 'free'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.metadata?.properties_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  ${user.metadata?.total_spent || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.metadata?.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : user.metadata?.status === 'canceled'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {user.metadata?.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {user.metadata?.signup_date 
                    ? formatDistanceToNow(parseISO(user.metadata.signup_date), { addSuffix: true })
                    : 'Unknown'
                  }
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded">
                        <Mail size={16} />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-destructive hover:bg-accent rounded">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}