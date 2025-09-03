// MOCK COMPLETO SEM DEPENDÊNCIAS EXTERNAS
export const prisma = {
  user: {
    create: async (data: any) => ({ 
      id: 'mock-user-id', 
      name: data.data.name, 
      email: data.data.email,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findUnique: async (data: any) => ({ 
      id: 'mock-user-id', 
      name: 'Usuário Mock', 
      email: 'mock@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }),
  },
  payment: {
    create: async (data: any) => ({ 
      id: 'mock-payment-id', 
      txid: data.data.txid,
      amountCents: data.data.amountCents,
      status: 'PENDING',
      provider: data.data.provider,
      userId: data.data.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findUnique: async (data: any) => ({ 
      id: 'mock-payment-id', 
      txid: 'mock-txid',
      status: 'PENDING',
      amountCents: 990,
      provider: 'mock',
      userId: 'mock-user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    }),
  },
};
