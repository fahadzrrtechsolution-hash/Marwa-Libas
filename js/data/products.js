const DEFAULT_PRODUCTS = [];

const DEFAULT_BANNERS = [];

const DEFAULT_COLLECTIONS = [];

const DEFAULT_HOME_CATEGORIES = [];

const DEFAULT_CATEGORY_BANNERS = [];

// Load from localStorage cache for instant UI rendering, fallback to defaults
let PRODUCTS =
  JSON.parse(localStorage.getItem("marwa_products")) || DEFAULT_PRODUCTS;
let BANNERS =
  JSON.parse(localStorage.getItem("marwa_banners")) || DEFAULT_BANNERS;
let COLLECTIONS =
  JSON.parse(localStorage.getItem("marwa_collections")) || DEFAULT_COLLECTIONS;
let HOME_CATEGORIES =
  JSON.parse(localStorage.getItem("marwa_home_categories")) ||
  DEFAULT_HOME_CATEGORIES;

// Create events to notify when data is loaded
const productsLoadedEvent = new Event("productsLoaded");
const bannersLoadedEvent = new Event("bannersLoaded");
const collectionsLoadedEvent = new Event("collectionsLoaded");
const homeCategoriesLoadedEvent = new Event("homeCategoriesLoaded");



// Read from Firebase Firestore
if (typeof db !== "undefined") {
  db.collection("marwa_products").onSnapshot(
    (snapshot) => {
      let loadedProducts = [];
      snapshot.forEach((doc) => {
        loadedProducts.push(doc.data());
      });

      if (loadedProducts.length > 0) {
        PRODUCTS = loadedProducts;
        localStorage.setItem("marwa_products", JSON.stringify(PRODUCTS));
      } else {
        PRODUCTS = DEFAULT_PRODUCTS;
        // Automatically seed Firebase with default products on first run
        DEFAULT_PRODUCTS.forEach((p) =>
          db.collection("marwa_products").doc(p.id).set(p),
        );
      }

      // Dispatch event so the app knows products are ready
      window.dispatchEvent(productsLoadedEvent);

      // If we are in the admin panel, trigger renderTable if it exists
      if (typeof window.renderTable === "function") {
        window.products = PRODUCTS; // update admin.js local variable
        window.renderTable();
      } else if (typeof handleRoute === "function") {
        // Re-render the current route on the main site
        handleRoute(true);
      }
    },
    (error) => {
      console.error("Error fetching products from Firebase:", error);
    },
  );

  // Banners Listener
  db.collection("marwa_banners").onSnapshot((snapshot) => {
    let loadedBanners = [];
    snapshot.forEach((doc) => {
      loadedBanners.push(doc.data());
    });

    if (loadedBanners.length > 0) {
      BANNERS = loadedBanners;
      localStorage.setItem("marwa_banners", JSON.stringify(BANNERS));
    } else {
      BANNERS = DEFAULT_BANNERS;
      DEFAULT_BANNERS.forEach((b) =>
        db.collection("marwa_banners").doc(b.id).set(b),
      );
    }

    window.dispatchEvent(bannersLoadedEvent);

    if (typeof window.renderBannersTable === "function") {
      window.banners = BANNERS;
      window.renderBannersTable();
    } else if (typeof handleRoute === "function") {
      handleRoute(true);
    }
  });

  // Collections Listener
  db.collection("marwa_collections").onSnapshot((snapshot) => {
    let loadedCollections = [];
    snapshot.forEach((doc) => {
      loadedCollections.push(doc.data());
    });

    if (loadedCollections.length > 0) {
      COLLECTIONS = loadedCollections;
      localStorage.setItem("marwa_collections", JSON.stringify(COLLECTIONS));
    } else {
      COLLECTIONS = DEFAULT_COLLECTIONS;
      DEFAULT_COLLECTIONS.forEach((c) =>
        db.collection("marwa_collections").doc(c.id).set(c),
      );
    }

    window.dispatchEvent(collectionsLoadedEvent);

    if (typeof window.renderCollectionsTable === "function") {
      window.collections = COLLECTIONS;
      window.renderCollectionsTable();
    } else if (typeof handleRoute === "function") {
      handleRoute(true);
    }
  });

  // Home Categories Listener
  db.collection("marwa_home_categories").onSnapshot((snapshot) => {
    let loadedHC = [];
    snapshot.forEach((doc) => {
      loadedHC.push(doc.data());
    });

    if (loadedHC.length > 0) {
      HOME_CATEGORIES = loadedHC;
      localStorage.setItem(
        "marwa_home_categories",
        JSON.stringify(HOME_CATEGORIES),
      );
    } else {
      HOME_CATEGORIES = DEFAULT_HOME_CATEGORIES;
      DEFAULT_HOME_CATEGORIES.forEach((c) =>
        db.collection("marwa_home_categories").doc(c.id).set(c),
      );
    }

    window.dispatchEvent(homeCategoriesLoadedEvent);

    if (typeof window.renderHomeCategoriesTable === "function") {
      window.homeCategories = HOME_CATEGORIES;
      window.renderHomeCategoriesTable();
    } else if (typeof handleRoute === "function") {
      handleRoute(true); // Might need to re-render homepage
    }
  });

  // Category Banners Listener
  db.collection("marwa_category_banners").onSnapshot((snapshot) => {
    let loadedCB = [];
    snapshot.forEach((doc) => {
      loadedCB.push(doc.data());
    });

    if (loadedCB.length > 0) {
      CATEGORY_BANNERS = loadedCB;
      localStorage.setItem(
        "marwa_category_banners",
        JSON.stringify(CATEGORY_BANNERS),
      );
    } else {
      CATEGORY_BANNERS = DEFAULT_CATEGORY_BANNERS;
      DEFAULT_CATEGORY_BANNERS.forEach((cb) =>
        db.collection("marwa_category_banners").doc(cb.id).set(cb),
      );
    }

    window.dispatchEvent(categoryBannersLoadedEvent);

    if (typeof window.renderCategoryBannersTable === "function") {
      window.categoryBanners = CATEGORY_BANNERS;
      window.renderCategoryBannersTable();
    } else if (typeof handleRoute === "function") {
      handleRoute(true);
    }
  });
} else {
  // Fallback if Firebase fails to load
  const savedProducts = localStorage.getItem("marwa_products");
  if (savedProducts) {
    PRODUCTS = JSON.parse(savedProducts);
  }
  const savedBanners = localStorage.getItem("marwa_banners");
  if (savedBanners) {
    BANNERS = JSON.parse(savedBanners);
  }
  const savedCollections = localStorage.getItem("marwa_collections");
  if (savedCollections) {
    COLLECTIONS = JSON.parse(savedCollections);
  }
  const savedHC = localStorage.getItem("marwa_home_categories");
  if (savedHC) {
    HOME_CATEGORIES = JSON.parse(savedHC);
  }
  const savedCB = localStorage.getItem("marwa_category_banners");
  if (savedCB) {
    CATEGORY_BANNERS = JSON.parse(savedCB);
  }
  window.dispatchEvent(productsLoadedEvent);
  window.dispatchEvent(bannersLoadedEvent);
  window.dispatchEvent(collectionsLoadedEvent);
  window.dispatchEvent(homeCategoriesLoadedEvent);
  window.dispatchEvent(categoryBannersLoadedEvent);
}

