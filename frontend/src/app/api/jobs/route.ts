import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Hole Query-Parameter
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    // Hole Jobs mit Sortierung und Paginierung
    const jobs = await db.collection("jobs")
      .find({})
      .sort({ erstelltAm: -1 }) // Sortiere nach Datum, neueste zuerst
      .skip(skip)
      .limit(limit)
      .toArray();

    // Hole Gesamtanzahl der Jobs
    const totalJobs = await db.collection("jobs").countDocuments();

    return NextResponse.json({
      jobs,
      pagination: {
        total: totalJobs,
        page,
        limit,
        totalPages: Math.ceil(totalJobs / limit)
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Jobs:', error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await req.json();
    
    console.log('Empfangene Daten für neuen Job:', data);
    
    // Paket-Laufzeit in Tagen (default: 30)
    const duration = data.duration || 30;
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + duration * 24 * 60 * 60 * 1000);

    // Füge Erstellungs- und Ablaufdatum hinzu
    const jobData = {
      ...data,
      erstelltAm: erstelltAm.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    const result = await db.collection("jobs").insertOne(jobData);
    console.log('Insert-Result:', result);
    return NextResponse.json({ 
      insertedId: result.insertedId,
      ...jobData
    });
  } catch (error) {
    console.error('Fehler beim Anlegen des Jobs:', error);
    return NextResponse.json({ error: "Fehler beim Anlegen des Jobs" }, { status: 500 });
  }
} 