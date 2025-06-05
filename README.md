# 📦 eCatalogos Força de Vendas API 🚀

API para gerenciamento de catálogo de produtos para força de vendas, com funcionalidades de CRUD, filtros e soft delete. Este projeto foi desenvolvido como um desafio para a empresa **e-Catalogos**.

---

## ✨ Funcionalidades Principais

* 📝 **CRUD completo** para produtos e suas variantes/SKUs.
* 🔍 **Filtros avançados** na listagem de produtos.
* 📄 **Paginação** nos resultados.
* 🗑️ **Soft Delete** para produtos.
* ✅ **Validações** de entrada de dados.

---

## 🚀 Começando

Siga estas instruções para configurar e executar o projeto em seu ambiente local.

### ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/) (recomendado versão >= 18)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Um banco de dados configurado. O Prisma ORM (configurado em `prisma/schema.prisma`) suporta:
    * MySQL
    * **MariaDB**
    * PostgreSQL
    * SQLite
    * SQL Server
    * MongoDB
    * CockroachDB

---

### ⚙️ Configuração e Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/henriquerodrigues-dev/ecatalogos-forca-vendas-api.git](https://github.com/henriquerodrigues-dev/ecatalogos-forca-vendas-api.git)
    cd ecatalogos-forca-vendas-api
    ```

2.  **Instale as dependências:**
    O comando abaixo instalará todas as dependências listadas no arquivo `package.json`, incluindo Prisma, Express, class-validator, etc.
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure o arquivo `.env`:**
    Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example`. Atualize com as suas configurações do banco de dados. Exemplo:
    ```env
    DATABASE_URL="mysql://user:password@localhost:3306/dbname"
    PORT=3000
    ```

4.  **Gere o Prisma Client:**
    Este comando gera o cliente Prisma com base no seu schema.
    ```bash
    npm run prisma:generate
    # ou
    yarn prisma:generate
    ```

5.  **Execute as migrations:**
    Este comando aplicará as migrações do Prisma para criar/alterar as tabelas no seu banco de dados.
    ```bash
    npm run prisma:migrate
    # ou
    yarn prisma:migrate
    ```

---

### 🛠️ Comandos Úteis

* **Rodar o projeto em modo desenvolvimento** (com reload automático):
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

* **Buildar o projeto** (compilar TypeScript para JavaScript):
    ```bash
    npm run build
    # ou
    yarn build
    ```

* **Rodar a aplicação compilada:**
    ```bash
    npm start
    # ou
    yarn start
    ```

---

## 🔌 Endpoints da API

A API estará disponível em `http://localhost:3000` (ou a porta que você configurou no `.env`).

Aqui estão os endpoints disponíveis:

| Método   | Rota                    | Descrição                                                 |
| :------- | :---------------------- | :-------------------------------------------------------- |
| `GET`    | `/products`             | Listar produtos com filtros, query params e paginação   |
| `GET`    | `/products/:id`         | Buscar detalhes de um produto                           |
| `POST`   | `/products`             | Criar novo produto e suas variantes/skus                |
| `PUT`    | `/products/:id`         | Atualizar produto (inclusive variantes/skus)            |
| `DELETE` | `/products/:id`         | Soft delete → setar campo `deleted_at` com a data atual   |
| `GET`    | `/products/deleted`     | Listagem de produtos deletados (soft deleted)           |
| `GET`    | `/products/deleted/:id` | Buscar um único produto deletado pelo ID (soft deleted) |

---

## 🧪 Testando a API

Para interagir e testar os endpoints da API, recomendamos o uso de ferramentas como o [Postman](https://www.postman.com/downloads/) ou Insomnia.

📄 **Especificação do Teste/Desafio:**
Você pode encontrar mais detalhes sobre os requisitos e escopo do desafio no seguinte link:
[Desafio eCatalogos Força de Vendas API - Notion](https://plucky-ceramic-4d7.notion.site/)

---

## 📁 Estrutura do Projeto

```bash
├── prisma/
│   └─ schema.prisma            # Modelo do banco e configuração Prisma
├── src/
│   ├── controllers/
│   │   └─ product.controller.ts # Controladores da aplicação (lógica de requisição/resposta)
│   ├── database/
│   │   └─ prismaClient.ts       # Instância Prisma Client
│   ├── middlewares/
│   │   └─ validation.middleware.ts # Middlewares (ex: validação)
│   ├── models/
│   │   └─ productDTO.ts         # DTOs (Data Transfer Objects) para validação
│   ├── routes/
│   │   └─ product.routes.ts     # Definição das rotas da API
│   ├── services/
│   │   └─ product.service.ts    # Lógica de negócios da aplicação
│   ├── utils/
│   │   ├── capitalize.ts       # Funções utilitárias
│   │   └── pagination.ts       #
│   ├── app.ts                  # Configuração do Express app
│   └── server.ts               # Ponto de entrada da aplicação (inicialização do servidor)
├── .env.example                # Exemplo de variáveis ambiente
├── .gitignore                  # Arquivos ignorados pelo git
├── package.json                # Dependências e scripts do projeto
├── package-lock.json           # Lockfile das dependências (npm)
├── tsconfig.json               # Configuração do TypeScript
└── README.md                   # Este arquivo :)
```

## 🙋‍♂️ Autor

Feito por **Henrique Rodrigues**

[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/henriquerodrigues-dev/)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/henriquerodrigues-dev)