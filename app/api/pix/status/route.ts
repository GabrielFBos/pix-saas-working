import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPixGateway } from '@/lib/pix';
import { statusQuerySchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    // Obtém o TXID da query string
    const { searchParams } = new URL(request.url);
    const txid = searchParams.get('txid');

    // Valida o TXID
    const validatedData = statusQuerySchema.parse({ txid });

    // Busca o status através do gateway PIX
    const pixGateway = getPixGateway();
    const status = await pixGateway.verifyPayment(validatedData.txid);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Erro ao consultar status:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'TXID inválido' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Pagamento não encontrado') {
      return NextResponse.json(
        { message: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
