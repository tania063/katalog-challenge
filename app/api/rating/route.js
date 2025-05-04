// app/api/rating/route.js
import { connectToDatabase } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("ratings");
    const ratings = await collection.find({}).toArray();
    const count = ratings.length;
    const average = count ? ratings.reduce((acc, cur) => acc + cur.value, 0) / count : 0;

    return NextResponse.json({ average, count });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { value } = body;

    // Validasi input rating
    if (typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json({ error: "Invalid rating value" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("ratings");
    await collection.insertOne({ value });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
