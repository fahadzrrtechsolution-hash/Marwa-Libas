

function renderCartDrawer() {
    const itemsContainer = document.getElementById('cart-drawer-items');
    const drawerFooter = document.getElementById('cart-drawer-footer');
    
    if (state.cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <p>Your shopping cart is empty</p>
                <button class="btn btn-primary close-cart-drawer-btn" style="border: none;">Start Shopping</button>
            </div>
        `;
        drawerFooter.style.display = "none";
        
        const closeBtn = itemsContainer.querySelector('.close-cart-drawer-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('cart-drawer').classList.remove('active');
                document.getElementById('cart-drawer-overlay').classList.remove('active');
                document.body.style.paddingRight = '';
                document.body.style.overflow = '';
            });
        }
        return;
    }

    let itemsHtml = '';
    state.cart.forEach((item, index) => {
        itemsHtml += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-meta">Size: ${item.size}</p>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus-qty" data-index="${index}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn plus-qty" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-price-remove">
                    <span class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
                    <button class="cart-remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
    });

    itemsContainer.innerHTML = itemsHtml;
    
    // Subtotal
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-drawer-subtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    drawerFooter.style.display = "block";

    // Setup qty change listeners
    itemsContainer.querySelectorAll('.minus-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartQty(index, state.cart[index].quantity - 1);
        });
    });

    itemsContainer.querySelectorAll('.plus-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartQty(index, state.cart[index].quantity + 1);
        });
    });

    itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}
