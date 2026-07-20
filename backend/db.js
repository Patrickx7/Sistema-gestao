// ============================================================
// db.js  ->  A DESPENSA (banco de dados) 🍱
// ============================================================
// É onde as tarefas ficam GUARDADAS de verdade, mesmo depois
// de desligar o computador. Guarda tudo em UM arquivo
// (tarefas.db), criado sozinho na primeira vez que o servidor roda.
//
// ⚠️ Lembrete: "servidor" (recepção) e "banco de dados" (despensa)
//    são coisas DIFERENTES. Viu "db." no começo da linha?
//    Então é conversa com a DESPENSA, nunca com a recepção.
// ============================================================

// require com { } = pegar só UMA PEÇA de dentro da caixa de ferramentas.
// Aqui pegamos a peça "DatabaseSync" da caixa "node:sqlite".
const { DatabaseSync } = require('node:sqlite');

// new = "criar um novo". Abre (ou cria) a caderneta "tarefas.db".
// A caixinha "db" vira a nossa LIGAÇÃO DIRETA com a despensa.
const db = new DatabaseSync('tarefas.db'); // 🔑 a partir daqui, "db" = a despensa

// db.exec = "despensa, EXECUTE este comando" (o texto abaixo está em SQL,
// o idioma do banco de dados).
//
// Cria a "planilha" (tabela) de tarefas -> pensa numa planilha do Excel:
//   cada LINHA  = uma tarefa
//   cada COLUNA = uma informação da tarefa
//
// "IF NOT EXISTS" = só cria se ainda não existir -> assim, ao reiniciar,
// NÃO apaga as tarefas que já estão salvas.
//
// Regras que se repetem nas colunas:
//   NOT NULL       = obrigatório (não pode ficar vazio)
//   DEFAULT 'algo' = se ninguém preencher, usa 'algo' automaticamente
db.exec(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,               -- número único gerado sozinho (1,2,3...)
    titulo     TEXT NOT NULL,                                   -- obrigatório
    descricao  TEXT DEFAULT '',                                 -- opcional (vazio se não vier)
    status     TEXT NOT NULL DEFAULT 'pendente',                -- nasce como 'pendente'
    prioridade TEXT NOT NULL DEFAULT 'media',                   -- nasce como 'media'
    criado_em  TEXT DEFAULT (datetime('now', 'localtime'))      -- carimbo automático de data/hora
  )
`);

// module.exports = "colocar na JANELINHA de entrega" -> entrega a caixinha "db"
// para os outros arquivos usarem. Sem isto, o db ficaria "preso na cozinha".
// Quem pega do outro lado: routes/tarefas.js, com  const db = require('../db')
module.exports = db;
