


function renderHomepage() {
    const appContent = document.getElementById('app-content');
    
    let productsHtml = '';
    PRODUCTS.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    const renderCategorySection = (title, items) => `
        <div style="background: linear-gradient(180deg, #fcfcfb 0%, #f4f5f6 100%); padding: 60px 0; margin-bottom: 40px; border-top: 1px solid #eee; border-bottom: 1px solid #ddd; box-shadow: inset 0px 2px 10px rgba(0,0,0,0.02);">
            <div class="container text-center">
                <div style="display: inline-block; position: relative; margin-bottom: 45px;">
                    <h2 style="font-family: inherit; font-size: 26px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0; padding-bottom: 15px; color: #111111; text-shadow: 1px 1px 1px rgba(255,255,255,0.8);">${title}</h2>
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 50px; height: 3px; background: #1a362d; border-radius: 2px;"></div>
                </div>
                
                <div class="collections-grid">
                ${items.map(col => `
                <a href="${col.link}" class="premium-category-card">
                    <div class="premium-img-wrapper">
                        <img src="${col.image}" alt="${col.title}" class="premium-col-img" loading="lazy">
                    </div>
                    <div class="premium-overlay">
                        <div class="premium-text-box">
                            <h4 class="premium-title">${col.title}</h4>
                            <span class="premium-shop-btn">Shop Now <span class="arrow">→</span></span>
                        </div>
                    </div>
                </a>
                `).join('')}
            </div>
        </div>
    </div>
    `;

    // Group HOME_CATEGORIES dynamically
    const groupedCategories = {};
    if (typeof HOME_CATEGORIES !== 'undefined') {
        HOME_CATEGORIES.forEach(cat => {
            if (!groupedCategories[cat.group]) {
                groupedCategories[cat.group] = [];
            }
            groupedCategories[cat.group].push(cat);
        });
    }

    let dynamicCategoriesHtml = '';
    const categoryOrder = ["SHOP WOMEN'S CATEGORIES", "SHOP MEN'S CATEGORIES", "SHOP KIDS CATEGORIES"];
    
    // Render ordered groups first
    categoryOrder.forEach(group => {
        if (groupedCategories[group]) {
            dynamicCategoriesHtml += renderCategorySection(group, groupedCategories[group]);
            delete groupedCategories[group];
        }
    });

    // Render any other remaining groups
    for (const group in groupedCategories) {
        dynamicCategoriesHtml += renderCategorySection(group, groupedCategories[group]);
    }
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

        ${dynamicCategoriesHtml}
            <style>
                .collections-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 25px;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0 15px;
                }
                .premium-category-card {
                    position: relative;
                    display: block;
                    width: 100%;
                    aspect-ratio: 4/5;
                    border-radius: 4px;
                    overflow: hidden;
                    text-decoration: none;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
                }
                .premium-img-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background-color: #f5f5f5;
                }
                .premium-col-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top center;
                    display: block;
                    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .premium-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 25px;
                    pointer-events: none;
                }
                .premium-text-box {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    padding: 15px 20px;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.2);
                    width: 85%;
                    text-align: center;
                    transform: translateY(10px);
                    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.4s ease;
                    pointer-events: auto;
                }
                .premium-title {
                    font-size: 15px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    margin: 0 0 4px 0;
                    color: #fff;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .premium-shop-btn {
                    font-size: 11px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255,255,255,0.9);
                    opacity: 0;
                    transform: translateY(5px);
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    display: inline-block;
                }
                .premium-shop-btn .arrow {
                    display: inline-block;
                    transition: transform 0.3s ease;
                }
                
                /* Hover Effects */
                .premium-category-card:hover .premium-col-img {
                    transform: scale(1.08);
                }
                .premium-category-card:hover .premium-text-box {
                    transform: translateY(0);
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255,255,255,0.4);
                }
                .premium-category-card:hover .premium-shop-btn {
                    opacity: 1;
                    transform: translateY(0);
                }
                .premium-category-card:hover .premium-shop-btn .arrow {
                    transform: translateX(4px);
                }

                @media(max-width: 767px) {
                    .collections-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 15px !important;
                        padding: 0 10px;
                    }
                    .premium-category-card {
                        aspect-ratio: 3/4;
                    }
                    .premium-text-box {
                        width: 92%;
                        padding: 10px 5px;
                        transform: translateY(0);
                    }
                    .premium-title {
                        font-size: 12px;
                        letter-spacing: 1px;
                        margin-bottom: 2px;
                    }
                    .premium-shop-btn {
                        font-size: 9px;
                        opacity: 1;
                        transform: translateY(0);
                    }
                    .premium-overlay {
                        padding-bottom: 15px;
                    }
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


        <div class="brands-marquee-section" style="padding: 60px 0; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); overflow: hidden; position: relative; margin-bottom: 60px; box-shadow: inset 0px 5px 15px rgba(0,0,0,0.02);">
            <div class="container text-center">
                <div style="display: inline-block; position: relative; margin-bottom: 40px;">
                    <h3 style="font-size: 24px; font-weight: 700; letter-spacing: 3px; color: #222; text-transform: uppercase; margin: 0; padding-bottom: 10px;">Featured Brands</h3>
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: var(--color-accent, #333); border-radius: 2px;"></div>
                </div>
            </div>
            
            <div class="marquee-wrapper" style="display: flex; white-space: nowrap; overflow: hidden; position: relative; width: 100%; max-width: 100vw;">
                <!-- Left and Right Fading Edges -->
                <div style="position: absolute; top: 0; left: 0; width: 100px; height: 100%; background: linear-gradient(to right, #f8f9f9, transparent); z-index: 2; pointer-events: none;"></div>
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100%; background: linear-gradient(to left, #f8f9f9, transparent); z-index: 2; pointer-events: none;"></div>
                
                <div class="marquee-container" style="display: flex; width: max-content; animation: scrollBrands 30s linear infinite;">
                    <!-- Content 1 -->
                    <div class="marquee-content" style="display: flex; gap: 40px; padding-right: 40px; align-items: center; padding-top: 15px; padding-bottom: 25px;">
                        <div class="brand-card"><span style="font-family: 'Georgia', serif;">Khaadi</span></div>
                        <div class="brand-card"><span style="font-family: 'Arial', sans-serif; letter-spacing: 2px;">SAPPHIRE</span></div>
                        <div class="brand-card"><span style="font-family: 'Times New Roman', serif; font-style: italic;">Gul Ahmed</span></div>
                        <div class="brand-card"><span style="font-family: 'Impact', sans-serif; font-size: 32px;">J.</span></div>
                        <div class="brand-card"><span style="font-family: 'Verdana', sans-serif;">Sana Safinaz</span></div>
                        <div class="brand-card"><span style="font-family: 'Courier New', monospace; font-weight: 700;">Nishat Linen</span></div>
                        <div class="brand-card"><span style="font-family: 'Tahoma', sans-serif;">Maria.B</span></div>
                        <div class="brand-card"><span style="font-family: 'Trebuchet MS', sans-serif;">Alkaram</span></div>
                    </div>
                    <!-- Content 2 (Duplicate for smooth scroll) -->
                    <div class="marquee-content" style="display: flex; gap: 40px; padding-right: 40px; align-items: center; padding-top: 15px; padding-bottom: 25px;">
                        <div class="brand-card"><span style="font-family: 'Georgia', serif;">Khaadi</span></div>
                        <div class="brand-card"><span style="font-family: 'Arial', sans-serif; letter-spacing: 2px;">SAPPHIRE</span></div>
                        <div class="brand-card"><span style="font-family: 'Times New Roman', serif; font-style: italic;">Gul Ahmed</span></div>
                        <div class="brand-card"><span style="font-family: 'Impact', sans-serif; font-size: 32px;">J.</span></div>
                        <div class="brand-card"><span style="font-family: 'Verdana', sans-serif;">Sana Safinaz</span></div>
                        <div class="brand-card"><span style="font-family: 'Courier New', monospace; font-weight: 700;">Nishat Linen</span></div>
                        <div class="brand-card"><span style="font-family: 'Tahoma', sans-serif;">Maria.B</span></div>
                        <div class="brand-card"><span style="font-family: 'Trebuchet MS', sans-serif;">Alkaram</span></div>
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
                .brand-card {
                    background: #ffffff;
                    padding: 20px 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 180px;
                    height: 80px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    border: 1px solid rgba(0,0,0,0.03);
                    position: relative;
                    overflow: hidden;
                }
                .brand-card::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
                    transform: skewX(-25deg);
                    transition: all 0.6s ease;
                }
                .brand-card:hover::after {
                    left: 200%;
                }
                .brand-card:hover {
                    transform: translateY(-8px) scale(1.05);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                    border-color: var(--color-accent, #eee);
                }
                .brand-card span {
                    font-size: 22px;
                    font-weight: bold;
                    color: #333;
                    transition: color 0.3s ease;
                }
                .brand-card:hover span {
                    color: var(--color-accent, #000);
                }
            </style>
        </div>
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
