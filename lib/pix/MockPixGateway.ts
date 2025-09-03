import { NextRequest } from 'next/server';
import { IPixGateway } from './IPixGateway';
import { CreateChargeRequest, CreateChargeResponse, StatusResponse } from '@/lib/validation';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';

// Gateway PIX mock para desenvolvimento
export class MockPixGateway implements IPixGateway {
  async createCharge(data: CreateChargeRequest): Promise<CreateChargeResponse> {
    // Gera um payload PIX mock (formato EMV QR Code)
    const copyPastePayload = this.generateMockPixPayload(data);
    
    return {
      copyPastePayload,
      key: env.PIX_KEY,
      amountCents: data.amountCents,
      txid: data.txid,
    };
  }

  async verifyPayment(txid: string): Promise<StatusResponse> {
    // Busca o pagamento no banco de dados
    const payment = await prisma.payment.findUnique({
      where: { txid },
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    return {
      status: payment.status.toLowerCase() as 'pending' | 'paid' | 'failed',
    };
  }

  async handleWebhook(req: NextRequest): Promise<{ txid: string; status: 'paid' | 'failed' }> {
    const body = await req.json();
    
    // Validação simples do webhook (em produção seria mais robusta)
    const signature = req.headers.get('x-webhook-signature');
    if (signature !== env.WEBHOOK_SECRET) {
      throw new Error('Assinatura inválida');
    }

    const { txid, status } = body;

    if (!txid || !status) {
      throw new Error('Payload inválido');
    }

    // Atualiza o status do pagamento no banco
    await prisma.payment.update({
      where: { txid },
      data: { 
        status: status.toUpperCase() as 'PAID' | 'FAILED',
        updatedAt: new Date(),
      },
    });

    return { txid, status };
  }

  // Gera um payload PIX mock no formato EMV QR Code
  private generateMockPixPayload(data: CreateChargeRequest): string {
    const amount = (data.amountCents / 100).toFixed(2);
    const merchantName = 'PIX SaaS Learning';
    const merchantCity = 'SAO PAULO';
    const _postalCode = '01001000';
    
    // Formato EMV QR Code para PIX
    const payload = [
      '00020126', // Payload Format Indicator + Merchant Account Information
      '0014br.gov.bcb.pix', // GUI
      '01', // Key
      `${env.PIX_KEY.length.toString().padStart(2, '0')}${env.PIX_KEY}`, // PIX Key
      '52040000', // Merchant Category Code
      '5303986', // Transaction Currency (BRL)
      `54${amount.length.toString().padStart(2, '0')}${amount}`, // Transaction Amount
      '5802BR', // Country Code
      '5913', // Merchant Name
      `${merchantName.length.toString().padStart(2, '0')}${merchantName}`,
      '6008', // Merchant City
      `${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`,
      '62070503***', // Additional Data Field Template
      '6304', // CRC16
    ].join('');

    // CRC16 simples (em produção seria calculado corretamente)
    const crc = 'ABCD';
    
    return payload + crc;
  }
}
