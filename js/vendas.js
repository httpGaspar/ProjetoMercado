// Objeto para armazenar a lista de produtos
let produtosLista = [];

// Função para buscar produto ao pressionar Enter ou clicar no botão
function buscarProduto(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const codigoBarras = document.getElementById('codigoBarras').value;

        // Chame a API para buscar informações do produto usando o código de barras
        fetch(`http://localhost:8080/getProdutoid/${codigoBarras}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Produto não encontrado');
                }
                return response.json();
            })
            .then(data => {
                // Se a quantidade não estiver preenchida ou for inválida, define como 1
                const quantidadeInput = document.getElementById('quantidadeVendida');
                let quantidadeVendida = parseInt(quantidadeInput.value) || 1;

                // Adiciona ou atualiza o produto na tabela
                adicionarProdutoTabela(data, quantidadeVendida);
            })
            .catch(error => {
                alert(error.message);
            });
    }
}

// Função para adicionar ou atualizar o produto na tabela
function adicionarProdutoTabela(produto, quantidadeVendida) {
    const tabela = document.getElementById('produtosTabela');

    // Verifica se o produto já está na lista
    const produtoExistente = produtosLista.find(p => p.codigoBarras === produto.codigo_barras);

    if (produtoExistente) {
        // Se o produto já existir, aumenta a quantidade
        produtoExistente.quantidadeVendida += quantidadeVendida;
    } else {
        // Se o produto não existir, adiciona à lista
        produtosLista.push({
            codigoBarras: produto.codigo_barras, // Usando o nome correto
            descricao: produto.nome,              // Usando o nome correto
            valorUnitario: produto.preco_venda,   // Usando o nome correto
            quantidadeVendida: quantidadeVendida,
        });
        console.log(produtosLista)
    }
    // Atualiza a tabela
    atualizarTabela();
}

// Função para atualizar a tabela de produtos
function atualizarTabela() {
    const tabela = document.getElementById('produtosTabela');
    tabela.innerHTML = ''; // Limpa a tabela atual

    let subtotal = 0;

    produtosLista.forEach(produto => {
        const novaLinha = tabela.insertRow();
        const celulaCodigo = novaLinha.insertCell(0);
        const celulaDescricao = novaLinha.insertCell(1);
        const celulaQuantidadeVendida = novaLinha.insertCell(2);
        const celulaValorUnitario = novaLinha.insertCell(3);
        const celulaTotal = novaLinha.insertCell(4);

        celulaCodigo.textContent = produto.codigoBarras;
        celulaDescricao.textContent = produto.descricao;
        celulaQuantidadeVendida.textContent = produto.quantidadeVendida;

        // Verifica se valorUnitario é um número antes de chamar toFixed()
        const valorUnitario = parseFloat(produto.valorUnitario);
        if (!isNaN(valorUnitario)) {
            celulaValorUnitario.textContent = valorUnitario.toFixed(2);
            const total = valorUnitario * produto.quantidadeVendida;
            celulaTotal.textContent = total.toFixed(2);
            subtotal += total; // Adiciona ao subtotal
        } else {
            celulaValorUnitario.textContent = 'N/A'; // Se não for um número, mostra N/A
            celulaTotal.textContent = 'N/A'; // Também define o total como N/A
        }
    });

    // Atualiza o valor subtotal na interface
    document.getElementById('valor').value = subtotal.toFixed(2);
}

function removerUltimoItem() {
    const tabela = document.getElementById('produtosTabela');
    
    // Verifica se há linhas na tabela
    if (tabela.rows.length > 0) {
        tabela.deleteRow(tabela.rows.length - 1); // Remove a última linha
        atualizarSubtotal();
    } else {
        alert("Não há produtos no carrinho para remover.");
    }
}

//função para finalizar a venda
function finalizarVenda() {
    console.log(produtosLista);
    fetch('http://localhost:8080/venderProdutos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtosLista)
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Erro:', error));
}

// Função para calcular o subtotal
function atualizarSubtotal() {
    const tabela = document.getElementById('produtosTabela');
    let subtotal = 0;

    // Percorre as linhas da tabela e soma os valores
    for (let i = 0; i < tabela.rows.length; i++) {
        const totalCell = tabela.rows[i].cells[4].textContent; // Total da linha
        const valorTotal = parseFloat(totalCell.replace('R$ ', '').replace('.', '').replace(',', '.')); // Converte para número
        subtotal += valorTotal; // Adiciona ao subtotal
    }

    // Atualiza o campo de subtotal
    const subtotalField = document.getElementById('valor');
    subtotalField.value = `R$ ${subtotal.toFixed(2).replace('.', ',')}`; // Formata e atualiza o valor
}








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
    finalizarVenda();
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










document.getElementById('Voltar').addEventListener('click', function() {
    window.location.href = '../paginas/inicio.html';
});

function voltar() {
    window.location.href = '../paginas/inicio.html';
}

// Evitar o comportamento padrão do F5
window.addEventListener('keydown', function(event) {
    if (event.key === 'F5') {
        event.preventDefault(); // Impede a atualização da página
        pesquisarProduto(); // Chama a função para abrir o modal de pesquisa
    }
});

// Função para abrir o modal de pesquisa
function pesquisarProduto() {
    abrirModal(); // Abre o modal ao clicar na lupa ou pressionar F5
}


// Adiciona um listener para o evento de tecla pressionada
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'F4':
            pesquisarProduto(); // Ação para F4
            break;
        case 'F12':
            document.getElementById('pesquisar').click(); // Simula o clique no botão de pesquisar
            break;
        case 'F7':
            window.location.href = 'inicio.html'; // Redireciona para a página de início
            break;
        case 'F8':
            document.getElementById('botaoFinalizar').click(); // Simula o clique no botão de finalizar
            break;
        case 'F9':
            document.getElementById('botaoCancelar').click(); // Simula o clique no botão de cancelar
            break;
    }
});











