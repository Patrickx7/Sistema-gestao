# 🗓️ Roteiro de Tarefas — Gerenciador de Tarefas da Dupla

Dupla: **Back-end (Node.js)** e **Front-end (HTML/CSS/JS)**.
Marquem as caixas conforme forem concluindo: troquem `[ ]` por `[x]`.

A ideia mudou: em vez de estoque, vamos construir um **gerenciador de
tarefas e anotações que nós mesmos vamos usar todo dia** — um quadro
**kanban com cards** (colunas Pendente / Fazendo / Concluída) e tarefas
que podem ser atribuídas de um para o outro.

---

## ✅ Semana 0 — Realinhamento (façam juntos, leva 1 dia)

- [x] Front dar `git pull` para receber o projeto novo
- [x] Apagar o banco antigo `backend/estoque.db` (se existir) — o novo
      banco `tarefas.db` é criado sozinho na primeira execução
- [x] Ler juntos o novo "contrato" da API no `README.md` e o arquivo
      `routes/tarefas.js`, entendendo o que cada rota recebe e devolve
- [x] Combinar os valores fixos: status (`pendente`, `fazendo`,
      `concluida`) e prioridade (`baixa`, `media`, `alta`)

      Valores fixos:
      status:     pendente | fazendo | concluida
      prioridade: baixa | media | alta

---

## ✅ Semana 1 — CRUD de Tarefas (a base já está pronta)

O código desta semana **já está pronto** neste projeto. A missão de vocês é
**rodar, entender linha por linha e modificar**. Só se aprende mexendo!

### Back-end
- [x] Rodar o servidor (`npm install` e depois `npm run dev`) e testar
      todas as 5 rotas no Postman (GET, GET por id, POST, PUT, DELETE)
- [x] Ler `server.js`, `db.js` e `routes/tarefas.js` e escrever com as
      próprias palavras o que cada trecho faz (pode ser em comentários)
- [x] **Desafio:** adicionar o campo `prazo` (data limite) na tarefa
      (alterar a tabela no `db.js` e as rotas POST/PUT)
- [ ] **Desafio:** criar a rota `GET /tarefas?status=pendente` que filtra
      pelo status (pesquisar: `req.query` no Express)

### Front-end
- [x] Abrir o `index.html` no navegador com o servidor rodando e testar
      criar, editar, concluir e excluir tarefas
- [x] Abrir o DevTools (F12) → aba **Network** e observar as requisições
      que o `app.js` faz para a API
- [x] Personalizar o visual: cores, fontes, nome do app da dupla
- [x] **Desafio:** mostrar o campo novo (`prazo`) no formulário e na tabela
- [ ] **Desafio:** botões de filtro acima da tabela (Todas / Pendentes /
      Fazendo / Concluídas) usando a rota nova do back
- [ ] **Desafio:** riscar (line-through) o título das tarefas concluídas

### Juntos (fim da semana)
- [ ] Revisar o código um do outro no GitHub (abrir um Pull Request simples)
- [ ] Anotar as dúvidas que sobraram e pesquisar/estudar juntos

---

## 🗂️ Semana 2 — Vira Kanban! (colunas e cards)

Objetivo: aposentar a tabela. A tela principal passa a ser um **quadro
kanban** com 3 colunas — Pendente, Fazendo e Concluída — e cada tarefa
vira um **card** que anda de coluna em coluna.

O interessante: o back-end quase não muda (o status já existe!). Essa
semana é para o front brilhar — e para os dois entenderem que a MESMA
API pode alimentar telas completamente diferentes.

### Back-end
- [ ] Criar a rota `PATCH /tarefas/:id/status` que muda **só** o status
      (o front vai chamá-la ao mover um card; pesquisar: diferença
      entre PUT e PATCH)
- [ ] Validar o status recebido (reaproveitar `STATUS_VALIDOS`) e
      devolver 404 se a tarefa não existir
- [ ] **Desafio:** adicionar a coluna `ordem` (número) na tabela para o
      card lembrar a posição dentro da coluna — e ordenar por ela no GET
- [ ] **Desafio:** rota `PATCH /tarefas/:id/mover` que recebe
      `{ "status": "fazendo", "ordem": 2 }` de uma vez só

### Front-end
- [ ] Trocar a `<table>` por 3 colunas lado a lado
      (pesquisar: `display: grid` com `grid-template-columns`)
- [ ] Criar o card da tarefa: título, descrição curta e a etiqueta de
      prioridade (as classes `.etiqueta` do CSS já ajudam!)
- [ ] Mostrar o contador de cards no título de cada coluna, ex: "Fazendo (2)"
- [ ] Botões ◀ ▶ no card para mover entre colunas, chamando a rota
      `PATCH /tarefas/:id/status` e recarregando o quadro
- [ ] Clicar no card abre a edição (o formulário que já existe)
- [ ] **Desafio:** arrastar e soltar os cards entre as colunas
      (pesquisar: atributo `draggable` e eventos `dragstart`,
      `dragover` e `drop` do HTML5 — comecem simples!)
- [ ] **Desafio:** colorir a borda esquerda do card pela prioridade
- [ ] **Desafio:** celular em mãos — colunas empilhadas em telas pequenas
      (pesquisar: `@media` query)

### Juntos
- [ ] Testar o fluxo completo: criar card → mover Pendente ▶ Fazendo ▶
      Concluída → conferir no banco (ou no Postman) se o status mudou
