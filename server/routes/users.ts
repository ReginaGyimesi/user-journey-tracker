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
  session_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  device: string;
  location: string;
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
 *                       session_id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       start_time:
 *                         type: string
 *                       end_time:
 *                         type: string
 *                       device:
 *                         type: string
 *                       location:
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

// This section will help you get a single record by id
// router.get("/:id", async (req, res) => {
//   try {
//     const db = await connectToDatabase();
//     let collection = db.collection("records");
//     let query = { _id: new ObjectId(req.params.id) };
//     let result = await collection.findOne(query);

//     if (!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching record");
//   }
// });

// This section will help you create a new record.
// router.post("/", async (req, res) => {
//   try {
//     const db = await connectToDatabase();
//     let newDocument = {
//       name: req.body.name,
//       position: req.body.position,
//       level: req.body.level,
//     };
//     let collection = db.collection("records");
//     let result = await collection.insertOne(newDocument);
//     res.send(result).status(201);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding record");
//   }
// });

// This section will help you update a record by id.
// router.patch("/:id", async (req, res) => {
//   try {
//     const db = await connectToDatabase();
//     const query = { _id: new ObjectId(req.params.id) };
//     const updates = {
//       $set: {
//         name: req.body.name,
//         position: req.body.position,
//         level: req.body.level,
//       },
//     };

//     let collection = db.collection("records");
//     let result = await collection.updateOne(query, updates);
//     res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating record");
//   }
// });

// This section will help you delete a record
// router.delete("/:id", async (req, res) => {
//   try {
//     const db = await connectToDatabase();
//     const query = { _id: new ObjectId(req.params.id) };

//     const collection = db.collection("records");
//     let result = await collection.deleteOne(query);

//     res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting record");
//   }
// });

export default router;
