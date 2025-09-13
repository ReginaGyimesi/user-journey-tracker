import express from "express";
import cors from "cors";
import connectToDatabase from "./db/connection.js";
import users from "./routes/users.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", users);

// Initialize database connection and start server
async function startServer() {
  try {
    await connectToDatabase();
    console.log("Database connected successfully");

    // start the Express server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
