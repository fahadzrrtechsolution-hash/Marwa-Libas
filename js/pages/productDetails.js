


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

    const productReviews = state.reviews[product.id] || [];
    let avgRating = 0;
    if (productReviews.length > 0) {
        const total = productReviews.reduce((sum, rev) => sum + rev.rating, 0);
        avgRating = (total / productReviews.length).toFixed(1);
    }

    // Generate stars for average rating
    let avgStarsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(avgRating)) {
            avgStarsHtml += `<svg width="16" height="16" fill="gold" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        } else {
            avgStarsHtml += `<svg width="16" height="16" fill="none" stroke="gold" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
    }

    const ratingDisplayHtml = productReviews.length > 0
        ? `<div class="product-detail-rating" style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
            <div class="stars" style="display: flex;">${avgStarsHtml}</div>
            <span style="font-size: 14px; color: #666;">${avgRating} (${productReviews.length} Reviews)</span>
           </div>`
        : `<div class="product-detail-rating" style="margin-bottom: 15px; font-size: 14px; color: #666;">No reviews yet</div>`;

    let reviewsListHtml = '';
    if (productReviews.length === 0) {
        reviewsListHtml = `<p>Be the first to review this product!</p>`;
    } else {
        reviewsListHtml = productReviews.map(rev => {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += `<svg width="14" height="14" fill="${i <= rev.rating ? 'gold' : 'none'}" stroke="gold" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            }
            return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-author">
                            <strong>${rev.name}</strong>
                            <span class="verified-badge">✓ Verified Buyer</span>
                        </div>
                        <div class="review-date">${rev.date}</div>
                    </div>
                    <div class="review-stars">${stars}</div>
                    <p class="review-text">${rev.text}</p>
                </div>
            `;
        }).join('');
    }

    const reviewsSectionHtml = `
        <div class="product-reviews-section">
            <h2 class="reviews-section-title">Customer Reviews</h2>
            <div class="reviews-layout">
                <div class="reviews-list">
                    ${reviewsListHtml}
                </div>
                <div class="review-form-container">
                    <h3>Write a Review</h3>
                    <form id="add-review-form" class="review-form">
                        <div class="form-group">
                            <label>Rating</label>
                            <div class="star-rating-input" id="star-rating-input">
                                <span class="star active" data-value="1">★</span>
                                <span class="star active" data-value="2">★</span>
                                <span class="star active" data-value="3">★</span>
                                <span class="star active" data-value="4">★</span>
                                <span class="star active" data-value="5">★</span>
                            </div>
                            <input type="hidden" id="review-rating-value" value="5">
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="review-name" required placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label>Review</label>
                            <textarea id="review-text" required placeholder="What did you like about this dress?" rows="4"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Submit Review</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Related Products Logic
    const relatedProducts = PRODUCTS.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 4);
    let relatedProductsHtml = '';
    
    if (relatedProducts.length > 0) {
        let gridHtml = '';
        relatedProducts.forEach(p => {
            const displayImg = p.localImage || p.image || (p.images && p.images[0]) || '';
            const priceHtml = `Rs. ${p.price.toLocaleString()}`;
            const oldPriceHtml = p.originalPrice > p.price ? `<span style="text-decoration: line-through; color: #999; font-size: 13px; margin-left: 5px;">Rs. ${p.originalPrice.toLocaleString()}</span>` : '';
            
            gridHtml += `
                <div class="product-card">
                    <a href="#product/${p.id}" class="product-image-container">
                        <img src="${displayImg}" alt="${p.title}" class="product-image">
                    </a>
                    <div class="product-info">
                        <a href="#product/${p.id}" class="product-title">${p.title}</a>
                        <div class="product-price">
                            ${priceHtml} ${oldPriceHtml}
                        </div>
                    </div>
                </div>
            `;
        });
        
        relatedProductsHtml = `
            <div class="related-products-section">
                <h2 class="related-products-title">More Collection</h2>
                <div class="related-products-grid">
                    ${gridHtml}
                </div>
            </div>
        `;
    }


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
                    <div class="brand-header-row">
                        <div>
                            <div class="brand-title">${product.brandName || product.externalBrand || 'Zellbury'}</div>
                            <div class="brand-meta">
                                ★ ${avgRating} | ${product.stock !== undefined ? product.stock : 100} items
                            </div>
                        </div>
                        <img src="assets/zellbury-logo.png" alt="Logo" class="brand-logo-img" onerror="this.style.display='none'">
                    </div>

                    <div class="product-title-row">
                        <h1 class="product-detail-title">${product.title}</h1>
                        <div class="action-icons">
                            <button class="icon-btn" title="Share" id="detail-share-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            </button>
                            <button class="icon-btn wishlist-toggle-btn" data-product-id="${product.id}" title="Wishlist">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="${state.wishlist.includes(product.id) ? '#ff3b30' : 'none'}" stroke="${state.wishlist.includes(product.id) ? '#ff3b30' : '#000000'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div class="product-card-price-row">
                        <span class="price-sale">PKR ${product.price.toLocaleString()}</span>
                        ${product.originalPrice > product.price ? `<span class="price-original">PKR ${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>

                    <div class="shipping-details-box">
                        <div class="shipping-header">
                            <span class="express-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Express</span>
                            Instant dispatch, no delays
                        </div>
                        <div class="shipping-row">
                            <div class="shipping-info">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                <div class="shipping-info-text">
                                    <strong>Est. shipping by ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</strong>
                                    <span>Express delivery · Pakistan</span>
                                </div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                        <div class="shipping-row">
                            <div class="shipping-info">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                <div class="shipping-info-text">
                                    <strong>Easy 14 days return and refund</strong>
                                    <span>Return for a different size within 14 days.</span>
                                </div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>

                    <!-- Size Selector -->
                    <div>
                        <span class="selector-label">Size</span>
                        <div class="size-selector-row" id="detail-size-selector">
                            <button class="size-btn active" data-size="Unstitched">Unstitched</button>
                        </div>
                    </div>

                    ${product.isExternal ? `
                        <div class="checkout-actions-group" style="margin-top: 30px;">
                            <a href="${product.externalUrl}" target="_blank" class="btn btn-primary btn-block t4s-ani-shake" style="display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none;">
                                View on ${product.externalBrand || 'Store'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                        </div>
                    ` : (product.stock === 0) ? `
                        <div class="checkout-actions-group" style="margin-top: 30px;">
                            <button class="btn-block" style="background: #e5e7eb; color: #9ca3af; cursor: not-allowed;" disabled>Out of Stock</button>
                        </div>
                    ` : `
                        <!-- Quantity Selector -->
                        <div>
                            <span class="selector-label">Quantity</span>
                            <div class="qty-selector-row">
                                <div class="detail-qty-box">
                                    <button class="detail-qty-btn" id="detail-qty-minus">-</button>
                                    <div class="detail-qty-val" id="detail-qty-value">1</div>
                                    <button class="detail-qty-btn" id="detail-qty-plus">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="checkout-actions-group">
                            <button class="btn-block" id="detail-add-to-cart">Add To Bag (PKR ${product.price.toLocaleString()})</button>
                            <button class="btn-block" id="detail-buy-now">Buy Now</button>
                        </div>
                    `}

                    <div class="product-details-section">
                        <h3>Product Details</h3>
                        <table class="specs-table">
                            ${specsHtml}
                        </table>
                        
                        <div class="additional-desc">
                            <h4>Additional Description:</h4>
                            ${product.description.replace(/\n/g, '<br>')}
                        </div>

                        <div class="additional-desc">
                            <h4>Disclaimer:</h4>
                            ${product.disclaimer ? product.disclaimer.replace(/\n/g, '<br>') : 'Actual product color may vary slightly from the image.'}
                        </div>
                    </div>
                </div>
            </div>
            
            ${relatedProductsHtml}
            ${reviewsSectionHtml}
        </div>

        <!-- Sticky ATC bar -->
        ${!product.isExternal && product.stock !== 0 ? `
        <div class="sticky-atc-bar" id="sticky-atc-bar">
            <div class="sticky-atc-inner">
                <div class="sticky-atc-product">
                    <img src="${product.localImage}" alt="${product.title}">
                    <div>
                        <div class="sticky-atc-title">${product.title}</div>
                        <div class="sticky-atc-price">Rs. ${product.price.toLocaleString()} PKR</div>
                    </div>
                </div>
                <div class="sticky-atc-actions">
                    <div class="sticky-size-selector">
                        <select id="sticky-size">
                            <option value="Unstitched">Unstitched</option>
                        </select>
                    </div>
                    <div class="sticky-qty-selector">
                        <button id="sticky-qty-minus">-</button>
                        <span id="sticky-qty-value">1</span>
                        <button id="sticky-qty-plus">+</button>
                    </div>
                    <button class="t4s-ani-shake" id="sticky-add-to-cart-btn">Add To Bag</button>
                </div>
            </div>
        </div>
        ` : ''}
    `;

            setupProductPageListeners(product);
        }

function setupProductPageListeners(product) {
                // Thumbnails click
                document.querySelectorAll('.thumb-item').forEach(thumb => {
                    thumb.addEventListener('click', function () {
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
                    btn.addEventListener('click', function () {
                        sizeBtns.forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                    });
                });

                // Qty Selectors
                let qty = 1;
                const qtyVal = document.getElementById('detail-qty-value');

                if (qtyVal) {
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
                }

                // Add To Cart Action (Main)
                const handleAddToCartAction = () => {
                    const selectedSizeBtn = document.querySelector('#detail-size-selector .size-btn.active');
                    const selectedSize = selectedSizeBtn ? selectedSizeBtn.getAttribute('data-size') : 'M';
                    addToCart(product.id, selectedSize, qty);
                };

                const detailAtcBtn = document.getElementById('detail-add-to-cart');
                if (detailAtcBtn) detailAtcBtn.addEventListener('click', handleAddToCartAction);

                // Sticky Add To Cart Action
                const stickyAtcBtn = document.getElementById('sticky-add-to-cart-btn');
                if (stickyAtcBtn) {
                    let stickyQty = 1;
                    const stickyQtyVal = document.getElementById('sticky-qty-value');
                    document.getElementById('sticky-qty-minus').addEventListener('click', () => {
                        if (stickyQty > 1) {
                            stickyQty--;
                            stickyQtyVal.textContent = stickyQty;
                        }
                    });
                    document.getElementById('sticky-qty-plus').addEventListener('click', () => {
                        stickyQty++;
                        stickyQtyVal.textContent = stickyQty;
                    });

                    stickyAtcBtn.addEventListener('click', () => {
                        const stickySize = document.getElementById('sticky-size').value;
                        addToCart(product.id, stickySize, stickyQty);
                    });
                }

                // Buy Now
                const buyNowBtn = document.getElementById('detail-buy-now');
                if (buyNowBtn) {
                    buyNowBtn.addEventListener('click', () => {
                        const selectedSizeBtn = document.querySelector('#detail-size-selector .size-btn.active');
                        const selectedSize = selectedSizeBtn ? selectedSizeBtn.getAttribute('data-size') : 'M';
                        addToCart(product.id, selectedSize, qty);
                        window.location.hash = "#checkout";
                    });
                }

                // Accordions
                document.querySelectorAll('.accordion-header').forEach(header => {
                    header.addEventListener('click', function () {
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

                // Reviews Form Listeners
                const stars = document.querySelectorAll('#star-rating-input .star');
                const ratingInput = document.getElementById('review-rating-value');
                
                stars.forEach(star => {
                    star.addEventListener('click', function() {
                        const val = parseInt(this.getAttribute('data-value'));
                        ratingInput.value = val;
                        stars.forEach(s => {
                            const sVal = parseInt(s.getAttribute('data-value'));
                            if (sVal <= val) {
                                s.classList.add('active');
                            } else {
                                s.classList.remove('active');
                            }
                        });
                    });
                });

                const reviewForm = document.getElementById('add-review-form');
                if (reviewForm) {
                    reviewForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const name = document.getElementById('review-name').value;
                        const text = document.getElementById('review-text').value;
                        const rating = parseInt(document.getElementById('review-rating-value').value);
                        
                        if (name && text) {
                            addReview(product.id, { name, text, rating });
                        }
                    });
                }
            }
