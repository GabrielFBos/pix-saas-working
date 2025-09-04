import { NextRequest, NextResponse } from 'next/server';
import { setPaymentStatus } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Verificar header x-mock-secret
    const mockSecret = request.headers.get('x-mock-secret');
    const expectedSecret = process.env.MOCK_SECRET;

    if (mockSecret !== expectedSecret) {
      console.log('Webhook rejeitado: secret inválido');
      return NextResponse.json(
        { message: 'Secret inválido' },
        { status: 401 }
      );
    }

    // Obter txid do body
    const body = await request.json();
    const { txid } = body;

    if (!txid) {
      return NextResponse.json(
        { message: 'TXID é obrigatório' },
        { status: 400 }
      );
    }

    // Atualizar status para 'paid' (idempotente)
    await setPaymentStatus(txid, 'paid');

    console.log(`Webhook processado: TXID ${txid} - Status: paid`);

    // Retorna sucesso
    return NextResponse.json({ 
      success: true, 
      txid,
      status: 'paid'
    }, { status: 200 });

  } catch (error) {
    console.error('Erro no webhook:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno' 
      },
      { status: 500 }
    );
  }
}
