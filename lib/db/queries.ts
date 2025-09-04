import { admin } from './supabase';

export async function upsertLeadByEmail(name: string, email: string) {
  const { data: existing, error: e1 } = await admin
    .from('leads').select('id').eq('email', email).maybeSingle();
  if (e1) throw e1;
  if (existing) return existing.id;

  const { data, error } = await admin
    .from('leads').insert({ name, email }).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function insertPayment(p: {
  lead_id: string; amount_cents: number; method: 'pix';
  txid: string; copy_paste: string; qr_image: string;
}) {
  const { data, error } = await admin.from('payments').insert(p).select('txid').single();
  if (error) throw error;
  return data.txid as string;
}

export async function getPaymentStatus(txid: string) {
  const { data, error } = await admin
    .from('payments').select('status').eq('txid', txid).single();
  if (error) throw error;
  return data.status as 'pending' | 'paid' | 'failed' | 'expired';
}

export async function setPaymentStatus(txid: string, status: 'pending' | 'paid' | 'failed' | 'expired') {
  const { error } = await admin.from('payments').update({ status }).eq('txid', txid);
  if (error) throw error;
}
