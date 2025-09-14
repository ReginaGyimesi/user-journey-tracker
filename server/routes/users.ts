import express from "express";

import connectToDatabase from "../db/connection.js";
// import { ObjectId } from "mongodb";

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
 * /api/:
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
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    let collection = db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
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
