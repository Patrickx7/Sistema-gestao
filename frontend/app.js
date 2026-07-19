// ============================================================
// app.js - Lógica do front-end
// ============================================================
// Este arquivo faz a "ponte" entre a tela (HTML) e a API (Node).
// A comunicação acontece pela função fetch(), que envia
// requisições HTTP para o servidor e recebe respostas em JSON.
//
// Diferença para a versão anterior: as tarefas agora são
// desenhadas em 3 colunas (quadro kanban), uma para cada status.
// Dá pra mover uma tarefa de coluna de dois jeitos:
//   1) arrastando o card (drag-and-drop)
//   2) usando o <select> "mover para" dentro do card (teclado/clique)
// ============================================================

// Endereço base da API. Se o back-end mudar de porta, altere aqui.
const API_URL = 'http://localhost:3000';

// Textos "bonitos" para mostrar na tela (o banco guarda o valor cru)
const NOMES_STATUS = { pendente: 'Pendente', fazendo: 'Fazendo', concluida: 'Concluída' };
const NOMES_PRIORIDADE = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };
const ORDEM_STATUS = ['pendente', 'fazendo', 'concluida'];

// --- Atalhos para os elementos do formulário ---
const painelFormulario = document.getElementById('painel-formulario');
const btnNovaTarefa = document.getElementById('btn-nova-tarefa');
const btnFecharForm = document.getElementById('btn-fechar-form');
const campoId = document.getElementById('tarefa-id');
const campoTitulo = document.getElementById('titulo');
const campoDescricao = document.getElementById('descricao');
const campoPrioridade = document.getElementById('prioridade');
const campoStatus = document.getElementById('status');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-form');
const mensagem = document.getElementById('mensagem');

// --- Atalhos para as 3 colunas do quadro ---
const colunas = {
  pendente: document.getElementById('coluna-corpo-pendente'),
  fazendo: document.getElementById('coluna-corpo-fazendo'),
  concluida: document.getElementById('coluna-corpo-concluida'),
};
const contadores = {
  pendente: document.getElementById('contador-pendente'),
  fazendo: document.getElementById('contador-fazendo'),
  concluida: document.getElementById('contador-concluida'),
};

// ============================================================
// 1. LISTAR tarefas (GET /tarefas) e distribuir nas colunas
// ============================================================
async function carregarTarefas() {
  try {
    const resposta = await fetch(`${API_URL}/tarefas`);
    const tarefas = await resposta.json();

    // Agrupa as tarefas por status: { pendente: [...], fazendo: [...], concluida: [...] }
    const grupos = { pendente: [], fazendo: [], concluida: [] };
    for (const tarefa of tarefas) {
      if (grupos[tarefa.status]) {
        grupos[tarefa.status].push(tarefa);
      }
    }

    // Redesenha cada coluna
    for (const status of ORDEM_STATUS) {
      const container = colunas[status];
      container.innerHTML = '';
      contadores[status].textContent = grupos[status].length;

      if (grupos[status].length === 0) {
        const vazio = document.createElement('p');
        vazio.className = 'coluna-vazia';
        vazio.textContent = 'Nada por aqui ainda.';
        container.appendChild(vazio);
        continue;
      }

      for (const tarefa of grupos[status]) {
        container.appendChild(criarCartao(tarefa));
      }
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível carregar as tarefas. O servidor está rodando?', 'erro');
  }
}

// ============================================================
// 2. Criar o elemento <div> de um card de tarefa
// ============================================================
function criarCartao(tarefa) {
  const card = document.createElement('div');
  card.className = `cartao-tarefa prioridade-${tarefa.prioridade}`;
  card.draggable = true;
  card.dataset.id = tarefa.id;

  card.innerHTML = `
    <div class="cartao-topo">
      <span class="etiqueta-prioridade">${NOMES_PRIORIDADE[tarefa.prioridade]}</span>
      <div class="cartao-acoes">
        <button title="Editar" data-acao="editar" data-id="${tarefa.id}">✏️</button>
        <button title="Excluir" data-acao="excluir" data-id="${tarefa.id}">🗑️</button>
      </div>
    </div>
    <h3 class="cartao-titulo">${escapar(tarefa.titulo)}</h3>
    <p class="cartao-descricao">${escapar(tarefa.descricao) || 'Sem descrição'}</p>
    <label class="cartao-mover-label">
      mover para
      <select class="cartao-mover" data-id="${tarefa.id}">
        <option value="pendente" ${tarefa.status === 'pendente' ? 'selected' : ''}>Pendente</option>
        <option value="fazendo" ${tarefa.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
        <option value="concluida" ${tarefa.status === 'concluida' ? 'selected' : ''}>Concluída</option>
      </select>
    </label>
  `;

  // --- Drag and drop: eventos do próprio card ---
  card.addEventListener('dragstart', () => {
    card.classList.add('arrastando');
    // Guarda o id da tarefa sendo arrastada para o "drop" ler depois
    dragTarefaId = tarefa.id;
  });
  card.addEventListener('dragend', () => card.classList.remove('arrastando'));

  return card;
}

// Escapa HTML para não quebrar a tela se alguém digitar < ou > no título
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto || '';
  return div.innerHTML;
}

// ============================================================
// 3. Drag and drop entre colunas
// ============================================================
let dragTarefaId = null;

