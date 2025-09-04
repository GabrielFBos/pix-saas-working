import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { upsertLeadByEmail, insertPayment } from '@/lib/db/queries';

// Schema de validação simplificado
const preCadastroSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse e valida o body da requisição
    const body = await request.json();
    const { name, email } = preCadastroSchema.parse(body);

    // Upsert lead (cria ou retorna existente)
    const leadId = await upsertLeadByEmail(name, email);

    // Valor fixo do PIX
    const amount = Number(process.env.PIX_FIXED_AMOUNT_CENTS ?? 990);

    // Gerar txid curto
    const txid = uuidv4().substring(0, 8);

    // Dados mock para PIX
    const copy_paste = `00020126580014br.gov.bcb.pix0136${txid}520400005303986540${(amount / 100).toFixed(2)}5802BR5913MOCK PROVIDER6008BRASILIA62070503***6304${Math.random().toString().slice(2, 6)}`;
    const qr_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    // Inserir pagamento no Supabase
    await insertPayment({
      lead_id: leadId,
      amount_cents: amount,
      method: 'pix',
      txid,
      copy_paste,
      qr_image,
    });

    // Retorna sucesso
    return NextResponse.json({ 
      ok: true, 
      txid,
      message: 'Lead processado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no pré-cadastro:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
