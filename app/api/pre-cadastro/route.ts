import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { getPixGateway } from '@/lib/pix';
import { preCadastroSchema, createChargeSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Parse e valida o body da requisição
    const body = await request.json();
    const validatedData = preCadastroSchema.parse(body);

    // Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (existingUser) {
      // Se o usuário já existe, retorna o pagamento mais recente
      if (existingUser.payments.length > 0) {
        const latestPayment = existingUser.payments[0];
        return NextResponse.json(
          { 
            txid: latestPayment.txid, 
            message: 'Usuário já cadastrado, redirecionando para pagamento existente',
            isExistingUser: true
          },
          { status: 200 }
        );
      }
      
      // Se não tem pagamentos, cria um novo
      const txid = uuidv4();
      const payment = await prisma.payment.create({
        data: {
          txid,
          amountCents: env.PIX_FIXED_AMOUNT_CENTS,
          status: 'PENDING',
          provider: env.PIX_PROVIDER,
          userId: existingUser.id,
        },
      });
      
      return NextResponse.json(
        { 
          txid: payment.txid, 
          message: 'Usuário já cadastrado, novo pagamento criado',
          isExistingUser: true
        },
        { status: 200 }
      );
    }

    // Gera um TXID único
    const txid = uuidv4();

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
      },
    });

    // Cria o pagamento no banco
    const _payment = await prisma.payment.create({
      data: {
        txid,
        amountCents: env.PIX_FIXED_AMOUNT_CENTS,
        status: 'PENDING',
        provider: env.PIX_PROVIDER,
        userId: user.id,
      },
    });

    // Cria a cobrança PIX através do gateway
    const pixGateway = getPixGateway();
    const chargeData = createChargeSchema.parse({
      amountCents: env.PIX_FIXED_AMOUNT_CENTS,
      txid,
      payer: {
        name: validatedData.name,
        email: validatedData.email,
      },
    });

    await pixGateway.createCharge(chargeData);

    // Retorna o TXID para redirecionamento
    return NextResponse.json({ 
      txid, 
      message: 'Usuário criado com sucesso',
      isExistingUser: false
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
