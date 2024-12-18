const baseUrl = 'http://localhost:8080';
let basePrice = 0;
let cartItems = [];

document.getElementById('tapioca-tab').addEventListener('click', () => fetchFillings(1));
document.getElementById('cuscuz-tab').addEventListener('click', () => fetchFillings(2));
document.getElementById('sanduiche-tab').addEventListener('click', () => fetchFillings(3));

var foodID = 0;

async function fetchFillings(foodId) {
    try {
        const response = await fetch(`${baseUrl}/food?id=${foodId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        basePrice = data.basePrice;
        foodID = foodId;

        cartItems = [];
        document.querySelector(".checkout-itens").innerHTML = "";
        document.getElementById("total-price").innerText = "R$ 0.00";

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
        div.id = "checkout-item";
        div.dataset.name = filling.name;
        div.dataset.price = filling.price;
        div.textContent = `${filling.name} - R$ ${filling.price}`;
        checkoutDiv.appendChild(div);

        fillingPrice = filling.price

        calcularTotal();
    }
}

var saleFillings = [];
var saleDescription = "";
var totalPrice = 0;

function calcularTotal() {

    const items = document.querySelectorAll('#checkout-item');
    totalPrice = basePrice;

    items.forEach(item => {
        const price = parseFloat(item.dataset.price);
        const filling = item.dataset.name;

        if(!saleFillings.includes(" " + filling)){
            saleFillings.push(" " + filling)
        };

        if (!isNaN(price)) {
            totalPrice += price;
        }
    });

    saleDescription = saleFillings.toString();
    console.log(saleDescription);

    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = "R$ " + totalPrice.toFixed(2);
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

    const currentDate = new Date().toISOString();

    fetch(`${baseUrl}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            idFood: foodID, 
            cpf: cpf,
            saleDate: currentDate, 
            description: saleDescription,
            price: totalPrice
        })
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