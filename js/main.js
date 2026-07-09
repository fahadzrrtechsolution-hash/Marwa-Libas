









function handleRoute(eventOrInitial) {
    const isInitialLoad = eventOrInitial === true;
    const hash = window.location.hash || '#home';
    const contentDiv = document.getElementById('app-content');
    
    // Close overlays & drawers on navigation
    document.getElementById('cart-drawer')?.classList.remove('active');
    document.getElementById('cart-drawer-overlay')?.classList.remove('active');
    document.getElementById('mobile-drawer')?.classList.remove('active');
    document.getElementById('drawer-overlay')?.classList.remove('active');
    document.getElementById('search-drawer')?.classList.remove('active');
    document.getElementById('search-drawer-overlay')?.classList.remove('active');
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
    
    if (!isInitialLoad) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // CSS page transition
    if (contentDiv) {
        contentDiv.classList.remove('fade-in');
        void contentDiv.offsetWidth; // Trigger reflow
        contentDiv.classList.add('fade-in');
    }

    // Route parser
    const navMenu = document.getElementById('navigation-menu');
    if (navMenu) navMenu.style.display = '';

    if (hash === '#home' || hash === '#') {
        renderHomepage();
    } else if (hash.startsWith('#collection/')) {
        const collectionId = hash.split('/')[1];
        renderCollectionPage(collectionId);
    } else if (hash.startsWith('#product/')) {
        const productId = hash.split('/')[1];
        renderProductPage(productId);
    } else if (hash === '#contact') {
        renderContactPage();
    } else if (hash === '#cart') {
        renderCartPage();
    } else if (hash === '#checkout') {
        if (navMenu) navMenu.style.display = 'none';
        renderCheckoutPage();
    } else if (hash === '#wishlist') {
        renderWishlistPage();
    } else {
        renderHomepage();
    }

    // Update active nav-link highlighting
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute(true);
}

function initApp() {
    initRouter();
    setupUIEvents();
    renderCartDrawer();
    updateBadges();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
