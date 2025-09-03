// Tipos globais da aplicação PIX SaaS Learning

// Tipos de pagamento
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type PixProvider = 'mock' | 'efi' | 'mp';

// Tipos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos de pagamento
export interface Payment {
  id: string;
  txid: string;
  userId: string;
  amountCents: number;
  status: PaymentStatus;
  provider: PixProvider;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Tipos de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos de formulário
export interface PreCadastroForm {
  name: string;
  email: string;
}

// Tipos de PIX
export interface PixCharge {
  copyPastePayload: string;
  key: string;
  amountCents: number;
  txid: string;
}

export interface PixStatus {
  status: 'pending' | 'paid' | 'failed';
}

// Tipos de webhook
export interface WebhookPayload {
  txid: string;
  status: 'paid' | 'failed';
  signature?: string;
}

// Tipos de erro
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Tipos de configuração
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'production' | 'test';
}

// Tipos de cache
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Tipos de logs
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

// Tipos de validação
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Tipos de autenticação
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  permissions: string[];
}

// Tipos de sessão
export interface Session {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

// Tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// Tipos de métricas
export interface Metrics {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  conversionRate: number;
}

// Tipos de relatórios
export interface Report {
  id: string;
  name: string;
  type: 'payment' | 'user' | 'revenue';
  data: any;
  generatedAt: string;
}

// Extensões globais
declare global {
  interface Window {
    __NEXT_DATA__: any;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      PIX_PROVIDER: PixProvider;
      PIX_FIXED_AMOUNT_CENTS: string;
      PIX_KEY: string;
      WEBHOOK_SECRET: string;
    }
  }
}

export {};
