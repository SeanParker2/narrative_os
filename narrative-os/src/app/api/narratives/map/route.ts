import { NextResponse } from 'next/server';
import { mockGraphNodes, mockGraphLinks } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    nodes: mockGraphNodes,
    links: mockGraphLinks,
  });
}
