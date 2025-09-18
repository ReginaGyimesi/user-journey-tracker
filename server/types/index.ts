export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Session {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  deviceInfo: {
    browser: string;
    os: string;
  };
  ipAddress: string;
}

export interface DashboardStats {
  allTimeUsers: number;
  allTimeSessions: number;
  allTimePurchases: number;
  avgMinutesSpent: number;
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

export interface UserSearchResponse {
  users: User[];
  total: number;
  query: string;
}
