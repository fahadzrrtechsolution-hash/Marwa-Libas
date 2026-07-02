


function renderProductPage(productId) {
    const appContent = document.getElementById('app-content');
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
        appContent.innerHTML = `<div class="container" style="padding: 100px 0;"><h2 class="text-center">Product not found.</h2><p class="text-center"><a href="#home">Back to Homepage</a></p></div>`;
        return;
    }

    // Build specification table rows
    let specsHtml = '';
    for (const [key, val] of Object.entries(product.specs)) {
        specsHtml += `<tr><td>${key}</td><td>${val}</td></tr>`;
    }

    // Build Images
    let thumbnailsHtml = '';
    const imagesToUse = (product.images && product.images.length > 0) ? product.images : [product.localImage || product.image];
    
    // If only one image, we can just duplicate it with CSS filters to simulate a gallery if desired, or just show the actual images.
    // Let's just show actual images:
    if (imagesToUse.length === 1) {
        thumbnailsHtml = `
            <img src="${imagesToUse[0]}" class="thumb-item active" alt="Thumb 1">
            <img src="${imagesToUse[0]}" class="thumb-item" alt="Thumb 2" style="filter: hue-rotate(30deg);">
            <img src="${imagesToUse[0]}" class="thumb-item" alt="Thumb 3" style="filter: brightness(0.9);">
        `;
    } else {
        imagesToUse.forEach((imgUrl, idx) => {
            thumbnailsHtml += `<img src="${imgUrl}" class="thumb-item ${idx === 0 ? 'active' : ''}" alt="Thumb ${idx + 1}">`;
        });
    }

    const mainImageToUse = imagesToUse[0];

    appContent.innerHTML = `
        <div class="container product-detail-container">
            <div class="breadcrumbs">
                <a href="#home">Home</a> &gt; <a href="#collection/${product.collection}">${product.collection.replace('-', ' ')}</a> &gt; <span>${product.title}</span>
            </div>
            
            <div class="product-detail-layout">
                <!-- Gallery Column -->
                <div class="product-gallery">
                    <div class="gallery-thumbnails">
                        ${thumbnailsHtml}
                    </div>
                    <div class="gallery-main">
                        <img id="main-product-img" src="${mainImageToUse}" alt="${product.title}">
                    </div>
                </div>

                <!-- Info Column -->
                <div class="product-info-col">
                    <div class="urgency-widget">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <span>Hurry! Only 4 items left in stock.</span>
                    </div>

                    <h1 class="product-detail-title">${product.title}</h1>
                    <div class="product-card-price-row" style="font-size: 24px;">
                        <span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>
                        <span class="price-sale">Rs. ${product.price.toLocaleString()}</span>
                    </div>

                    <div class="preorder-banner">
                        <strong>Pre-Order Article:</strong> Delivery will take 7 to 9 working days from confirmation date.
                    </div>

                    <!-- Size Selector -->
                    <div>
                        <span class="selector-label">Select Size:</span>
                        <div class="size-selector-row" id="detail-size-selector">
                            <button class="size-btn active" data-size="S">S</button>
                            <button class="size-btn" data-size="M">M</button>
                            <button class="size-btn" data-size="L">L</button>
                            <button class="size-btn" data-size="XL">XL</button>
                        </div>
                    </div>

                    <!-- Quantity Selector -->
                    <div>
                        <span class="selector-label">Quantity:</span>
                        <div class="qty-selector-row">
                            <div class="detail-qty-box">
                                <button class="detail-qty-btn" id="detail-qty-minus">-</button>
                                <span class="detail-qty-val" id="detail-qty-value">1</span>
                                <button class="detail-qty-btn" id="detail-qty-plus">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="checkout-actions-group">
                        <button class="btn btn-primary btn-block t4s-ani-shake" id="detail-add-to-cart">Add to Cart</button>
                        <button class="btn btn-dark btn-block" id="detail-buy-now">Buy It Now</button>
                    </div>

                    <!-- Accordions -->
                    <div class="product-specs-accordion">
                        <div class="accordion-item active">
                            <button class="accordion-header">
                                Description
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="accordion-content" style="max-height: 500px;">
                                <p>${product.description}</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <button class="accordion-header">
                                Specifications
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="accordion-content">
                                <table class="specs-table">
                                    ${specsHtml}
                                </table>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <button class="accordion-header">
                                Delivery & Return Policy
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="accordion-content">
                                <p>Standard delivery across Pakistan takes 4-7 working days. Pre-order articles require 7-9 working days. Easy return and exchange policy is valid within 14 days of receipt if items are in original condition with tags attached.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sticky ATC bar -->
        <div class="sticky-atc-bar" id="sticky-atc-bar">
            <div class="sticky-atc-product">
                <img src="${product.localImage}" alt="${product.title}">
                <div>
                    <div class="sticky-atc-title">${product.title}</div>
                    <div class="sticky-atc-price">Rs. ${product.price.toLocaleString()}</div>
                </div>
            </div>
            <div class="sticky-atc-actions">
                <button class="btn btn-primary" id="sticky-add-to-cart-btn">Add To Cart</button>
            </div>
        </div>
    `;

    setupProductPageListeners(product);
}

function setupProductPageListeners(product) {
    // Thumbnails click
    document.querySelectorAll('.thumb-item').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const mainImg = document.getElementById('main-product-img');
            mainImg.src = this.src;
            mainImg.style.filter = this.style.filter;
        });
    });

    // Size Selectors
    const sizeBtns = document.querySelectorAll('#detail-size-selector .size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Qty Selectors
    let qty = 1;
    const qtyVal = document.getElementById('detail-qty-value');
    
    document.getElementById('detail-qty-minus').addEventListener('click', () => {
        if (qty > 1) {
            qty--;
            qtyVal.textContent = qty;
        }
    });

    document.getElementById('detail-qty-plus').addEventListener('click', () => {
        qty++;
        qtyVal.textContent = qty;
    });

    // Add To Cart Action
    const handleAddToCartAction = () => {
        const selectedSize = document.querySelector('#detail-size-selector .size-btn.active').getAttribute('data-size');
        addToCart(product.id, selectedSize, qty);
    };

    document.getElementById('detail-add-to-cart').addEventListener('click', handleAddToCartAction);
    const stickyAtcBtn = document.getElementById('sticky-add-to-cart-btn');
    if (stickyAtcBtn) stickyAtcBtn.addEventListener('click', handleAddToCartAction);

    // Buy Now
    document.getElementById('detail-buy-now').addEventListener('click', () => {
        const selectedSize = document.querySelector('#detail-size-selector .size-btn.active').getAttribute('data-size');
        addToCart(product.id, selectedSize, qty);
        window.location.hash = "#checkout";
    });

    // Accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = '0px';
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Sticky ATC Bar visibility
    const stickyAtc = document.getElementById('sticky-atc-bar');
    const mainAtcBtn = document.getElementById('detail-add-to-cart');
    
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyAtc.classList.add('visible');
                } else {
                    stickyAtc.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        if (mainAtcBtn) {
            observer.observe(mainAtcBtn);
        }
    }
}
