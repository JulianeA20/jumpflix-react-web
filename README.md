# 🎬 JumpFlix

> Uma plataforma moderna de streaming para filmes, séries, animes e K-dramas

![JumpFlix Logo](src/assets/logo-jf.png)

## 📖 Sobre o Projeto

JumpFlix é uma aplicação web de streaming desenvolvida com React que oferece uma experiência completa para os amantes de entretenimento audiovisual. A plataforma permite aos usuários descobrir, organizar e acompanhar seus conteúdos favoritos, incluindo filmes, séries, animes e K-dramas.

### ✨ Funcionalidades Principais

- 🔐 **Sistema de Autenticação**: Login/registro seguro com Supabase
- 🎭 **Catálogo Diversificado**: Filmes, séries, animes e K-dramas
- 🔍 **Busca Avançada**: Pesquise por título, gênero ou ano de lançamento
- 👤 **Perfil de Usuário**: Gerencie suas informações e avatar personalizado
- 📱 **Design Responsivo**: Interface adaptável para todos os dispositivos
- ⚡ **Performance Otimizada**: Lazy loading e memoização para melhor experiência
- 🎨 **Interface Moderna**: Design clean com Tailwind CSS
- 📊 **Dashboard Administrativo**: Gerenciamento de conteúdo para administradores

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite** - Build tool e dev server ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para aplicações React
- **Lucide React** - Ícones modernos e customizáveis

### Backend & Database
- **Supabase** - Backend-as-a-Service com PostgreSQL
- **Supabase Auth** - Sistema de autenticação
- **Supabase Storage** - Armazenamento de arquivos

### Ferramentas de Desenvolvimento
- **ESLint** - Linting para JavaScript/React
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📁 Estrutura do Projeto

```
jumpflix-react-web/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/          # Imagens e recursos estáticos
│   ├── components/      # Componentes reutilizáveis
│   │   ├── AddContent.jsx
│   │   ├── EditContent.jsx
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   └── ...
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── Series.jsx
│   │   └── ...
│   ├── services/        # Configurações de API
│   │   ├── supabaseClient.js
│   │   └── database.js
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Ponto de entrada
├── supabase/            # Configurações do Supabase
└── package.json
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/JulianeA20/jumpflix-react-web.git
cd jumpflix-react-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse a aplicação**
Abra seu navegador em `http://localhost:5173`

## 📱 Screenshots

### Página Inicial
<!-- Adicione aqui uma screenshot da página inicial -->
*Captura de tela da página inicial mostrando o catálogo de conteúdos*

### Dashboard de Filmes
<!-- Adicione aqui uma screenshot da página de filmes -->
*Interface de navegação pelos filmes disponíveis*

### Perfil do Usuário
<!-- Adicione aqui uma screenshot do perfil -->
*Página de perfil com opções de personalização*

### Busca e Filtros
<!-- Adicione aqui uma screenshot da funcionalidade de busca -->
*Sistema de busca avançada com filtros*

## 🎯 Funcionalidades Detalhadas

### Para Usuários
- **Navegação Intuitiva**: Browse por categorias (Filmes, Séries, Animes, K-dramas)
- **Busca Inteligente**: Encontre conteúdo por título, gênero ou ano
- **Perfil Personalizado**: Upload de avatar e gerenciamento de informações
- **Interface Responsiva**: Experiência otimizada em desktop e mobile

### Para Administradores
- **Gerenciamento de Conteúdo**: Adicionar, editar e remover títulos
- **Upload de Mídia**: Sistema de upload para pôsteres e trailers
- **Controle de Temporadas**: Gerenciamento de episódios para séries
- **Dashboard Administrativo**: Visão geral e estatísticas

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

**Juliane Almeida** - [@JulianeA20](https://github.com/JulianeA20)

## 🙏 Agradecimentos

- [React](https://reactjs.org/) pela incrível biblioteca
- [Supabase](https://supabase.com/) pelo backend robusto
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Vite](https://vitejs.dev/) pela ferramenta de build
- [Lucide](https://lucide.dev/) pelos ícones elegantes

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/JulianeA20">Juliane Almeida</a>
</p>
