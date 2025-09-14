export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Session {
  session_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  device: string;
  location: string;
}

export interface UserSessionsResponse {
  user_id: string;
  session_count: number;
  sessions: Session[];
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
