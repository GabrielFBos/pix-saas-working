/**
 * @fileoverview Interface do Gateway de Pagamentos
 * Define o contrato para integração com provedores de pagamento
 */

import { PaymentMethod, PaymentStatus } from '@/lib/core/entities';

/**
 * Dados de entrada para criar uma cobrança
 * @interface CreateChargeInput
 */
export interface CreateChargeInput {
  /** Valor da cobrança em centavos */
  amount_cents: number;
  
  /** ID único da transação */
  txid: string;
  
  /** Dados do pagador */
  payer: {
    name: string;
    email: string;
  };
  
  /** Método de pagamento */
  method: PaymentMethod;
  
  /** Descrição da cobrança (opcional) */
  description?: string;
}

/**
 * Dados de saída após criar uma cobrança
 * @interface CreateChargeOutput
 */
export interface CreateChargeOutput {
  /** ID único da transação */
  txid: string;
  
  /** Status inicial da cobrança */
  status: PaymentStatus;
  
  /** Dados específicos do método de pagamento */
  payment_data: {
    /** Para PIX: código QR em base64 */
    qr_code?: string;
    
    /** Para PIX: código copia e cola */
    copy_paste?: string;
    
    /** Para cartão: URL de redirecionamento */
    redirect_url?: string;
  };
  
  /** Data de expiração da cobrança */
  expires_at: Date;
  
  /** URL para consultar o status */
  status_url: string;
}

/**
 * Dados de entrada para consultar status de pagamento
 * @interface GetStatusInput
 */
export interface GetStatusInput {
  /** ID único da transação */
  txid: string;
}

/**
 * Dados de saída da consulta de status
 * @interface GetStatusOutput
 */
export interface GetStatusOutput {
  /** ID único da transação */
  txid: string;
  
  /** Status atual do pagamento */
  status: PaymentStatus;
  
  /** Data da última atualização */
  updated_at: Date;
  
  /** Valor pago (se aplicável) */
  paid_amount_cents?: number;
  
  /** Data do pagamento (se aplicável) */
  paid_at?: Date;
}

/**
 * Dados de entrada para processar webhook
 * @interface ProcessWebhookInput
 */
export interface ProcessWebhookInput {
  /** Headers da requisição */
  headers: Record<string, string>;
  
  /** Body da requisição */
  body: any;
  
  /** Método HTTP */
  method: string;
}

/**
 * Dados de saída do processamento de webhook
 * @interface ProcessWebhookOutput
 */
export interface ProcessWebhookOutput {
  /** ID único da transação */
  txid: string;
  
  /** Novo status do pagamento */
  status: PaymentStatus;
  
  /** Indica se o webhook foi processado com sucesso */
  processed: boolean;
  
  /** Mensagem de erro (se houver) */
  error?: string;
}

/**
 * Interface principal do Gateway de Pagamentos
 * 
 * Esta interface define o contrato que todos os provedores de pagamento
 * devem implementar para garantir compatibilidade no sistema.
 * 
 * @interface PaymentGateway
 */
export interface PaymentGateway {
  /**
   * Cria uma nova cobrança no gateway
   * 
   * @param input - Dados necessários para criar a cobrança
   * @returns Promise com os dados da cobrança criada
   * @throws {Error} Se houver erro na criação da cobrança
   */
  createCharge(input: CreateChargeInput): Promise<CreateChargeOutput>;
  
  /**
   * Consulta o status atual de uma cobrança
   * 
   * @param input - Dados para consultar o status
   * @returns Promise com o status atual da cobrança
   * @throws {Error} Se houver erro na consulta
   */
  getStatus(input: GetStatusInput): Promise<GetStatusOutput>;
  
  /**
   * Processa um webhook recebido do gateway
   * 
   * @param input - Dados do webhook recebido
   * @returns Promise com o resultado do processamento
   * @throws {Error} Se houver erro no processamento
   */
  processWebhook(input: ProcessWebhookInput): Promise<ProcessWebhookOutput>;
  
  /**
   * Valida se um webhook é autêntico
   * 
   * @param input - Dados do webhook para validação
   * @returns Promise indicando se o webhook é válido
   */
  validateWebhook(input: ProcessWebhookInput): Promise<boolean>;
}
