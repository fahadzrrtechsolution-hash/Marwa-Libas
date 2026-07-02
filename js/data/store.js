



let state = {
    cart: JSON.parse(localStorage.getItem('marwa_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('marwa_wishlist')) || [],
    searchQuery: "",
    currentPage: "home",
    selectedCollection: "new-arrivals"
};

function saveState() {
    localStorage.setItem('marwa_cart', JSON.stringify(state.cart));
    localStorage.setItem('marwa_wishlist', JSON.stringify(state.wishlist));
    updateBadges();
}

function updateBadges() {
    const cartCount = document.getElementById('cart-count');
    const wishlistCount = document.getElementById('wishlist-count');
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartDrawerCount) cartDrawerCount.textContent = totalItems;
    if (wishlistCount) wishlistCount.textContent = state.wishlist.length;
}

function addToCart(productId, size, quantity) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.id === productId && item.size === size);
    
    if (existingIndex > -1) {
        state.cart[existingIndex].quantity += quantity;
    } else {
        state.cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.localImage,
            size: size,
            quantity: quantity
        });
    }

    saveState();
    renderCartDrawer();
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
    }
}

function updateCartQty(index, newQty) {
    if (newQty < 1) {
        state.cart.splice(index, 1);
    } else {
        state.cart[index].quantity = newQty;
    }
    saveState();
    renderCartDrawer();
}

function removeCartItem(index) {
    state.cart.splice(index, 1);
    saveState();
    renderCartDrawer();
}

function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
        state.wishlist.splice(index, 1);
    } else {
        state.wishlist.push(productId);
    }
    saveState();
    handleRoute();
}
