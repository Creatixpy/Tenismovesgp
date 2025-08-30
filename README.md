# TenisMoveSGP - E-commerce de Tênis

Uma loja online moderna e responsiva para venda de tênis premium, construída com Next.js 15, TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização utilitária
- **Supabase** - Backend como serviço (Database, Auth, Storage)
- **React 19** - Biblioteca para interfaces
- **Lucide React** - Ícones modernos

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

## 🛠️ Configuração

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd tenismaniasgp
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### a. Crie um novo projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação

#### b. Execute o schema do banco de dados
1. No painel do Supabase, vá para **"SQL Editor"**
2. **IMPORTANTE**: Use o arquivo `supabase-schema-limpo.sql` (não o arquivo original)
3. Copie e execute o conteúdo do arquivo `supabase-schema-limpo.sql`
4. Verifique se todas as tabelas foram criadas corretamente na aba **"Table Editor"**

#### c. Configure as variáveis de ambiente
1. Copie o arquivo `.env.local.example` para `.env.local`
2. Preencha com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### 4. Execute o projeto
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
tenismaniasgp/
├── app/                    # Páginas Next.js (App Router)
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.tsx      # Cabeçalho da aplicação
│   │   ├── Footer.tsx      # Rodapé da aplicação
│   │   └── CarrinhoFlutuante.tsx # Carrinho flutuante
│   ├── produtos/           # Página de produtos
│   ├── sobre/             # Página sobre
│   ├── contato/           # Página de contato
│   └── page.tsx           # Página inicial
├── lib/                    # Utilitários e configurações
│   ├── supabase.ts         # Configuração do Supabase
│   └── hooks.ts            # Hooks customizados
├── public/                 # Arquivos estáticos
└── supabase-schema.sql     # Schema do banco de dados
```

## 🗄️ Schema do Banco de Dados

O projeto utiliza as seguintes tabelas principais:

- **produtos** - Catálogo de produtos
- **categorias** - Categorias dos produtos
- **usuarios** - Dados dos usuários
- **carrinhos** - Carrinhos de compras
- **itens_carrinho** - Itens dos carrinhos
- **pedidos** - Histórico de pedidos
- **itens_pedido** - Itens dos pedidos

## 🎨 Funcionalidades

- ✅ Design responsivo e moderno
- ✅ Catálogo de produtos dinâmico
- ✅ Sistema de carrinho de compras
- ✅ Filtros por categoria
- ✅ Autenticação de usuários
- ✅ Painel administrativo
- ✅ Processamento de pedidos

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia o servidor de produção
npm run lint         # Executa o linter
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras opções
O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: contato@tenismovesgp.com
- WhatsApp: (11) 99999-9999

---

**TenisMoveSGP** - Excelência em tênis premium! 🏆
