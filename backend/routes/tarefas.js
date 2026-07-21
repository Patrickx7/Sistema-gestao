// ============================================================
// routes/tarefas.js  ->  O GARÇOM ESPECIALISTA em tarefas 🧑‍🍳
// ============================================================
// A recepção (server.js) encaminha para cá todo pedido "/tarefas".
// Aqui é onde o trabalho de verdade acontece. São 5 ações (CRUD):
//   GET    /tarefas      -> lista TODAS as tarefas
//   GET    /tarefas/:id  -> busca UMA tarefa pelo id
//   POST   /tarefas      -> CRIA uma tarefa nova
//   PUT    /tarefas/:id  -> ATUALIZA uma tarefa existente
//   DELETE /tarefas/:id  -> APAGA uma tarefa
//
// Padrões que se repetem (decorou 1, sabe todos):
//   req            = o pedido que CHEGA   |  res = a bandeja de resposta que SAI
//   res.json(...)  = embrulha e devolve pro front (SAÍDA)
//   db.prepare(...).all()  = traz TODAS as linhas
//   db.prepare(...).get(...) = traz UMA linha só
//   WHERE id = ?   = filtro "apenas onde o id for tal"; o ? é por SEGURANÇA
//                    (valor do usuário NUNCA gruda direto no SQL)
//   return         = "encerra ESTE atendimento aqui" (evita responder 2x)
// ============================================================

// --- PEGAR AS FERRAMENTAS ---
const express = require('express');
const router = express.Router();  // 🧑‍🍳 "router" = o garçom especialista (o "app" só das tarefas)
const db = require('../db');      // 🔑 pega a despensa que o db.js deixou na janelinha (../ = sobe uma pasta)

// Listas de "convidados" aceitos: se vier algo fora daqui, recusamos.
// (Ficam no topo porque são usadas em várias ações -> escreve uma vez só.)
const STATUS_VALIDOS = ['pendente', 'fazendo', 'concluida'];
const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta'];

// ------------------------------------------------------------
// GET /tarefas -> Lista TODAS as tarefas
// ------------------------------------------------------------
router.get('/', (req, res) => {
  // Pede à despensa TODAS as tarefas, da mais nova pra mais antiga (DESC).
  const tarefas = db.prepare('SELECT * FROM tarefas ORDER BY id DESC').all();
  res.json(tarefas); // 📤 embrulha a lista e devolve pro front
});

// ------------------------------------------------------------
// GET /tarefas/:id -> Busca UMA tarefa específica
// ":id" = espaço em branco na URL. Ex: /tarefas/3 -> :id vale 3
// e o código pega esse número em req.params.id
// ------------------------------------------------------------
router.get('/:id', (req, res) => {
  // WHERE id = ?  ->  só a tarefa daquele id. O ? recebe o valor separado (segurança).
  // .get(...) -> traz UMA só.
  const tarefa = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(req.params.id);

  if (!tarefa) { // "se NÃO achou a tarefa..."
    // 404 = "não encontrado". return = encerra aqui (não continua pro res.json de baixo).
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.json(tarefa); // 📤 achou -> entrega na bandeja
});

// ------------------------------------------------------------
// POST /tarefas -> CRIA uma tarefa nova
// O front envia um JSON no "corpo" (req.body). Ex:
// { "titulo": "Estudar Express", "prioridade": "alta" }
// ------------------------------------------------------------
router.post('/', (req, res) => {
  // Pega os campos de dentro da "carta" (req.body) e cria uma variável pra cada um.
  const { titulo, descricao, status, prioridade, prazo } = req.body;

  // --- VALIDAÇÕES (o "segurança" conferindo antes de deixar entrar) ---
  // Título é obrigatório. .trim() tira espaços das pontas. 400 = "você mandou errado".
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório' });
  }

  // Se vier status/prioridade fora da lista de convidados, recusa com erro claro.
  if (status && !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
  }
  if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ erro: `Prioridade inválida. Use: ${PRIORIDADES_VALIDAS.join(', ')}` });
  }

  // INSERT = guardar uma linha nova na despensa. .run() = usado quando MODIFICA o banco.
  // Cada ? recebe, na ordem, um valor do .run(). O "|| 'algo'" = valor padrão se vier vazio.
  const resultado = db
    .prepare('INSERT INTO tarefas (titulo, descricao, status, prioridade, prazo) VALUES (?, ?, ?, ?, ?)')
    .run(titulo.trim(), descricao || '', status || 'pendente', prioridade || 'media', prazo || 'sem prazo');

  // Busca a tarefa recém-criada (pelo id que o banco acabou de gerar) pra devolver completa.
  const novaTarefa = db
    .prepare('SELECT * FROM tarefas WHERE id = ?')
    .get(resultado.lastInsertRowid);

  res.status(201).json(novaTarefa); // 201 = "criado com sucesso"
});

// ------------------------------------------------------------
// PUT /tarefas/:id -> ATUALIZA uma tarefa existente
// ------------------------------------------------------------
router.put('/:id', (req, res) => {
  const { titulo, descricao, status, prioridade, prazo} = req.body;
  const { id } = req.params; // o número da tarefa a atualizar

  // Primeiro confere se a tarefa EXISTE (senão, 404).
  const existente = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  // Mesmas validações do POST (o segurança conferindo de novo).
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório' });
  }
  if (status && !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
  }
  if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ erro: `Prioridade inválida. Use: ${PRIORIDADES_VALIDAS.join(', ')}` });
  }

  // UPDATE ... WHERE id = ?  ->  o WHERE é ESSENCIAL: muda SÓ a tarefa daquele id
  // (sem o WHERE, mudaria TODAS!). "|| existente.status" = mantém o que já estava, se não vier novo.
  db.prepare(
    'UPDATE tarefas SET titulo = ?, descricao = ?, status = ?, prioridade = ?, prazo = ? WHERE id = ?'
  ).run(
    titulo.trim(),
    descricao || '',
    status || existente.status,
    prioridade || existente.prioridade,
    prazo || existente.prazo,
    id
  );

  const atualizada = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(id);
  res.json(atualizada); // 📤 devolve a tarefa já atualizada
});

// ------------------------------------------------------------
// DELETE /tarefas/:id -> APAGA uma tarefa
// ------------------------------------------------------------
router.delete('/:id', (req, res) => {
  // DELETE ... WHERE id = ?  ->  apaga só a linha daquele id.
  // .run() devolve "resultado.changes" = quantas linhas foram afetadas.
  const resultado = db.prepare('DELETE FROM tarefas WHERE id = ?').run(req.params.id);

  if (resultado.changes === 0) { // 0 = nada foi apagado -> o id não existia
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.json({ mensagem: 'Tarefa excluída com sucesso' });
});

// module.exports = coloca o garçom "pronto" na janelinha ->
// é este "router" que o server.js pega em: require('./routes/tarefas')
module.exports = router;
