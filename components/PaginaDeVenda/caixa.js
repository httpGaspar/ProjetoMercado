document.getElementById('Voltar').addEventListener('click', function() {
    window.location.href = '../PaginaPrincipal/inicio.html';
});

function formatarMoeda(input) {
    let valor = input.value;

    // Remove qualquer caractere que não seja dígito ou vírgula
    valor = valor.replace(/\D/g, '');

    // Formata o valor para sempre ter pelo menos 2 casas decimais
    valor = (valor / 100).toFixed(2).replace('.', ',');

    // Adiciona o símbolo R$
    input.value = 'R$ ' + valor;
}

function quantidade() {
    document.querySelector('input[placeholder="R$ 0,00"]').focus();
}

function pesquisar() {
    document.querySelector('#pesquisar').click();
}

function cancelar() {
    document.querySelector('#botaoCancelar').click();
}

function finalizar() {
    document.querySelector('#botaoFinalizar').click();
}

function voltar() {
    document.querySelector('button[onclick="voltar()"]').click();
}

// Teclas de atalho para F4 a F8
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'F4':
            pesquisar();
            event.preventDefault();
            break;
        case 'F5':
            quantidade();
            event.preventDefault();
            break;
        case 'F7':
            voltar();
            event.preventDefault();
            break;
        case 'F8':
            finalizar();
            event.preventDefault();
            break;
        case 'F9':
            cancelar();
            event.preventDefault();
            break;
    }
});

// Exibir o modal quando o botão "Finalizar" for clicado
const modal = document.getElementById("modal");
const btnFinalizar = document.getElementById("botaoFinalizar");
const spanClose = document.querySelector(".close");
const subtotalInput = document.getElementById("valor");  // Campo Subtotal

// Abrir o modal ao clicar no botão
btnFinalizar.onclick = function() {
    // Exibir o modal
    modal.style.display = "block";

    // Pegar o valor do subtotal e inserir no campo "Valor Total" do modal
    const subtotalValue = subtotalInput.value;
    mostrarConteudo(subtotalValue);
}

// Fechar o modal ao clicar no 'x'
spanClose.onclick = function() {
    modal.style.display = "none";
}

// Fechar o modal se clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Função para exibir o conteúdo com base na forma de pagamento
function mostrarConteudo(subtotalValue) {
    const pagamento = document.getElementById("escolha").value;
    const conteudoPagamento = document.getElementById("conteudoPagamento");

    if (pagamento === "Dinheiro") {
        conteudoPagamento.innerHTML = `
            <label for="valorTotal">Valor Total:</label>
            <input type="text" id="valorTotal" value="${subtotalValue}" disabled>

            <label for="valorRecebido">Valor Recebido:</label>
            <input type="text" id="valorRecebido" placeholder="Digite o valor recebido" oninput="calcularTroco()">

            <label for="troco">Troco:</label>
            <input type="text" id="troco" placeholder="R$ 0,00" disabled>

            <button onclick="confirmarPagamento()" class= "buttonModelD" >Pagamento Confirmado</button>

        `;
    } else if (pagamento === "Debito" || pagamento === "Credito") {
        conteudoPagamento.innerHTML = `
            <p>Insira o cartão na maquininha</p>
            <button onclick="confirmarPagamento()" class= "buttonModel" >Pagamento Confirmado</button>
            <button onclick="cancelarPagamento()" class= "buttonModel" >Cancelar</button>
        `;
    } else if (pagamento === "Pix") {
        conteudoPagamento.innerHTML = `
            <p>Escaneie o QR code na maquininha</p>
            <button onclick="confirmarPagamento()" class= "buttonModel" >Pagamento Confirmado</button>
            <button onclick="cancelarPagamento()" class= "buttonModel" >Cancelar</button>
        `;
    }
}

// Função para calcular o troco
function calcularTroco() {
    const valorTotal = parseFloat(document.getElementById("valorTotal").value.replace('R$', '').replace(',', '.')) || 0;
    const valorRecebido = parseFloat(document.getElementById("valorRecebido").value) || 0;
    const troco = valorRecebido - valorTotal;
    document.getElementById("troco").value = troco >= 0 ? `R$ ${troco.toFixed(2)}` : "Valor insuficiente";
}

// Funções de pagamento
function confirmarPagamento() {
    modal.style.display = "none";
}

function cancelarPagamento() {
    modal.style.display = "none";
}

const produtos = [
    //adicionar metodo get para fazer a busca de produtos e colocar na tabela
    //isso é so para mostrar o funcionamento
    { id: 1, nome: "Produto 1", codigoBarras: "001", valorUnitario: 10.00 }, // Adicione código de barras e valor
    { id: 2, nome: "Produto 2", codigoBarras: "002", valorUnitario: 20.00 },
    { id: 3, nome: "Produto 3", codigoBarras: "003", valorUnitario: 30.00 },
    // Adicione mais produtos conforme necessário
];

