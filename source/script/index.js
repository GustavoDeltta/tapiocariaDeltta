const baseUrl = 'http://localhost:8080';
let basePrice = 0; // Variável para armazenar o preço base da comida
let cartItems = []; // Variável para armazenar os itens do carrinho

// Quando uma aba de comida é clicada, carrega os recheios correspondentes
document.getElementById('tapioca-tab').addEventListener('click', () => fetchFillings(1)); // Exemplo: ID 1 para Tapioca
document.getElementById('cuscuz-tab').addEventListener('click', () => fetchFillings(2)); // Exemplo: ID 2 para Cuscuz
document.getElementById('cuscuz-tab').addEventListener('click', () => fetchFillings(3));

// Função para carregar recheios com base no ID da comida
async function fetchFillings(foodId) {
    try {
        const response = await fetch(`${baseUrl}/food?id=${foodId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        basePrice = data.price; // Atualiza o preço base da comida

        const fillingsGrid = document.querySelector('.recheios-grid');
        fillingsGrid.innerHTML = ''; // Limpa os recheios anteriores

        // Renderizar recheios
        data.fillings.forEach(filling => {
            const div = document.createElement('div');
            div.className = 'recheio-item';
            div.textContent = `${filling.name} R$${filling.price}`;
            fillingsGrid.appendChild(div);

            // Adiciona ao carrinho ao clicar
            div.addEventListener('click', () => addToCart(filling));
        });
    } catch (error) {
        alert(`Erro ao carregar recheios: ${error.message}`);
    }
}

// Função para adicionar recheio ao carrinho
function addToCart(filling) {
    // Verifica se o recheio já está no carrinho
    if (!cartItems.some(item => item.name === filling.name)) {
        cartItems.push(filling); // Adiciona o recheio ao carrinho

        // Cria um item no checkout
        const checkoutDiv = document.querySelector('.checkout-itens');
        const div = document.createElement('div');
        div.dataset.name = filling.name;
        div.dataset.price = filling.price;
        div.textContent = `${filling.name} - R$ ${filling.price}`;
        checkoutDiv.appendChild(div);

        // Atualiza o preço total
        updateTotalPrice();
    }
}

// Função para atualizar o preço total
function updateTotalPrice() {
    const foodElement = document.getElementById('food');
    if (!foodElement) {
        console.error('Elemento com ID "food" não encontrado.');
        return; // Previna o erro
    }

    const foodId = foodElement.value;
    if (foodId === '0') return;

    fetch(`${baseUrl}/food?id=${foodId}`)
        .then(response => response.json())
        .then(data => {
            let totalPrice = data.price;

            const checkboxes = document.querySelectorAll('#recheiosList input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                totalPrice += parseFloat(checkbox.dataset.price);
            });

            const totalPriceElement = document.getElementById('totalPrice');
            if (totalPriceElement) {
                totalPriceElement.textContent = totalPrice.toFixed(2);
            } else {
                console.error('Elemento com ID "totalPrice" não encontrado.');
            }
        })
        .catch(error => console.error('Erro ao calcular o preço total:', error));
}

// Função para limpar o pedido
document.getElementById("clear-btn").addEventListener("click", () => {
    document.querySelector(".checkout-itens").innerHTML = ""; // Limpa os itens do carrinho
    cartItems = []; // Reseta o carrinho
    document.getElementById("total-price").innerText = "R$ 0,00"; // Reseta o preço total
});

// Função para processar o pagamento
document.getElementById("payment-btn").addEventListener("click", () => {
    const cpf = document.getElementById('cpf').value;
    if (!cpf || cartItems.length === 0) {
        alert("Por favor, preencha todos os campos e adicione itens ao carrinho.");
        return;
    }

    const description = "Comida com recheios";
    const price = basePrice + cartItems.reduce((sum, filling) => sum + filling.price, 0);

    // Envio dos dados para o servidor
    fetch(`${baseUrl}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `cpf=${cpf}&description=${encodeURIComponent(description)}&price=${price}`
    })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Erro ao processar o pagamento:', error));
});

window.onload = () => {
    // Carrega automaticamente a lista de comidas (se necessário) ou outra ação
};

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close");

// Abre o modal ao clicar no botão
openModalBtn.onclick = function () {
    modal.style.display = "block";
};

// Fecha o modal ao clicar no botão de fechar (X)
closeBtn.onclick = function () {
    modal.style.display = "none";
};

// Fecha o modal ao clicar fora da área de conteúdo
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};