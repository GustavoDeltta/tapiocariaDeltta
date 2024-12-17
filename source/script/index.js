const baseUrl = 'http://localhost:8080';
let basePrice = 0;
let cartItems = [];

document.getElementById('tapioca-tab').addEventListener('click', () => fetchFillings(1), updateTotalPrice(1));
document.getElementById('cuscuz-tab').addEventListener('click', () => fetchFillings(2), updateTotalPrice(2));
document.getElementById('cuscuz-tab').addEventListener('click', () => fetchFillings(3), updateTotalPrice(3));

async function fetchFillings(foodId) {
    try {
        const response = await fetch(`${baseUrl}/food?id=${foodId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        basePrice = data.basePrice;
        console.log("NCVDJNCJDNCJDN", data) 

        const fillingsGrid = document.querySelector('.recheios-grid');
        fillingsGrid.innerHTML = ''; 

        data.fillings.forEach(filling => {
            const div = document.createElement('div');
            div.className = 'recheio-item';
            div.textContent = `${filling.name} R$${filling.price}`;
            fillingsGrid.appendChild(div);

            div.addEventListener('click', () => addToCart(filling));
        });
    } catch (error) {
        alert(`Erro ao carregar recheios: ${error.message}`);
    }
}
var fillingPrice;
function addToCart(filling) {

    if (!cartItems.some(item => item.name === filling.name)) {
        cartItems.push(filling); 

        const checkoutDiv = document.querySelector('.checkout-itens');
        const div = document.createElement('div');
        div.dataset.name = filling.name;
        div.dataset.price = filling.price;
        div.textContent = `${filling.name} - R$ ${filling.price}`;
        checkoutDiv.appendChild(div);

        fillingPrice = filling.price

        updateTotalPrice();
    }
}

function updateTotalPrice() {

    var totalPrice = basePrice;

    const item = document.querySelectorAll('.checkout-itens');
    item.forEach(div => {
        console.log(div.children)
        totalPrice += parseFloat(fillingPrice);
    });

    console.log(item);

    // for(i of item){
    //     totalPrice += parseFloat(fillingPrice);
    // }

    console.log('Total Price:', totalPrice);

    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = totalPrice;
}

document.getElementById("clear-btn").addEventListener("click", () => {
    document.querySelector(".checkout-itens").innerHTML = "";
    cartItems = [];
    document.getElementById("total-price").innerText = "R$ 0.00";
});

document.getElementById("payment-btn").addEventListener("click", () => {
    const cpf = document.getElementById('cpf').value;
    if (!cpf || cartItems.length === 0) {
        alert("Por favor, preencha todos os campos e adicione itens ao carrinho.");
        return;
    }

    const description = "Comida com recheios";
    const price = basePrice + cartItems.reduce((sum, filling) => sum + filling.price, 0);

    fetch(`${baseUrl}/payment`, {
        method: 'POST',
        body: `cpf=${cpf}&description=${encodeURIComponent(description)}&price=${price}`
    })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Erro ao processar o pagamento:', error));
});

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close");

openModalBtn.onclick = function () {
    modal.style.display = "block";
};

closeBtn.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};