import { NextResponse } from 'next/server';
import { mockAlerts } from '@/services/mockData';

export async function GET() {
  const divergenceAlerts = mockAlerts.filter(a => a.type === 'Divergence');
  return NextResponse.json(divergenceAlerts);
}
