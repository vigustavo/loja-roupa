# Loja de Roupas - Script Funcional

Documento mestre com o detalhamento de telas, funcionalidades, regras e integrações para orientar uma IA geradora de código na criação do frontend, backend e banco de dados de um e-commerce especializado em moda.

---

## 1. Requisitos Gerais

- Aplicação web responsiva (desktop e mobile)
- Arquitetura: Frontend + API Backend + Banco de Dados relacional ou NoSQL
- Autenticação via JWT ou sessão, com controle de permissões (Admin x Cliente)
- Logs para ações críticas (login, CRUD, pedidos, pagamentos)
- Integrações externas: gateway de pagamento e serviço de e-mail

---

## 2. Módulo Administrativo

### 2.1 Autenticação

**Telas:** Login Admin, Recuperação de Senha

**Funcionalidades:**
- Login com e-mail e senha (hash seguro)
- Validação de credenciais e bloqueio após tentativas excessivas
- Geração/renovação de token de sessão
- Recuperação de senha via e-mail com token temporário

### 2.2 Dashboard

**Componentes:** Total de vendas, total de pedidos, faturamento mensal, produtos com estoque baixo, gráfico de vendas

**Regras:**
- Consultas em tempo real
- Atualização ao carregar e a cada intervalo configurável

### 2.3 Gestão de Produtos

**Telas:** Listagem, Criar, Editar, Detalhe

| Campo | Observação |
|-------|------------|
| ID | Gerado automaticamente |
| Nome | Obrigatório |
| Descrição | Texto rico |
| Preço / Preço promocional | Validação de moeda |
| Categoria, Marca, Coleção | Referências |
| Status | Ativo ou inativo |

**Variações:** Tamanho, Cor, SKU, Estoque por variação

**Funcionalidades adicionais:** Upload múltiplo de imagens, destaque na vitrine, pesquisa e filtros na listagem

### 2.4 Gestão de Categorias

Campos: Nome, Slug, Status

Ações: Criar, editar, excluir, vincular produtos

### 2.5 Estoque

- Controle por variação
- Registro de entradas e saídas
- Alertas para estoque mínimo
- Bloqueio de estoque negativo

### 2.6 Pedidos

**Telas:** Lista e Detalhe

| Campo | Descrição |
|-------|-----------|
| ID | Código do pedido |
| Cliente | Referência ao usuário |
| Produtos | Itens + variações |
| Valor total | Soma + descontos |
| Status | Aguardando pagamento, Pago, Enviado, Entregue, Cancelado |
| Endereço | Destino da entrega |

### 2.7 Pagamentos

- Integração com gateway (cartão, pix, boleto)
- Confirmação automática e reembolso

### 2.8 Frete

- Cadastro de métodos e faixas de CEP
- Cálculo automático no checkout
- Rastreamento e atualização de status

### 2.9 Clientes

- Listagem com filtros
- Histórico de pedidos
- Bloqueio e desbloqueio

### 2.10 Marketing

- Criação de cupons (percentual ou valor fixo)
- Definição de validade, quantidade e regras de uso (não acumulativo)

### 2.11 Relatórios

- Vendas por período/categoria
- Produtos (estoque, giro)
- Clientes (recorrência, ticket médio)

---

## 3. Módulo Cliente

### 3.1 Autenticação

- Cadastro com confirmação de e-mail
- Login e recuperação de senha

### 3.2 Home

- Banner principal e sliders
- Produtos em destaque e promoções

### 3.3 Listagem de Produtos

- Filtros (preço, tamanho, cor, categoria)
- Ordenação (mais vendidos, preço, novidades)

### 3.4 Página do Produto

- Galeria de imagens
- Preço e preço promocional
- Seleção de variação (tamanho, cor)
- Avaliações e recomendações

### 3.5 Carrinho

- Adicionar/remover itens
- Atualizar quantidades e recalcular totals
- Aplicar cupom válido

### 3.6 Checkout

Etapas: Identificação → Endereço → Frete → Pagamento → Confirmação

### 3.7 Pós-compra

- Acompanhamento de pedido
- Histórico completo
- Solicitação de troca ou devolução

### 3.8 Conta do Cliente

- Editar perfil e senha
- Gerenciar endereços
- Lista de favoritos

---

## 4. Regras de Negócio

- Pedido só pode ser enviado se estiver pago
- Cupom não é acumulativo
- Cancelamento permitido apenas antes do envio

---

## 5. Sugestões Técnicas para a IA

- Criar rotas RESTful para cada módulo (admin e cliente)
- Modelos de dados principais: User, Product, ProductVariant, Category, Order, OrderItem, StockMovement, Coupon
- Utilizar validações robustas de formulário no frontend e backend
- Adicionar testes de unidade e de integração para fluxos críticos
- Preparar seeds iniciais para categorias, produtos e usuários de teste

---

**FIM DO SCRIPT**

---

## 6. Implementação de Referência no Repositório

O diretório `backend/` contém uma API Node.js + Express (TypeScript) com autenticação JWT simplificada, seeds de produtos, categorias, clientes e endpoints REST para:

- `/auth` · login admin/cliente, cadastro e recuperação
- `/products`, `/categories` · CRUD com validação via Zod e controle de estoque por variação
- `/orders`, `/coupons`, `/customers`, `/overview` · fluxos de pedido, marketing e dashboard

Principais scripts:

1. `cd loja/backend`
2. `npm install`
3. `cp .env.example .env` (opcional, use `JWT_SECRET` e `PORT`)
4. `npm run dev` para iniciar na porta 4000

O diretório `frontend/` usa React + Vite + TypeScript com roteamento para clientes e admins, contextos de autenticação/carrinho e UI moderna já conectada à API (`/api`).

Passos:

1. `cd loja/frontend`
2. `npm install`
3. `npm run dev` (porta 5173 com proxy para `http://localhost:4000`)

> Dica: credenciais seeds — Admin `admin@loja.com` / `admin123`, Cliente `cliente@loja.com` / `cliente123`.

## 7. Deploy na Netlify

- O arquivo `netlify.toml` na raiz já informa à Netlify para executar os builds dentro de `frontend/` (`base = "frontend"`), rodar `npm run build` e publicar o conteúdo gerado em `frontend/dist`.
- A regra de redirect (`/* -> /index.html`) resolve as rotas do SPA para que nenhum caminho interno gere 404.
- No painel da Netlify basta conectar o repositório, selecionar a branch `main` e manter os campos em branco (o arquivo de configuração assume os valores corretos automaticamente). Reimplante após cada push que altere frontend ou ativos públicos.
# loja-roupa
