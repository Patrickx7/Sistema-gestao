// ============================================================
// db.js - Configuração do banco de dados SQLite
// ============================================================
// O SQLite guarda tudo em UM arquivo (estoque.db), que é criado
// automaticamente na primeira vez que o servidor roda.
// Não precisa instalar nenhum servidor de banco de dados!
// ============================================================

const Database = require('better-sqlite3');

// Cria (ou abre, se já existir) o arquivo do banco
const db = new Database('estoque.db');

// Cria a tabela de produtos, caso ela ainda não exista.
// Campos:
//   id         -> número único gerado automaticamente
//   nome       -> nome do produto (obrigatório)
//   descricao  -> texto livre opcional
//   preco      -> preço em reais (número decimal)
//   quantidade -> quantidade atual em estoque
//   criado_em  -> data/hora em que o produto foi cadastrado
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT NOT NULL,
    descricao  TEXT DEFAULT '',
    preco      REAL NOT NULL DEFAULT 0,
    quantidade INTEGER NOT NULL DEFAULT 0,
    criado_em  TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// Exporta a conexão para ser usada nas rotas
module.exports = db;
