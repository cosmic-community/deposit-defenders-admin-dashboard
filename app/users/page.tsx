import { Suspense } from 'react'
import { Users, UserPlus, Search, Filter, Download } from 'lucide-react'
import UserTable from '@/components/UserTable'
import UserFilters from '@/components/UserFilters'
import UserSearch from '@/components/UserSearch'
import UserStats from '@/components/UserStats'
import { getUsers } from '@/lib/cosmic'
import { calculateUserMetrics } from '@/lib/analytics'

async function UsersContent() {
  try {
    const users = await getUsers()
    const userMetrics = calculateUserMetrics(users)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users size={32} />
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and analyze your Deposit Defenders user base
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              <Download size={18} />
              Export Users
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <UserStats metrics={userMetrics} />

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <UserSearch />
          </div>
          <div className="lg:w-64">
            <UserFilters />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              All Users ({users.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter size={16} />
              {users.filter(u => u.metadata?.status === 'active').length} active users
            </div>
          </div>
          
          <UserTable users={users} showActions={true} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Users page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Users Page Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load user data. Please check your Cosmic configuration.
          </p>
        </div>
      </div>
    )
  }
}

function UsersLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <div className="h-8 bg-accent rounded animate-pulse w-64 mb-2" />
          <div className="h-4 bg-accent rounded animate-pulse w-96" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-accent rounded animate-pulse w-32" />
          <div className="h-10 bg-accent rounded animate-pulse w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 h-10 bg-accent rounded animate-pulse" />
        <div className="w-64 h-10 bg-accent rounded animate-pulse" />
      </div>
      
      <div className="bg-card border border-border rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-6 bg-accent rounded animate-pulse w-32" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-accent rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  )
}