- [ ] Combinar: a tabela antiga morre ou vira uma página "lista"?

---

## 👥 Semana 3 — Usuários e atribuição de tarefas

Objetivo: cadastrar os dois usuários (vocês!) e poder dizer **quem é o
responsável** por cada tarefa — "essa é minha, essa é sua".

### Back-end
- [ ] Criar a tabela `usuarios` no `db.js` com os campos:
      `id`, `nome`, `email`, `criado_em`
- [ ] Criar `routes/usuarios.js` com:
      - [ ] `GET /usuarios` → lista os usuários
      - [ ] `POST /usuarios` → cria um usuário (validar nome e e-mail
            obrigatórios; **desafio:** recusar e-mail repetido, status 409)
- [ ] Adicionar a coluna `responsavel_id` na tabela `tarefas`
      ⚠️ A tabela já existe no arquivo `tarefas.db`! Pesquisem
      `ALTER TABLE ADD COLUMN` — ou apaguem o `.db` para recriar do zero
- [ ] No `GET /tarefas`, devolver também o **nome** do responsável
      (pesquisar: `LEFT JOIN` — e por que não `INNER JOIN`? O que
      acontece com tarefas sem responsável?)
- [ ] Aceitar `responsavel_id` no POST e PUT de tarefas
- [ ] Criar `GET /tarefas?responsavel=1` para filtrar por responsável
- [ ] Testar tudo no Postman antes de avisar o front que está pronto

### Front-end
- [ ] Criar uma página `usuarios.html` (com link no menu) para cadastrar
      e listar os usuários
- [ ] No formulário de tarefa: `<select>` "Responsável" preenchido via
      `GET /usuarios` (com a opção "Ninguém ainda")
- [ ] Mostrar o responsável no card (ex: as iniciais do nome num
      circulinho no canto — tipo Trello!)
- [ ] Enquanto o back não termina: usar dados falsos (mock) num array JS
- [ ] **Desafio:** filtro "Minhas tarefas" — um seletor no topo do quadro
      onde cada um escolhe quem é, e as colunas mostram só os seus cards
- [ ] **Desafio:** guardar essa escolha no `localStorage` para o navegador
      lembrar quem você é ao reabrir a página

### Juntos
- [ ] Cadastrar os dois usuários de verdade e dividir tarefas reais
      (podem usar as tarefas DESTE roteiro! 🤯)
- [ ] Testar: criar tarefa para o outro → o outro filtra e encontra

---

## 📝 Semana 4 — Anotações + Dashboard

Objetivo: um bloco de anotações rápidas (ideias, links, lembretes) e uma
tela inicial que resume tudo.

### Back-end
- [ ] Criar a tabela `notas` no `db.js` com os campos:
      `id`, `titulo`, `conteudo`, `usuario_id`, `criado_em`
- [ ] Criar `routes/notas.js` com o CRUD completo (GET, POST, PUT, DELETE)
      — vocês já fizeram isso com tarefas, agora sem olhar a cola!
- [ ] Criar rota `GET /dashboard` que devolve um resumo:
      total de tarefas, quantas pendentes/fazendo/concluídas,
      quantas de prioridade alta ainda não concluídas e total de notas
      (pesquisar: `COUNT(*)` e `GROUP BY`)
- [ ] **Desafio:** rota `GET /notas?busca=ideia` para pesquisar no título
      e no conteúdo (pesquisar: `LIKE` no SQL)

### Front-end
- [ ] Criar a página `notas.html` com as anotações em cartões (não tabela!)
      — cada cartão mostra título, conteúdo e autor
- [ ] Criar uma página `dashboard.html` como tela inicial, mostrando os
      números do resumo em cartões grandes
- [ ] Destacar no dashboard as tarefas de prioridade alta não concluídas
- [ ] **Desafio:** campo de busca na página de notas usando a rota nova
- [ ] **Desafio:** `<textarea>` com contador de caracteres para o conteúdo

### Juntos
- [ ] Passar a usar o sistema DE VERDADE por uma semana: toda tarefa e
      anotação da dupla entra nele
- [ ] Retrospectiva: o que foi fácil, o que foi difícil, o que estudar mais

---

## 🔮 Depois da semana 4 (quando se sentirem prontos)

- Login e cadastro com senha (pesquisar: `bcrypt` para senhas e `JWT`
  para autenticação) — aí o "quem sou eu" vira login de verdade
- Comentários dentro dos cards (conversa entre os dois)
- Colunas personalizadas: a dupla cria as próprias colunas do quadro
  (aí `status` vira uma tabela `colunas` no banco — mudança grande!)
- Migrar o banco de SQLite para PostgreSQL
- Migrar o front-end para React
- Colocar o sistema no ar para usar do celular (pesquisar: Render,
  Railway ou Vercel)

## 💡 Regras de ouro da dupla

1. Commits pequenos e frequentes, com mensagens claras.
2. Travou por mais de 1 hora? Pede ajuda pro parceiro (ou pro Claude 😉).
3. Copiar código de tutorial só vale se explicar depois o que ele faz.
4. Todo fim de semana: 15 minutos de conversa sobre o andamento.
5. A partir da semana 2: o sistema é de vocês — usem ele para gerenciar
   o próprio desenvolvimento dele!
