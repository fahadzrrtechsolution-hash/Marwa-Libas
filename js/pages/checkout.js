


function renderCheckoutPage() {
    const appContent = document.getElementById('app-content');
    
    if (state.cart.length === 0) {
        appContent.innerHTML = `
            <div class="container text-center" style="padding: 100px 0;">
                <h2>Your cart is empty.</h2>
                <p style="margin: 20px 0;"><a href="#home" class="btn btn-primary">Go to Shopping</a></p>
            </div>
        `;
        return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 250; // Standard shipping in Pakistan
    const total = subtotal + shipping;

    let itemsHtml = '';
    state.cart.forEach(item => {
        itemsHtml += `
            <div style="display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-md); align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-md);">
                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 65px; object-fit: cover; border-radius: var(--border-radius);">
                <div style="flex: 1;">
                    <h4 style="font-size: 14px;">${item.title}</h4>
                    <span style="font-size: 12px; color: var(--color-text-secondary);">Size: ${item.size} x ${item.quantity}</span>
                </div>
                <span style="font-weight: 600;">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });

    appContent.innerHTML = `
        <div class="container">
            <h1 class="collection-title text-center" style="margin-top: var(--spacing-lg);">Checkout Details</h1>
            <div class="checkout-layout">
                <!-- Shipping Form -->
                <div>
                    <h3 style="margin-bottom: var(--spacing-md); text-transform: uppercase;">1. Delivery Address</h3>
                    <form id="checkout-form">
                        <div class="form-group">
                            <label for="chk-email">Email Address *</label>
                            <input type="email" id="chk-email" class="form-control" required placeholder="For receiving receipt">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div class="form-group">
                                <label for="chk-fname">First Name *</label>
                                <input type="text" id="chk-fname" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="chk-lname">Last Name *</label>
                                <input type="text" id="chk-lname" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="chk-address">Shipping Address *</label>
                            <input type="text" id="chk-address" class="form-control" placeholder="House/Apartment number, Street, Area" required>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div class="form-group">
                                <label for="chk-city">City *</label>
                                <input type="text" id="chk-city" class="form-control" required placeholder="e.g. Lahore, Karachi, Islamabad">
                            </div>
                            <div class="form-group">
                                <label for="chk-phone">Phone Number *</label>
                                <input type="tel" id="chk-phone" class="form-control" placeholder="e.g. 03001234567" required>
                            </div>
                        </div>

                        <h3 style="margin: var(--spacing-lg) 0 var(--spacing-md); text-transform: uppercase;">2. Payment Method</h3>
                        <div class="form-group" style="border: 1px solid var(--color-border); padding: var(--spacing-md); border-radius: var(--border-radius); display: flex; align-items: center; gap: var(--spacing-md);">
                            <input type="radio" id="pay-cod" name="payment" checked>
                            <label for="pay-cod" style="margin: 0; cursor: pointer; text-transform: none; font-size: 15px; font-weight: 500;">Cash on Delivery (COD)</label>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-lg);">Complete Order</button>
                    </form>
                </div>

                <!-- Order Summary -->
                <div>
                    <div class="checkout-summary-box">
                        <h3 style="margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-sm); text-transform: uppercase;">Order Summary</h3>
                        
                        <div style="max-height: 250px; overflow-y: auto; margin-bottom: var(--spacing-md);">
                            ${itemsHtml}
                        </div>

                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Subtotal</span>
                            <span>Rs. ${subtotal.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-sm);">
                            <span>Shipping</span>
                            <span>Rs. ${shipping}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px;">
                            <span>Total (PKR)</span>
                            <span style="color: var(--color-accent-dark);">Rs. ${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success screen
        appContent.innerHTML = `
            <div class="container text-center" style="padding: 100px 0; max-width: 600px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" style="margin-bottom: var(--spacing-md);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
                <h1 style="font-size: 36px; margin-bottom: var(--spacing-md);">Thank You!</h1>
                <h3 style="margin-bottom: var(--spacing-sm);">Your order has been placed successfully.</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">Your Order ID is #SK-${Math.floor(100000 + Math.random() * 900000)}. We have sent a confirmation email to <strong>${document.getElementById('chk-email').value}</strong>. Our support team will contact you shortly to confirm your dispatch.</p>
                <a href="#home" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;

        // Clear cart
        state.cart.length = 0; // Better way to clear array without reassigning
        saveState();
        renderCartDrawer();
    });
}
