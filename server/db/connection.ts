import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
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
    db = client.db("user_journey_tracker");
    return db;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default connectToDatabase;