for (const status of ORDEM_STATUS) {
  const container = colunas[status];

  container.addEventListener('dragover', (evento) => {
    evento.preventDefault(); // necessário para permitir o "drop"
    container.classList.add('sobre-arraste');
  });

  container.addEventListener('dragleave', () => {
    container.classList.remove('sobre-arraste');
  });

  container.addEventListener('drop', (evento) => {
    evento.preventDefault();
    container.classList.remove('sobre-arraste');
    if (dragTarefaId) moverTarefa(dragTarefaId, status);
    dragTarefaId = null;
  });
}

// Clique no <select> "mover para" de um card (funciona sem arrastar)
document.getElementById('quadro').addEventListener('change', (evento) => {
  if (!evento.target.classList.contains('cartao-mover')) return;
  moverTarefa(evento.target.dataset.id, evento.target.value);
});

// ============================================================
// 4. Mover uma tarefa para outro status (usado pelo drag e pelo select)
// ============================================================
async function moverTarefa(id, novoStatus) {
  try {
    // Busca a tarefa atual, porque o PUT espera todos os campos
    const respostaAtual = await fetch(`${API_URL}/tarefas/${id}`);
    const tarefa = await respostaAtual.json();

    if (tarefa.status === novoStatus) return; // nada mudou

    const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...tarefa, status: novoStatus }),
    });

    if (!resposta.ok) {
      mostrarMensagem('Não foi possível mover a tarefa.', 'erro');
      return;
    }

    mostrarMensagem(`Tarefa movida para "${NOMES_STATUS[novoStatus]}".`, 'sucesso');
    carregarTarefas();
  } catch (erro) {
    mostrarMensagem('Falha na conexão com o servidor.', 'erro');
  }
}

// ============================================================
// 5. SALVAR tarefa (POST para criar, PUT para editar)
// ============================================================
async function salvarTarefa() {
  const dados = {
    titulo: campoTitulo.value,
    descricao: campoDescricao.value,
    prioridade: campoPrioridade.value,
    status: campoStatus.value,
  };

  // Se o campo escondido tem um id, estamos EDITANDO. Senão, CRIANDO.
  const id = campoId.value;
  const estaEditando = id !== '';

  const url = estaEditando ? `${API_URL}/tarefas/${id}` : `${API_URL}/tarefas`;
  const metodo = estaEditando ? 'PUT' : 'POST';

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const corpo = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(corpo.erro || 'Erro ao salvar a tarefa.', 'erro');
      return;
    }

    mostrarMensagem(estaEditando ? 'Tarefa atualizada!' : 'Tarefa criada!', 'sucesso');
    fecharFormulario();
    carregarTarefas();
  } catch (erro) {
    mostrarMensagem('Falha na conexão com o servidor.', 'erro');
  }
}

// ============================================================
// 6. EDITAR: preenche o formulário com os dados da tarefa e abre o painel
// ============================================================
async function iniciarEdicao(id) {
  const resposta = await fetch(`${API_URL}/tarefas/${id}`);
  const tarefa = await resposta.json();

  campoId.value = tarefa.id;
  campoTitulo.value = tarefa.titulo;
  campoDescricao.value = tarefa.descricao;
  campoPrioridade.value = tarefa.prioridade;
  campoStatus.value = tarefa.status;

  tituloForm.textContent = `Editando: ${tarefa.titulo}`;
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.classList.remove('escondido');

  abrirFormulario();
}

// ============================================================
// 7. EXCLUIR tarefa (DELETE /tarefas/:id)
// ============================================================
async function excluirTarefa(id) {
  const confirmou = confirm('Tem certeza que deseja excluir esta tarefa?');
  if (!confirmou) return;

  const resposta = await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });

  if (resposta.ok) {
    mostrarMensagem('Tarefa excluída.', 'sucesso');
    carregarTarefas();
  } else {
    mostrarMensagem('Erro ao excluir a tarefa.', 'erro');
  }
}

// ============================================================
// Funções auxiliares
// ============================================================
function abrirFormulario() {
  painelFormulario.classList.remove('escondido');
  campoTitulo.focus();
  painelFormulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fecharFormulario() {
  painelFormulario.classList.add('escondido');
  limparFormulario();
}

function limparFormulario() {
  campoId.value = '';
  campoTitulo.value = '';
  campoDescricao.value = '';
  campoPrioridade.value = 'media';
  campoStatus.value = 'pendente';
  tituloForm.textContent = 'Nova tarefa';
  btnSalvar.textContent = 'Salvar tarefa';
  btnCancelar.classList.add('escondido');
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.classList.remove('escondido');
  setTimeout(() => mensagem.classList.add('escondido'), 4000);
}

// ============================================================
// Eventos (o que acontece quando o usuário interage)
// ============================================================
btnNovaTarefa.addEventListener('click', () => {
  limparFormulario();
  abrirFormulario();
});
btnFecharForm.addEventListener('click', fecharFormulario);
btnSalvar.addEventListener('click', salvarTarefa);
btnCancelar.addEventListener('click', fecharFormulario);

// Um único "ouvinte" no quadro cuida dos cliques em editar/excluir
// em qualquer card, de qualquer coluna (delegação de eventos).
document.getElementById('quadro').addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { acao, id } = botao.dataset;
  if (acao === 'editar') iniciarEdicao(id);
  if (acao === 'excluir') excluirTarefa(id);
});

// Carrega o quadro assim que a página abre
carregarTarefas();
