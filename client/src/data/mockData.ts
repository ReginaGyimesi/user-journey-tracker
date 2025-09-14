import { DashboardMetrics, Session, User, UserJourney } from "../types";

export const mockDashboardMetrics: DashboardMetrics = {
  currentUsers: 233,
  allTimeSessions: 5367,
  allTimePurchases: 1367,
  avgMinutesSpent: 4,
};

export const mockRecentSessions: Session[] = [
  {
    sessionId: "s3",
    userId: "user1",
    userName: "Alice",
    pages: 4,
    timestamp: "10:43",
    duration: 5.4,
  },
  {
    sessionId: "s1",
    userId: "user2",
    userName: "Bob",
    pages: 7,
    timestamp: "10:35",
    duration: 2.1,
  },
];

export const mockUsers: User[] = [
  {
    _id: "user1",
    name: "Alice Smith",
    email: "alice.smith@test.com",
  },
  {
    _id: "user2",
    name: "Bob Johnson",
    email: "bob.johnson@test.com",
  },
  {
    _id: "user3",
    name: "Carol Davis",
    email: "carol.davis@test.com",
  },
];

export const mockUserJourney: UserJourney = {
  user: {
    _id: "user1",
    name: "Alice Smith",
    email: "alice.smith@test.com",
  },
  sessions: [
    {
      sessionId: "S24",
      userId: "user1",
      userName: "Alice Smith",
      pages: 3,
      timestamp: "10:46am",
      duration: 5.4,
    },
    {
      sessionId: "S12",
      userId: "user1",
      userName: "Alice Smith",
      pages: 2,
      timestamp: "8:32pm",
      duration: 2.1,
    },
    {
      sessionId: "S6",
      userId: "user1",
      userName: "Alice Smith",
      pages: 5,
      timestamp: "15:12pm",
      duration: 7,
    },
  ],
  events: [
    {
      type: "Session ended",
      timestamp: "10:46am",
    },
    {
      type: "Product visited",
      timestamp: "10:45am",
      product: "Product A",
    },
    {
      type: "Products page visited",
      timestamp: "10:44am",
      page: "Products",
    },
    {
      type: "Session started",
      timestamp: "10:43am",
    },
  ],
  totalSessions: 3,
  totalPurchases: 1,
};

export const mockChartData = [
  { label: "Mon", value: 120 },
  { label: "Tue", value: 190 },
  { label: "Wed", value: 300 },
  { label: "Thu", value: 500 },
];
