


function renderHomepage() {
    // Dropdown toggle logic
    window.toggleCategoryDropdown = function(element, event) {
        event.stopPropagation();
        const parent = element.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.category-dropdown-wrapper.active').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
        
        // Toggle current one
        if (!isActive) {
            parent.classList.add('active');
        }
    };

    // Close when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.category-dropdown-wrapper')) {
            document.querySelectorAll('.category-dropdown-wrapper.active').forEach(wrapper => {
                wrapper.classList.remove('active');
            });
        }
    });

    const appContent = document.getElementById('app-content');
    
    let productsHtml = '';
    PRODUCTS.forEach(product => {
        productsHtml += renderProductCard(product);
    });

    let dynamicCategoriesHtml = `
        <div class="category-top-nav" style="background: #ffffff; padding: 15px 0; overflow: visible; margin-bottom: 20px; position: relative; z-index: 100;">
            <div class="container category-top-nav-container">
                
                <div class="category-dropdown-wrapper">
                    <a href="javascript:void(0)" class="category-chip" onclick="toggleCategoryDropdown(this, event)">Women <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:2px;"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                    <div class="category-dropdown">
                        <a href="#collection/women-clothing">Clothing</a>
                        <a href="#collection/women-accessories">Accessories</a>
                        <a href="#collection/women-footwear">Footwear</a>
                        <a href="#collection/women-lingerie">Lingerie and Sleepwear</a>
                    </div>
                </div>

                <div class="category-dropdown-wrapper">
                    <a href="javascript:void(0)" class="category-chip" onclick="toggleCategoryDropdown(this, event)">Men <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:2px;"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                    <div class="category-dropdown">
                        <a href="#collection/men-clothing">Clothing</a>
                        <a href="#collection/men-footwear">Footwear</a>
                        <a href="#collection/men-accessories">Accessories</a>
                        <a href="#collection/men-inner-sleepwear">Inner and Sleepwear</a>
                    </div>
                </div>
                <div class="category-dropdown-wrapper">
                    <a href="javascript:void(0)" class="category-chip" onclick="toggleCategoryDropdown(this, event)">Kids <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:2px;"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                    <div class="category-dropdown">
                        <a href="#collection/kids-girl">Girl</a>
                        <a href="#collection/kids-boy">Boy</a>
                        <a href="#collection/kids-boy-newborn">Boy Newborn</a>
                        <a href="#collection/kids-girl-newborn">Girl Newborn</a>
                    </div>
                </div>
                <div class="category-dropdown-wrapper">
                    <a href="javascript:void(0)" class="category-chip" onclick="toggleCategoryDropdown(this, event)">Beauty <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:2px;"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                    <div class="category-dropdown">
                        <a href="#collection/beauty-fragrance">Fragrance</a>
                        <a href="#collection/beauty-hair-care">Hair Care</a>
                        <a href="#collection/beauty-makeup">Makeup</a>
                        <a href="#collection/beauty-skincare">Skincare</a>
                        <a href="#collection/beauty-bath-body">Bath & Body</a>
                    </div>
                </div>
            </div>
            <style>
                .category-top-nav-container {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }
                .category-dropdown-wrapper {
                    position: relative;
                    display: inline-block;
                }
                .category-dropdown {
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(15px) scale(0.95);
                    background-color: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    min-width: 220px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    border-radius: 12px;
                    padding: 12px 0;
                    z-index: 200;
                    border: 1px solid rgba(0,0,0,0.05);
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    display: flex;
                    flex-direction: column;
                }
                .category-dropdown-wrapper:hover .category-dropdown,
                .category-dropdown-wrapper.active .category-dropdown {
                    visibility: visible;
                    opacity: 1;
                    transform: translateX(-50%) translateY(10px) scale(1);
                }
                .category-dropdown::before {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: 0;
                    width: 100%;
                    height: 10px;
                }
                .category-dropdown a {
                    color: #444;
                    padding: 10px 24px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    text-align: left;
                    position: relative;
                }
                .category-dropdown a:hover {
                    background-color: rgba(0,0,0,0.03);
                    color: #000;
                    padding-left: 30px;
                }

                .category-chip {
                    display: inline-flex;
                    align-items: center;
                    padding: 10px 22px;
                    background: #f8f8f8;
                    border-radius: 30px;
                    color: #222;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    border: 1px solid transparent;
                    white-space: nowrap;
                }
                .category-chip svg {
                    transition: transform 0.3s ease;
                }
                .category-dropdown-wrapper:hover .category-chip,
                .category-dropdown-wrapper.active .category-chip {
                    background: var(--color-brand);
                    color: #fff;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
                    text-decoration: none;
                }
                .category-dropdown-wrapper:hover .category-chip svg,
                .category-dropdown-wrapper.active .category-chip svg {
                    transform: rotate(180deg);
                }

                @media (max-width: 768px) {
                    .category-top-nav-container {
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .category-dropdown {
                        min-width: 160px;
                    }
                    .category-dropdown-wrapper:nth-child(1) .category-dropdown,
                    .category-dropdown-wrapper:nth-child(2) .category-dropdown {
                        left: 0;
                        transform: translateY(15px) scale(0.95);
                    }
                    .category-dropdown-wrapper:nth-child(1):hover .category-dropdown,
                    .category-dropdown-wrapper:nth-child(1).active .category-dropdown,
                    .category-dropdown-wrapper:nth-child(2):hover .category-dropdown,
                    .category-dropdown-wrapper:nth-child(2).active .category-dropdown {
                        transform: translateY(10px) scale(1);
                    }
                    .category-dropdown-wrapper:nth-child(3) .category-dropdown,
                    .category-dropdown-wrapper:nth-child(4) .category-dropdown {
                        left: auto;
                        right: 0;
                        transform: translateY(15px) scale(0.95);
                    }
                    .category-dropdown-wrapper:nth-child(3):hover .category-dropdown,
                    .category-dropdown-wrapper:nth-child(3).active .category-dropdown,
                    .category-dropdown-wrapper:nth-child(4):hover .category-dropdown,
                    .category-dropdown-wrapper:nth-child(4).active .category-dropdown {
                        transform: translateY(10px) scale(1);
                    }
                }
            </style>
        </div>
    `;
    appContent.innerHTML = `
        ${dynamicCategoriesHtml}

        <div class="hero-container fade-in">
            <section class="hero-section" id="hero-slider">
                <div class="hero-track" id="hero-track">
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
                                <a href="${banner.btnLink}" class="btn">${banner.btnText}</a>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
                </div>
                
                <div class="hero-pagination" id="hero-pagination">
                    ${BANNERS.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`).join('')}
                </div>
            </section>
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


        <div class="brands-marquee-section" style="background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); overflow: hidden; position: relative; box-shadow: inset 0px 5px 15px rgba(0,0,0,0.02);">
            <div class="container text-center">
                <div class="brands-title-wrapper" style="display: inline-block; position: relative;">
                    <h3 class="brands-title" style="font-weight: 700; letter-spacing: 3px; color: #222; text-transform: uppercase; margin: 0; padding-bottom: 10px;">Featured Brands</h3>
                    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: var(--color-accent, #333); border-radius: 2px;"></div>
                </div>
            </div>
            
            <div class="marquee-wrapper" style="display: flex; white-space: nowrap; overflow: hidden; position: relative; width: 100%; max-width: 100vw;">
                <!-- Left and Right Fading Edges -->
                <div style="position: absolute; top: 0; left: 0; width: 100px; height: 100%; background: linear-gradient(to right, #f8f9f9, transparent); z-index: 2; pointer-events: none;"></div>
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100%; background: linear-gradient(to left, #f8f9f9, transparent); z-index: 2; pointer-events: none;"></div>
                
                <div class="marquee-container" style="display: flex; width: max-content; animation: scrollBrands 30s linear infinite;">
                    <!-- Content 1 -->
                    <div class="marquee-content" style="display: flex; gap: 40px; padding-right: 40px; align-items: center;">
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
                    <div class="marquee-content" style="display: flex; gap: 40px; padding-right: 40px; align-items: center;">
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
                .brands-marquee-section {
                    padding: 60px 0;
                    margin-bottom: 60px;
                }
                .brands-title-wrapper {
                    margin-bottom: 40px;
                }
                .brands-title {
                    font-size: 24px;
                }
                .marquee-content {
                    padding-top: 15px;
                    padding-bottom: 25px;
                }
                @media (max-width: 767px) {
                    .brands-marquee-section {
                        padding: 15px 0;
                        margin-bottom: 20px;
                    }
                    .brands-title-wrapper {
                        margin-bottom: 15px;
                    }
                    .brands-title {
                        font-size: 16px;
                    }
                    .marquee-content {
                        padding-top: 5px;
                        padding-bottom: 10px;
                    }
                    .brand-card {
                        padding: 5px 15px !important;
                        min-width: 120px !important;
                        height: 45px !important;
                    }
                    .brand-card span {
                        font-size: 14px !important;
                    }
                }
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
    const heroSection = document.getElementById('hero-slider');
    const track = document.getElementById('hero-track');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-pagination .dot');
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const goToSlide = (index) => {
            if (index < 0) currentSlide = slides.length - 1;
            else if (index >= slides.length) currentSlide = 0;
            else currentSlide = index;

            track.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            slides.forEach(s => s.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            
            dots.forEach(d => d.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        const startSlider = () => {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 4500); 
        };

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                startSlider(); 
            });
        });

        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let heroWidth = heroSection.offsetWidth;

        // Update width on resize
        window.addEventListener('resize', () => {
            heroWidth = heroSection.offsetWidth;
        });

        const handleDragStart = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            currentX = startX;
            if (slideInterval) clearInterval(slideInterval); 
            track.style.transition = 'none';
        };

        const handleDragMove = (e) => {
            if (!isDragging) return;
            currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            let diff = currentX - startX;
            
            // Add resistance at edges
            if (currentSlide === 0 && diff > 0) diff *= 0.3;
            else if (currentSlide === slides.length - 1 && diff < 0) diff *= 0.3;

            track.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
        };

        const handleDragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            let endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
            let diff = startX - endX;

            if (Math.abs(diff) > 70) {
                if (diff > 0) nextSlide(); 
                else prevSlide(); 
            } else {
                goToSlide(currentSlide); 
            }
            startSlider(); 
        };

        if (heroSection) {
            heroSection.addEventListener('mousedown', handleDragStart);
            heroSection.addEventListener('mousemove', handleDragMove);
            heroSection.addEventListener('mouseup', handleDragEnd);
            heroSection.addEventListener('mouseleave', handleDragEnd);
            
            heroSection.addEventListener('touchstart', handleDragStart, {passive: true});
            heroSection.addEventListener('touchmove', handleDragMove, {passive: true});
            heroSection.addEventListener('touchend', handleDragEnd, {passive: true});
        }

        startSlider();
    }

    setupQuickBuyListeners();
}
