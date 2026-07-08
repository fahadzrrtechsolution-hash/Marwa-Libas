function renderCollectionPage(collectionId) {
    const appContent = document.getElementById('app-content');
    
    // Store current state
    window.currentCollectionState = {
        id: collectionId,
        cols: window.innerWidth < 768 ? 2 : 6, // default 6 on desktop, 2 on mobile
        sort: 'featured',
        baseProducts: PRODUCTS.filter(p => p.collection === collectionId || collectionId === 'all'),
        filter: null // initialized on first render
    };

    renderCollectionContent();
}

function sortProducts(products, sortType) {
    const sorted = [...products];
    switch(sortType) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'title-asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'featured':
        default:
            return sorted; // original order
    }
}

function renderCollectionContent() {
    const state = window.currentCollectionState;
    
    if (!state.filter && state.baseProducts) {
        let minPrice = 0;
        let maxPrice = 0;
        if (state.baseProducts.length > 0) {
            const prices = state.baseProducts.map(p => p.price);
            minPrice = Math.min(...prices);
            maxPrice = Math.max(...prices);
        }
        state.filter = {
            inStock: true,
            outStock: true,
            minPrice: minPrice,
            maxPrice: maxPrice,
            absoluteMin: minPrice,
            absoluteMax: maxPrice
        };
    }

    let currentProducts = state.baseProducts || [];
    
    if (state.filter) {
        currentProducts = currentProducts.filter(p => {
            const isInStock = p.stock !== 0 && p.stock !== 'Out of Stock';
            if (!state.filter.inStock && isInStock) return false;
            if (!state.filter.outStock && !isInStock) return false;
            if (p.price < state.filter.minPrice || p.price > state.filter.maxPrice) return false;
            return true;
        });
    }

    const sortedProducts = sortProducts(currentProducts, state.sort);
    
    let collectionTitle = state.id.replace('-', ' ');
    if (state.id === 'under-2290') collectionTitle = "Dresses under Rs. 2290";

    let productsHtml = '';
    sortedProducts.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    if (sortedProducts.length === 0) {
        productsHtml = `<p class="text-center" style="grid-column: 1/-1; padding: 40px;">No products found in this collection.</p>`;
    }

    // Dynamic Filter Content
    const filterContent = document.querySelector('.filter-drawer-content');
    if (filterContent && state.filter) {
        const inStockCount = state.baseProducts.filter(p => p.stock !== 0 && p.stock !== 'Out of Stock').length;
        const outOfStockCount = state.baseProducts.length - inStockCount;

        filterContent.innerHTML = `
            <!-- Availability Section -->
            <div class="filter-section" style="margin-bottom: 30px; border-bottom: 1px solid var(--color-border); padding-bottom: 25px;">
                <h4 style="font-size: 15px; font-weight: 500; margin-bottom: 20px; color: var(--color-text-primary); display: inline-block; border-bottom: 2px solid var(--color-brand); padding-bottom: 4px;">Availability</h4>
                
                <label class="filter-checkbox" style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" id="filter-in-stock" ${state.filter.inStock ? 'checked' : ''} style="accent-color: var(--color-brand); width: 16px; height: 16px; cursor: pointer;">
                    <span style="font-size: 14px; color: var(--color-text-primary);">In Stock (${inStockCount})</span>
                </label>
                
                <label class="filter-checkbox" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                    <input type="checkbox" id="filter-out-stock" ${state.filter.outStock ? 'checked' : ''} style="accent-color: var(--color-brand); width: 16px; height: 16px; cursor: pointer;">
                    <span style="font-size: 14px; color: var(--color-text-primary);">Out Of Stock (${outOfStockCount})</span>
                </label>
            </div>
            
            <!-- Price Section -->
            <div class="filter-section">
                <h4 style="font-size: 15px; font-weight: 500; margin-bottom: 25px; color: var(--color-text-primary); display: inline-block; border-bottom: 2px solid var(--color-brand); padding-bottom: 4px;">Price</h4>
                
                <div class="price-slider-container">
                    <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                        <input type="number" id="filter-min-price" value="${state.filter.minPrice}" min="${state.filter.absoluteMin}" max="${state.filter.absoluteMax}" style="width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px;" placeholder="Min">
                        <span style="color: var(--color-text-secondary);">-</span>
                        <input type="number" id="filter-max-price" value="${state.filter.maxPrice}" min="${state.filter.absoluteMin}" max="${state.filter.absoluteMax}" style="width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px;" placeholder="Max">
                    </div>
                    
                    <button class="btn btn-outline" id="apply-filters-btn" style="border-radius: 30px; font-size: 11px; padding: 10px 30px; border: 1.5px solid var(--color-brand); color: var(--color-brand); font-weight: 700; letter-spacing: 1px; width: 100%;">APPLY FILTER</button>
                </div>
            </div>
        `;
    }

    const gridBtnHtml = (cols) => {
        const isActive = state.cols === cols;
        return `
        <button class="grid-btn" data-cols="${cols}" style="display: flex; gap: 2px; padding: 4px; border: 1px solid ${isActive ? '#333' : 'transparent'}; background: none; cursor: pointer; height: 26px; border-radius: 2px;">
            ${Array(cols).fill(0).map(() => `<span style="width: 4px; background: ${isActive ? '#333' : '#999'}; height: 100%;"></span>`).join('')}
        </button>
        `;
    };

    const appContent = document.getElementById('app-content');
    appContent.innerHTML = `
        <div class="container collection-section" style="max-width: 1600px; padding-top: 40px;">
            <div class="collection-toolbar" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 15px 0; margin-bottom: 30px;">
                <div class="toolbar-left">
                    <button class="btn-filter" style="background: none; border: none; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        Filter
                    </button>
                </div>
                
                <div class="toolbar-center grid-controls desktop-only" style="display: flex; gap: 8px; align-items: center;">
                    <button class="grid-btn" data-cols="1" style="display: flex; flex-direction: column; gap: 2px; padding: 4px; border: 1px solid ${state.cols===1 ? '#333' : 'transparent'}; background: none; cursor: pointer; height: 26px; border-radius: 2px; width: 20px;">
                        <span style="width: 100%; background: ${state.cols===1 ? '#333' : '#999'}; height: 4px;"></span>
                        <span style="width: 100%; background: ${state.cols===1 ? '#333' : '#999'}; height: 4px;"></span>
                        <span style="width: 100%; background: ${state.cols===1 ? '#333' : '#999'}; height: 4px;"></span>
                    </button>
                    ${gridBtnHtml(2)}
                    ${gridBtnHtml(3)}
                    ${gridBtnHtml(4)}
                    ${gridBtnHtml(5)}
                    ${gridBtnHtml(6)}
                </div>
                
                <div class="toolbar-right">
                    <select id="sort-select" style="padding: 8px 15px; border: 1px solid var(--color-border); border-radius: 20px; outline: none; font-size: 13px; cursor: pointer;">
                        <option value="featured" ${state.sort === 'featured' ? 'selected' : ''}>Featured</option>
                        <option value="price-asc" ${state.sort === 'price-asc' ? 'selected' : ''}>Price, low to high</option>
                        <option value="price-desc" ${state.sort === 'price-desc' ? 'selected' : ''}>Price, high to low</option>
                        <option value="title-asc" ${state.sort === 'title-asc' ? 'selected' : ''}>Alphabetically, A-Z</option>
                        <option value="title-desc" ${state.sort === 'title-desc' ? 'selected' : ''}>Alphabetically, Z-A</option>
                    </select>
                </div>
            </div>

            <div class="product-grid grid-cols-${state.cols}" id="collection-product-grid">
                ${productsHtml}
            </div>
            
            <style>
                @media(max-width: 992px) {
                    .desktop-only { display: none !important; }
                }
            </style>
        </div>
    `;

    // Reattach listeners
    setupQuickBuyListeners();
    setupToolbarListeners();
}

