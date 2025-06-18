import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid question' }, { status: 400 });
    }

    // Temporary mock response for testing UI
    const mockAnswer = `This is a mock answer to your question: "${question}". 
CyberBalm recommends applying strong email filtering, offline backups, regular patching, and staff training to defend against ransomware.`;

    return NextResponse.json({ answer: mockAnswer });
  } catch (error: any) {
    console.error('❌ API Error:', error.message || error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
