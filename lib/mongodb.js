import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log("Mongo URI:", uri);

let client;
let clientPromise;

// Jika clientPromise sudah ada di global, maka gunakan itu
if (process.env.NODE_ENV === "development") {
  // Untuk development mode, cache client di global
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Untuk produksi, jangan cache client
  client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

export default clientPromise;

export async function connectToDatabase() {
  try {
    const client = await clientPromise;  // Menggunakan clientPromise yang sudah terdefinisi
    const db = client.db("cv_online");  // Nama database yang ingin diakses
    console.log("✅ Connected to MongoDB!");
    return { client, db };  // Mengembalikan client dan db
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to the database");
  }
}
