function setupUIEvents() {
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-drawer-overlay");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const searchDrawer = document.getElementById("search-drawer");
  const searchDrawerOverlay = document.getElementById("search-drawer-overlay");

  function lockScroll() {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
  }

  function openCartDrawer() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    lockScroll();
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    unlockScroll();
  }

  function openMobileMenu() {
    mobileDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
    lockScroll();
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    unlockScroll();
  }

  function openSearchOverlay() {
    searchDrawer.classList.add("active");
    searchDrawerOverlay.classList.add("active");
    document.getElementById("search-input").focus();
    lockScroll();
  }

  function closeSearchOverlay() {
    searchDrawer.classList.remove("active");
    searchDrawerOverlay.classList.remove("active");
    document.getElementById("search-input").value = "";
    document.getElementById("search-results").innerHTML = "";
    unlockScroll();
  }

  document
    .getElementById("cart-trigger")
    ?.addEventListener("click", openCartDrawer);
  document
    .getElementById("close-cart")
    ?.addEventListener("click", closeCartDrawer);
  cartOverlay?.addEventListener("click", closeCartDrawer);

  document
    .getElementById("mobile-menu-toggle")
    ?.addEventListener("click", openMobileMenu);
  document
    .getElementById("close-mobile-menu")
    ?.addEventListener("click", closeMobileMenu);
  drawerOverlay?.addEventListener("click", closeMobileMenu);

  document
    .getElementById("search-trigger")
    ?.addEventListener("click", openSearchOverlay);
  document
    .getElementById("close-search")
    ?.addEventListener("click", closeSearchOverlay);

  // Escape key to close overlays
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartDrawer();
      closeMobileMenu();
      closeSearchOverlay();
    }
  });

  searchDrawerOverlay?.addEventListener("click", closeSearchOverlay);

  // Search bar functionality
  const searchInput = document.getElementById("search-input");
  const searchCategory = document.getElementById("search-category");
  const resultsContainer = document.getElementById("search-results");

  if (searchInput) {
    const performSearch = () => {
      const query = searchInput.value.toLowerCase().trim();
      const category = searchCategory ? searchCategory.value : "all";
      const suggestionsDiv = document.getElementById("search-suggestions");

      if (query === "") {
        resultsContainer.innerHTML = "";
        if (suggestionsDiv) suggestionsDiv.style.display = "block";
        return;
      }

      if (suggestionsDiv) suggestionsDiv.style.display = "none";

      const filtered = PRODUCTS.filter((p) => {
        const matchesQuery =
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.specs &&
            p.specs["Color"] &&
            p.specs["Color"].toLowerCase().includes(query));

        let matchesCategory = true;
        if (category !== "all") {
          const catLower = category.toLowerCase();
          let keyMatch =
            catLower.includes("3pc") || catLower.includes("3pcs")
              ? "3pc"
              : "2pc";
          matchesCategory =
            p.title.toLowerCase().includes(keyMatch) ||
            (p.specs &&
              p.specs["No. of Pieces"] &&
              p.specs["No. of Pieces"].toLowerCase().includes(keyMatch));
        }

        return matchesQuery && matchesCategory;
      });

      let resultsHtml = "";
      filtered.forEach((product) => {
        resultsHtml += `
                    <div class="search-result-item" onclick="window.location.hash='#product/${product.id}'; document.getElementById('search-drawer').classList.remove('active'); document.getElementById('search-drawer-overlay').classList.remove('active'); document.body.style.overflow='';">
                        <img src="${product.localImage}" alt="${product.title}">
                        <div class="search-result-info">
                            <h4 class="search-result-title">${product.title}</h4>
                            <span class="search-result-price">Rs. ${product.price.toLocaleString()}</span>
                        </div>
                    </div>
                `;
      });

      if (filtered.length === 0) {
        resultsHtml =
          '<p class="text-center" style="padding: 20px 0; color: var(--color-text-secondary);">No products were found matching your selection.</p>';
      }

      resultsContainer.innerHTML = resultsHtml;
    };

    searchInput.addEventListener("input", performSearch);
    if (searchCategory)
      searchCategory.addEventListener("change", performSearch);
  }

  // Newsletter form submit
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert(
        "Subscribed successfully! Check your inbox for your 10% discount code.",
      );
      this.reset();
    });
  }
}
