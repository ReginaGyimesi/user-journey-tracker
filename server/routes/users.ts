import express from "express";

import connectToDatabase from "../db/connection.js";
import { Event, Session, User } from "../types/index.js";

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
 * /api/users/search:
 *   get:
 *     summary: Search users by name and email
 *     description: Search users with fuzzy search, partial matching, and autocomplete functionality
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Search query for name or email
 *         schema:
 *           type: string
 *           example: "john"
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of results to return
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: number
 *                   description: Total number of matching users
 *                 query:
 *                   type: string
 *                   description: The search query used
 *       400:
 *         description: Invalid search query
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Search query is required"
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get("/users/search", async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(400).send("Search query is required");
      return;
    }

    const searchQuery = q.trim();
    const maxLimit = Math.min(parseInt(limit as string) || 10, 50);

    const db = await connectToDatabase();
    const usersCollection = db.collection<User>("users");

    // Create a regex pattern for partial matching (case-insensitive)
    const regexPattern = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Search in both name and email fields
    const searchResults = await usersCollection
      .find({
        $or: [
          { name: { $regex: regexPattern } },
          { email: { $regex: regexPattern } }
        ]
      })
      .limit(maxLimit)
      .toArray();

    // For fuzzy search, we'll also try some common typos and variations
    const fuzzyResults = await usersCollection
      .find({
        $or: [
          // Exact matches first
          { name: { $regex: regexPattern } },
          { email: { $regex: regexPattern } },
          // Fuzzy matches for common typos (simple implementation)
          { name: { $regex: new RegExp(searchQuery.replace(/[aeiou]/g, '[aeiou]'), 'i') } },
          { email: { $regex: new RegExp(searchQuery.replace(/[aeiou]/g, '[aeiou]'), 'i') } }
        ]
      })
      .limit(maxLimit)
      .toArray();

    // Combine and deduplicate results
    const allResults = [...searchResults, ...fuzzyResults];
    const uniqueResults = allResults.filter((user, index, self) => 
      index === self.findIndex(u => u._id === user._id)
    );

    // Sort results by relevance (exact matches first, then partial matches)
    const sortedResults = uniqueResults.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
      const aEmailMatch = a.email.toLowerCase().includes(searchQuery.toLowerCase());
      const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
      const bEmailMatch = b.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Exact matches get higher priority
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      if (aEmailMatch && !bEmailMatch) return -1;
      if (!aEmailMatch && bEmailMatch) return 1;

      // Then sort by name alphabetically
      return a.name.localeCompare(b.name);
    });

    const response = {
      users: sortedResults.slice(0, maxLimit),
      total: sortedResults.length,
      query: searchQuery
    };

    res.send(response).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching users");
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

    const usersCollection = db.collection<User>("users");
    const user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Get all events for the user
    const eventsCollection = db.collection<Event>("events");

    const events = await eventsCollection
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .toArray();

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

    let purchaseCount = events.filter(
      (event) => event.event_type === "PURCHASE"
    ).length;

    const response = {
      user_id: userId,
      event_count: events.length,
      avg_time_spent_seconds: avgTimeSpentSeconds,
      all_time_purchases: purchaseCount,
      events: events,
    };

    res.send(response).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user events");
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
 *                 session_avg_time:
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
    let sessions = await sessionsCollection.find({ userId: userId }).toArray();

    // Get user info to verify user exists
    let usersCollection = db.collection<User>("users");
    let user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Calculate average minutes spent from sessions
    let totalMinutes = 0;
    let validSessions = 0;

    sessions.forEach((session) => {
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);

      if (durationMinutes > 0 && durationMinutes < 1440) {
        totalMinutes += durationMinutes;
        validSessions++;
      }
    });

    const avgMinutesSpent =
      validSessions > 0 ? Math.round(totalMinutes / validSessions) : 0;

    const response = {
      user_id: userId,
      session_count: sessions.length,
      session_avg_time: avgMinutesSpent,
      sessions: sessions,
    };

    res.send(response).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user sessions");
  }
});

export default router;
