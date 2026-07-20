// ============================================================
// server.js  ->  A RECEPÇÃO do restaurante 🏨
// ============================================================
// É o ponto de entrada: todo pedido entra por aqui.
// A recepção aplica as regras gerais e ENCAMINHA cada pedido
// para o funcionário certo (ela não faz o trabalho sozinha).
//
// Para rodar:
//   1. cd backend
//   2. npm install        (só na primeira vez)
//   3. npm run dev        (reinicia sozinho quando você salva um arquivo)
//
// O servidor sobe em: http://localhost:3000
// ============================================================

// --- 1) PEGAR AS FERRAMENTAS (require = "pegar e guardar na caixinha") ---
const express = require('express'); // 🔧 ferramenta que monta o servidor (a "fábrica")
const cors = require('cors');       // 🪪 o "crachá" que deixa a tela (front) falar com o servidor

// require com "./" = pegar um ARQUIVO MEU (não uma ferramenta de fora).
// Aqui a recepção vai buscar o "garçom das tarefas".
const rotasTarefas = require('./routes/tarefas'); // 🌉 ponte para o routes/tarefas.js

// --- 2) CONSTRUIR O SERVIDOR ---
// express()  ->  os () "dão a partida": a fábrica produz o servidor pronto.
const app = express(); // 🚗 "app" = o servidor pronto (o carro que saiu da fábrica)
const PORTA = 3000;    // 🚪 número da porta do prédio onde o servidor vai atender

// --- 3) INSTALAR AS REGRAS GERAIS (app.use = "vale para TODO pedido que chega") ---
app.use(cors());          // 🪪 liga o crachá de segurança em todos os pedidos
app.use(express.json());  // 📬 "abridor de cartas": abre o JSON que CHEGA do front

// --- 4) COLOCAR AS PLAQUINHAS NAS PORTAS ---

// Porta da frente "/"  ->  teste de vida ("estou no ar!").
// (req = pedido que chega | res = a bandeja de resposta que devolvemos)
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do gerenciador de tarefas está no ar! 🚀' }); // 📤 embrulha e devolve
});

// Porta "/tarefas"  ->  a recepção NÃO resolve, só ENCAMINHA para o garçom
// especialista (routes/tarefas.js), sem conferir nada aqui.
app.use('/tarefas', rotasTarefas);

// --- 5) LIGAR O SERVIDOR (sempre por ÚLTIMO: só liga depois de tudo pronto) ---
app.listen(PORTA, () => {
  // console.log = só um "bilhete" no terminal pra você saber que ligou (não afeta nada)
  console.log(`✅ Servidor rodando em http://localhost:${PORTA}`);
  console.log(`   Teste no navegador: http://localhost:${PORTA}/tarefas`);
});
