import { NextRequest, NextResponse } from 'next/server';
import { processPdfText } from '@/utils/pdf-import';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }
    
    // Process the PDF text using our enhanced pattern recognition system
    const result = processPdfText(body.text);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing PDF text:', error);
    
    return NextResponse.json(
      { error: 'Failed to process PDF text' },
      { status: 500 }
    );
  }
}
