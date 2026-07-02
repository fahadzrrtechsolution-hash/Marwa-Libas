



function renderWishlistPage() {
    const appContent = document.getElementById('app-content');
    
    if (state.wishlist.length === 0) {
        appContent.innerHTML = `
            <div class="container text-center" style="padding: 100px 0;">
                <h2>Your wishlist is empty.</h2>
                <p style="margin: 20px 0;"><a href="#home" class="btn btn-primary">Start Adding Products</a></p>
            </div>
        `;
        return;
    }

    let itemsHtml = '';
    state.wishlist.forEach(id => {
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
            itemsHtml += renderProductCard(product);
        }
    });

    appContent.innerHTML = `
        <div class="container collection-section">
            <h1 class="collection-title text-center">My Wishlist</h1>
            <p class="collection-subtitle text-center">Dresses you've loved. Add them to your cart before they are sold out!</p>
            <div class="product-grid">
                ${itemsHtml}
            </div>
        </div>
    `;

    setupQuickBuyListeners();
}
