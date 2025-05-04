import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received contact request:", body);

    const { db } = await connectToDatabase();
    const collection = db.collection("contact");

    const result = await collection.insertOne(body);
    console.log("Data inserted:", result);

    return new Response(JSON.stringify({ message: "Success", data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error inserting contact data:", error);
    return new Response(JSON.stringify({
      message: "Internal server error",
      error: error.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
