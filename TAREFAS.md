# 🗓️ Roteiro de Tarefas — Sistema de Gestão de Estoque

Dupla: **Back-end (Node.js)** e **Front-end (HTML/CSS/JS)**.
Marquem as caixas conforme forem concluindo: troquem `[ ]` por `[x]`.

---

## ✅ Semana 0 — Preparação (façam juntos, leva 1 dia)

- [ ] Criar repositório no GitHub com as pastas `backend/` e `frontend/`
- [ ] Ambos instalarem: Node.js (versão LTS), Git e VS Code
- [ ] Back-end instalar também: Postman ou Insomnia (para testar a API)
- [ ] Fazer o primeiro commit juntos e cada um clonar o repositório
- [ ] Combinar o "contrato" da API: ler juntos o arquivo `routes/produtos.js`
      e entender o que cada rota recebe e devolve

---

## 📦 Semana 1 — CRUD de Produtos (a base deste projeto já pronta)

O código desta semana **já está pronto** neste projeto. A missão de vocês é
**rodar, entender linha por linha e modificar**. Só se aprende mexendo!

### Back-end
- [ ] Rodar o servidor (`npm install` e depois `npm run dev`) e testar
      todas as 5 rotas no Postman (GET, GET por id, POST, PUT, DELETE)
- [ ] Ler `server.js`, `db.js` e `routes/produtos.js` e escrever com as
      próprias palavras o que cada trecho faz (pode ser em comentários)
- [ ] **Desafio:** adicionar um campo novo ao produto, ex: `categoria`
      (alterar a tabela no `db.js` e as rotas POST/PUT)
- [ ] **Desafio:** criar validação que impede `preco` ou `quantidade` negativos
      (devolver status 400 com mensagem de erro)

### Front-end
- [ ] Abrir o `index.html` no navegador com o servidor rodando e testar
      cadastrar, editar e excluir produtos
- [ ] Abrir o DevTools (F12) → aba **Network** e observar as requisições
      que o `app.js` faz para a API
- [ ] Personalizar o visual: cores, fontes, logo do "sistema" de vocês
- [ ] **Desafio:** mostrar o campo novo (`categoria`) no formulário e na tabela
- [ ] **Desafio:** destacar em vermelho as linhas com quantidade igual a 0

### Juntos (fim da semana)
- [ ] Revisar o código um do outro no GitHub (abrir um Pull Request simples)
- [ ] Anotar as dúvidas que sobraram e pesquisar/estudar juntos

---

## 🔄 Semana 2 — Movimentação de Estoque (entradas e saídas)

Objetivo: registrar cada entrada e saída de produto, com histórico.
Regra de negócio: a `quantidade` do produto deve ser atualizada
automaticamente a cada movimentação.

### Back-end
- [ ] Criar a tabela `movimentacoes` no `db.js` com os campos:
      `id`, `produto_id`, `tipo` ('entrada' ou 'saida'), `quantidade`, `data`
- [ ] Criar `routes/movimentacoes.js` com:
      - [ ] `POST /movimentacoes` → registra a movimentação **e** atualiza
            a quantidade do produto
      - [ ] `GET /movimentacoes` → lista o histórico (dica: pesquisar
            `INNER JOIN` para trazer o nome do produto junto)
- [ ] Validar: não permitir saída maior que o estoque atual (status 400)
- [ ] Testar tudo no Postman antes de avisar o front que está pronto

### Front-end
- [ ] Criar uma página nova `movimentacoes.html` (com link no menu)
- [ ] Formulário com: seletor de produto (`<select>` preenchido via
      `GET /produtos`), tipo (entrada/saída) e quantidade
- [ ] Tabela com o histórico de movimentações (data, produto, tipo, qtd)
- [ ] Enquanto o back não termina: usar dados falsos (mock) num array JS
- [ ] **Desafio:** filtro para ver só entradas ou só saídas

### Juntos
- [ ] Testar o fluxo completo: cadastrar produto → dar entrada → dar saída
      → conferir se a quantidade bateu
- [ ] Testar o erro: tentar tirar mais do que tem no estoque

---

## 🚨 Semana 3 — Alertas de Estoque Baixo + Dashboard simples

Objetivo: o sistema avisa quando um produto está acabando.

### Back-end
- [ ] Adicionar o campo `estoque_minimo` na tabela de produtos
- [ ] Criar rota `GET /produtos/alertas` → devolve só os produtos com
      `quantidade <= estoque_minimo`
      ⚠️ Atenção: essa rota precisa vir **antes** de `GET /produtos/:id`
      no arquivo de rotas (pesquisem por quê — tem a ver com a ordem
      em que o Express testa as rotas!)
- [ ] Criar rota `GET /dashboard` que devolve um resumo:
      total de produtos, valor total do estoque (preço × quantidade)
      e quantos produtos estão em alerta
- [ ] **Desafio:** rota `GET /produtos?busca=teclado` para pesquisar por nome

### Front-end
- [ ] Adicionar o campo "estoque mínimo" no formulário de produto
- [ ] Criar uma página `dashboard.html` como tela inicial, mostrando os
      números do resumo em cartões grandes
- [ ] Listar os produtos em alerta com destaque visual (ex: fundo amarelo)
- [ ] **Desafio:** campo de busca na tabela de produtos usando a rota nova
- [ ] **Desafio:** badge/contador de alertas no menu (ex: "Alertas (3)")

### Juntos
- [ ] Demo final: apresentar o sistema um para o outro (ou para amigos!)
- [ ] Retrospectiva: o que foi fácil, o que foi difícil, o que estudar mais

---

## 🔮 Depois da semana 3 (quando se sentirem prontos)

- Login e cadastro de usuários (pesquisar: `bcrypt` para senhas e `JWT`
  para autenticação)
- Módulo de tarefas e agenda
- Migrar o banco de SQLite para PostgreSQL
- Migrar o front-end para React
- Colocar o sistema no ar (pesquisar: Render, Railway ou Vercel)

## 💡 Regras de ouro da dupla

1. Commits pequenos e frequentes, com mensagens claras.
2. Travou por mais de 1 hora? Pede ajuda pro parceiro (ou pro Claude 😉).
3. Copiar código de tutorial só vale se explicar depois o que ele faz.
4. Todo fim de semana: 15 minutos de conversa sobre o andamento.
