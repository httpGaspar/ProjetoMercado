document.getElementById('Venda').addEventListener('click', function() {
    window.location.href = '../PaginaDeVenda/venda.html';
});

document.getElementById('Estoque').addEventListener('click', function() {
    window.location.href = '../PaginaDeEstoque/estoque.html';
});

//ainda tem que ser criada
document.getElementById('Sair').addEventListener('click', function() {
    window.location.href = '../PaginasDeCadastroLogin/login.html';
});

function irParaVenda() {
    window.location.href = '../PaginaDeVenda/venda.html';
}

function irParaEstoque() {
    window.location.href = '../PaginaDeEstoque/estoque.html';}

function sair() {
    window.location.href = '../PaginasDeCadastroLogin/login.html'
}

document.getElementById('Venda').addEventListener('click', irParaVenda);
document.getElementById('Estoque').addEventListener('click', irParaEstoque);
document.getElementById('Sair').addEventListener('click', sair);

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'F1':
            event.preventDefault();
            irParaVenda();
            break;
        case 'F2':
            event.preventDefault();
            irParaEstoque();
            break;
        case 'F4':
            event.preventDefault();
            sair();
            break;
    }
});