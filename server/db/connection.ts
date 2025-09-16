import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add connection options to handle SSL/TLS issues
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
});

let db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
    db = client.db("userTrackingDB");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    console.log("Starting server without database connection...");
    // Return a mock database object to allow server to start
    db = client.db("userTrackingDB");
    return db;
  }
}

export default connectToDatabase;
