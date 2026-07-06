


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

        <div class="container text-center" style="margin-top: 50px; margin-bottom: 50px;">
            <h2 style="font-family: inherit; font-size: 26px; margin-bottom: 40px; font-weight: 600; letter-spacing: 1px;">SHOP BY COLLECTION</h2>
            <div class="collections-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; max-width: 900px; margin: 0 auto;">
                ${typeof COLLECTIONS !== 'undefined' ? COLLECTIONS.map(col => `
                <a href="${col.link}" class="collection-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 100%; max-width: 180px; overflow: hidden; border-radius: 50%; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); aspect-ratio: 1/1; border: 3px solid #fff;">
                        <img src="${col.image}" alt="${col.title}" class="col-img" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    </div>
                    <h4 style="font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 5px;">${col.title}</h4>
                </a>
                `).join('') : ''}
            </div>
            <style>
                .collection-card:hover .col-img {
                    transform: scale(1.15);
                }
                .collection-card h4 {
                    transition: color 0.3s ease;
                }
                .collection-card:hover h4 {
                    color: var(--color-accent, #999);
                }
                @media(max-width: 767px) {
                    .collections-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 20px !important;
                        padding: 0 10px;
                    }
                }
            </style>
        </div>

        <div class="brands-marquee-section" style="padding: 40px 0; background: var(--color-bg-secondary, #f9f9f9); overflow: hidden; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 50px;">
            <div class="container text-center">
                <h3 style="font-size: 18px; font-weight: 500; letter-spacing: 2px; color: #555; margin-bottom: 30px; text-transform: uppercase;">Featured Brands</h3>
            </div>
            <div class="marquee-wrapper" style="display: flex; white-space: nowrap; overflow: hidden; position: relative;">
                <div class="marquee-container" style="display: flex; width: max-content; animation: scrollBrands 20s linear infinite;">
                    <div class="marquee-content" style="display: flex; gap: 60px; padding-right: 60px; align-items: center;">
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Georgia', serif; color: #333;">Khaadi</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Arial', sans-serif; letter-spacing: 2px; color: #333;">SAPPHIRE</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Times New Roman', serif; font-style: italic; color: #333;">Gul Ahmed</span>
                        <span style="font-size: 28px; font-weight: bold; font-family: 'Impact', sans-serif; color: #333;">J.</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Verdana', sans-serif; color: #333;">Sana Safinaz</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Courier New', monospace; color: #333;">Nishat Linen</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Tahoma', sans-serif; color: #333;">Maria.B</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Trebuchet MS', sans-serif; color: #333;">Alkaram</span>
                    </div>
                    <div class="marquee-content" style="display: flex; gap: 60px; padding-right: 60px; align-items: center;">
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Georgia', serif; color: #333;">Khaadi</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Arial', sans-serif; letter-spacing: 2px; color: #333;">SAPPHIRE</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Times New Roman', serif; font-style: italic; color: #333;">Gul Ahmed</span>
                        <span style="font-size: 28px; font-weight: bold; font-family: 'Impact', sans-serif; color: #333;">J.</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Verdana', sans-serif; color: #333;">Sana Safinaz</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Courier New', monospace; color: #333;">Nishat Linen</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Tahoma', sans-serif; color: #333;">Maria.B</span>
                        <span style="font-size: 26px; font-weight: bold; font-family: 'Trebuchet MS', sans-serif; color: #333;">Alkaram</span>
                    </div>
                </div>
            </div>
            <style>
                @keyframes scrollBrands {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-wrapper:hover .marquee-container {
                    animation-play-state: paused;
                }
                .marquee-content span {
                    opacity: 0.7;
                    transition: opacity 0.3s, transform 0.3s;
                    cursor: pointer;
                    display: inline-block;
                }
                .marquee-content span:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
            </style>
        </div>

        <div class="container collection-section" style="margin-top: var(--spacing-xl);">
            <div class="collection-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h1 class="collection-title" style="margin-bottom: 0; text-align: left;">All Products</h1>
                <a href="#collection/all" class="btn btn-outline">View All</a>
            </div>
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
