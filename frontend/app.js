// ============================================================
// app.js - Lógica do front-end
// ============================================================
// Este arquivo faz a "ponte" entre a tela (HTML) e a API (Node).
// A comunicação acontece pela função fetch(), que envia
// requisições HTTP para o servidor e recebe respostas em JSON.
// ============================================================

// Endereço base da API. Se o back-end mudar de porta, altere aqui.
const API_URL = 'http://localhost:3000';

// Textos "bonitos" para mostrar na tela (o banco guarda o valor cru)
const NOMES_STATUS = { pendente: 'Pendente', fazendo: 'Fazendo', concluida: 'Concluída' };
const NOMES_PRIORIDADE = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };

// --- Atalhos para os elementos da tela ---
const campoId = document.getElementById('tarefa-id');
const campoTitulo = document.getElementById('titulo');
const campoDescricao = document.getElementById('descricao');
const campoPrioridade = document.getElementById('prioridade');
const campoStatus = document.getElementById('status');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-form');
const listaTarefas = document.getElementById('lista-tarefas');
const listaVazia = document.getElementById('lista-vazia');
const mensagem = document.getElementById('mensagem');

// ============================================================
// 1. LISTAR tarefas (GET /tarefas)
// ============================================================
async function carregarTarefas() {
  try {
    const resposta = await fetch(`${API_URL}/tarefas`);
    const tarefas = await resposta.json();

    // Limpa a tabela antes de redesenhar
    listaTarefas.innerHTML = '';

    // Mostra ou esconde o aviso de "lista vazia"
    listaVazia.classList.toggle('escondido', tarefas.length > 0);

    // Cria uma linha <tr> para cada tarefa
    for (const tarefa of tarefas) {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${tarefa.titulo}</td>
        <td>${tarefa.descricao || '-'}</td>
        <td><span class="etiqueta prioridade-${tarefa.prioridade}">${NOMES_PRIORIDADE[tarefa.prioridade]}</span></td>
        <td><span class="etiqueta status-${tarefa.status}">${NOMES_STATUS[tarefa.status]}</span></td>
        <td class="acoes">
          <button title="Editar" data-acao="editar" data-id="${tarefa.id}">✏️</button>
          <button title="Excluir" data-acao="excluir" data-id="${tarefa.id}">🗑️</button>
        </td>
      `;

      listaTarefas.appendChild(linha);
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível carregar as tarefas. O servidor está rodando?', 'erro');
  }
}

// ============================================================
// 2. SALVAR tarefa (POST para criar, PUT para editar)
// ============================================================
async function salvarTarefa() {
  // Monta o objeto com os dados do formulário
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
      headers: { 'Content-Type': 'application/json' }, // avisa que é JSON
      body: JSON.stringify(dados), // converte o objeto JS em texto JSON
    });

    const corpo = await resposta.json();

    // resposta.ok é true quando o status é 200-299
    if (!resposta.ok) {
      mostrarMensagem(corpo.erro || 'Erro ao salvar a tarefa.', 'erro');
      return;
    }

    mostrarMensagem(
      estaEditando ? 'Tarefa atualizada!' : 'Tarefa criada!',
      'sucesso'
    );
    limparFormulario();
    carregarTarefas(); // recarrega a tabela
  } catch (erro) {
    mostrarMensagem('Falha na conexão com o servidor.', 'erro');
  }
}

// ============================================================
// 3. EDITAR: preenche o formulário com os dados da tarefa
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

  // Sobe a página até o formulário
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// 4. EXCLUIR tarefa (DELETE /tarefas/:id)
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
  mensagem.className = `mensagem ${tipo}`; // aplica a cor certa
  // Esconde a mensagem sozinha depois de 4 segundos
  setTimeout(() => mensagem.classList.add('escondido'), 4000);
}

// ============================================================
// Eventos (o que acontece quando o usuário interage)
// ============================================================
btnSalvar.addEventListener('click', salvarTarefa);
btnCancelar.addEventListener('click', limparFormulario);

// Um único "ouvinte" na tabela cuida dos cliques em editar/excluir.
// Isso se chama "delegação de eventos" — pesquisem, é útil demais!
listaTarefas.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { acao, id } = botao.dataset;
  if (acao === 'editar') iniciarEdicao(id);
  if (acao === 'excluir') excluirTarefa(id);
});

// Carrega a lista assim que a página abre
carregarTarefas();