const modalPesquisa = document.getElementById("modalPesquisa");
const listaProdutos = document.getElementById("listaProdutos");
const produtosTabela = document.getElementById("produtosTabela"); // Referência ao corpo da tabela

// Função para abrir o modal
document.getElementById("pesquisar").onclick = function() {
    modalPesquisa.style.display = "block";
    listarProdutos(produtos); // Exibir a lista de produtos quando abrir o modal
}

// Função para fechar o modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Função para listar os produtos
function listarProdutos(produtos) {
    listaProdutos.innerHTML = ""; // Limpa a lista antes de adicionar novos itens
    produtos.forEach(produto => {
        const li = document.createElement("li");
        li.textContent = produto.nome;
        li.onclick = function() {
            adicionarProduto(produto);
        };
        listaProdutos.appendChild(li);
    });
}

// Função para adicionar produto à lista de compras
function adicionarProduto(produto) {
    alert(`${produto.nome} foi adicionado à lista de compras.`);
    
    // Adiciona o produto à tabela
    const row = produtosTabela.insertRow(); // Adiciona uma nova linha na tabela
    
    const cellCodigoBarras = row.insertCell(0);
    const cellDescricao = row.insertCell(1);
    const cellQtd = row.insertCell(2);
    const cellValorUnitario = row.insertCell(3);
    const cellTotal = row.insertCell(4);
    
    cellCodigoBarras.textContent = produto.codigoBarras; // Código de Barras
    cellDescricao.textContent = produto.nome; // Nome do produto
    cellQtd.textContent = "1"; // Inicializa a quantidade como 1 (ou você pode permitir que o usuário defina)
    cellValorUnitario.textContent = `R$ ${produto.valorUnitario.toFixed(2)}`; // Valor Unitário formatado
    cellTotal.textContent = `R$ ${(produto.valorUnitario * 1).toFixed(2)}`; // Total inicial (1 unidade)
    
    fecharModal("modalPesquisa"); // Fecha o modal após adicionar o produto
}

// Função para filtrar produtos
function filtrarProdutos() {
    const termo = document.getElementById("campoPesquisa").value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(termo));
    listarProdutos(produtosFiltrados);
}

// Fechar o modal se clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === modalPesquisa) {
        fecharModal("modalPesquisa");
    }
}

// Função para abrir o modal de cancelamento
document.getElementById("botaoCancelar").onclick = function() {
    abrirModalCancelamento();
}

// Função para abrir o modal de cancelamento
function abrirModalCancelamento() {
    const modalCancelamento = document.getElementById("modalCancelamento");
    modalCancelamento.style.display = "block";

    // Preencher o select com produtos existentes
    preencherProdutosCancelamento();
}

// Função para preencher o select com produtos existentes
function preencherProdutosCancelamento() {
    const produtoCancelarSelect = document.getElementById("produtoCancelar");
    produtoCancelarSelect.innerHTML = ""; // Limpa as opções anteriores
    
    const produtosNaTabela = document.querySelectorAll("#produtosTabela tr"); // Seleciona todas as linhas na tabela

    produtosNaTabela.forEach((row, index) => {
        const produtoNome = row.cells[1].textContent; // Pega o nome do produto da segunda coluna
        const option = document.createElement("option");
        option.value = index; // Usamos o índice para identificar o produto
        option.textContent = produtoNome; // Nome do produto
        produtoCancelarSelect.appendChild(option);
    });
}

// Função para confirmar o cancelamento
function confirmarCancelamento() {
    const produtoCancelarSelect = document.getElementById("produtoCancelar");
    const produtoIndex = parseInt(produtoCancelarSelect.value);
    
    const produtosNaTabela = document.querySelectorAll("#produtosTabela tr"); // Seleciona todas as linhas na tabela

    // Verifica se há produtos na tabela
    if (produtoIndex >= 0 && produtoIndex < produtosNaTabela.length) {
        const row = produtosNaTabela[produtosNaTabela.length - 1 - produtoIndex]; // Seleciona o produto da última para a primeira
        
        // Remove a linha da tabela
        row.parentNode.removeChild(row);
        alert(`${row.cells[1].textContent} foi removido da lista de compras.`);
    } else {
        alert("Produto não encontrado.");
    }
    
    fecharModal('modalCancelamento'); // Fecha o modal após o cancelamento
}

// Fechar o modal se clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === modalCancelamento) {
        fecharModal("modalCancelamento");
    }
}
