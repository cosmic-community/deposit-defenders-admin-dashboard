'use client'

import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Activity,
  PieChart
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users
  },
  {
    name: 'Revenue',
    href: '/revenue',
    icon: DollarSign
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp
  },
  {
    name: 'Activity',
    href: '/activity',
    icon: Activity
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: PieChart
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          Deposit Defenders Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analytics Dashboard
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Deposit Defenders v1.0</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}