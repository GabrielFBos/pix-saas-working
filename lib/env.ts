import { z } from 'zod';

// Schema de validação para variáveis de ambiente
const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_NAME: z.string().default('PIX SaaS Learning'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // PIX
  PIX_PROVIDER: z.enum(['mock', 'efi', 'mp']).default('mock'),
  PIX_FIXED_AMOUNT_CENTS: z.coerce.number().positive().default(990),
  PIX_KEY: z.string().default('chave-pix-exemplo@dominio.com'),
  WEBHOOK_SECRET: z.string().default('troque-isto-no-ambiente-real'),
  
  // Supabase (opcional durante build)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Database (fallback)
  DATABASE_URL: z.string().optional(),
  
  // Segurança
  JWT_SECRET: z.string().default('troque-isto-em-producao'),
  COOKIE_SECRET: z.string().default('troque-isto-em-producao'),
  
  // Logs
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Performance
  NEXT_TELEMETRY_DISABLED: z.coerce.number().default(1),
  
  // URLs
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

// Validação das variáveis de ambiente com fallback
const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.warn('⚠️ Variáveis de ambiente inválidas:', envParse.error.format());
}

// Exporta as variáveis validadas ou defaults
export const env = envParse.success ? envParse.data : {
  NEXT_PUBLIC_APP_NAME: 'PIX SaaS Learning',
  NODE_ENV: 'development',
  PIX_PROVIDER: 'mock',
  PIX_FIXED_AMOUNT_CENTS: 990,
  PIX_KEY: 'chave-pix-exemplo@dominio.com',
  WEBHOOK_SECRET: 'troque-isto-no-ambiente-real',
  JWT_SECRET: 'troque-isto-em-producao',
  COOKIE_SECRET: 'troque-isto-em-producao',
  LOG_LEVEL: 'info',
  NEXT_TELEMETRY_DISABLED: 1,
} as any;

// Tipos derivados do schema
export type Env = z.infer<typeof envSchema>;
