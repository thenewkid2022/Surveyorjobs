import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const stellengesuche = await db.collection("stellengesuche")
      .find({})
      .sort({ erstelltAm: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("stellengesuche").countDocuments();

    return NextResponse.json({
      stellengesuche,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Stellengesuche:', error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Stellengesuche" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await req.json();

    // Paket-Laufzeit in Tagen (default: 30)
    const duration = data.duration || 30;
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + duration * 24 * 60 * 60 * 1000);

    const stellengesuchData = {
      ...data,
      erstelltAm: erstelltAm.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    const result = await db.collection("stellengesuche").insertOne(stellengesuchData);
    return NextResponse.json({ 
      insertedId: result.insertedId,
      ...stellengesuchData
    });
  } catch (error) {
    console.error('Fehler beim Anlegen des Stellengesuchs:', error);
    return NextResponse.json({ error: "Fehler beim Anlegen des Stellengesuchs" }, { status: 500 });
  }
} 