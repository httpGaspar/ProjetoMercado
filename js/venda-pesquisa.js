let produtos = [];

// Função para buscar todos os produtos do endpoint
async function buscarProdutos() {
    try {
        const response = await fetch('http://localhost:8080/getProdutos');
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        produtos = await response.json();
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar a lista de produtos.');
    }
}

// Função para filtrar produtos com base no nome e mostrar no modal
function filtrarProdutos() {
    const input = document.getElementById('campoPesquisa').value.toLowerCase();
    const listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = ''; // Limpa a lista antes de adicionar novos produtos

    // Filtra os produtos que correspondem à pesquisa
    const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(input));

    // Se não houver produtos, avisa o usuário
    if (produtosFiltrados.length === 0) {
        listaProdutos.innerHTML = '<li>Nenhum produto encontrado.</li>';
        return;
    }

    // Adiciona os produtos filtrados à lista
    produtosFiltrados.forEach(produto => {
        const li = document.createElement('li');
        li.textContent = `${produto.nome} (Código: ${produto.codigo_barras}) - R$ ${produto.preco_venda.toFixed(2)}`;
        li.onclick = () => adicionarProdutoCarrinho(produto); // Adiciona evento de clique
        listaProdutos.appendChild(li);
    });
}

// Função para adicionar o produto ao carrinho
function adicionarProdutoCarrinho(produto) {
    // Lógica para adicionar o produto ao carrinho
    // Exemplo: pode ser uma função que adiciona o produto na tabela ou na lista de produtos no carrinho
    console.log('Produto adicionado ao carrinho:', produto);
    fecharModal('modalPesquisa'); // Fecha o modal após adicionar o produto
}

// Função para abrir o modal
function abrirModal() {
    document.getElementById('modalPesquisa').style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('modalPesquisa').style.display = 'none';
}

// Função para pesquisar produto ao clicar no botão de pesquisa
function pesquisarProduto() {
    abrirModal(); // Abre o modal ao clicar na lupa
}

// Chama a função para buscar os produtos ao carregar a página
window.onload = buscarProdutos;

// Função para adicionar o produto ao carrinho
function adicionarProdutoCarrinho(produto) {
    const tabela = document.getElementById('produtosTabela');
    
    // Verifica se o produto já existe na tabela
    const linhaExistente = Array.from(tabela.rows).find(row => row.cells[0].textContent === produto.codigo_barras);
    
    if (linhaExistente) {
        // Se o produto já existe, atualiza a quantidade e o total
        const quantidadeCell = linhaExistente.cells[2]; // Célula da quantidade
        const valorUnitarioCell = linhaExistente.cells[3]; // Célula do valor unitário
        const totalCell = linhaExistente.cells[4]; // Célula do total

        const novaQuantidade = parseInt(quantidadeCell.textContent) + 1; // Incrementa a quantidade
        quantidadeCell.textContent = novaQuantidade; // Atualiza a quantidade

        // Atualiza o total
        const valorUnitario = parseFloat(valorUnitarioCell.textContent.replace('R$ ', '').replace(',', '.'));
        const novoTotal = novaQuantidade * valorUnitario;
        totalCell.textContent = `R$ ${novoTotal.toFixed(2).replace('.', ',')}`; // Atualiza o total
    } else {
        // Se o produto não existe, cria uma nova linha na tabela
        const novaLinha = tabela.insertRow();

        // Adiciona as células na nova linha
        novaLinha.insertCell(0).textContent = produto.codigo_barras; // Código de Barras
        novaLinha.insertCell(1).textContent = produto.nome; // Descrição
        novaLinha.insertCell(2).textContent = '1'; // Quantidade inicial
        novaLinha.insertCell(3).textContent = `R$ ${produto.preco_venda.toFixed(2).replace('.', ',')}`; // Valor Unitário
        novaLinha.insertCell(4).textContent = `R$ ${produto.preco_venda.toFixed(2).replace('.', ',')}`; // Total (inicialmente igual ao valor unitário)
    }
    produtosLista.push({
        codigoBarras: produto.codigo_barras, // Usando o nome correto
        descricao: produto.nome,              // Usando o nome correto
        valorUnitario: produto.preco_venda,   // Usando o nome correto
        quantidadeVendida: 1,
    });
    console.log(produtosLista);
    atualizarSubtotal();

    // Fecha o modal após adicionar o produto
    fecharModal('modalPesquisa');
}

// Adiciona evento de escuta ao input
document.getElementById('productName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        pesquisarProdutos(); // Chama a função de pesquisa ao pressionar "Enter"
    }
});

// Função para pesquisar produtos
function pesquisarProdutos() {
    const input = document.getElementById('productName').value.trim();

    if (input) {
        // Chama a API para pegar a lista de produtos
        fetch('http://localhost:8080/getProdutos')
            .then(response => response.json())
            .then(produtos => {
                // Filtra produtos com base no input
                const produtosFiltrados = produtos.filter(produto => 
                    produto.nome.toLowerCase().includes(input.toLowerCase())
                );

                // Exibe os produtos no modal
                exibirProdutosModal(produtosFiltrados);
            })
            .catch(error => console.error('Erro ao buscar produtos:', error));
    } else {
        alert('Por favor, insira um nome de produto para pesquisar.');
    }
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
