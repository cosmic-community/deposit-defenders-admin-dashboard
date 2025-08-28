// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// User object type with subscription and activity data
export interface User extends CosmicObject {
  type: 'users';
  metadata: {
    email: string;
    subscription_plan: 'free' | 'pro';
    signup_date: string;
    last_login?: string;
    properties_count: number;
    total_spent: number;
    status: 'active' | 'inactive' | 'canceled';
    payment_method?: string;
    billing_date?: string;
  };
}

// User session tracking for login analytics
export interface UserSession extends CosmicObject {
  type: 'user_sessions';
  metadata: {
    user_id: string;
    login_date: string;
    session_duration?: number;
    ip_address?: string;
    user_agent?: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
  };
}

// Revenue analytics object
export interface RevenueRecord extends CosmicObject {
  type: 'revenue_records';
  metadata: {
    user_id: string;
    amount: number;
    subscription_plan: 'pro';
    payment_date: string;
    payment_method: 'credit_card' | 'debit_card';
    status: 'paid' | 'failed' | 'refunded';
    stripe_payment_id?: string;
  };
}

// Dashboard analytics interfaces
export interface DashboardMetrics {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  freeUsers: number;
  proUsers: number;
  conversionRate: number;
  totalLogins: number;
  activeUsers: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface UserGrowthData {
  date: string;
  signups: number;
  totalUsers: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  mrr: number;
}

// Activity-specific interfaces
export interface ActivityData {
  date: string;
  logins: number;
  registrations: number;
  totalActivities: number;
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards for runtime validation
export function isUser(obj: CosmicObject): obj is User {
  return obj.type === 'users';
}

export function isUserSession(obj: CosmicObject): obj is UserSession {
  return obj.type === 'user_sessions';
}

export function isRevenueRecord(obj: CosmicObject): obj is RevenueRecord {
  return obj.type === 'revenue_records';
}

// Utility types
export type SubscriptionPlan = 'free' | 'pro';
export type UserStatus = 'active' | 'inactive' | 'canceled';
export type PaymentStatus = 'paid' | 'failed' | 'refunded';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

// Dashboard component props
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface ChartCardProps {
  title: string;
  data: ChartData;
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  height?: number;
}