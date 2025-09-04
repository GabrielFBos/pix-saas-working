export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { upsertLeadByEmail, insertPayment } from '@/lib/db/queries';

function getAmountCents() {
  const raw = process.env.PIX_FIXED_AMOUNT_CENTS ?? '990';
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 990;
  return Math.floor(n);
}

function genTxid() {
  return 'tx_' + Math.random().toString(36).slice(2, 10);
}

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });
    }

    const leadId = await upsertLeadByEmail(name, email);

    const txid = genTxid();
    const amount_cents = getAmountCents();
    const copy_paste = `00020126...MOCK:${txid}`;
    const qr_image = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==`;

    await insertPayment({
      lead_id: leadId,
      amount_cents,
      method: 'pix',
      txid,
      copy_paste,
      qr_image,
    } as any);

    return NextResponse.json({ ok: true, txid });
  } catch (err: any) {
    console.error('pre-cadastro 500:', err?.message ?? err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
