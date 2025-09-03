// Setup para testes
import { config } from 'dotenv';

// Carrega variáveis de ambiente para testes
config({ path: '.env.test' });

// Mock do Prisma para testes
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));
