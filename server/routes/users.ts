import express from "express";

import connectToDatabase from "../db/connection.js";
import { ObjectId } from "mongodb";

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

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user's unique identifier
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "John Doe"
 *         email: "john@example.com"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *   responses:
 *     UsersListResponse:
 *       description: List of users retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       description: Error occurred while fetching users
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "Error fetching users"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users from the database
 *     tags: [Users]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UsersListResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/users", async (req, res) => {
  try {
    const db = await connectToDatabase();
    let collection = db.collection<User[]>("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     description: Retrieve a specific user from the database by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's unique identifier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User not found"
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/users/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    let collection = db.collection<User>("users");
    let query = { _id: req.params.id };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("User not found");
    } else {
      res.send(result).status(200);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

/**
 * @swagger
 * /api/users/{id}/sessions:
 *   get:
 *     summary: Get sessions for a specific user
 *     description: Retrieve all sessions for a user with session count
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's unique identifier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 session_count:
 *                   type: number
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       deviceInfo:
 *                         type: object
 *                         properties:
 *                           browser:
 *                             type: string
 *                           os:
 *                             type: string
 *                       ipAddress:
 *                         type: string
 *       404:
 *         description: User not found
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/users/:id/sessions", async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await connectToDatabase();
    let sessionsCollection = db.collection<Session>("sessions");

    // Get all sessions for the user
    let sessions = await sessionsCollection.find({ user_id: userId }).toArray();

    // Get user info to verify user exists
    let usersCollection = db.collection<User>("users");
    let user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const response = {
      user_id: userId,
      session_count: sessions.length,
      sessions: sessions,
    };

    res.send(response).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user sessions");
  }
});

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all sessions
 *     description: Retrieve all sessions from the database
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   session_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                   end_time:
 *                     type: string
 *                   device:
 *                     type: string
 *                   location:
 *                     type: string
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/sessions", async (req, res) => {
  try {
    const db = await connectToDatabase();
    let collection = db.collection<Session>("sessions");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sessions");
  }
});

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve aggregated statistics for the dashboard including all-time users, sessions, purchases, and average minutes spent
 *     tags: [Dashboard]
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
router.get("/dashboard/stats", async (req, res) => {
  try {
    const db = await connectToDatabase();

    // Get all time users count
    const usersCollection = db.collection<User>("users");
    const allTimeUsers = await usersCollection.countDocuments();

    // Get all time sessions count
    const sessionsCollection = db.collection<Session>("sessions");
    const allTimeSessions = await sessionsCollection.countDocuments();

    // For now, we'll use mock data for purchases since we don't have a purchases collection
    // In a real application, you would have a purchases collection
    const allTimePurchases = 1367; // This should come from a purchases collection

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
 * /api/users/{id}/events:
 *   get:
 *     summary: Get events for a specific user
 *     description: Retrieve all events for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's unique identifier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       event_id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       session_id:
 *                         type: string
 *                       event_type:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                         properties:
 *                           page_id:
 *                             type: string
 *                           item_id:
 *                             type: string
 *                           time_spent_seconds:
 *                             type: number
 *                           search_query:
 *                             type: string
 *                           price:
 *                             type: number
 *       404:
 *         description: User not found
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/users/:id/events", async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await connectToDatabase();

    // Get user info to verify user exists
    const usersCollection = db.collection<User>("users");
    const user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Get all events for the user, sorted by timestamp (most recent first)
    const eventsCollection = db.collection<Event>("events");

    // Debug: Check total events in collection
    const totalEvents = await eventsCollection.countDocuments();
    console.log(`Total events in collection: ${totalEvents}`);

    // Debug: Check events for this user
    const events = await eventsCollection
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .toArray();

    console.log(`Events found for user ${userId}: ${events.length}`);

    // Calculate average time spent from events that have time_spent_seconds
    let totalTimeSpent = 0;
    let eventsWithTimeSpent = 0;

    events.forEach((event) => {
      if (event.metadata.time_spent_seconds) {
        totalTimeSpent += event.metadata.time_spent_seconds;
        eventsWithTimeSpent++;
      }
    });

    const avgTimeSpentSeconds =
      eventsWithTimeSpent > 0
        ? Math.round(totalTimeSpent / eventsWithTimeSpent)
        : 0;

    const response = {
      user_id: userId,
      event_count: events.length,
      avg_time_spent_seconds: avgTimeSpentSeconds,
      events: events,
    };

    res.send(response).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user events");
  }
});

export default router;
