export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getPaymentStatus, setPaymentStatus } from '@/lib/db/queries';

export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-mock-secret');
    if (secret !== process.env.MOCK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const { txid } = await req.json();
    if (!txid) return NextResponse.json({ ok: false }, { status: 400 });

    const current = await getPaymentStatus(txid);
    if (current !== 'paid') {
      await setPaymentStatus(txid, 'paid');
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('webhook 500:', err?.message ?? err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
