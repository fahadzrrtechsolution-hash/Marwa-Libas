


function renderHomepage() {
    const appContent = document.getElementById('app-content');
    
    let productsHtml = '';
    PRODUCTS.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    appContent.innerHTML = `
        <div class="hero-container fade-in">
            <section class="hero-section" id="hero-slider">
                ${BANNERS.map((banner, index) => {
                    const themeStyle = banner.theme === 'dark' ? 'color: var(--color-bg-primary);' : '';
                    const themeStyleBorder = banner.theme === 'dark' ? 'border-color: var(--color-bg-primary); color: var(--color-bg-primary);' : '';
                    const btnClass = banner.theme === 'dark' ? 'btn btn-outline' : 'btn';
                    
                    return `
                    <div class="hero-slide ${index === 0 ? 'active' : ''}">
                        <img src="${banner.image}" alt="${banner.title}" class="hero-bg-img">
                        <div class="hero-content">
                            <div class="hero-subtitle" style="${themeStyle}">${banner.subtitle}</div>
                            <h1 class="hero-title" style="${themeStyle}">${banner.title}</h1>
                            ${banner.discount ? `<div class="hero-discount" style="${themeStyle}">${banner.discount}</div>` : ''}
                            <div class="hero-actions">
                                <a href="${banner.btnLink}" class="${btnClass}" style="${themeStyleBorder}">${banner.btnText}</a>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
                
                <div class="hero-pagination" id="hero-pagination">
                    ${BANNERS.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`).join('')}
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
