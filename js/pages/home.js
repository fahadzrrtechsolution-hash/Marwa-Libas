


function renderHomepage() {
    const appContent = document.getElementById('app-content');
    
    let productsHtml = '';
    PRODUCTS.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    appContent.innerHTML = `
        <div class="hero-container fade-in">
            <section class="hero-section" id="hero-slider">
                <div class="hero-slide active">
                    <img src="assets/hero_banner.png" alt="Mid-Summer Sale" class="hero-bg-img">
                    <div class="hero-content">
                        <div class="hero-subtitle">Mid-Summer</div>
                        <h1 class="hero-title">SALE</h1>
                        <div class="hero-discount">UP TO 50% OFF</div>
                        <div class="hero-actions">
                            <a href="#collection/sale" class="btn">SHOP NOW</a>
                        </div>
                    </div>
                </div>
                <div class="hero-slide">
                    <img src="assets/hero_banner_2.png" alt="New Arrivals" class="hero-bg-img">
                    <div class="hero-content">
                        <div class="hero-subtitle" style="color: var(--color-bg-primary);">Luxury Edition</div>
                        <h1 class="hero-title" style="color: var(--color-bg-primary);">NEW<br>ARRIVALS</h1>
                        <div class="hero-actions">
                            <a href="#collection/new-arrivals" class="btn btn-outline" style="border-color: var(--color-bg-primary); color: var(--color-bg-primary);">EXPLORE</a>
                        </div>
                    </div>
                </div>
                <div class="hero-slide">
                    <img src="assets/hero_banner_3.png" alt="Festive Collection" class="hero-bg-img">
                    <div class="hero-content">
                        <div class="hero-subtitle">Premium Wear</div>
                        <h1 class="hero-title">FESTIVE</h1>
                        <div class="hero-discount">Starting at Rs. 4,500</div>
                        <div class="hero-actions">
                            <a href="#collection/festive" class="btn">SHOP COLLECTION</a>
                        </div>
                    </div>
                </div>
                
                <div class="hero-pagination" id="hero-pagination">
                    <span class="dot active" data-index="0"></span>
                    <span class="dot" data-index="1"></span>
                    <span class="dot" data-index="2"></span>
                </div>
            </section>
        </div>

        <div class="container collection-section" style="margin-top: var(--spacing-xl);">
            <h1 class="collection-title text-center">New Arrivals</h1>
            <p class="collection-subtitle text-center">Pre-Order articles will be delivered in 4-7 working days. Shop our latest Eid and Summer lawn ensembles.</p>
            <div class="product-grid">
                ${productsHtml}
            </div>
        </div>

        <section class="curated-section">
            <div class="container">
                <div class="curated-banner">
                    <h2>Curated By Influencers</h2>
                    <p>Join the ranks of the fashion elite with premium clothing designed by Silai Karhai. Designed to elevate your daily style with high elegance.</p>
                    <a href="#collection/best-sellers" class="btn btn-outline">Explore Best Sellers</a>
                </div>
            </div>
        </section>
    `;

    // Initialize Hero Slider
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-pagination .dot');
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const goToSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        const startSlider = () => {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4500); // 4.5 seconds auto-scroll
        };

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                startSlider(); // reset timer on manual click
            });
        });

        startSlider();
    }

    setupQuickBuyListeners();
}
