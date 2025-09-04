export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/db/queries';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const txid = url.searchParams.get('txid') ?? '';
    if (!txid) return NextResponse.json({ status: 'missing-txid' }, { status: 400 });
    const status = await getPaymentStatus(txid);
    return NextResponse.json({ status });
  } catch (err: any) {
    console.error('status 500:', err?.message ?? err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
