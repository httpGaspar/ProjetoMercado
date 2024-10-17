// URL da API que retorna os produtos
const apiUrl = 'http://localhost:8080/getProdutos'; // Altere para o endpoint correto da sua API

// Função para buscar produtos do banco de dados pela API
async function buscarProdutos() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        const produtos = await response.json(); // Recebe o JSON com os dados dos produtos
        preencherTabela(produtos);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para preencher a tabela com os dados dos produtos
function preencherTabela(produtos) {
    const tabela = document.querySelector('#estoque tbody'); // Seleciona o corpo da tabela

    // Limpa as linhas da tabela
    tabela.innerHTML = '';

    // Itera sobre a lista de produtos recebida da API
    produtos.forEach(produto => {
        const linha = document.createElement('tr'); // Cria uma nova linha

        const button = document.createElement('button');
        button.className = 'btn-cancelar';
        button.onclick = function() {
          CancelarProduto(parseInt(produto.codigo_barras, 10));
        };
        button.textContent = 'excluir';
        
        linha.innerHTML = `
          <td>${produto.nome}</td>
          <td>${produto.codigo_barras}</td>
          <td>${produto.ncm}</td>
          <td>${produto.quantidade}</td>
          <td>${produto.preco_venda}</td>
        `;
        linha.appendChild(button);
        
        // Adiciona a linha à tabela
        tabela.appendChild(linha);
    });
}

async function CancelarProduto(id) {
    try {
        const url = `http://localhost:8080/deleteProduto/${+id}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });
        console.log(id);
        if (!response.ok) {
            throw new Error('Erro ao deletar produtos.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
    preencherTabela();
}

// URL da API para salvar novos produtos
const apiUrlSaveProduto = 'http://localhost:8080/saveProduto';

// Função para cadastrar um novo produto
async function cadastrarProduto(event) {
    event.preventDefault(); // Impede o reload da página

    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const codigo = document.getElementById('codigo').value;
    const ncm = document.getElementById('ncm').value;
    const quantidade = document.getElementById('quantidade').value;
    const valor = document.getElementById('valor').value;
    const lucro = document.getElementById('lucro').value;

    // Cria o objeto do produto a ser enviado
    const novoProduto = {
        nome: nome,
        codigo_barras: codigo,
        ncm: ncm,
        quantidade: quantidade,
        preco_compra: valor,
        lucro: lucro
    };

    // Exibe o JSON no console
    console.log('JSON enviado:', JSON.stringify(novoProduto));

    try {
        // Envia o produto via POST para a API de cadastro
        const response = await fetch(apiUrlSaveProduto, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoProduto), // Converte o objeto em JSON para enviar na requisição
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar o produto.');
        }

        // Fecha o modal após o sucesso
        fecharModal();

        // Atualiza a lista de produtos após o cadastro
        buscarProdutos();

    } catch (error) {
        console.error('Erro ao cadastrar o produto:', error);
        alert('Erro ao cadastrar o produto.');
    }
}

// Função para abrir o modal
function abrirModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';

    // Limpa os campos do formulário
    document.getElementById('formProduto').reset();
}

// Chama a função de buscar produtos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    buscarProdutos();

    // Modal e botões para abrir e fechar
    const modal = document.getElementById('modal');
    const btn = document.querySelector('button.adicionar'); // Botão "Adicionar Itens"
    const span = document.querySelector('.close'); // Botão de fechar 

    // Abre o modal ao clicar no botão
    btn.onclick = function() {
        abrirModal();
    }

    // Fecha o modal ao clicar no "x"
    span.onclick = function() {
        fecharModal();
    }

    // Fecha o modal ao clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            fecharModal();
        }
    }

    // Adiciona o evento de submit ao formulário de cadastro
    const form = document.getElementById('formProduto');
    form.addEventListener('submit', cadastrarProduto);
});
