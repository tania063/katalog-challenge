import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://tania:tania123@cluster0.fmxe9yb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "tania"; // ganti sesuai nama database kamu

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("about"); // nama collection kamu
    const data = await collection.find().toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Gagal ambil data dari MongoDB:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  } finally {
    await client.close();
  }
}
