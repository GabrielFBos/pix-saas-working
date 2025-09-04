/**
 * @fileoverview Entidades principais do sistema PIX SaaS Learning
 * Define os tipos fundamentais para Leads e Pagamentos
 */

/**
 * Métodos de pagamento disponíveis no sistema
 */
export type PaymentMethod = 'pix' | 'card';

/**
 * Status possíveis para um pagamento
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

/**
 * Entidade Lead - representa um usuário interessado no produto
 * @interface Lead
 */
export interface Lead {
  /** Identificador único do lead */
  id: string;
  
  /** Nome completo do lead */
  name: string;
  
  /** E-mail do lead (deve ser único) */
  email: string;
  
  /** Data de criação do lead */
  created_at: Date;
}

/**
 * Entidade Payment - representa um pagamento no sistema
 * @interface Payment
 */
export interface Payment {
  /** Identificador único do pagamento */
  id: string;
  
  /** ID do lead associado ao pagamento */
  lead_id: string;
  
  /** Valor do pagamento em centavos (ex: 990 = R$ 9,90) */
  amount_cents: number;
  
  /** Método de pagamento utilizado */
  method: PaymentMethod;
  
  /** ID da transação no gateway de pagamento */
  txid: string;
  
  /** Status atual do pagamento */
  status: PaymentStatus;
  
  /** Data de criação do pagamento */
  created_at: Date;
  
  /** Data da última atualização do pagamento */
  updated_at: Date;
}

/**
 * Dados necessários para criar um novo lead
 */
export interface CreateLeadInput {
  name: string;
  email: string;
}

/**
 * Dados necessários para criar um novo pagamento
 */
export interface CreatePaymentInput {
  lead_id: string;
  amount_cents: number;
  method: PaymentMethod;
  txid: string;
}
