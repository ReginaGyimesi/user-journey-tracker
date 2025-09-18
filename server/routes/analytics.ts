import express from "express";
import connectToDatabase from "../db/connection.js";
import { DashboardStats, Session, User, Event } from "../types/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/analytics/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve aggregated statistics for the dashboard including all-time users, sessions, purchases, and average minutes spent
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allTimeUsers:
 *                   type: number
 *                   description: Total number of users
 *                   example: 50
 *                 allTimeSessions:
 *                   type: number
 *                   description: Total number of sessions
 *                   example: 171
 *                 allTimePurchases:
 *                   type: number
 *                   description: Total number of items purchased
 *                   example: 1367
 *                 avgMinutesSpent:
 *                   type: number
 *                   description: Average minutes spent per session
 *                   example: 4
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/analytics/stats", async (req, res) => {
  try {
    const db = await connectToDatabase();

    // Get all time users count
    const usersCollection = db.collection<User>("users");
    const allTimeUsers = await usersCollection.countDocuments();

    // Get all time sessions count
    const sessionsCollection = db.collection<Session>("sessions");
    const allTimeSessions = await sessionsCollection.countDocuments();

    // Get all events
    const eventsCollection = db.collection<Session>("events");

    // Find all PURCHASE events
    const allTimePurchases = await eventsCollection.countDocuments({
      event_type: "PURCHASE",
    });

    // Calculate average minutes spent from sessions
    const sessions = await sessionsCollection.find({}).toArray();
    let totalMinutes = 0;
    let validSessions = 0;

    sessions.forEach((session) => {
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = durationMs / (1000 * 60); // Convert to minutes

      if (durationMinutes > 0 && durationMinutes < 1440) {
        // Valid session (less than 24 hours)
        totalMinutes += durationMinutes;
        validSessions++;
      }
    });

    const avgMinutesSpent =
      validSessions > 0 ? Math.round(totalMinutes / validSessions) : 4;

    const dashboardStats: DashboardStats = {
      allTimeUsers,
      allTimeSessions,
      allTimePurchases,
      avgMinutesSpent,
    };

    res.send(dashboardStats).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching dashboard statistics");
  }
});

/**
 * @swagger
 * /api/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics over time
 *     description: Retrieve aggregated revenue data grouped by date from purchase events
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Revenue analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: number
 *                         example: 2025
 *                       month:
 *                         type: number
 *                         example: 9
 *                       day:
 *                         type: number
 *                         example: 1
 *                   totalRevenue:
 *                     type: number
 *                     description: Total revenue for the day
 *                     example: 848.29
 *                   purchaseCount:
 *                     type: number
 *                     description: Number of purchases for the day
 *                     example: 5
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date in ISO format
 *                     example: "2025-09-01T00:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/analytics/revenue", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const eventsCollection = db.collection<Event>("events");

    const revenueOverTime = await eventsCollection
      .aggregate([
        {
          $match: { event_type: "PURCHASE" },
        },
        {
          $group: {
            _id: {
              year: { $year: { $toDate: "$timestamp" } },
              month: { $month: { $toDate: "$timestamp" } },
              day: { $dayOfMonth: { $toDate: "$timestamp" } },
            },
            totalRevenue: { $sum: "$metadata.price" },
            purchaseCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            totalRevenue: 1,
            purchaseCount: 1,
          },
        },
      ])
      .toArray();

    res.json(revenueOverTime);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching revenue data");
  }
});

/**
 * @swagger
 * /api/analytics/daily-active-users:
 *   get:
 *     summary: Get daily active users analytics
 *     description: Retrieve daily active users data grouped by date from sessions
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Daily active users analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: number
 *                         example: 2025
 *                       month:
 *                         type: number
 *                         example: 9
 *                       day:
 *                         type: number
 *                         example: 1
 *                   activeUsers:
 *                     type: number
 *                     description: Number of unique active users for the day
 *                     example: 15
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date in ISO format
 *                     example: "2025-09-01T00:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/analytics/daily-active-users", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection<Session>("sessions");

    const dailyActiveUsers = await sessionsCollection
      .aggregate([
        {
          $group: {
            _id: {
              year: { $year: { $toDate: "$startTime" } },
              month: { $month: { $toDate: "$startTime" } },
              day: { $dayOfMonth: { $toDate: "$startTime" } },
            },
            activeUsers: { $addToSet: "$userId" },
          },
        },
        {
          $project: {
            activeUsers: { $size: "$activeUsers" },
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .toArray();

    res.json(dailyActiveUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching daily active users data");
  }
});

export default router;
