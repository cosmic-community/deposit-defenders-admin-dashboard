import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export async function getUsers(): Promise<import('../types').User[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'users' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    
    return response.objects as import('../types').User[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getUserSessions(): Promise<import('../types').UserSession[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'user_sessions' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects as import('../types').UserSession[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching user sessions:', error);
    throw new Error('Failed to fetch user sessions');
  }
}

export async function getRevenueRecords(): Promise<import('../types').RevenueRecord[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'revenue_records' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects as import('../types').RevenueRecord[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching revenue records:', error);
    throw new Error('Failed to fetch revenue records');
  }
}

export async function createUser(userData: {
  email: string;
  subscription_plan: 'free' | 'pro';
  signup_date: string;
}): Promise<import('../types').User> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'users',
      title: userData.email,
      slug: userData.email.replace('@', '-').replace('.', '-'),
      metadata: {
        email: userData.email,
        subscription_plan: userData.subscription_plan,
        signup_date: userData.signup_date,
        properties_count: 0,
        total_spent: 0,
        status: 'active'
      }
    });
    
    return response.object as import('../types').User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function createUserSession(sessionData: {
  user_id: string;
  login_date: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
}): Promise<import('../types').UserSession> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'user_sessions',
      title: `Session ${sessionData.user_id} ${sessionData.login_date}`,
      slug: `session-${sessionData.user_id}-${Date.now()}`,
      metadata: {
        user_id: sessionData.user_id,
        login_date: sessionData.login_date,
        device_type: sessionData.device_type
      }
    });
    
    return response.object as import('../types').UserSession;
  } catch (error) {
    console.error('Error creating user session:', error);
    throw new Error('Failed to create user session');
  }
}

export async function createRevenueRecord(revenueData: {
  user_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'credit_card' | 'debit_card';
}): Promise<import('../types').RevenueRecord> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'revenue_records',
      title: `Payment ${revenueData.user_id} ${revenueData.payment_date}`,
      slug: `payment-${revenueData.user_id}-${Date.now()}`,
      metadata: {
        user_id: revenueData.user_id,
        amount: revenueData.amount,
        subscription_plan: 'pro',
        payment_date: revenueData.payment_date,
        payment_method: revenueData.payment_method,
        status: 'paid'
      }
    });
    
    return response.object as import('../types').RevenueRecord;
  } catch (error) {
    console.error('Error creating revenue record:', error);
    throw new Error('Failed to create revenue record');
  }
}