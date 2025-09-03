# Supabase Configuration - PIX SaaS Learning

Este diretório contém toda a configuração do Supabase para o projeto PIX SaaS Learning.

## 📁 Estrutura

```
supabase/
├── config.toml          # Configuração principal do Supabase
├── migrations/          # Migrações do banco de dados
│   └── 001_initial_schema.sql
└── README.md           # Este arquivo
```

## 🚀 Configuração Inicial

### 1. Instalar Supabase CLI
```bash
npm install -g supabase
```

### 2. Login no Supabase
```bash
supabase login
```

### 3. Inicializar projeto (se necessário)
```bash
supabase init
```

### 4. Conectar ao projeto remoto
```bash
supabase link --project-ref SEU_PROJECT_REF
```

## 📊 Banco de Dados

### Tabelas

#### `users`
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `payments`
- `id` (UUID, Primary Key)
- `txid` (VARCHAR, Unique)
- `user_id` (UUID, Foreign Key)
- `amount_cents` (INTEGER)
- `status` (ENUM: PENDING, PAID, FAILED)
- `provider` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Índices
- `idx_users_email` - Performance em consultas por email
- `idx_payments_txid` - Performance em consultas por TXID
- `idx_payments_user_id` - Performance em consultas por usuário
- `idx_payments_status` - Performance em consultas por status
- `idx_payments_created_at` - Performance em consultas por data

## 🔒 Segurança

### Row Level Security (RLS)
- Habilitado em todas as tabelas
- Políticas configuradas para permitir operações básicas
- Autenticação via JWT

### Políticas
- **Users**: Leitura e inserção permitidas
- **Payments**: Leitura, inserção e atualização permitidas

## 🛠️ Comandos Úteis

### Desenvolvimento Local
```bash
# Iniciar Supabase local
npm run supabase:start

# Parar Supabase local
npm run supabase:stop

# Status do Supabase
npm run supabase:status
```

### Banco de Dados
```bash
# Reset do banco local
npm run supabase:db:reset

# Aplicar migrações
npm run supabase:db:push

# Gerar tipos TypeScript
npm run supabase:gen:types
```

### Produção
```bash
# Deploy de migrações para produção
supabase db push --db-url "sua-url-do-supabase"

# Gerar tipos da produção
supabase gen types typescript --project-id SEU_PROJECT_ID > types/supabase.ts
```

## 🔧 Variáveis de Ambiente

### Desenvolvimento Local
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-local
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-local
```

### Produção
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-producao
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-producao
```

## 📈 Monitoramento

### Logs
- Acesse o dashboard do Supabase para ver logs em tempo real
- Configure alertas para erros críticos

### Performance
- Monitore queries lentas no dashboard
- Use índices adequados para otimizar performance

## 🔄 Migrações

### Criar Nova Migração
```bash
supabase migration new nome_da_migracao
```

### Aplicar Migrações
```bash
# Local
supabase db reset

# Produção
supabase db push
```

## 🧪 Testes

### Testes de Banco
```bash
# Testar conexão
npm run supabase:status

# Testar queries
# Use o SQL Editor no dashboard do Supabase
```

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Migrations](https://supabase.com/docs/guides/cli/migrations)

## 👨‍💻 Autor

Gabriel Fernandes - eng.gabrielfernandesb@gmail.com
