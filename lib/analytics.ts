import { 
  User, 
  UserSession, 
  RevenueRecord, 
  DashboardMetrics, 
  UserGrowthData, 
  RevenueData,
  ChartData 
} from '@/types';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfToday, 
  endOfToday, 
  format, 
  subDays,
  subMonths,
  parseISO,
  isAfter,
  isBefore
} from 'date-fns';

export function calculateDashboardMetrics(
  users: User[],
  sessions: UserSession[],
  revenue: RevenueRecord[]
): DashboardMetrics {
  const today = new Date();
  const todayStart = startOfToday();
  const todayEnd = endOfToday();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const last30Days = subDays(today, 30);

  // User metrics
  const totalUsers = users.length;
  const newUsersToday = users.filter(user => {
    const signupDate = parseISO(user.metadata.signup_date);
    return isAfter(signupDate, todayStart) && isBefore(signupDate, todayEnd);
  }).length;

  const newUsersThisMonth = users.filter(user => {
    const signupDate = parseISO(user.metadata.signup_date);
    return isAfter(signupDate, monthStart) && isBefore(signupDate, monthEnd);
  }).length;

  // Subscription metrics
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length;
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length;
  const conversionRate = totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0;

  // Revenue metrics
  const paidRevenue = revenue.filter(r => r.metadata.status === 'paid');
  const totalRevenue = paidRevenue.reduce((sum, r) => sum + r.metadata.amount, 0);
  const monthlyRecurringRevenue = proUsers * 5; // $5 per pro user per month

  // Activity metrics
  const recentSessions = sessions.filter(session => {
    const loginDate = parseISO(session.metadata.login_date);
    return isAfter(loginDate, last30Days);
  });
  const totalLogins = recentSessions.length;
  
  // Active users (logged in within last 30 days)
  const activeUserIds = new Set(recentSessions.map(s => s.metadata.user_id));
  const activeUsers = activeUserIds.size;

  return {
    totalUsers,
    newUsersToday,
    newUsersThisMonth,
    totalRevenue,
    monthlyRecurringRevenue,
    freeUsers,
    proUsers,
    conversionRate,
    totalLogins,
    activeUsers
  };
}

export function generateUserGrowthData(users: User[], days: number = 30): UserGrowthData[] {
  const today = new Date();
  const startDate = subDays(today, days - 1);
  
  const growthData: UserGrowthData[] = [];
  let cumulativeUsers = 0;

  for (let i = 0; i < days; i++) {
    const currentDate = subDays(today, days - 1 - i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Count signups for this specific day
    const signupsToday = users.filter(user => {
      const signupDate = format(parseISO(user.metadata.signup_date), 'yyyy-MM-dd');
      return signupDate === dateStr;
    }).length;

    cumulativeUsers += signupsToday;

    growthData.push({
      date: format(currentDate, 'MMM dd'),
      signups: signupsToday,
      totalUsers: cumulativeUsers
    });
  }

  return growthData;
}

export function generateRevenueData(revenue: RevenueRecord[], days: number = 30): RevenueData[] {
  const today = new Date();
  const revenueData: RevenueData[] = [];
  let cumulativeRevenue = 0;

  for (let i = 0; i < days; i++) {
    const currentDate = subDays(today, days - 1 - i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Calculate revenue for this specific day
    const dailyRevenue = revenue
      .filter(r => {
        const paymentDate = format(parseISO(r.metadata.payment_date), 'yyyy-MM-dd');
        return paymentDate === dateStr && r.metadata.status === 'paid';
      })
      .reduce((sum, r) => sum + r.metadata.amount, 0);

    cumulativeRevenue += dailyRevenue;

    // Calculate MRR based on pro subscribers at this point in time
    const proUsersAtDate = revenue.filter(r => {
      const paymentDate = parseISO(r.metadata.payment_date);
      return isBefore(paymentDate, currentDate) || format(paymentDate, 'yyyy-MM-dd') === dateStr;
    }).length;
    
    const mrr = proUsersAtDate * 5; // $5 per pro user

    revenueData.push({
      date: format(currentDate, 'MMM dd'),
      revenue: dailyRevenue,
      mrr: mrr
    });
  }

  return revenueData;
}

export function createUserGrowthChart(growthData: UserGrowthData[]): ChartData {
  return {
    labels: growthData.map(d => d.date),
    datasets: [
      {
        label: 'Daily Signups',
        data: growthData.map(d => d.signups),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Total Users',
        data: growthData.map(d => d.totalUsers),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };
}

export function createRevenueChart(revenueData: RevenueData[]): ChartData {
  return {
    labels: revenueData.map(d => d.date),
    datasets: [
      {
        label: 'Daily Revenue',
        data: revenueData.map(d => d.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'MRR',
        data: revenueData.map(d => d.mrr),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };
}

export function createSubscriptionChart(freeUsers: number, proUsers: number): ChartData {
  return {
    labels: ['Free Users', 'Pro Users'],
    datasets: [
      {
        data: [freeUsers, proUsers],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)', // Gray for free
          'rgba(59, 130, 246, 0.8)'   // Blue for pro
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1
      }
    ]
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function calculateGrowthPercentage(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
}