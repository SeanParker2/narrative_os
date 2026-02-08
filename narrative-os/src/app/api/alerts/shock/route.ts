import { NextResponse } from 'next/server';
import { mockAlerts } from '@/services/mockData';

export async function GET() {
  const shockAlerts = mockAlerts.filter(a => a.type === 'Shock');
  return NextResponse.json(shockAlerts);
}
