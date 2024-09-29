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
