document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.getElementById("home-section");
    const cartSection = document.getElementById("cart-section");
    const homeLink = document.getElementById("home-link");
    const cartLink = document.getElementById("cart-link");
    const productList = document.getElementById("product-list");
    const cartItemsContainer = document.getElementById("cart-items");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    let cart = [];
    let products = [];

  
    homeLink.addEventListener("click", () => {
        homeSection.classList.remove("hidden");
        cartSection.classList.add("hidden");
    });

  
    cartLink.addEventListener("click", () => {
        homeSection.classList.add("hidden");
        cartSection.classList.remove("hidden");
        renderCart();  
    });


    function fetchProducts() {
        fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889")
            .then(response => response.json())
            .then(data => {
                products = data.items; 
                renderProducts(products); 
            });
    }


    function renderProducts(products) {
        productList.innerHTML = "";
        products.forEach(item => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-item");
            productElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="product-image">
                <h3>${item.title}</h3>
                <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
                <button class="add-to-cart" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-image="${item.image}">Add to Cart</button>
            `;
            productList.appendChild(productElement);
        });

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", event => {
                addToCart(event.target.dataset);
            });
        });
    }

   
    function addToCart(product) {
        const existingItem = cart.find(item => item.id == product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: product.id, title: product.title, price: parseInt(product.price), image: product.image, quantity: 1 });
        }
        renderCart();
    }

 
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
                    <input type="number" value="${item.quantity}" min="1" class="cart-item-quantity" data-id="${item.id}">
                    <p class="cart-item-subtotal">Subtotal: ₹${((item.price * item.quantity) / 100).toFixed(2)}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        document.getElementById("subtotal").textContent = `₹${(subtotal / 100).toFixed(2)}`;
        document.getElementById("total").textContent = `₹${(subtotal / 100).toFixed(2)}`;

  
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", event => {
                cart = cart.filter(item => item.id != event.target.dataset.id);
                renderCart();
            });
        });

        
        document.querySelectorAll(".cart-item-quantity").forEach(input => {
            input.addEventListener("change", (event) => {
                const itemId = event.target.dataset.id;
                const newQuantity = parseInt(event.target.value);

                const item = cart.find(item => item.id == itemId);
                if (item) {
                    item.quantity = newQuantity;
                }

                renderCart();
            });
        });
    }


    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(query)
        );
        renderProducts(filteredProducts);    });

    fetchProducts();
});
