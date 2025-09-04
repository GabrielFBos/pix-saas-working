import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txid = searchParams.get('txid');

    if (!txid) {
      return NextResponse.json(
        { message: 'TXID é obrigatório' },
        { status: 400 }
      );
    }

    // Busca o status do pagamento no Supabase
    const status = await getPaymentStatus(txid);

    return NextResponse.json({
      txid,
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao consultar status:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
