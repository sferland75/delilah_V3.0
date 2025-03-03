import { NextResponse } from 'next/server';
 
export function GET() {
  return NextResponse.redirect(new URL('/assessment/initial', 'http://localhost:3000'));
}
