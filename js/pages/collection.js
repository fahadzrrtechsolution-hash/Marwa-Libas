function renderCollectionPage(collectionId) {
  const appContent = document.getElementById("app-content");

  // Read user preferences from localStorage
  const savedCols = localStorage.getItem("marwa_grid_cols");
  const defaultCols = savedCols
    ? parseInt(savedCols)
    : window.innerWidth < 768
      ? 2
      : 6;
  const savedSort = localStorage.getItem("marwa_sort_pref") || "featured";

  // Store current state
  window.currentCollectionState = {
    id: collectionId,
    cols: defaultCols,
    sort: savedSort,
    baseProducts: PRODUCTS.filter(
      (p) => p.collection === collectionId || collectionId === "all",
    ),
    filter: null, // initialized on first render
  };

  renderCollectionContent();
}

function sortProducts(products, sortType) {
  const sorted = [...products];
  switch (sortType) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "featured":
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
      const prices = state.baseProducts.map((p) => p.price);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }
    state.filter = {
      inStock: true,
      outStock: true,
      minPrice: minPrice,
      maxPrice: maxPrice,
      absoluteMin: minPrice,
      absoluteMax: maxPrice,
    };
  }

  let currentProducts = state.baseProducts || [];

  if (state.filter) {
    currentProducts = currentProducts.filter((p) => {
      const isInStock = p.stock !== 0 && p.stock !== "Out of Stock";
      if (!state.filter.inStock && isInStock) return false;
      if (!state.filter.outStock && !isInStock) return false;
      if (p.price < state.filter.minPrice || p.price > state.filter.maxPrice)
        return false;
      return true;
    });
  }

  const sortedProducts = sortProducts(currentProducts, state.sort);

  let collectionTitle = state.id.replace(/-/g, " ");
  if (state.id === "under-2290") collectionTitle = "Dresses under Rs. 2290";

  let categoryBannerHtml = "";

  let customBanners = [];
  if (typeof CATEGORY_BANNERS !== "undefined") {
    customBanners = CATEGORY_BANNERS.filter((b) => b.collectionId === state.id);
  }

  if (customBanners.length > 1) {
    let slidesHtml = "";
    customBanners.forEach((b, index) => {
      const displayTitle = b.title || collectionTitle;
      const subtitleHtml = b.subtitle
        ? `<p style="font-size: 15px; margin-top: 15px; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${b.subtitle}</p>`
        : "";
      const themeColor = b.theme === "dark" ? "#000" : "#fff";
      const shadow = b.theme === "dark" ? "none" : "0 4px 15px rgba(0,0,0,0.3)";

      slidesHtml += `
                <div class="category-slide ${index === 0 ? "active" : ""}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: ${index === 0 ? "1" : "0"}; transition: opacity 0.8s ease-in-out;">
                    <img src="${b.image}" alt="${displayTitle}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: brightness(0.65);">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: ${themeColor}; z-index: 2; width: 100%;">
                        <h1 style="font-size: 42px; text-transform: uppercase; letter-spacing: 4px; font-weight: 500; text-shadow: ${shadow}; margin: 0;">${displayTitle}</h1>
                        ${subtitleHtml}
                    </div>
                </div>
            `;
    });

    categoryBannerHtml = `
            <div class="collection-banner category-slider-container" style="position: relative; width: 100%; height: 350px; overflow: hidden; margin-bottom: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                ${slidesHtml}
                <button class="cat-prev-slide" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button class="cat-next-slide" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        `;
  } else {
    let collectionImage = "assets/hero_banner.png";
    let displayTitle = collectionTitle;
    let subtitleHtml = `<p style="font-size: 15px; margin-top: 15px; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Explore Collection</p>`;
    let themeColor = "#fff";
    let shadow = "0 4px 15px rgba(0,0,0,0.3)";

    if (customBanners.length === 1) {
      const b = customBanners[0];
      collectionImage = b.image;
      displayTitle = b.title || collectionTitle;
      if (b.subtitle)
        subtitleHtml = `<p style="font-size: 15px; margin-top: 15px; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${b.subtitle}</p>`;
      themeColor = b.theme === "dark" ? "#000" : "#fff";
      shadow = b.theme === "dark" ? "none" : "0 4px 15px rgba(0,0,0,0.3)";
    } else {
      if (typeof HOME_CATEGORIES !== "undefined") {
        const hc = HOME_CATEGORIES.find((c) => c.link.includes(state.id));
        if (hc) {
          displayTitle = hc.group.replace("SHOP ", "") + " - " + hc.title;
          collectionImage = hc.image;
        }
      }
      if (
        collectionImage === "assets/hero_banner.png" &&
        typeof COLLECTIONS !== "undefined"
      ) {
        const col = COLLECTIONS.find((c) => c.link.includes(state.id));
        if (col) {
          displayTitle = col.title;
          collectionImage = col.image;
        }
      }
    }

    categoryBannerHtml = `
            <div class="collection-banner" style="position: relative; width: 100%; height: 350px; overflow: hidden; margin-bottom: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <img src="${collectionImage}" alt="${displayTitle}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: brightness(0.65);">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: ${themeColor}; z-index: 2; width: 100%;">
                    <h1 style="font-size: 42px; text-transform: uppercase; letter-spacing: 4px; font-weight: 500; text-shadow: ${shadow}; margin: 0;">${displayTitle}</h1>
                    ${subtitleHtml}
                </div>
            </div>
        `;
  }

  let productsHtml = "";
  sortedProducts.forEach((product) => {
    productsHtml += renderProductCard(product);
  });

  if (sortedProducts.length === 0) {
    productsHtml = `
            <div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 20px; background: #0a0a0a; position: relative; border-radius: 20px; overflow: hidden; text-align: center; min-height: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
                
                <!-- Animated Background Glows -->
                <div style="position: absolute; top: -100px; left: -100px; width: 300px; height: 300px; background: rgba(212, 175, 55, 0.15); filter: blur(100px); border-radius: 50%; animation: pulseGlow 4s alternate infinite;"></div>
                <div style="position: absolute; bottom: -100px; right: -100px; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.05); filter: blur(100px); border-radius: 50%; animation: pulseGlow 5s alternate-reverse infinite;"></div>
                
                <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; animation: comingSoonFadeIn 1s ease-out;">
                    
                    <!-- Elegant Dropping Line Animation -->
                    <div style="width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, #d4af37); margin-bottom: 30px; animation: dropLine 2.5s infinite;"></div>
                    
                    <h3 style="font-size: clamp(32px, 5vw, 56px); font-weight: 300; letter-spacing: 12px; margin-bottom: 20px; text-transform: uppercase; background: linear-gradient(45deg, #fff, #d4af37, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmerText 3s linear infinite; background-size: 200% auto;">Coming Soon</h3>
                    
                    <p style="font-size: 14px; color: #888; max-width: 450px; line-height: 1.8; margin-bottom: 40px; letter-spacing: 2px; text-transform: uppercase;">
                        Curating the finest aesthetics.<br>Our exclusive collection is in the works.
                    </p>
                    
                    <button onclick="location.hash='#home'" style="padding: 15px 40px; border-radius: 0; font-size: 13px; letter-spacing: 3px; border: 1px solid rgba(255,255,255,0.2); color: white; background: transparent; cursor: pointer; transition: all 0.4s ease; text-transform: uppercase;" onmouseover="this.style.background='white'; this.style.color='black';" onmouseout="this.style.background='transparent'; this.style.color='white';">
                        Return to Store
                    </button>
                </div>
            </div>
            
            <style>
                @keyframes shimmerText {
                    to { background-position: 200% center; }
                }
                @keyframes dropLine {
                    0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
                    40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
                    60% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
                    100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
                }
                @keyframes pulseGlow {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.2); opacity: 1; }
                }
                @keyframes comingSoonFadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
  }

  // Dynamic Filter Content
  const filterContent = document.querySelector(".filter-drawer-content");
  if (filterContent && state.filter) {
    const inStockCount = state.baseProducts.filter(
      (p) => p.stock !== 0 && p.stock !== "Out of Stock",
    ).length;
    const outOfStockCount = state.baseProducts.length - inStockCount;

    filterContent.innerHTML = `
            <!-- Availability Section -->
            <div class="filter-section" style="margin-bottom: 30px; border-bottom: 1px solid var(--color-border); padding-bottom: 25px;">
                <h4 style="font-size: 15px; font-weight: 500; margin-bottom: 20px; color: var(--color-text-primary); display: inline-block; border-bottom: 2px solid var(--color-brand); padding-bottom: 4px;">Availability</h4>
                
                <label class="filter-checkbox" style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px; cursor: pointer;">
                    <input type="checkbox" id="filter-in-stock" ${state.filter.inStock ? "checked" : ""} style="accent-color: var(--color-brand); width: 16px; height: 16px; cursor: pointer;">
                    <span style="font-size: 14px; color: var(--color-text-primary);">In Stock (${inStockCount})</span>
                </label>
                
                <label class="filter-checkbox" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                    <input type="checkbox" id="filter-out-stock" ${state.filter.outStock ? "checked" : ""} style="accent-color: var(--color-brand); width: 16px; height: 16px; cursor: pointer;">
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
        <button class="grid-btn" data-cols="${cols}" style="display: flex; gap: 2px; padding: 4px; border: 1px solid ${isActive ? "#333" : "transparent"}; background: none; cursor: pointer; height: 26px; border-radius: 2px;">
            ${Array(cols)
              .fill(0)
              .map(
                () =>
                  `<span style="width: 4px; background: ${isActive ? "#333" : "#999"}; height: 100%;"></span>`,
              )
              .join("")}
        </button>
        `;
  };

  const appContent = document.getElementById("app-content");
  appContent.innerHTML = `
        <div class="container collection-section" style="max-width: 1600px; padding-top: 40px;">
            ${categoryBannerHtml}
            <div class="collection-toolbar" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 15px 0; margin-bottom: 30px;">
                <div class="toolbar-left">
                    <button class="btn-filter" style="background: none; border: none; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        Filter
                    </button>
                </div>
                
                <div class="toolbar-center grid-controls desktop-only" style="display: flex; gap: 8px; align-items: center;">
                    <button class="grid-btn" data-cols="1" style="display: flex; flex-direction: column; gap: 2px; padding: 4px; border: 1px solid ${state.cols === 1 ? "#333" : "transparent"}; background: none; cursor: pointer; height: 26px; border-radius: 2px; width: 20px;">
                        <span style="width: 100%; background: ${state.cols === 1 ? "#333" : "#999"}; height: 4px;"></span>
                        <span style="width: 100%; background: ${state.cols === 1 ? "#333" : "#999"}; height: 4px;"></span>
                        <span style="width: 100%; background: ${state.cols === 1 ? "#333" : "#999"}; height: 4px;"></span>
                    </button>
                    ${gridBtnHtml(2)}
                    ${gridBtnHtml(3)}
                    ${gridBtnHtml(4)}
                    ${gridBtnHtml(5)}
                    ${gridBtnHtml(6)}
                </div>
                
                <div class="toolbar-right">
                    <select id="sort-select" style="padding: 8px 15px; border: 1px solid var(--color-border); border-radius: 20px; outline: none; font-size: 13px; cursor: pointer;">
                        <option value="featured" ${state.sort === "featured" ? "selected" : ""}>Featured</option>
                        <option value="price-asc" ${state.sort === "price-asc" ? "selected" : ""}>Price, low to high</option>
                        <option value="price-desc" ${state.sort === "price-desc" ? "selected" : ""}>Price, high to low</option>
                        <option value="title-asc" ${state.sort === "title-asc" ? "selected" : ""}>Alphabetically, A-Z</option>
                        <option value="title-desc" ${state.sort === "title-desc" ? "selected" : ""}>Alphabetically, Z-A</option>
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
  setupCategorySlider();
}

