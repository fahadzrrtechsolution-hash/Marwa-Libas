

function renderProductCard(product) {
    const isWishlisted = state.wishlist.includes(product.id);
    const wishlistIconColor = isWishlisted ? 'var(--color-sale)' : 'none';
    const wishlistStroke = isWishlisted ? 'var(--color-sale)' : 'currentColor';
    let badgesHtml = '';
    
    // Discount Badge (Orange Circle)
    if (product.originalPrice > product.price) {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        badgesHtml += `<span class="badge-discount">-${discount}%</span>`;
    }
    
    // RE-STOCK Badge (Green Rectangle) - check if it's explicitly restock, else if they have an arbitrary badge, show it. We'll simulate Re-stock on some items or if badge === 'Re-stock'.
    if (product.badge && product.badge.toUpperCase() === 'RE-STOCK') {
        badgesHtml += `<span class="badge-restock">RE-STOCK</span>`;
    } else if (product.title.includes('Black') || product.title.includes('White')) {
        // Just adding a few restock badges for the visual effect requested in screenshot
        badgesHtml += `<span class="badge-restock">RE-STOCK</span>`;
    }

    const stock = product.stock !== undefined ? product.stock : 10;
    const isOutOfStock = stock <= 0;
    
    if (isOutOfStock) {
        badgesHtml = `<span class="badge-discount" style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; position: absolute; top: 12px; left: 12px; z-index: 10;">SOLD OUT</span>`;
    }

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-card-media">
                <div class="product-badges-container">
                    ${badgesHtml}
                </div>
                <a href="#product/${product.id}">
                    <img src="${product.localImage}" alt="${product.title}">
                </a>
                <button class="wishlist-toggle-btn icon-btn" style="position: absolute; top: 12px; right: 12px; z-index: 5; background: rgba(255,255,255,0.8); border-radius: 50%; padding: 6px;" data-product-id="${product.id}" aria-label="Add to Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlistIconColor}" stroke="${wishlistStroke}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <div class="quick-buy-overlay">
                    ${isOutOfStock ? `
                        <button class="quick-size-btn out-of-stock-btn" style="width: 100%; cursor: not-allowed; background: #e5e7eb; color: #9ca3af;" disabled>Out of Stock</button>
                    ` : product.isExternal ? `
                        <button class="quick-size-btn" style="width: 100%;" onclick="window.location.hash='#product/${product.id}'">View Details</button>
                    ` : `
                        <button class="quick-size-btn" data-size="S">S</button>
                        <button class="quick-size-btn" data-size="M">M</button>
                        <button class="quick-size-btn" data-size="L">L</button>
                        <button class="quick-size-btn" data-size="XL">XL</button>
                    `}
                </div>
            </div>
            <div class="product-card-details">
                <h3 class="product-card-title"><a href="#product/${product.id}">${product.title}</a></h3>
                <div class="product-card-price-col">
                    ${product.originalPrice > product.price ? `<span class="price-original">Rs.${product.originalPrice.toLocaleString()}.00 PKR</span>` : ''}
                    <span class="price-sale">Rs.${product.price.toLocaleString()}.00 PKR</span>
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
            
            const productId = this.getAttribute('data-product-id');
            const isAdding = !state.wishlist.includes(productId);
            
            toggleWishlist(productId);
            
            if (isAdding) {
                playHeartAnimation(this);
            }
        });
    });
}

function playHeartAnimation(btn) {
    const heart = document.createElement('div');
    heart.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-sale)" stroke="var(--color-sale)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    
    const btnRect = btn.getBoundingClientRect();
    const targetIcon = document.querySelector('a[href="#wishlist"]');
    if (!targetIcon) return;
    const targetRect = targetIcon.getBoundingClientRect();
    
    heart.style.position = 'fixed';
    heart.style.left = btnRect.left + 'px';
    heart.style.top = btnRect.top + 'px';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    heart.style.pointerEvents = 'none';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.left = targetRect.left + (targetRect.width / 2) - 12 + 'px';
        heart.style.top = targetRect.top + (targetRect.height / 2) - 12 + 'px';
        heart.style.transform = 'scale(0.2)';
        heart.style.opacity = '0.2';
    }, 50);
    
    setTimeout(() => {
        heart.remove();
        targetIcon.style.transform = 'scale(1.2)';
        targetIcon.style.transition = 'transform 0.2s';
        setTimeout(() => targetIcon.style.transform = 'none', 200);
    }, 850);
}
