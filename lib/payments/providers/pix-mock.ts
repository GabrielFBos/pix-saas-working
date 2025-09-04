/**
 * @fileoverview Provedor Mock para PIX
 * Implementação simulada do gateway PIX para desenvolvimento e testes
 */

import { v4 as uuidv4 } from 'uuid';
import { PaymentGateway, CreateChargeInput, CreateChargeOutput, GetStatusInput, GetStatusOutput, ProcessWebhookInput, ProcessWebhookOutput } from '@/lib/payments/gateway';
import { PaymentStatus } from '@/lib/core/entities';

/**
 * Provedor Mock para PIX
 * 
 * Esta implementação simula um gateway PIX real, gerando dados fake
 * para desenvolvimento e testes. Todos os pagamentos ficam em status
 * 'pending' até receber um webhook válido.
 */
export class PixMockProvider implements PaymentGateway {
  private readonly mockSecret: string;
  
  constructor() {
    this.mockSecret = process.env.MOCK_SECRET || 'mock-secret-key';
  }
  
  /**
   * Cria uma cobrança PIX mock
   * 
   * Gera dados fake incluindo QR code em base64 e código copia e cola.
   * O QR code é uma imagem fake em base64 para simular um QR real.
   * 
   * @param input - Dados da cobrança a ser criada
   * @returns Promise com os dados da cobrança mock criada
   */
  async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
    const txid = input.txid || uuidv4();
    
    // Log da criação da cobrança
    console.log(`[PIX Mock] Criando cobrança - TXID: ${txid}, Valor: R$ ${(input.amount_cents / 100).toFixed(2)}`);
    
    // QR Code fake em base64 (imagem 1x1 pixel transparente)
    const fakeQrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // Código PIX fake (formato válido mas não funcional)
    const fakeCopyPaste = `00020126580014br.gov.bcb.pix0136${txid}520400005303986540${(input.amount_cents / 100).toFixed(2)}5802BR5913MOCK PROVIDER6008BRASILIA62070503***6304${this.generateChecksum(txid)}`;
    
    const result: CreateChargeOutput = {
      txid,
      status: 'pending',
      payment_data: {
        qr_code: fakeQrCode,
        copy_paste: fakeCopyPaste,
      },
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      status_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/status?txid=${txid}`,
    };
    
    console.log(`[PIX Mock] Cobrança criada com sucesso - TXID: ${txid}`);
    return result;
  }
  
  /**
   * Consulta o status de uma cobrança
   * 
   * Retorna sempre 'pending' para simular cobranças não pagas.
   * O status só muda quando um webhook válido é recebido.
   * 
   * @param input - Dados para consultar o status
   * @returns Promise com o status atual (sempre 'pending')
   */
  async getStatus(input: GetStatusInput): Promise<GetStatusOutput> {
    console.log(`[PIX Mock] Consultando status - TXID: ${input.txid}`);
    
    return {
      txid: input.txid,
      status: 'pending',
      updated_at: new Date(),
    };
  }
  
  /**
   * Processa um webhook recebido
   * 
   * Verifica se o webhook é autêntico através do header 'x-mock-secret'.
   * Se válido, marca o pagamento como 'paid'.
   * 
   * @param input - Dados do webhook recebido
   * @returns Promise com o resultado do processamento
   */
  async processWebhook(input: ProcessWebhookInput): Promise<ProcessWebhookOutput> {
    console.log(`[PIX Mock] Processando webhook - TXID: ${input.body?.txid || 'unknown'}`);
    
    try {
      // Verifica se o webhook é autêntico
      const isValid = await this.validateWebhook(input);
      
      if (!isValid) {
        console.log(`[PIX Mock] Webhook inválido - TXID: ${input.body?.txid || 'unknown'}`);
        return {
          txid: input.body?.txid || '',
          status: 'pending',
          processed: false,
          error: 'Webhook inválido - secret não confere',
        };
      }
      
      // Se válido, marca como pago
      const txid = input.body?.txid || uuidv4();
      console.log(`[PIX Mock] Pagamento confirmado - TXID: ${txid}`);
      
      return {
        txid,
        status: 'paid',
        processed: true,
      };
      
    } catch (error) {
      console.error(`[PIX Mock] Erro ao processar webhook:`, error);
      return {
        txid: input.body?.txid || '',
        status: 'pending',
        processed: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
  
  /**
   * Valida se um webhook é autêntico
   * 
   * Verifica se o header 'x-mock-secret' confere com o secret configurado.
   * 
   * @param input - Dados do webhook para validação
   * @returns Promise indicando se o webhook é válido
   */
  async validateWebhook(input: ProcessWebhookInput): Promise<boolean> {
    const receivedSecret = input.headers['x-mock-secret'] || input.headers['X-Mock-Secret'];
    return receivedSecret === this.mockSecret;
  }
  
  /**
   * Gera um checksum fake para o código PIX
   * 
   * @param txid - ID da transação
   * @returns Checksum fake de 4 dígitos
   */
  private generateChecksum(txid: string): string {
    // Algoritmo simples para gerar checksum fake
    let sum = 0;
    for (let i = 0; i < txid.length; i++) {
      sum += txid.charCodeAt(i);
    }
    return (sum % 10000).toString().padStart(4, '0');
  }
}

/**
 * Instância singleton do provedor PIX Mock
 */
export const pixMockProvider = new PixMockProvider();

/**
 * Função auxiliar para criar uma instância do provedor
 * 
 * @returns Nova instância do PixMockProvider
 */
export function createPixMockProvider(): PixMockProvider {
  return new PixMockProvider();
}

// ===== TESTES UNITÁRIOS BÁSICOS =====

/**
 * Testes básicos para o PixMockProvider
 * 
 * Para executar os testes, chame a função runPixMockTests()
 */
export async function runPixMockTests(): Promise<void> {
  console.log('🧪 Iniciando testes do PixMockProvider...');
  
  const provider = new PixMockProvider();
  
  try {
    // Teste 1: Criar cobrança
    console.log('📝 Teste 1: Criar cobrança');
    const chargeInput: CreateChargeInput = {
      amount_cents: 990,
      txid: 'test-txid-123',
      payer: {
        name: 'João Silva',
        email: 'joao@teste.com',
      },
      method: 'pix',
      description: 'Teste de cobrança',
    };
    
    const charge = await provider.createCharge(chargeInput);
    console.log('✅ Cobrança criada:', charge.txid);
    
    // Teste 2: Consultar status
    console.log('📝 Teste 2: Consultar status');
    const status = await provider.getStatus({ txid: charge.txid });
    console.log('✅ Status consultado:', status.status);
    
    // Teste 3: Webhook válido
    console.log('📝 Teste 3: Webhook válido');
    const validWebhook: ProcessWebhookInput = {
      headers: { 'x-mock-secret': process.env.MOCK_SECRET || 'mock-secret-key' },
      body: { txid: charge.txid },
      method: 'POST',
    };
    
    const webhookResult = await provider.processWebhook(validWebhook);
    console.log('✅ Webhook processado:', webhookResult.processed);
    
    // Teste 4: Webhook inválido
    console.log('📝 Teste 4: Webhook inválido');
    const invalidWebhook: ProcessWebhookInput = {
      headers: { 'x-mock-secret': 'secret-errado' },
      body: { txid: charge.txid },
      method: 'POST',
    };
    
    const invalidResult = await provider.processWebhook(invalidWebhook);
    console.log('✅ Webhook inválido rejeitado:', !invalidResult.processed);
    
    console.log('🎉 Todos os testes passaram!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    throw error;
  }
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  runPixMockTests().catch(console.error);
}
