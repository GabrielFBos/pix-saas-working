# 🚀 Guia de Deploy - PIX SaaS Learning

## 📋 Pré-requisitos
- ✅ Conta no Vercel (https://vercel.com)
- ✅ Conta no Supabase (já configurada)
- ✅ Repositório no GitHub (já configurado)

## 🔧 Passo a Passo - Deploy no Vercel

### 1. Acesse o Vercel
- Vá para: https://vercel.com
- Faça login com sua conta GitHub

### 2. Importe o Projeto
- Clique em **"New Project"**
- Na seção **"Import Git Repository"**, procure por **`GabrielFBos/PayCode`**
- Clique em **"Import"**

### 3. Configure o Projeto
- **Project Name**: `paycode-pix-saas` (ou deixe o padrão)
- **Framework Preset**: Next.js (deve ser detectado automaticamente)
- **Root Directory**: `./` (deixe vazio)

### 4. Configure as Variáveis de Ambiente
Na seção **"Environment Variables"**, adicione as seguintes variáveis:

#### Variáveis Obrigatórias:
```env
NEXT_PUBLIC_SUPABASE_URL=https://osxwzaeyxzutgvechdgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeHd6YWV5eHp1dGd2ZWNoZGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTMzNTMsImV4cCI6MjA3MTQ2OTM1M30.cspFCyW4mWMFbWmZcaVm3WSgEx7p0NWasOuRMenltQM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zeHd6YWV5eHp1dGd2ZWNoZGduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg5MzM1MywiZXhwIjoyMDcxNDY5MzUzfQ.5l746oBltqxCgOuoq4JDepgLnZeJKEejbOJxB3Rxefc
```

#### Variáveis do PIX:
```env
PIX_PROVIDER=mock
PIX_FIXED_AMOUNT_CENTS=990
PIX_KEY=chave-pix-exemplo@dominio.com
WEBHOOK_SECRET=seu-secret-aqui
```

#### Variáveis da Aplicação:
```env
NEXT_PUBLIC_APP_NAME=PIX SaaS Learning
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 5. Deploy
- Clique em **"Deploy"**
- Aguarde o build (pode levar 2-3 minutos)

### 6. Verificação
Após o deploy, você verá:
- ✅ **Build Status**: Success
- ✅ **URL do projeto**: `https://paycode-pix-saas.vercel.app` (ou similar)
- ✅ **Domínio personalizado**: opcional

## 🔗 URLs Importantes

### Produção:
- **Aplicação**: `https://paycode-pix-saas.vercel.app`
- **Supabase**: https://supabase.com/dashboard/project/osxwzaeyxzutgvechdgn

### APIs:
- **Pré-cadastro**: `https://paycode-pix-saas.vercel.app/api/pre-cadastro`
- **Status PIX**: `https://paycode-pix-saas.vercel.app/api/pix/status`
- **Webhook PIX**: `https://paycode-pix-saas.vercel.app/api/pix/webhook`

## 🧪 Teste da Aplicação

### 1. Acesse a URL do projeto
### 2. Teste o fluxo completo:
- ✅ Página inicial → `/pre-cadastro`
- ✅ Formulário de cadastro
- ✅ Página de pagamento PIX
- ✅ QR Code e dados PIX
- ✅ Polling de status
- ✅ Página de confirmação

## 🔧 Configurações Adicionais (Opcional)

### Domínio Personalizado:
- Vá em **Settings > Domains**
- Adicione seu domínio personalizado

### Variáveis de Ambiente Adicionais:
- Vá em **Settings > Environment Variables**
- Adicione/edite variáveis conforme necessário

## 📊 Monitoramento

### Vercel Analytics:
- Acesse **Analytics** no dashboard
- Monitore performance e erros

### Supabase Dashboard:
- Monitore queries e performance
- Verifique logs de erro

## 🆘 Troubleshooting

### Erro de Build:
- Verifique se todas as variáveis estão configuradas
- Consulte os logs de build no Vercel

### Erro de Conexão com Supabase:
- Verifique as credenciais do Supabase
- Confirme se as tabelas foram criadas

### Erro de API:
- Verifique os logs no Vercel Functions
- Teste as APIs individualmente

## 🎉 Sucesso!

Após o deploy bem-sucedido, você terá:
- ✅ **Aplicação online** e funcionando
- ✅ **PWA instalável** no mobile
- ✅ **Interface responsiva**
- ✅ **Sistema PIX** com mock
- ✅ **Banco de dados** PostgreSQL
- ✅ **Deploy automático** a cada push

---

**Autor**: Gabriel Fernandes  
**Email**: eng.gabrielfernandesb@gmail.com  
**Data**: 2024
