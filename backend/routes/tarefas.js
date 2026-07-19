// ============================================================
// routes/tarefas.js - Rotas do CRUD de tarefas
// ============================================================
// CRUD = Create (criar), Read (ler), Update (atualizar), Delete (excluir)
//
// Cada rota é um "endereço" que o front-end chama via fetch():
//   GET    /tarefas      -> lista todas as tarefas
//   GET    /tarefas/:id  -> busca UMA tarefa pelo id
//   POST   /tarefas      -> cria uma tarefa nova
//   PUT    /tarefas/:id  -> atualiza uma tarefa existente
//   DELETE /tarefas/:id  -> exclui uma tarefa
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// Valores aceitos nos campos de "escolha limitada".
// Guardar isso em constantes evita repetir a lista em cada rota.
const STATUS_VALIDOS = ['pendente', 'fazendo', 'concluida'];
const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta'];

// ------------------------------------------------------------
// GET /tarefas -> Lista todas as tarefas
// ------------------------------------------------------------
router.get('/', (req, res) => {
  const tarefas = db.prepare('SELECT * FROM tarefas ORDER BY id DESC').all();
  res.json(tarefas); // devolve a lista em formato JSON
});

// ------------------------------------------------------------
// GET /tarefas/:id -> Busca uma tarefa específica
// Ex: GET /tarefas/3 busca a tarefa de id 3
// ------------------------------------------------------------
router.get('/:id', (req, res) => {
  const tarefa = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(req.params.id);

  if (!tarefa) {
    // Status 404 = "não encontrado"
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.json(tarefa);
});

// ------------------------------------------------------------
// POST /tarefas -> Cria uma tarefa nova
// O front-end envia um JSON no "corpo" (body) da requisição:
// { "titulo": "Estudar Express", "descricao": "...", "prioridade": "alta" }
// ------------------------------------------------------------
router.post('/', (req, res) => {
  const { titulo, descricao, status, prioridade } = req.body;

  // Validação simples: título é obrigatório
  if (!titulo || titulo.trim() === '') {
    // Status 400 = "requisição inválida" (culpa de quem enviou)
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório' });
  }

  // Se vier um status/prioridade fora da lista, recusa com erro claro
  if (status && !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
  }
  if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ erro: `Prioridade inválida. Use: ${PRIORIDADES_VALIDAS.join(', ')}` });
  }

  const resultado = db
    .prepare('INSERT INTO tarefas (titulo, descricao, status, prioridade) VALUES (?, ?, ?, ?)')
    .run(titulo.trim(), descricao || '', status || 'pendente', prioridade || 'media');

  // Busca a tarefa recém-criada para devolver completa
  const novaTarefa = db
    .prepare('SELECT * FROM tarefas WHERE id = ?')
    .get(resultado.lastInsertRowid);

  // Status 201 = "criado com sucesso"
  res.status(201).json(novaTarefa);
});

// ------------------------------------------------------------
// PUT /tarefas/:id -> Atualiza uma tarefa existente
// ------------------------------------------------------------
router.put('/:id', (req, res) => {
  const { titulo, descricao, status, prioridade } = req.body;
  const { id } = req.params;

  // Verifica se a tarefa existe antes de atualizar
  const existente = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erro: 'O campo "titulo" é obrigatório' });
  }

  if (status && !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
  }
  if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ erro: `Prioridade inválida. Use: ${PRIORIDADES_VALIDAS.join(', ')}` });
  }

  db.prepare(
    'UPDATE tarefas SET titulo = ?, descricao = ?, status = ?, prioridade = ? WHERE id = ?'
  ).run(
    titulo.trim(),
    descricao || '',
    status || existente.status,
    prioridade || existente.prioridade,
    id
  );

  const atualizada = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(id);
  res.json(atualizada);
});

// ------------------------------------------------------------
// DELETE /tarefas/:id -> Exclui uma tarefa
// ------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const resultado = db.prepare('DELETE FROM tarefas WHERE id = ?').run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }

  res.json({ mensagem: 'Tarefa excluída com sucesso' });
});

module.exports = router;
