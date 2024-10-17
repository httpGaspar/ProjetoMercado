// Captura o botão de cadastro
document.getElementById('registerButton').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os valores dos campos de input
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verifica se os campos não estão vazios
    if (!username || !password) {
        document.getElementById('registerResponse').innerHTML = "Por favor, preencha todos os campos.";
        return;
    }

    // Cria o objeto de dados para enviar à API
    const registerData = {
        username: username,
        password: password
    };

    // Faz a requisição POST ao endpoint de cadastro
    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    })
    .then(response => response.json())  // Converte a resposta para JSON
    .then(data => {
        // Exibe a resposta da API
        if (data.success) {
            document.getElementById('registerResponse').innerHTML = "Usuário cadastrado com sucesso!";
        } else {
            document.getElementById('registerResponse').innerHTML = "Erro ao cadastrar: " + data.message;
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
        document.getElementById('registerResponse').innerHTML = "Erro ao tentar cadastrar.";
    });
});
