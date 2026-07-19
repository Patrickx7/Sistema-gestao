// ============================================================
// db.js - Configuração do banco de dados SQLite
// ============================================================
// O SQLite guarda tudo em UM arquivo (tarefas.db), que é criado
// automaticamente na primeira vez que o servidor roda.
// Não precisa instalar nenhum servidor de banco de dados!
// ============================================================

const { DatabaseSync } = require('node:sqlite');

// Cria (ou abre, se já existir) o arquivo do banco
const db = new DatabaseSync('tarefas.db');

// Cria a tabela de tarefas, caso ela ainda não exista.
// Campos:
//   id         -> número único gerado automaticamente
//   titulo     -> título curto da tarefa (obrigatório)
//   descricao  -> detalhes da tarefa (opcional)
//   status     -> 'pendente', 'fazendo' ou 'concluida'
//   prioridade -> 'baixa', 'media' ou 'alta'
//   criado_em  -> data/hora em que a tarefa foi criada
db.exec(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo     TEXT NOT NULL,
    descricao  TEXT DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'pendente',
    prioridade TEXT NOT NULL DEFAULT 'media',
    criado_em  TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

// Exporta a conexão para ser usada nas rotas
module.exports = db;
