import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectToDatabase from "./db/connection.js";
import users from "./routes/users.js";
import analytics from "./routes/analytics.js";
import sessions from "./routes/sessions.js";

const PORT = process.env.PORT || 5050;
const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Journey Tracker API",
      version: "1.0.0",
      description: "API for managing user journey tracking",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

// Swagger JSON endpoint
app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", users);
app.use("/api", analytics);
app.use("/api", sessions);

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
