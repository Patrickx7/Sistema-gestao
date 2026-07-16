# 📦 Sistema de Gestão de Estoque

Projeto de estudos em dupla: **front-end** (HTML, CSS, JS) + **back-end** (Node.js).

## Estrutura

```
sistema-gestao/
├── backend/            → API em Node.js + Express + SQLite
│   ├── server.js       → ponto de entrada do servidor
│   ├── db.js           → conexão e criação das tabelas
│   └── routes/
│       └── produtos.js → rotas do CRUD de produtos
├── frontend/           → telas em HTML, CSS e JavaScript puro
│   ├── index.html
│   ├── style.css
│   └── app.js          → chamadas fetch() para a API
├── TAREFAS.md          → roteiro das semanas 1, 2 e 3
└── README.md
```

## Como rodar

### 1. Back-end (precisa do Node.js instalado)

```bash
cd backend
npm install       # instala as dependências (só na primeira vez)
npm run dev       # inicia o servidor com reinício automático
```

O servidor sobe em **http://localhost:3000**.
Teste no navegador: http://localhost:3000/produtos

O banco de dados é o arquivo `estoque.db`, criado automaticamente
na primeira execução dentro da pasta `backend/`.

### 2. Front-end

Basta abrir o arquivo `frontend/index.html` no navegador
(duplo clique ou botão direito → abrir com o navegador).

Dica melhor: no VS Code, instale a extensão **Live Server** e clique
em "Go Live" — a página recarrega sozinha quando você salva.

⚠️ O back-end precisa estar rodando para o front funcionar!

## Rotas da API (o "contrato" entre front e back)

| Método | Rota            | O que faz                    |
|--------|-----------------|------------------------------|
| GET    | /produtos       | Lista todos os produtos      |
| GET    | /produtos/:id   | Busca um produto pelo id     |
| POST   | /produtos       | Cria um produto novo         |
| PUT    | /produtos/:id   | Atualiza um produto          |
| DELETE | /produtos/:id   | Exclui um produto            |

Formato do JSON enviado no POST/PUT:

```json
{
  "nome": "Teclado mecânico",
  "descricao": "Switch azul, ABNT2",
  "preco": 199.90,
  "quantidade": 15
}
```

## Próximos passos

Sigam o arquivo **TAREFAS.md** — ele tem o roteiro completo das
semanas 1, 2 e 3, com tarefas separadas por papel (back/front)
e desafios extras.
