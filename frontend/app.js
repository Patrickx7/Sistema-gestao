// ============================================================
// app.js - Lógica do front-end
// ============================================================
// Este arquivo faz a "ponte" entre a tela (HTML) e a API (Node).
// A comunicação acontece pela função fetch(), que envia
// requisições HTTP para o servidor e recebe respostas em JSON.
// ============================================================

// Endereço base da API. Se o back-end mudar de porta, altere aqui.
const API_URL = 'http://localhost:3000';

// --- Atalhos para os elementos da tela ---
const campoId = document.getElementById('produto-id');
const campoNome = document.getElementById('nome');
const campoDescricao = document.getElementById('descricao');
const campoPreco = document.getElementById('preco');
const campoQuantidade = document.getElementById('quantidade');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-form');
const listaProdutos = document.getElementById('lista-produtos');
const listaVazia = document.getElementById('lista-vazia');
const mensagem = document.getElementById('mensagem');

// ============================================================
// 1. LISTAR produtos (GET /produtos)
// ============================================================
async function carregarProdutos() {
  try {
    const resposta = await fetch(`${API_URL}/produtos`);
    const produtos = await resposta.json();

    // Limpa a tabela antes de redesenhar
    listaProdutos.innerHTML = '';

    // Mostra ou esconde o aviso de "lista vazia"
    listaVazia.classList.toggle('escondido', produtos.length > 0);

    // Cria uma linha <tr> para cada produto
    for (const produto of produtos) {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.descricao || '-'}</td>
        <td>R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</td>
        <td>${produto.quantidade}</td>
        <td class="acoes">
          <button title="Editar" data-acao="editar" data-id="${produto.id}">✏️</button>
          <button title="Excluir" data-acao="excluir" data-id="${produto.id}">🗑️</button>
        </td>
      `;

      listaProdutos.appendChild(linha);
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível carregar os produtos. O servidor está rodando?', 'erro');
  }
}

// ============================================================
// 2. SALVAR produto (POST para criar, PUT para editar)
// ============================================================
async function salvarProduto() {
  // Monta o objeto com os dados do formulário
  const dados = {
    nome: campoNome.value,
    descricao: campoDescricao.value,
    preco: campoPreco.value,
    quantidade: campoQuantidade.value,
  };

  // Se o campo escondido tem um id, estamos EDITANDO. Senão, CRIANDO.
  const id = campoId.value;
  const estaEditando = id !== '';

  const url = estaEditando ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
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
      mostrarMensagem(corpo.erro || 'Erro ao salvar o produto.', 'erro');
      return;
    }

    mostrarMensagem(
      estaEditando ? 'Produto atualizado!' : 'Produto cadastrado!',
      'sucesso'
    );
    limparFormulario();
    carregarProdutos(); // recarrega a tabela
  } catch (erro) {
    mostrarMensagem('Falha na conexão com o servidor.', 'erro');
  }
}

// ============================================================
// 3. EDITAR: preenche o formulário com os dados do produto
// ============================================================
async function iniciarEdicao(id) {
  const resposta = await fetch(`${API_URL}/produtos/${id}`);
  const produto = await resposta.json();

  campoId.value = produto.id;
  campoNome.value = produto.nome;
  campoDescricao.value = produto.descricao;
  campoPreco.value = produto.preco;
  campoQuantidade.value = produto.quantidade;

  tituloForm.textContent = `Editando: ${produto.nome}`;
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.classList.remove('escondido');

  // Sobe a página até o formulário
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// 4. EXCLUIR produto (DELETE /produtos/:id)
// ============================================================
async function excluirProduto(id) {
  const confirmou = confirm('Tem certeza que deseja excluir este produto?');
  if (!confirmou) return;

  const resposta = await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });

  if (resposta.ok) {
    mostrarMensagem('Produto excluído.', 'sucesso');
    carregarProdutos();
  } else {
    mostrarMensagem('Erro ao excluir o produto.', 'erro');
  }
}

// ============================================================
// Funções auxiliares
// ============================================================
function limparFormulario() {
  campoId.value = '';
  campoNome.value = '';
  campoDescricao.value = '';
  campoPreco.value = '';
  campoQuantidade.value = '';
  tituloForm.textContent = 'Novo produto';
  btnSalvar.textContent = 'Salvar produto';
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
btnSalvar.addEventListener('click', salvarProduto);
btnCancelar.addEventListener('click', limparFormulario);

// Um único "ouvinte" na tabela cuida dos cliques em editar/excluir.
// Isso se chama "delegação de eventos" — pesquisem, é útil demais!
listaProdutos.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { acao, id } = botao.dataset;
  if (acao === 'editar') iniciarEdicao(id);
  if (acao === 'excluir') excluirProduto(id);
});

// Carrega a lista assim que a página abre
carregarProdutos();