function setupCategorySlider() {
  const container = document.querySelector(".category-slider-container");
  if (!container) return;

  const slides = container.querySelectorAll(".category-slide");
  const prevBtn = container.querySelector(".cat-prev-slide");
  const nextBtn = container.querySelector(".cat-next-slide");

  if (!slides.length) return;

  let currentIdx = 0;
  let autoPlayInterval;

  const showSlide = (idx) => {
    slides.forEach((s) => {
      s.style.opacity = "0";
      s.classList.remove("active");
    });
    slides[idx].style.opacity = "1";
    slides[idx].classList.add("active");
  };

  const nextSlide = () => {
    currentIdx = (currentIdx + 1) % slides.length;
    showSlide(currentIdx);
  };

  const prevSlide = () => {
    currentIdx = (currentIdx - 1 + slides.length) % slides.length;
    showSlide(currentIdx);
  };

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetInterval();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetInterval();
    });

  const resetInterval = () => {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  autoPlayInterval = setInterval(nextSlide, 5000);
}

function setupToolbarListeners() {
  const gridBtns = document.querySelectorAll(".grid-btn");
  gridBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const cols = parseInt(this.getAttribute("data-cols"));
      window.currentCollectionState.cols = cols;
      localStorage.setItem("marwa_grid_cols", cols);
      renderCollectionContent();
    });
  });

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      window.currentCollectionState.sort = this.value;
      localStorage.setItem("marwa_sort_pref", this.value);
      renderCollectionContent();
    });
  }

  // Filter Drawer Logic
  const filterBtn = document.querySelector(".btn-filter");
  const filterDrawer = document.getElementById("filter-drawer");
  const filterOverlay = document.getElementById("filter-drawer-overlay");
  const closeFilterBtn = document.getElementById("close-filter");

  if (filterBtn && filterDrawer && filterOverlay) {
    // We ensure we don't attach multiple identical listeners by removing previous if any,
    // but since this is bound dynamically it's better to just overwrite onclick or keep it simple.
    filterBtn.onclick = (e) => {
      e.preventDefault();
      filterDrawer.classList.add("active");
      filterOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeFilter = () => {
      filterDrawer.classList.remove("active");
      filterOverlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (closeFilterBtn) closeFilterBtn.onclick = closeFilter;
    filterOverlay.onclick = closeFilter;
  }

  const applyFiltersBtn = document.getElementById("apply-filters-btn");
  if (applyFiltersBtn) {
    applyFiltersBtn.onclick = () => {
      const inStock = document.getElementById("filter-in-stock").checked;
      const outStock = document.getElementById("filter-out-stock").checked;
      let minPrice = parseFloat(
        document.getElementById("filter-min-price").value,
      );
      let maxPrice = parseFloat(
        document.getElementById("filter-max-price").value,
      );

      if (isNaN(minPrice))
        minPrice = window.currentCollectionState.filter.absoluteMin;
      if (isNaN(maxPrice))
        maxPrice = window.currentCollectionState.filter.absoluteMax;

      window.currentCollectionState.filter.inStock = inStock;
      window.currentCollectionState.filter.outStock = outStock;
      window.currentCollectionState.filter.minPrice = minPrice;
      window.currentCollectionState.filter.maxPrice = maxPrice;

      if (filterDrawer) filterDrawer.classList.remove("active");
      if (filterOverlay) filterOverlay.classList.remove("active");
      document.body.style.overflow = "";

      renderCollectionContent();
    };
  }
}
