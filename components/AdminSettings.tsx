'use client'

import { useState } from 'react'
import { User, Mail, Shield, Calendar, Plus, Trash2, Edit } from 'lucide-react'

interface AdminSettingsProps {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    proUsers: number;
    freeUsers: number;
  };
}

export default function AdminSettings({ userMetrics }: AdminSettingsProps) {
  const [adminUsers, setAdminUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@depositdefenders.com',
      role: 'Super Admin',
      lastLogin: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@depositdefenders.com',
      role: 'Admin',
      lastLogin: '2024-01-14',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@depositdefenders.com',
      role: 'Manager',
      lastLogin: '2024-01-10',
      status: 'inactive'
    }
  ])

  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Admin'
  })

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        lastLogin: 'Never',
        status: 'active'
      }
      setAdminUsers([...adminUsers, user])
      setNewUser({ name: '', email: '', role: 'Admin' })
      setShowAddUser(false)
    }
  }

  const handleDeleteUser = (id: string) => {
    setAdminUsers(adminUsers.filter(user => user.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Admin Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Total Admins</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">{adminUsers.length}</p>
          <p className="text-sm text-muted-foreground">Active admin accounts</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Super Admins</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {adminUsers.filter(u => u.role === 'Super Admin').length}
          </p>
          <p className="text-sm text-muted-foreground">Highest permission level</p>
        </div>
        
        <div className="bg-accent p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Active Today</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {adminUsers.filter(u => u.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Currently online</p>
        </div>
      </div>

      {/* Admin Users Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Admin Users</h4>
          <button 
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus size={16} />
            Add Admin User
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="bg-accent p-4 rounded-lg mb-4 border border-border">
            <h5 className="font-medium text-foreground mb-3">Add New Admin User</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-3">
          {adminUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-accent rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <h6 className="font-medium text-foreground">{user.name}</h6>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      {user.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Last login: {user.lastLogin}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className={`text-xs ${
                    user.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-background rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}