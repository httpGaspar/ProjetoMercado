document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const btn = document.querySelector('button'); // Botão "Adicionar Itens"
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('formProduto');
    const tbody = document.querySelector('#estoque tbody');

    // Abre o modal
    btn.onclick = function() {
        modal.style.display = 'block';
    }

    // Fecha o modal
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Fecha o modal ao clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
)