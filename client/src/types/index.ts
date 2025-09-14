export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  userName: string;
  pages: number;
  timestamp: string;
  duration?: number;
}

export interface Event {
  type: string;
  timestamp: string;
  page?: string;
  product?: string;
}

export interface UserJourney {
  user: User;
  sessions: Session[];
  events: Event[];
  totalSessions: number;
  totalPurchases: number;
}

export interface DashboardMetrics {
  currentUsers: number;
  allTimeSessions: number;
  allTimePurchases: number;
  avgMinutesSpent: number;
}
