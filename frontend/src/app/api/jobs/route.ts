import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/utils/api";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '6';
    
    const response = await fetch(`${getApiUrl()}/api/jobs?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Jobs');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Jobs:', error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await fetch(`${getApiUrl()}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Anlegen des Jobs');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Fehler beim Anlegen des Jobs:', error);
    return NextResponse.json({ error: "Fehler beim Anlegen des Jobs" }, { status: 500 });
  }
} 