// Array que simula o banco de dados dos clientes
let clientes = [];

// Função para validar o CPF
function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // CPF com números repetidos

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    // Validação do segundo dígito
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Função para verificar se o CPF já está cadastrado
function isUniqueCPF(cpf) {
    return !clientes.some(client => client.cpf === cpf);
}

// Função para validar o formulário
function validateForm(event) {
    event.preventDefault(); // Impede o envio do formulário

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const endereco = document.getElementById('endereco').value.trim();
    const errorMessages = document.getElementById('errorMessages');
    errorMessages.innerHTML = ''; // Limpa as mensagens de erro

    let isValid = true;

    // Validação de campos obrigatórios
    if (!nome || !cpf || !dataNascimento || !endereco) {
        errorMessages.innerHTML += '<p>Todos os campos são obrigatórios!</p>';
        isValid = false;
    }

    // Validação de CPF
    if (cpf && !isValidCPF(cpf)) {
        errorMessages.innerHTML += '<p>CPF inválido!</p>';
        isValid = false;
    }

    // Validação de CPF único
    if (cpf && !isUniqueCPF(cpf)) {
        errorMessages.innerHTML += '<p>CPF já cadastrado!</p>';
        isValid = false;
    }

    // Se o formulário for válido, salva o cliente
    if (isValid) {
        saveClientData(nome, cpf, dataNascimento, endereco);
    }
}

// Função para salvar os dados do cliente
function saveClientData(nome, cpf, dataNascimento, endereco) {
    // Salva os dados na "base de dados"
    clientes.push({ nome, cpf, dataNascimento, endereco });

    // Exibe mensagem de sucesso
    document.getElementById('errorMessages').innerHTML = '<p>Cliente salvo com sucesso!</p>';
    document.getElementById('clientForm').reset();  // Limpa o formulário

    updateClientTable(); // Atualiza a tabela de clientes
}

// Função para atualizar a tabela de clientes
function updateClientTable() {
    const tableBody = document.getElementById('clientTableBody');
    tableBody.innerHTML = ''; // Limpa a tabela antes de atualizar

    // Verifica se há clientes cadastrados
    if (clientes.length === 0) {
        const noDataRow = tableBody.insertRow();
        noDataRow.innerHTML = '<td colspan="5" style="text-align: center;">Nenhum cliente cadastrado</td>';
        return;
    }

    // Adiciona cada cliente à tabela
    clientes.forEach(client => {
        const row = tableBody.insertRow(); // Cria uma nova linha na tabela
        row.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.cpf}</td>
            <td>${client.dataNascimento}</td>
            <td>${client.endereco}</td>
            <td>
                <button onclick="editClient('${client.cpf}')">Editar</button>
                <button onclick="deleteClient('${client.cpf}')">Excluir</button>
            </td>
        `;
    });
}

// Função para editar os dados do cliente
function editClient(cpf) {
    const client = clientes.find(c => c.cpf === cpf);
    if (client) {
        document.getElementById('nome').value = client.nome;
        document.getElementById('cpf').value = client.cpf;
        document.getElementById('dataNascimento').value = client.dataNascimento;
        document.getElementById('endereco').value = client.endereco;
        deleteClient(cpf); // Exclui o cliente antigo antes de salvar as edições
    }
}

// Função para excluir os dados do cliente
function deleteClient(cpf) {
    clientes = clientes.filter(client => client.cpf !== cpf); // Remove o cliente com o CPF fornecido
    updateClientTable(); // Atualiza a tabela
}

// Vinculando o evento de envio do formulário
document.getElementById('clientForm').addEventListener('submit', validateForm);

// Função para carregar os clientes ao carregar a página
document.addEventListener('DOMContentLoaded', updateClientTable);