// Helper to save product to Firebase
function saveProductToDb(product) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_products").doc(product.id).set(product);
  }
}

// Helper to delete product from Firebase
function deleteProductFromDb(id) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_products").doc(id).delete();
  }
}

// Helper to save banner to Firebase
function saveBannerToDb(banner) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_banners").doc(banner.id).set(banner);
  }
}

// Helper to delete banner from Firebase
function deleteBannerFromDb(id) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_banners").doc(id).delete();
  }
}

// Helper to save collection to Firebase
function saveCollectionToDb(collection) {
  if (typeof db !== "undefined") {
    return db
      .collection("marwa_collections")
      .doc(collection.id)
      .set(collection);
  }
}

// Helper to delete collection from Firebase
function deleteCollectionFromDb(id) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_collections").doc(id).delete();
  }
}

// Helper to save home category to Firebase
function saveHomeCategoryToDb(category) {
  if (typeof db !== "undefined") {
    return db
      .collection("marwa_home_categories")
      .doc(category.id)
      .set(category);
  }
}

// Helper to delete home category from Firebase
function deleteHomeCategoryFromDb(id) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_home_categories").doc(id).delete();
  }
}

// Helper to save category banner to Firebase
function saveCategoryBannerToDb(banner) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_category_banners").doc(banner.id).set(banner);
  }
}

// Helper to delete category banner from Firebase
function deleteCategoryBannerFromDb(id) {
  if (typeof db !== "undefined") {
    return db.collection("marwa_category_banners").doc(id).delete();
  }
}
