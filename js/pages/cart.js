function renderCartPage() {
    const appContent = document.getElementById('app-content');
    
    if (state.cart.length === 0) {
        appContent.innerHTML = `
            <div class="container text-center" style="padding: 100px 0;">
                <h2>Your cart is empty.</h2>
                <p style="margin: 20px 0;"><a href="#home" class="btn btn-primary">Continue Shopping</a></p>
            </div>
        `;
        return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let itemsHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;" class="cart-table-desktop">
            <thead>
                <tr style="border-bottom: 1px solid var(--color-border); text-align: left;">
                    <th style="padding: 15px 0; font-weight: 500; font-size: 13px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 1px;">Product</th>
                    <th style="padding: 15px 0; font-weight: 500; font-size: 13px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 1px; text-align: center;">Quantity</th>
                    <th style="padding: 15px 0; font-weight: 500; font-size: 13px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 1px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    state.cart.forEach((item, index) => {
        itemsHtml += `
            <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 30px 0;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <img src="${item.image}" alt="${item.title}" style="width: 100px; height: 130px; object-fit: cover; border-radius: var(--border-radius);">
                        <div>
                            <h4 style="margin-bottom: 8px; font-size: 16px; font-weight: 500;"><a href="#product/${item.productId}" style="color: inherit; text-decoration: none;">${item.title}</a></h4>
                            <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 10px;">Size: ${item.size}</p>
                            <p style="font-size: 14px;">Rs. ${item.price.toLocaleString()}</p>
                        </div>
                    </div>
                </td>
                <td style="padding: 30px 0; text-align: center; vertical-align: middle;">
                    <div class="cart-item-qty" style="justify-content: center; margin: 0 auto; margin-bottom: 10px;">
                        <button class="qty-btn cp-minus-qty" data-index="${index}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn cp-plus-qty" data-index="${index}">+</button>
                    </div>
                    <button class="cart-page-remove" data-index="${index}" style="background: none; border: none; color: var(--color-text-secondary); text-decoration: underline; cursor: pointer; font-size: 13px; padding: 0;">Remove</button>
                </td>
                <td style="padding: 30px 0; text-align: right; vertical-align: middle; font-weight: 500; font-size: 16px;">
                    Rs. ${(item.price * item.quantity).toLocaleString()}
                </td>
            </tr>
        `;
    });

    itemsHtml += `
            </tbody>
        </table>
    `;

    appContent.innerHTML = `
        <div class="container" style="max-width: 1200px; padding: 80px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px;">
                <h1 style="font-size: 40px; font-weight: 400; margin: 0; font-family: 'Playfair Display', serif;">Your cart</h1>
                <a href="#home" style="color: var(--color-text-secondary); text-decoration: underline; font-size: 14px;">Continue shopping</a>
            </div>
            
            ${itemsHtml}
            
            <div style="display: flex; justify-content: flex-end;">
                <div style="width: 100%; max-width: 350px; text-align: right;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 18px;">
                        <span>Subtotal</span>
                        <span style="font-weight: 500;">Rs. ${subtotal.toLocaleString()}</span>
                    </div>
                    <p style="color: var(--color-text-secondary); font-size: 14px; margin-bottom: 25px;">Taxes and shipping calculated at checkout</p>
                    <a href="#checkout" class="btn btn-primary btn-block" style="font-size: 16px; padding: 15px; letter-spacing: 1px;">Check out</a>
                </div>
            </div>
        </div>
        <style>
            @media(max-width: 767px) {
                .cart-table-desktop thead { display: none; }
                .cart-table-desktop tr { display: block; padding-bottom: 20px; }
                .cart-table-desktop td { display: block; text-align: left !important; padding: 15px 0 !important; }
                .cart-table-desktop td:nth-child(2) { display: flex; justify-content: space-between; align-items: center; padding-top: 0 !important; }
                .cart-table-desktop td:nth-child(2) .cart-item-qty { margin: 0 !important; }
                .cart-table-desktop td:nth-child(3) { display: none; } /* Hide total column on mobile, price is in product details */
            }
        </style>
    `;

    // Setup listeners
    appContent.querySelectorAll('.cp-minus-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartQty(index, state.cart[index].quantity - 1);
            if (window.location.hash === '#cart') renderCartPage(); // Re-render this page
        });
    });

    appContent.querySelectorAll('.cp-plus-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartQty(index, state.cart[index].quantity + 1);
            if (window.location.hash === '#cart') renderCartPage(); // Re-render this page
        });
    });

    appContent.querySelectorAll('.cart-page-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
            if (window.location.hash === '#cart') renderCartPage(); // Re-render this page
        });
    });
}
