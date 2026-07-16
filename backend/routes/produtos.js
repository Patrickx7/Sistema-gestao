// ============================================================
// routes/produtos.js - Rotas do CRUD de produtos
// ============================================================
// CRUD = Create (criar), Read (ler), Update (atualizar), Delete (excluir)
//
// Cada rota é um "endereço" que o front-end chama via fetch():
//   GET    /produtos      -> lista todos os produtos
//   GET    /produtos/:id  -> busca UM produto pelo id
//   POST   /produtos      -> cria um produto novo
//   PUT    /produtos/:id  -> atualiza um produto existente
//   DELETE /produtos/:id  -> exclui um produto
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// ------------------------------------------------------------
// GET /produtos -> Lista todos os produtos
// ------------------------------------------------------------
router.get('/', (req, res) => {
  const produtos = db.prepare('SELECT * FROM produtos ORDER BY id DESC').all();
  res.json(produtos); // devolve a lista em formato JSON
});

// ------------------------------------------------------------
// GET /produtos/:id -> Busca um produto específico
// Ex: GET /produtos/3 busca o produto de id 3
// ------------------------------------------------------------
router.get('/:id', (req, res) => {
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);

  if (!produto) {
    // Status 404 = "não encontrado"
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json(produto);
});

// ------------------------------------------------------------
// POST /produtos -> Cria um produto novo
// O front-end envia um JSON no "corpo" (body) da requisição:
// { "nome": "Teclado", "descricao": "...", "preco": 99.9, "quantidade": 10 }
// ------------------------------------------------------------
router.post('/', (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;

  // Validação simples: nome é obrigatório
  if (!nome || nome.trim() === '') {
    // Status 400 = "requisição inválida" (culpa de quem enviou)
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  const resultado = db
    .prepare('INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)')
    .run(nome.trim(), descricao || '', Number(preco) || 0, Number(quantidade) || 0);

  // Busca o produto recém-criado para devolver completo
  const novoProduto = db
    .prepare('SELECT * FROM produtos WHERE id = ?')
    .get(resultado.lastInsertRowid);

  // Status 201 = "criado com sucesso"
  res.status(201).json(novoProduto);
});

// ------------------------------------------------------------
// PUT /produtos/:id -> Atualiza um produto existente
// ------------------------------------------------------------
router.put('/:id', (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;
  const { id } = req.params;

  // Verifica se o produto existe antes de atualizar
  const existente = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  db.prepare(
    'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE id = ?'
  ).run(nome.trim(), descricao || '', Number(preco) || 0, Number(quantidade) || 0, id);

  const atualizado = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
  res.json(atualizado);
});

// ------------------------------------------------------------
// DELETE /produtos/:id -> Exclui um produto
// ------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const resultado = db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json({ mensagem: 'Produto excluído com sucesso' });
});

module.exports = router;
