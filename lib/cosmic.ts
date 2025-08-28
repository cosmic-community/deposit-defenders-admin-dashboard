import { createBucketClient } from '@cosmicjs/sdk'
import { User, UserSession, RevenueRecord, CosmicResponse } from '@/types'

// Initialize Cosmic client
const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function to handle 404 errors from Cosmic API
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}

// Fetch all users with error handling
export async function getUsers(): Promise<User[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'users' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at'])
      .depth(1)
    
    return response.objects as User[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      console.log('No users found')
      return []
    }
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

// Fetch user sessions for activity tracking
export async function getUserSessions(): Promise<UserSession[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'user_sessions' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(1)
    
    return response.objects as UserSession[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      console.log('No user sessions found')
      return []
    }
    console.error('Error fetching user sessions:', error)
    throw new Error('Failed to fetch user sessions')
  }
}

// Fetch revenue records for financial analytics
export async function getRevenueRecords(): Promise<RevenueRecord[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'revenue_records' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(1)
    
    return response.objects as RevenueRecord[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      console.log('No revenue records found')
      return []
    }
    console.error('Error fetching revenue records:', error)
    throw new Error('Failed to fetch revenue records')
  }
}

// Fetch a single user by ID
export async function getUser(id: string): Promise<User | null> {
  try {
    const response = await cosmic.objects
      .findOne({ id, type: 'users' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at'])
      .depth(1)
    
    return response.object as User
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}

// Create a new user (for demonstration purposes)
export async function createUser(userData: {
  title: string
  metadata: User['metadata']
}): Promise<User> {
  try {
    const response = await cosmic.objects.insertOne({
      title: userData.title,
      type: 'users',
      status: 'published',
      metadata: userData.metadata
    })
    
    return response.object as User
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

// Update user metadata
export async function updateUser(id: string, updates: {
  title?: string
  metadata?: Partial<User['metadata']>
}): Promise<User> {
  try {
    const response = await cosmic.objects.updateOne(id, updates)
    return response.object as User
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user')
  }
}

// Create a revenue record
export async function createRevenueRecord(revenueData: {
  title: string
  metadata: RevenueRecord['metadata']
}): Promise<RevenueRecord> {
  try {
    const response = await cosmic.objects.insertOne({
      title: revenueData.title,
      type: 'revenue_records',
      status: 'published',
      metadata: revenueData.metadata
    })
    
    return response.object as RevenueRecord
  } catch (error) {
    console.error('Error creating revenue record:', error)
    throw new Error('Failed to create revenue record')
  }
}

// Create a user session record
export async function createUserSession(sessionData: {
  title: string
  metadata: UserSession['metadata']
}): Promise<UserSession> {
  try {
    const response = await cosmic.objects.insertOne({
      title: sessionData.title,
      type: 'user_sessions',
      status: 'published',
      metadata: sessionData.metadata
    })
    
    return response.object as UserSession
  } catch (error) {
    console.error('Error creating user session:', error)
    throw new Error('Failed to create user session')
  }
}

export { cosmic }