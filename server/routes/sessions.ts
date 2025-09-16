import express from "express";
import connectToDatabase from "../db/connection.js";
import { Session } from "../types/index.js";

const router = express.Router();

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
    let results = await collection
      .aggregate([
        {
          $addFields: {
            startTimeDate: { $toDate: "$startTime" },
          },
        },
        {
          $sort: { startTimeDate: -1 },
        },
      ])
      .toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sessions");
  }
});

export default router;
