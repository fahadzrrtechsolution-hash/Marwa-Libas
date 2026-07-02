

function renderProductCard(product) {
    const isWishlisted = state.wishlist.includes(product.id);
    const wishlistIconColor = isWishlisted ? 'currentColor' : 'none';
    const wishlistStroke = isWishlisted ? 'var(--color-sale)' : 'currentColor';
    const badgeHtml = product.badge ? `<span class="product-badge badge-sale">${product.badge}</span>` : '';

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-card-media">
                ${badgeHtml}
                <a href="#product/${product.id}">
                    <img src="${product.localImage}" alt="${product.title}">
                </a>
                <button class="wishlist-toggle-btn icon-btn" style="position: absolute; top: 12px; right: 12px; z-index: 5; background: rgba(255,255,255,0.8); border-radius: 50%; padding: 6px;" data-product-id="${product.id}" aria-label="Add to Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlistIconColor}" stroke="${wishlistStroke}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <div class="quick-buy-overlay">
                    <button class="quick-size-btn" data-size="S">S</button>
                    <button class="quick-size-btn" data-size="M">M</button>
                    <button class="quick-size-btn" data-size="L">L</button>
                    <button class="quick-size-btn" data-size="XL">XL</button>
                </div>
            </div>
            <div class="product-card-details">
                <h3 class="product-card-title"><a href="#product/${product.id}">${product.title}</a></h3>
                <div class="product-card-price-row">
                    <span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>
                    <span class="price-sale">Rs. ${product.price.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

function setupQuickBuyListeners() {
    document.querySelectorAll('.quick-size-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            const productId = card.getAttribute('data-id');
            const size = this.getAttribute('data-size');
            
            addToCart(productId, size, 1);
        });
    });
    
    document.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(this.getAttribute('data-product-id'));
        });
    });
}
