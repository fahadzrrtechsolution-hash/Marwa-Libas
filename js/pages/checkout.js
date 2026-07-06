


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
    const shipping = 149; // Updated to match user's screenshot
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
        <style>
            .shopify-checkout {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #333333;
                text-align: left;
            }
            .shopify-checkout h2 {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 15px;
                margin-top: 35px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-transform: none;
                letter-spacing: normal;
                font-family: inherit;
            }
            .shopify-checkout h2 a {
                font-size: 14px;
                color: #0068C9;
                text-decoration: none;
                font-weight: 400;
            }
            .shopify-checkout h2 a:hover {
                text-decoration: underline;
            }
            .shopify-checkout .help-text {
                font-size: 13px;
                color: #737373;
                margin-top: -10px;
                margin-bottom: 15px;
                font-weight: 400;
            }
            .shopify-checkout .field-row {
                display: flex;
                gap: 14px;
                margin-bottom: 14px;
            }
            .shopify-checkout .field-full {
                margin-bottom: 14px;
            }
            .shopify-checkout .input-wrapper {
                position: relative;
                width: 100%;
                background: #fff;
            }
            .shopify-checkout .input-wrapper select,
            .shopify-checkout .input-wrapper input {
                width: 100%;
                border: 1px solid #d9d9d9;
                border-radius: 5px;
                padding: 13px;
                font-size: 14px;
                transition: all 0.2s ease;
                box-sizing: border-box;
                font-family: inherit;
                background-color: transparent;
            }
            .shopify-checkout .input-wrapper input::placeholder {
                color: #737373;
            }
            .shopify-checkout .input-wrapper input:focus,
            .shopify-checkout .input-wrapper select:focus {
                outline: none;
                border-color: #0068C9;
                box-shadow: 0 0 0 2px #0068c933;
            }
            .shopify-checkout .input-wrapper .floating-label {
                position: absolute;
                left: 13px;
                top: 5px;
                font-size: 12px;
                color: #737373;
                pointer-events: none;
            }
            .shopify-checkout .input-wrapper.has-floating select {
                padding-top: 22px;
                padding-bottom: 4px;
                appearance: none;
                -webkit-appearance: none;
            }
            .shopify-checkout .input-wrapper .select-arrow {
                position: absolute;
                right: 13px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                color: #737373;
            }
            .shopify-checkout .input-wrapper .help-icon {
                position: absolute;
                right: 13px;
                top: 50%;
                transform: translateY(-50%);
                color: #737373;
                cursor: pointer;
            }
            .shopify-checkout .checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
                margin-bottom: 15px;
            }
            .shopify-checkout .checkbox-wrapper input[type="checkbox"] {
                width: 18px;
                height: 18px;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                cursor: pointer;
                accent-color: #0068C9;
            }
            .shopify-checkout .checkbox-wrapper label {
                font-size: 14px;
                color: #333;
                cursor: pointer;
            }
            .shopify-checkout .content-box {
                border: 1px solid #d9d9d9;
                border-radius: 5px;
                background: #fff;
                margin-bottom: 20px;
            }
            .shopify-checkout .content-box-row {
                padding: 16px;
                display: flex;
                align-items: center;
                border: 1px solid transparent;
                cursor: pointer;
                position: relative;
            }
            .shopify-checkout .content-box-row:not(:last-child) {
                border-bottom-color: #d9d9d9;
            }
            .shopify-checkout .content-box-row.active {
                background-color: #f2f7fe;
                border-color: #0068C9;
                border-radius: 5px;
                box-shadow: 0 0 0 1px #0068C9;
                z-index: 2;
            }
            .shopify-checkout .content-box-row.active + .content-box-row {
                border-top-color: transparent;
            }
            .shopify-checkout .content-box-row input[type="radio"] {
                width: 18px;
                height: 18px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: #0068C9;
            }
            .shopify-checkout .content-box-row .label-text {
                font-size: 14px;
                color: #333;
                flex: 1;
            }
            .shopify-checkout .content-box-row .price-text {
                font-size: 14px;
                font-weight: 500;
                color: #333;
            }
            .shopify-checkout .btn-submit {
                background-color: #0068C9;
                color: white;
                width: 100%;
                padding: 18px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                transition: background-color 0.2s ease;
                font-family: inherit;
            }
            .shopify-checkout .btn-submit:hover {
                background-color: #0056a6;
            }
            @media(max-width: 767px) {
                .checkout-layout {
                    grid-template-columns: 1fr !important;
                }
                .shopify-checkout .field-row {
                    flex-direction: column;
                }
            }
        </style>
        <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 40px 20px;">
            <div class="checkout-layout" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px;">
                <!-- Shipping Form -->
                <div class="shopify-checkout">
                    <form id="checkout-form">
                        
                        <h2 style="margin-top: 0;">Contact <a href="#login">Sign in</a></h2>
                        <div class="field-full">
                            <div class="input-wrapper">
                                <input type="text" id="chk-email" placeholder="Email or mobile phone number" required>
                                <svg class="help-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                        </div>
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="chk-news" checked>
                            <label for="chk-news">Email me with news and offers</label>
                        </div>

                        <h2>Delivery</h2>
                        <div class="field-full">
                            <div class="input-wrapper has-floating">
                                <span class="floating-label">Country/Region</span>
                                <select id="chk-country">
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="UAE">United Arab Emirates</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="USA">United States</option>
                                </select>
                                <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                        
                        <div class="field-row">
                            <div class="input-wrapper">
                                <input type="text" id="chk-fname" placeholder="First name" required>
                            </div>
                            <div class="input-wrapper">
                                <input type="text" id="chk-lname" placeholder="Last name" required>
                            </div>
                        </div>

                        <div class="field-full">
                            <div class="input-wrapper">
                                <input type="text" id="chk-address" placeholder="Address" required>
                            </div>
                        </div>

                        <div class="field-full">
                            <div class="input-wrapper">
                                <input type="text" id="chk-apt" placeholder="Apartment, suite, etc. (optional)">
                            </div>
                        </div>

                        <div class="field-row">
                            <div class="input-wrapper">
                                <input type="text" id="chk-city" placeholder="City" required>
                            </div>
                            <div class="input-wrapper">
                                <input type="text" id="chk-postal" placeholder="Postal code (optional)">
                            </div>
                        </div>

                        <div class="field-full">
                            <div class="input-wrapper">
                                <input type="tel" id="chk-phone" placeholder="Phone" required>
                                <svg class="help-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                        </div>

                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="chk-save-info">
                            <label for="chk-save-info">Save this information for next time</label>
                        </div>

                        <h2>Shipping method</h2>
                        <div class="content-box">
                            <div class="content-box-row active" style="cursor: default;">
                                <span class="label-text" style="font-size: 13px;">SHIPPING COST</span>
                                <span class="price-text">Rs 149.00</span>
                            </div>
                        </div>

                        <h2>Payment</h2>
                        <p class="help-text">All transactions are secure and encrypted.</p>
                        <div class="content-box">
                            <label class="content-box-row active">
                                <input type="radio" name="payment" value="cod" checked>
                                <span class="label-text">Cash on Delivery (COD)</span>
                            </label>
                            <label class="content-box-row">
                                <input type="radio" name="payment" value="bank">
                                <span class="label-text">Bank Deposit</span>
                            </label>
                            <div id="bank-details-box" style="display: none; padding: 20px 16px; background-color: #f4f4f4; font-size: 14px; color: #333; line-height: 1.5; border-top: 1px solid #d9d9d9; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">
                                Bank Name: Faysal Bank<br>
                                IBAN Number: PK33FAYS3395475000001668<br>
                                Account Title: IBTSAAM AHMAR
                            </div>
                        </div>

                        <h2>Billing address</h2>
                        <div class="content-box">
                            <label class="content-box-row active">
                                <input type="radio" name="billing" value="same" checked>
                                <span class="label-text">Same as shipping address</span>
                            </label>
                            <label class="content-box-row">
                                <input type="radio" name="billing" value="different">
                                <span class="label-text">Use a different billing address</span>
                            </label>
                        </div>

                        <button type="submit" class="btn-submit">Complete order</button>
                    </form>
                </div>

                <!-- Order Summary -->
                <div style="background: #fafafa; position: relative;">
                    <div style="background: #fafafa; border-left: 1px solid var(--color-border); padding: 0 0 0 40px; position: sticky; top: 100px; height: 100%;">
                        <div style="max-height: calc(100vh - 200px); overflow-y: auto; margin-bottom: var(--spacing-md); padding-right: 10px;">
                            ${itemsHtml}
                        </div>

                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
                            <span style="color: var(--color-text-secondary);">Subtotal</span>
                            <span style="font-weight: 500;">Rs. ${subtotal.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-md); font-size: 14px;">
                            <span style="color: var(--color-text-secondary);">Shipping</span>
                            <span style="font-weight: 500;">Rs. ${shipping.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; align-items: center;">
                            <span>Total</span>
                            <span style="font-size: 24px;">Rs. ${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for radio buttons to update active styling
    const radioInputs = document.querySelectorAll('.shopify-checkout input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            const box = this.closest('.content-box');
            if (!box) return;
            const rows = box.querySelectorAll('.content-box-row');
            rows.forEach(r => r.classList.remove('active'));
            this.closest('.content-box-row').classList.add('active');
            
            if (this.name === 'payment') {
                const bankDetails = document.getElementById('bank-details-box');
                if (bankDetails) {
                    bankDetails.style.display = this.value === 'bank' ? 'block' : 'none';
                }
            }
        });
    });

    document.getElementById('checkout-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing Order...';
        submitBtn.disabled = true;

        try {
            const orderId = 'ML-' + Math.floor(100000 + Math.random() * 900000);
            const email = document.getElementById('chk-email').value;
            const firstName = document.getElementById('chk-fname').value;
            const lastName = document.getElementById('chk-lname').value;
            const address = document.getElementById('chk-address').value;
            const apartment = document.getElementById('chk-apartment') ? document.getElementById('chk-apartment').value : '';
            const city = document.getElementById('chk-city').value;
            const phone = document.getElementById('chk-phone').value;
            
            // Collect order items
            const orderItems = state.cart.map(item => ({
                id: item.id,
                title: item.title,
                size: item.size,
                price: item.price,
                quantity: item.quantity,
                image: item.images ? item.images[0] : ''
            }));

            const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 250;
            const total = subtotal + shipping;

            const orderData = {
                orderId,
                customer: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    address,
                    apartment,
                    city
                },
                items: orderItems,
                subtotal,
                shipping,
                total,
                status: 'Pending',
                date: new Date().toISOString()
            };

            // 1. Save to Firebase Database
            let fireDb = typeof db !== 'undefined' ? db : window.db;
            if (fireDb) {
                await fireDb.collection('marwa_orders').doc(orderId).set(orderData);
                
                // 1.5 Deduct Stock
                for (let item of orderItems) {
                    try {
                        const productRef = fireDb.collection('marwa_products').doc(item.id);
                        const docSnapshot = await productRef.get();
                        if (docSnapshot.exists) {
                            const pData = docSnapshot.data();
                            if (!pData.isExternal) {
                                let currentStock = pData.stock !== undefined ? pData.stock : 10;
                                let newStock = currentStock - item.quantity;
                                if (newStock < 0) newStock = 0;
                                await productRef.update({ stock: newStock });
                            }
                        }
                    } catch(e) {
                        console.error('Error updating stock for item', item.id, e);
                    }
                }
            }

            // 2. Send Email Notification via FormSubmit
            const itemsList = orderItems.map(i => `${i.quantity}x ${i.title} (${i.size}) - Rs. ${i.price}`).join('\n');
            await fetch("https://formsubmit.co/ajax/marwalibas1@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `New Order Received! ${orderId} - Rs. ${total}`,
                    Name: `${firstName} ${lastName}`,
                    Phone: phone,
                    Email: email,
                    City: city,
                    Address: `${address} ${apartment}`,
                    Total_Amount: `Rs. ${total}`,
                    Items: itemsList
                })
            }).catch(err => console.error('FormSubmit Error:', err)); // Silently catch email errors so user still sees success

            // 3. Show success screen
            const whatsappMessage = encodeURIComponent(`Hello Marwa Libas! I have just placed an order (Order ID: #${orderId}). My name is ${firstName} ${lastName}, Total Bill: Rs. ${total.toLocaleString()}. Please confirm my order!`);
            const whatsappUrl = `https://wa.me/923229043703?text=${whatsappMessage}`;

            appContent.innerHTML = `
                <div class="container text-center" style="padding: 100px 0; max-width: 600px;">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" style="margin-bottom: var(--spacing-md);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
                    <h1 style="font-size: 36px; margin-bottom: var(--spacing-md);">Order Placed Successfully!</h1>
                    <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">Your Order ID is <strong>#${orderId}</strong>. We have saved your order.</p>
                    <p style="margin-bottom: var(--spacing-lg); font-size: 16px;">Please click the button below to send your order details to our WhatsApp so we can immediately confirm your dispatch.</p>
                    
                    <a href="${whatsappUrl}" target="_blank" id="wa-redirect-btn" class="btn btn-primary" style="background-color: #25D366; border-color: #25D366; font-size: 18px; padding: 15px 30px; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        Confirm on WhatsApp
                    </a>
                    
                    <div style="margin-top: 30px;">
                        <a href="#home" class="btn btn-outline" style="border: 1px solid #ddd; color: #666; padding: 10px 20px;">Continue Shopping</a>
                    </div>
                </div>
            `;

            // Clear cart
            state.cart.length = 0;
            saveState();
            renderCartDrawer();

        } catch (error) {
            console.error('Checkout error:', error);
            alert("There was an error processing your order. Please try again.");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
