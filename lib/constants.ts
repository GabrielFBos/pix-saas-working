// Constantes da aplicação PIX SaaS Learning

// Configurações da aplicação
export const APP_CONFIG = {
  name: 'PIX SaaS Learning',
  version: '1.0.0',
  description: 'Sistema SaaS de aprendizado com integração PIX',
  author: 'Gabriel Fernandes',
  email: 'eng.gabrielfernandesb@gmail.com',
} as const;

// Configurações de pagamento
export const PAYMENT_CONFIG = {
  defaultAmountCents: 990, // R$ 9,90
  currency: 'BRL',
  locale: 'pt-BR',
  providers: ['mock', 'efi', 'mp'] as const,
} as const;

// Configurações de API
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
} as const;

// Configurações de UI
export const UI_CONFIG = {
  theme: {
    primary: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  },
} as const;

// Configurações de segurança
export const SECURITY_CONFIG = {
  jwtExpiry: 3600, // 1 hora
  refreshTokenExpiry: 604800, // 7 dias
  maxLoginAttempts: 5,
  lockoutDuration: 900, // 15 minutos
} as const;

// Configurações de banco de dados
export const DB_CONFIG = {
  maxConnections: 10,
  connectionTimeout: 30000,
  queryTimeout: 10000,
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  validation: {
    required: 'Este campo é obrigatório',
    email: 'E-mail inválido',
    minLength: (min: number) => `Mínimo de ${min} caracteres`,
    maxLength: (max: number) => `Máximo de ${max} caracteres`,
  },
  payment: {
    notFound: 'Pagamento não encontrado',
    alreadyPaid: 'Pagamento já foi realizado',
    expired: 'Pagamento expirado',
    failed: 'Pagamento falhou',
  },
  api: {
    networkError: 'Erro de conexão',
    serverError: 'Erro interno do servidor',
    unauthorized: 'Não autorizado',
    forbidden: 'Acesso negado',
  },
} as const;

// Configurações de logs
export const LOG_CONFIG = {
  levels: ['error', 'warn', 'info', 'debug'] as const,
  defaultLevel: 'info',
  maxFileSize: '10mb',
  maxFiles: 5,
} as const;

// URLs e endpoints
export const ENDPOINTS = {
  api: {
    preCadastro: '/api/pre-cadastro',
    pixStatus: '/api/pix/status',
    pixWebhook: '/api/pix/webhook',
  },
  pages: {
    home: '/',
    preCadastro: '/pre-cadastro',
    pagamento: '/pagamento',
    confirmado: '/confirmado',
  },
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  ttl: {
    short: 60, // 1 minuto
    medium: 300, // 5 minutos
    long: 3600, // 1 hora
  },
  keys: {
    user: 'user',
    payment: 'payment',
    pixStatus: 'pix_status',
  },
} as const;
