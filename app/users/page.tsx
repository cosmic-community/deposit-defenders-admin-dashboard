import { Suspense } from 'react'
import { Users, UserPlus, TrendingUp, CreditCard } from 'lucide-react'
import UserStats from '@/components/UserStats'
import UserTable from '@/components/UserTable'
import UserFilters from '@/components/UserFilters'
import UserSearch from '@/components/UserSearch'
import { getUsers } from '@/lib/cosmic'

async function UsersContent() {
  try {
    const users = await getUsers()
    
    const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
    const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
    const conversionRate = users.length > 0 ? (proUsers / users.length) * 100 : 0

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track user activity, subscriptions, and platform engagement
          </p>
        </div>

        <UserStats 
          users={users}
          freeUsers={freeUsers}
          proUsers={proUsers}
          conversionRate={conversionRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <UserSearch />
            <UserFilters />
          </div>
          <div className="lg:col-span-3">
            <UserTable users={users} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Users page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Users Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load user data. Please check your configuration.
          </p>
        </div>
      </div>
    )
  }
}

function UsersLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-border pb-6">
        <div className="h-8 bg-accent rounded animate-pulse w-64 mb-2" />
        <div className="h-4 bg-accent rounded animate-pulse w-96" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
      
      <div className="h-96 bg-accent rounded animate-pulse" />
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