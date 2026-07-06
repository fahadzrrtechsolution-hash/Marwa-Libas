function renderCollectionPage(collectionId) {
    const appContent = document.getElementById('app-content');
    
    // Store current state
    window.currentCollectionState = {
        id: collectionId,
        cols: window.innerWidth < 768 ? 2 : 6, // default 6 on desktop, 2 on mobile
        sort: 'featured',
        products: PRODUCTS.filter(p => p.collection === collectionId || collectionId === 'all')
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
    const sortedProducts = sortProducts(state.products, state.sort);
    
    let collectionTitle = state.id.replace('-', ' ');
    if (state.id === 'under-2290') collectionTitle = "Dresses under Rs. 2290";

    let productsHtml = '';
    sortedProducts.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    if (sortedProducts.length === 0) {
        productsHtml = `<p class="text-center" style="grid-column: 1/-1; padding: 40px;">No products found in this collection.</p>`;
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
}