function setupToolbarListeners() {
    const gridBtns = document.querySelectorAll('.grid-btn');
    gridBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cols = parseInt(this.getAttribute('data-cols'));
            window.currentCollectionState.cols = cols;
            renderCollectionContent();
        });
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            window.currentCollectionState.sort = this.value;
            renderCollectionContent();
        });
    }

    // Filter Drawer Logic
    const filterBtn = document.querySelector('.btn-filter');
    const filterDrawer = document.getElementById('filter-drawer');
    const filterOverlay = document.getElementById('filter-drawer-overlay');
    const closeFilterBtn = document.getElementById('close-filter');

    if (filterBtn && filterDrawer && filterOverlay) {
        // We ensure we don't attach multiple identical listeners by removing previous if any, 
        // but since this is bound dynamically it's better to just overwrite onclick or keep it simple.
        filterBtn.onclick = (e) => {
            e.preventDefault();
            filterDrawer.classList.add('active');
            filterOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeFilter = () => {
            filterDrawer.classList.remove('active');
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeFilterBtn) closeFilterBtn.onclick = closeFilter;
        filterOverlay.onclick = closeFilter;
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.onclick = () => {
            const inStock = document.getElementById('filter-in-stock').checked;
            const outStock = document.getElementById('filter-out-stock').checked;
            let minPrice = parseFloat(document.getElementById('filter-min-price').value);
            let maxPrice = parseFloat(document.getElementById('filter-max-price').value);
            
            if (isNaN(minPrice)) minPrice = window.currentCollectionState.filter.absoluteMin;
            if (isNaN(maxPrice)) maxPrice = window.currentCollectionState.filter.absoluteMax;
            
            window.currentCollectionState.filter.inStock = inStock;
            window.currentCollectionState.filter.outStock = outStock;
            window.currentCollectionState.filter.minPrice = minPrice;
            window.currentCollectionState.filter.maxPrice = maxPrice;
            
            if (filterDrawer) filterDrawer.classList.remove('active');
            if (filterOverlay) filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            renderCollectionContent();
        };
    }
}
