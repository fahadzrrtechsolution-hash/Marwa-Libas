


function renderCollectionPage(collectionId) {
    const appContent = document.getElementById('app-content');
    
    // Filter products by collection
    const filteredProducts = PRODUCTS.filter(p => p.collection === collectionId || collectionId === 'all');
    
    let collectionTitle = collectionId.replace('-', ' ');
    if (collectionId === 'under-2290') collectionTitle = "Dresses under Rs. 2290";

    let productsHtml = '';
    filteredProducts.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    if (filteredProducts.length === 0) {
        productsHtml = `<p class="text-center" style="grid-column: 1/-1; padding: 40px;">No products found in this collection.</p>`;
    }

    appContent.innerHTML = `
        <div class="container collection-section">
            <h1 class="collection-title text-center" style="text-transform: capitalize;">${collectionTitle}</h1>
            <p class="collection-subtitle text-center">Browse through our handpicked selections.</p>
            <div class="product-grid">
                ${productsHtml}
            </div>
        </div>
    `;

    setupQuickBuyListeners();
}
