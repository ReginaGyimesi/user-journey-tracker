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
  _id: string;
  event_id: string;
  user_id: string;
  session_id: string;
  event_type: string;
  timestamp: string;
  metadata: {
    page_id?: string;
    item_id?: string;
    time_spent_seconds?: number;
    search_query?: string;
    price?: number;
  };
}

export interface UserEventsResponse {
  user_id: string;
  event_count: number;
  avg_time_spent_seconds: number;
  events: Event[];
}

export interface UserJourney {
  user: User;
  sessions: Session[];
  events: Event[];
  totalSessions: number;
  totalPurchases: number;
}

export interface DashboardMetrics {
  allTimeUsers: number;
  allTimeSessions: number;
  allTimePurchases: number;
  avgMinutesSpent: number;
}
