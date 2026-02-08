import { NextResponse } from 'next/server';
import { mockNarratives } from '@/services/mockData';

export async function GET() {
  return NextResponse.json(mockNarratives);
}
