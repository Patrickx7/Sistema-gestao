// ============================================================
// server.js - Ponto de entrada do back-end
// ============================================================
// Para rodar:
//   1. cd backend
//   2. npm install        (só na primeira vez)
//   3. npm run dev        (reinicia sozinho quando você salva um arquivo)
//
// O servidor sobe em: http://localhost:3000
// ============================================================

const express = require('express');
const cors = require('cors');

const rotasTarefas = require('./routes/tarefas');

const app = express();
const PORTA = 3000;

// --- Middlewares (funções que rodam em TODA requisição) ---

// Permite que o front-end (que roda em outro endereço/porta)
// converse com esta API. Sem isso, o navegador bloqueia as
// requisições por segurança (erro de CORS).
app.use(cors());

// Faz o Express entender JSON no corpo das requisições
app.use(express.json());

// --- Rotas ---

// Rota de "saúde": serve para testar se o servidor está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do gerenciador de tarefas está no ar! 🚀' });
});

// Tudo que começar com /tarefas vai para o arquivo routes/tarefas.js
app.use('/tarefas', rotasTarefas);

// --- Inicia o servidor ---
app.listen(PORTA, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORTA}`);
  console.log(`   Teste no navegador: http://localhost:${PORTA}/tarefas`);
});
