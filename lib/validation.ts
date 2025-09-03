import { z } from 'zod';

// Schema para formulário de pré-cadastro
export const preCadastroSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

// Schema para resposta de pré-cadastro
export const preCadastroResponseSchema = z.object({
  txid: z.string().uuid(),
});

// Schema para consulta de status
export const statusQuerySchema = z.object({
  txid: z.string().uuid(),
});

// Schema para resposta de status
export const statusResponseSchema = z.object({
  status: z.enum(['pending', 'paid', 'failed']),
});

// Schema para webhook PIX
export const webhookSchema = z.object({
  txid: z.string().uuid(),
  status: z.enum(['paid', 'failed']),
  signature: z.string().optional(),
});

// Schema para criação de cobrança PIX
export const createChargeSchema = z.object({
  amountCents: z.number().positive(),
  txid: z.string().uuid(),
  payer: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
});

// Schema para resposta de criação de cobrança
export const createChargeResponseSchema = z.object({
  copyPastePayload: z.string(),
  key: z.string(),
  amountCents: z.number(),
  txid: z.string(),
});

// Tipos TypeScript derivados dos schemas
export type PreCadastroForm = z.infer<typeof preCadastroSchema>;
export type PreCadastroResponse = z.infer<typeof preCadastroResponseSchema>;
export type StatusQuery = z.infer<typeof statusQuerySchema>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export type WebhookPayload = z.infer<typeof webhookSchema>;
export type CreateChargeRequest = z.infer<typeof createChargeSchema>;
export type CreateChargeResponse = z.infer<typeof createChargeResponseSchema>;
