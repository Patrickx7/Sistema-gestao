# ✅ Gerenciador de Tarefas da Dupla

Projeto de estudos em dupla: **front-end** (HTML, CSS, JS) + **back-end** (Node.js).
Um gerenciador de tarefas e anotações que nós mesmos usamos no dia a dia:
um **quadro kanban com cards** (Pendente / Fazendo / Concluída), com
tarefas que podem ser atribuídas entre os usuários.

> A primeira versão (semana 1) mostra as tarefas numa tabela simples —
> na semana 2 do roteiro ela vira o quadro kanban.

## Estrutura

```
sistema-gestao/
├── backend/            → API em Node.js + Express + SQLite
│   ├── server.js       → ponto de entrada do servidor
│   ├── db.js           → conexão e criação das tabelas
│   └── routes/
│       └── tarefas.js  → rotas do CRUD de tarefas
├── frontend/           → telas em HTML, CSS e JavaScript puro
│   ├── index.html
│   ├── style.css
│   └── app.js          → chamadas fetch() para a API
├── TAREFAS.md          → roteiro das semanas 1 a 4
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
Teste no navegador: http://localhost:3000/tarefas

O banco de dados é o arquivo `tarefas.db`, criado automaticamente
na primeira execução dentro da pasta `backend/`.
(Se ainda existir o `estoque.db` do projeto antigo, pode apagar.)

### 2. Front-end

Basta abrir o arquivo `frontend/index.html` no navegador
(duplo clique ou botão direito → abrir com o navegador).

Dica melhor: no VS Code, instale a extensão **Live Server** e clique
em "Go Live" — a página recarrega sozinha quando você salva.

⚠️ O back-end precisa estar rodando para o front funcionar!

## Rotas da API (o "contrato" entre front e back)

| Método | Rota           | O que faz                    |
|--------|----------------|------------------------------|
| GET    | /tarefas       | Lista todas as tarefas       |
| GET    | /tarefas/:id   | Busca uma tarefa pelo id     |
| POST   | /tarefas       | Cria uma tarefa nova         |
| PUT    | /tarefas/:id   | Atualiza uma tarefa          |
| DELETE | /tarefas/:id   | Exclui uma tarefa            |

Formato do JSON enviado no POST/PUT:

```json
{
  "titulo": "Estudar rotas do Express",
  "descricao": "Ler a documentação e testar no Postman",
  "status": "pendente",
  "prioridade": "alta"
}
```

Valores aceitos:
- `status`: `pendente` | `fazendo` | `concluida`
- `prioridade`: `baixa` | `media` | `alta`

## Próximos passos

Sigam o arquivo **TAREFAS.md** — ele tem o roteiro completo das
semanas 1 a 4, com tarefas separadas por papel (back/front)
e desafios extras: quadro kanban com cards, usuários, atribuição
de tarefas, anotações e dashboard.
