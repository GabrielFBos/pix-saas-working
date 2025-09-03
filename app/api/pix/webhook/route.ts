import { NextRequest, NextResponse } from 'next/server';
import { getPixGateway } from '@/lib/pix';

export async function POST(request: NextRequest) {
  try {
    // Processa o webhook através do gateway PIX
    const pixGateway = getPixGateway();
    const result = await pixGateway.handleWebhook(request);

    console.log(`Webhook processado: TXID ${result.txid} - Status: ${result.status}`);

    // Retorna sucesso para o provedor PIX
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro no webhook:', error);

    // Em caso de erro, retorna 400 para o provedor PIX tentar novamente
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno' 
      },
      { status: 400 }
    );
  }
}
