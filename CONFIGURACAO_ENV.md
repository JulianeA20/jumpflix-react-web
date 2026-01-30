# 🔐 Guia de Configuração de Variáveis de Ambiente - Jumpflix

Este documento explica como gerenciar credenciais do Supabase de forma segura no projeto.

## 📁 Estrutura de Arquivos .env

O projeto possui **duas camadas** de variáveis de ambiente:

### 1. **Frontend (React/Vite)** - `.env` na raiz do projeto
```bash
VITE_SUPABASE_URL=https://xvascbatpefpgjsqedol.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_hwZbWutczuqOOV2Kwf-4rg_9Zdllqxt
```

- ✅ **Prefixo obrigatório:** `VITE_` para que o Vite exponha as variáveis no cliente
- ✅ **Uso:** Acessar via `import.meta.env.VITE_SUPABASE_URL` no código React
- ✅ **Arquivo:** `c:\Users\julia\OneDrive\Documentos\desenvolvimento_2\jumpflix-react-web\jumpflix-react-web\.env`

### 2. **Backend (Supabase Functions)** - `.env` na pasta `supabase/functions/`
```bash
SUPABASE_URL=https://xvascbatpefpgjsqedol.supabase.co
SUPABASE_ANON_KEY=sb_publishable_hwZbWutczuqOOV2Kwf-4rg_9Zdllqxt
EMAIL_USER=jumpflixapp@gmail.com
EMAIL_PASS=juli22jac
```

- ✅ **Sem prefixo:** Variáveis usadas apenas no backend Deno
- ✅ **Uso:** Acessar via `Deno.env.get("SUPABASE_URL")` nas functions
- ✅ **Arquivo:** `c:\Users\julia\OneDrive\Documentos\desenvolvimento_2\jumpflix-react-web\jumpflix-react-web\supabase\functions\.env`

## 🛠️ Como Usar nos Diferentes Contextos

### No Frontend (React Components)
```javascript
import { supabase } from './services/supabaseClient';

// O supabaseClient já está configurado com as variáveis de ambiente
const { data, error } = await supabase.from('users').select('*');
```

### Nas Supabase Functions (Backend)
```typescript
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const emailUser = Deno.env.get('EMAIL_USER') ?? '';
```

## 🔒 Segurança

### ✅ **O que está protegido:**
- `.env` está no `.gitignore` (não vai para o Git)
- Credenciais sensíveis estão apenas localmente
- `.env.example` serve como template (sem valores reais)

### ⚠️ **Importante:**
- **NUNCA** commite o arquivo `.env` com credenciais reais
- Compartilhe o `.env.example` para outros desenvolvedores
- Para produção, configure as variáveis no painel do Supabase

## 🚀 Configuração Inicial

1. **Clone o repositório**
2. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```
3. **Preencha com suas credenciais do Supabase**
4. **Para Supabase Functions:**
   ```bash
   cp supabase/functions/.env.example supabase/functions/.env
   ```

## 🔗 Onde Encontrar as Credenciais

Acesse o painel do Supabase: https://app.supabase.com/project/xvascbatpefpgjsqedol/settings/api

- **URL do Projeto:** Settings → API → Project URL
- **Anon Key:** Settings → API → Project API keys → anon/public

## 🗂️ Resumo de Arquivos

| Arquivo | Localização | Commitado? | Propósito |
|---------|-------------|------------|-----------|
| `.env` | Raiz do projeto | ❌ Não | Credenciais frontend (local) |
| `.env.example` | Raiz do projeto | ✅ Sim | Template frontend |
| `supabase/functions/.env` | Pasta functions | ❌ Não | Credenciais backend (local) |
| `supabase/functions/.env.example` | Pasta functions | ✅ Sim | Template backend |

---

**✨ Configuração concluída!** Agora suas credenciais estão seguras e organizadas.
