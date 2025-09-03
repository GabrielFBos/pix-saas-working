import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockPixGateway } from '@/lib/pix/MockPixGateway';
import { NextRequest } from 'next/server';

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    payment: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock das variáveis de ambiente
vi.mock('@/lib/env', () => ({
  env: {
    PIX_KEY: 'test-pix-key@example.com',
    WEBHOOK_SECRET: 'test-secret',
  },
}));

describe('MockPixGateway', () => {
  let gateway: MockPixGateway;

  beforeEach(() => {
    gateway = new MockPixGateway();
    vi.clearAllMocks();
  });

  describe('createCharge', () => {
    it('deve criar uma cobrança com payload PIX válido', async () => {
      const data = {
        amountCents: 990,
        txid: '123e4567-e89b-12d3-a456-426614174000',
        payer: {
          name: 'João Silva',
          email: 'joao@example.com',
        },
      };

      const result = await gateway.createCharge(data);

      expect(result).toEqual({
        copyPastePayload: expect.stringContaining('00020126'),
        key: 'test-pix-key@example.com',
        amountCents: 990,
        txid: '123e4567-e89b-12d3-a456-426614174000',
      });

      expect(result.copyPastePayload).toMatch(/^00020126/);
    });
  });

  describe('verifyPayment', () => {
    it('deve retornar status do pagamento', async () => {
      const mockPayment = {
        id: '1',
        txid: '123e4567-e89b-12d3-a456-426614174000',
        status: 'PAID',
        amountCents: 990,
        userId: 'user-1',
        provider: 'mock',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.payment.findUnique).mockResolvedValue(mockPayment as any);

      const result = await gateway.verifyPayment('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual({ status: 'paid' });
      expect(prisma.payment.findUnique).toHaveBeenCalledWith({
        where: { txid: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('deve lançar erro quando pagamento não encontrado', async () => {
      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.payment.findUnique).mockResolvedValue(null);

      await expect(
        gateway.verifyPayment('invalid-txid')
      ).rejects.toThrow('Pagamento não encontrado');
    });
  });

  describe('handleWebhook', () => {
    it('deve processar webhook com assinatura válida', async () => {
      const mockBody = {
        txid: '123e4567-e89b-12d3-a456-426614174000',
        status: 'paid',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(mockBody),
        headers: {
          get: vi.fn().mockReturnValue('test-secret'),
        },
      } as unknown as NextRequest;

      const { prisma } = await import('@/lib/prisma');
      vi.mocked(prisma.payment.update).mockResolvedValue({} as any);

      const result = await gateway.handleWebhook(mockRequest);

      expect(result).toEqual({
        txid: '123e4567-e89b-12d3-a456-426614174000',
        status: 'paid',
      });

      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { txid: '123e4567-e89b-12d3-a456-426614174000' },
        data: {
          status: 'PAID',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('deve rejeitar webhook com assinatura inválida', async () => {
      const mockBody = {
        txid: '123e4567-e89b-12d3-a456-426614174000',
        status: 'paid',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(mockBody),
        headers: {
          get: vi.fn().mockReturnValue('invalid-secret'),
        },
      } as unknown as NextRequest;

      await expect(
        gateway.handleWebhook(mockRequest)
      ).rejects.toThrow('Assinatura inválida');
    });

    it('deve rejeitar webhook com payload inválido', async () => {
      const mockBody = {
        txid: '123e4567-e89b-12d3-a456-426614174000',
        // status ausente
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(mockBody),
        headers: {
          get: vi.fn().mockReturnValue('test-secret'),
        },
      } as unknown as NextRequest;

      await expect(
        gateway.handleWebhook(mockRequest)
      ).rejects.toThrow('Payload inválido');
    });
  });
});
