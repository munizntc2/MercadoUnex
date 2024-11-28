const products = [
    { id: 1, name: 'Arroz', price: 5.99, img: './imagens/arroz.png' },
    { id: 2, name: 'Feijão', price: 4.99, img: './imagens/feijao.png' },
    { id: 3, name: 'Macarrão', price: 3.99, img: './imagens/macarrao.png' },
    { id: 4, name: 'Óleo', price: 7.99, img: './imagens/oleo.png' }
];

let selectedProductId = null;
let selectedQuantity = 1;

function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-3', 'product-card');
        productCard.innerHTML = `
            <div class="card">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                    <button class="btn btn-outline-secondary" onclick="openQuantityModal(${product.id})">
                        Selecione a Quantidade
                    </button>
                    <button class="btn btn-primary mt-2" onclick="addToCart(${product.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

function openQuantityModal(productId) {
    selectedProductId = productId;
    selectedQuantity = 1;
    const quantityOptions = document.getElementById('quantity-options');
    quantityOptions.innerHTML = ''; 

    for (let i = 1; i <= 10; i++) {
        const optionButton = document.createElement('button');
        optionButton.classList.add('btn', 'btn-outline-primary', 'm-1');
        optionButton.textContent = i;
        optionButton.onclick = () => selectQuantity(i); 
        quantityOptions.appendChild(optionButton);
    }

    const applyButton = document.getElementById('apply-quantity-btn');
    applyButton.disabled = true;

    $('#quantityModal').modal('show');
}

function selectQuantity(quantity) {
    selectedQuantity = quantity;
    const applyButton = document.getElementById('apply-quantity-btn');
    applyButton.disabled = false;
}

document.getElementById('apply-quantity-btn').addEventListener('click', () => {
    const quantityButton = document.querySelector(`button[onclick="openQuantityModal(${selectedProductId})"]`);
    if (quantityButton) {
        quantityButton.textContent = `Quantidade: ${selectedQuantity}`;
    }
    $('#quantityModal').modal('hide'); 
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += selectedQuantity;
    } else {
        cart.push({ ...product, quantity: selectedQuantity });
    }

    setCart(cart);
    updateCart();
    showMessage(`${product.name} - Quantidade ${selectedQuantity} adicionada ao carrinho!`, 'success');
}

function showMessage(message, type = 'success') {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    messageContainer.setAttribute('role', 'alert');
    messageContainer.innerHTML = `
        ${message} 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    const container = document.querySelector('.container');
    container.insertBefore(messageContainer, container.firstChild);

    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.quantity * item.price;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name} - ${item.quantity} x R$ ${item.price.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    setCart(cart);
    updateCart();
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showError('Erro: O carrinho está vazio. Adicione itens antes de finalizar a compra.');
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    window.location.href = 'payment.html'; 
});

function showError(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
    messageContainer.role = 'alert';
    messageContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.container'); 
    container.insertBefore(messageContainer, container.firstChild);

    messageContainer.querySelector('.btn-close').addEventListener('click', function () {
        messageContainer.remove();
    });
}



window.onload = function () {
    loadProducts();
    updateCart();
};
