window.onload = function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartSummary = document.getElementById('cart-summary');
    const cartItemsSummary = document.getElementById('cart-items-summary');
    const totalPriceElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsSummary.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalPriceElement.textContent = "R$ 0,00";
    } else {
        let cartContent = "";
        let totalPrice = 0;

        cart.forEach(item => {
            cartContent += `<p>${item.name} - ${item.quantity} x R$ ${item.price.toFixed(2)}</p>`;
            totalPrice += item.price * item.quantity;
        });

        cartItemsSummary.innerHTML = cartContent;
        totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    const paymentMethod = document.getElementById('payment-method');
    paymentMethod.addEventListener('change', function () {
        if (this.value === 'credit-card') {
            document.getElementById('card-details').style.display = 'block';
        } else {
            document.getElementById('card-details').style.display = 'none';
        }
    });

    document.getElementById('payment-form').addEventListener('submit', function (event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const cardNumber = document.getElementById('card-number').value;

        if (!name || !address || !paymentMethod) {
            document.getElementById('error-message').textContent = 'Todos os campos são obrigatórios.';
            document.getElementById('error-message').style.display = 'block';
            return;
        }

        if (paymentMethod === 'credit-card' && (!cardNumber || cardNumber.length < 16)) {
            document.getElementById('error-message').textContent = 'Por favor, insira um número de cartão válido.';
            document.getElementById('error-message').style.display = 'block';
            return;
        }

        localStorage.removeItem('cart');  
        alert('Compra realizada com sucesso!');  
        window.location.href = 'index.html'; 
    });
};
