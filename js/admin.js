document.addEventListener('DOMContentLoaded', () => {
    
    // --- Authentication ---
    const loginScreen = document.getElementById('admin-login-screen');
    const mainLayout = document.getElementById('admin-main-layout');
    const passInput = document.getElementById('admin-password-input');
    const loginBtn = document.getElementById('admin-login-btn');
    const loginError = document.getElementById('admin-login-error');

    // Default password
    const ADMIN_PASSWORD = 'marwalibas123';

    if(loginBtn) {
        // Check if already logged in
        if (localStorage.getItem('marwa_admin_logged_in') === 'true') {
            loginScreen.style.display = 'none';
            mainLayout.style.display = 'flex';
        }

        loginBtn.addEventListener('click', () => {
            if (passInput.value === ADMIN_PASSWORD) {
                localStorage.setItem('marwa_admin_logged_in', 'true');
                loginScreen.style.display = 'none';
                mainLayout.style.display = 'flex';
            } else {
                loginError.style.display = 'block';
            }
        });
        
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
        
        // Optional: Add a logout function if needed later, e.g. 
        // window.adminLogout = () => { localStorage.removeItem('marwa_admin_logged_in'); location.reload(); }
    }

    // --- State Management ---
    // Products and Banners will be populated dynamically from js/data/products.js via Firebase onSnapshot
    window.products = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
    window.banners = typeof BANNERS !== 'undefined' ? BANNERS : [];
    window.collections = typeof COLLECTIONS !== 'undefined' ? COLLECTIONS : [];
    
    // We don't need a local save function because saveProductToDb and deleteProductFromDb are used.

    // --- DOM Elements ---
    const tbody = document.getElementById('products-tbody');
    const addBtn = document.getElementById('add-product-btn');
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('product-modal-overlay');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const form = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');

    // --- Banner DOM Elements ---
    const bannerTbody = document.getElementById('banners-tbody');
    const addBannerBtn = document.getElementById('add-banner-btn');
    const bannerModal = document.getElementById('banner-modal');
    const bannerOverlay = document.getElementById('banner-modal-overlay');
    const closeBannerBtn = document.getElementById('close-banner-modal-btn');
    const cancelBannerBtn = document.getElementById('cancel-banner-modal-btn');
    const bannerForm = document.getElementById('banner-form');
    const bannerModalTitle = document.getElementById('banner-modal-title');
    const bannerImageContainer = document.getElementById('banner-image-upload-container');

    // --- Collections DOM Elements ---
    const collectionTbody = document.getElementById('collections-tbody');
    const addCollectionBtn = document.getElementById('add-collection-btn');
    const collectionModal = document.getElementById('collection-modal');
    const collectionOverlay = document.getElementById('collection-modal-overlay');
    const closeCollectionBtn = document.getElementById('close-collection-modal-btn');
    const cancelCollectionBtn = document.getElementById('cancel-collection-modal-btn');
    const collectionForm = document.getElementById('collection-form');
    const collectionModalTitle = document.getElementById('collection-modal-title');
    const collectionImageContainer = document.getElementById('collection-image-upload-container');

    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-view]');
    const views = document.querySelectorAll('.admin-view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetView = link.getAttribute('data-view');
            views.forEach(view => {
                if (view.id === 'view-' + targetView) {
                    view.style.display = 'block';
                    view.classList.add('active'); // CSS fade-in
                } else {
                    view.style.display = 'none';
                    view.classList.remove('active');
                }
            });
        });
    });

    // --- Image Compression & Upload Logic ---
    const compressImage = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;
                
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                callback(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const imageContainer = document.getElementById('image-upload-container');
    const addImageRowBtn = document.getElementById('add-image-row-btn');

    if (addImageRowBtn) {
        addImageRowBtn.addEventListener('click', () => addImageRow(imageContainer));
    }

    // Helper for adding image rows to specific containers
    const addImageRow = (container, initialValue = '') => {
        const row = document.createElement('div');
        row.className = 'image-upload-row';
        const isBase64 = initialValue && initialValue.startsWith('data:');
        const urlValue = (!isBase64 && initialValue) ? initialValue : '';
        
        row.innerHTML = `
            <img class="image-preview-thumb" src="${initialValue || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg=='}">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
                <input type="text" class="form-control url-input" placeholder="Paste image URL here..." value="${urlValue}">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 12px; color: #888;">OR Upload File:</span>
                    <input type="file" accept="image/*" class="form-control file-input" style="font-size: 12px; padding: 6px;">
                </div>
            </div>
            <input type="hidden" class="base64-input" value="${initialValue}">
            <button type="button" class="action-btn delete remove-image-row-btn" title="Remove" style="padding: 0 8px; font-weight: bold; align-self: flex-start;">✕</button>
        `;

        const fileInput = row.querySelector('.file-input');
        const urlInput = row.querySelector('.url-input');
        const hiddenInput = row.querySelector('.base64-input');
        const preview = row.querySelector('.image-preview-thumb');
        const removeBtn = row.querySelector('.remove-image-row-btn');

        // Handle URL typing
        urlInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val) {
                hiddenInput.value = val;
                preview.src = val;
                fileInput.value = ''; // clear file selection
            } else {
                hiddenInput.value = '';
                preview.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg==';
            }
        });

        // Handle File picking
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                compressImage(file, (base64) => {
                    hiddenInput.value = base64;
                    preview.src = base64;
                    urlInput.value = ''; // clear url input
                });
            }
        });

        // Handle Remove
        removeBtn.addEventListener('click', () => {
            row.remove();
        });

        container.appendChild(row);
    };

    // --- Render Table ---
    window.renderTable = () => {
        tbody.innerHTML = '';
        if(!window.products || window.products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 40px;">No products found. Add a new product to get started.</td></tr>`;
            return;
        }

        window.products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${(product.images && product.images.length > 0) ? product.images[0] : (product.localImage || product.image)}" alt="${product.title}"></td>
                <td><strong>${product.title}</strong></td>
                <td>Rs. ${product.price.toLocaleString()}</td>
                <td>${product.stock !== undefined ? product.stock : 10}</td>
                <td style="text-transform: capitalize;">${product.collection.replace('-', ' ')}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}" title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete delete-btn" data-id="${product.id}" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach actions
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.getAttribute('data-id')));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteProduct(btn.getAttribute('data-id')));
        });
    };

    // --- Render Banners Table ---
    window.renderBannersTable = () => {
        bannerTbody.innerHTML = '';
        if(!window.banners || window.banners.length === 0) {
            bannerTbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 40px;">No banners found. Add a new banner to get started.</td></tr>`;
            return;
        }

        window.banners.forEach(banner => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${banner.image}" alt="${banner.title}"></td>
                <td><strong>${banner.title}</strong></td>
                <td>${banner.subtitle}</td>
                <td>${banner.btnLink}</td>
                <td>
                    <button class="action-btn edit-banner-btn" data-id="${banner.id}" title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete delete-banner-btn" data-id="${banner.id}" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            `;
            bannerTbody.appendChild(tr);
        });

        // Attach actions
        document.querySelectorAll('.edit-banner-btn').forEach(btn => {
            btn.addEventListener('click', () => openBannerModal(btn.getAttribute('data-id')));
        });
        document.querySelectorAll('.delete-banner-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteBanner(btn.getAttribute('data-id')));
        });
    };

    // --- Render Collections Table ---
    window.renderCollectionsTable = () => {
        collectionTbody.innerHTML = '';
        if(!window.collections || window.collections.length === 0) {
            collectionTbody.innerHTML = `<tr><td colspan="4" class="text-center" style="padding: 40px;">No collections found. Add a new collection to get started.</td></tr>`;
            return;
        }

        window.collections.forEach(col => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${col.image}" alt="${col.title}"></td>
                <td><strong>${col.title}</strong></td>
                <td>${col.link}</td>
                <td>
                    <button class="action-btn edit-collection-btn" data-id="${col.id}" title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete delete-collection-btn" data-id="${col.id}" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            `;
            collectionTbody.appendChild(tr);
        });

        // Attach actions
        document.querySelectorAll('.edit-collection-btn').forEach(btn => {
            btn.addEventListener('click', () => openCollectionModal(btn.getAttribute('data-id')));
        });
        document.querySelectorAll('.delete-collection-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteCollection(btn.getAttribute('data-id')));
        });
    };

    // --- Modal Logic ---
    const isExternalCheckbox = document.getElementById('product-is-external');
    const externalFieldsContainer = document.getElementById('external-fields-container');

    if(isExternalCheckbox) {
        isExternalCheckbox.addEventListener('change', (e) => {
            externalFieldsContainer.style.display = e.target.checked ? 'block' : 'none';
            document.getElementById('product-external-brand').required = e.target.checked;
            document.getElementById('product-external-url').required = e.target.checked;
        });
    }

    const openModal = (id = null) => {
        form.reset();
        if(isExternalCheckbox) {
            isExternalCheckbox.checked = false;
            externalFieldsContainer.style.display = 'none';
        }
        
        if (id) {
            modalTitle.textContent = "Edit Product";
            const product = window.products.find(p => p.id === id);
            
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-title').value = product.title;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-original-price').value = product.originalPrice;
            document.getElementById('product-collection').value = product.collection;
            document.getElementById('product-badge').value = product.badge || '';
            document.getElementById('product-stock').value = product.stock !== undefined ? product.stock : 10;

            if(product.isExternal) {
                isExternalCheckbox.checked = true;
                externalFieldsContainer.style.display = 'block';
                document.getElementById('product-external-brand').value = product.externalBrand || '';
                document.getElementById('product-external-url').value = product.externalUrl || '';
            }
            
            imageContainer.innerHTML = '';
            let imagesToLoad = [];
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                imagesToLoad = product.images;
            } else if (product.localImage || product.image) {
                imagesToLoad = [product.localImage || product.image];
            }

            if (imagesToLoad.length > 0) {
                imagesToLoad.forEach(img => addImageRow(imageContainer, img));
            } else {
                addImageRow(imageContainer);
            }

            document.getElementById('product-desc').value = product.description;
            
            // Format specs back to string
            let specsStr = '';
            if(product.specs) {
                for (const [key, val] of Object.entries(product.specs)) {
                    specsStr += `${key}:${val}\n`;
                }
            }
            document.getElementById('product-specs').value = specsStr.trim();
        } else {
            modalTitle.textContent = "Add Product";
            document.getElementById('product-id').value = '';
            document.getElementById('product-stock').value = '10';
            imageContainer.innerHTML = '';
            addImageRow(imageContainer);
        }

        modal.classList.add('active');
        overlay.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    };

    addBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // --- Banner Modal Logic ---
    const openBannerModal = (id = null) => {
        bannerForm.reset();
        
        if (id) {
            bannerModalTitle.textContent = "Edit Banner";
            const banner = window.banners.find(b => b.id === id);
            
            document.getElementById('banner-id').value = banner.id;
            document.getElementById('banner-title').value = banner.title;
            document.getElementById('banner-subtitle').value = banner.subtitle;
            document.getElementById('banner-discount').value = banner.discount || '';
            document.getElementById('banner-theme').value = banner.theme || 'light';
            document.getElementById('banner-btn-text').value = banner.btnText;
            document.getElementById('banner-btn-link').value = banner.btnLink;
            
            bannerImageContainer.innerHTML = '';
            addImageRow(bannerImageContainer, banner.image);
        } else {
            bannerModalTitle.textContent = "Add Banner";
            document.getElementById('banner-id').value = '';
            bannerImageContainer.innerHTML = '';
            addImageRow(bannerImageContainer);
        }

        bannerModal.classList.add('active');
        bannerOverlay.classList.add('active');
    };

    const closeBannerModal = () => {
        bannerModal.classList.remove('active');
        bannerOverlay.classList.remove('active');
    };

    addBannerBtn.addEventListener('click', () => openBannerModal());
    closeBannerBtn.addEventListener('click', closeBannerModal);
    cancelBannerBtn.addEventListener('click', closeBannerModal);
    bannerOverlay.addEventListener('click', closeBannerModal);

    // --- Collection Modal Logic ---
    const openCollectionModal = (id = null) => {
        collectionForm.reset();
        
        if (id) {
            collectionModalTitle.textContent = "Edit Collection";
            const col = window.collections.find(c => c.id === id);
            
            document.getElementById('collection-id').value = col.id;
            document.getElementById('collection-title').value = col.title;
            document.getElementById('collection-link').value = col.link;
            
            collectionImageContainer.innerHTML = '';
            addImageRow(collectionImageContainer, col.image);
        } else {
            collectionModalTitle.textContent = "Add Collection";
            document.getElementById('collection-id').value = '';
            collectionImageContainer.innerHTML = '';
            addImageRow(collectionImageContainer);
        }

        collectionModal.classList.add('active');
        collectionOverlay.classList.add('active');
    };

    const closeCollectionModal = () => {
        collectionModal.classList.remove('active');
        collectionOverlay.classList.remove('active');
    };

    if(addCollectionBtn) addCollectionBtn.addEventListener('click', () => openCollectionModal());
    if(closeCollectionBtn) closeCollectionBtn.addEventListener('click', closeCollectionModal);
    if(cancelCollectionBtn) cancelCollectionBtn.addEventListener('click', closeCollectionModal);
    if(collectionOverlay) collectionOverlay.addEventListener('click', closeCollectionModal);

    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Parse Specs
        const specsText = document.getElementById('product-specs').value;
        const specsObj = {};
        specsText.split('\n').forEach(line => {
            if(line.includes(':')) {
                const parts = line.split(':');
                specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
            }
        });

        // Parse Images
        const imageInputs = document.querySelectorAll('.base64-input');
        const imagesArray = Array.from(imageInputs).map(inp => inp.value).filter(val => val !== '');
        const mainImage = imagesArray.length > 0 ? imagesArray[0] : '';

        const newProduct = {
            id: document.getElementById('product-id').value || document.getElementById('product-title').value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: document.getElementById('product-title').value,
            price: parseInt(document.getElementById('product-price').value),
            originalPrice: parseInt(document.getElementById('product-original-price').value),
            collection: document.getElementById('product-collection').value,
            badge: document.getElementById('product-badge').value,
            stock: parseInt(document.getElementById('product-stock').value),
            isExternal: isExternalCheckbox ? isExternalCheckbox.checked : false,
            externalBrand: document.getElementById('product-external-brand') ? document.getElementById('product-external-brand').value : '',
            externalUrl: document.getElementById('product-external-url') ? document.getElementById('product-external-url').value : '',
            image: mainImage,
            localImage: mainImage,
            images: imagesArray,
            description: document.getElementById('product-desc').value,
            specs: specsObj
        };

        const existingIndex = window.products.findIndex(p => p.id === newProduct.id);
        
        if (existingIndex > -1) {
            // Edit Mode
            window.products[existingIndex] = newProduct;
        } else {
            // Add Mode
            window.products.push(newProduct);
        }

        if (typeof saveProductToDb === 'function') {
            saveProductToDb(newProduct);
        } else {
            // Fallback for local storage
            localStorage.setItem('marwa_products', JSON.stringify(window.products));
        }
        
        // window.renderTable() is triggered automatically by Firebase onSnapshot in products.js
        if (typeof window.renderTable === 'function') window.renderTable();
        closeModal();
    });

    // --- Banner Form Submission ---
    bannerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const imageInputs = bannerImageContainer.querySelectorAll('.base64-input');
        const imagesArray = Array.from(imageInputs).map(inp => inp.value).filter(val => val !== '');
        const mainImage = imagesArray.length > 0 ? imagesArray[0] : '';

        if (!mainImage) {
            alert('Please provide at least one image for the banner.');
            return;
        }

        let bannerId = document.getElementById('banner-id').value;
        if (!bannerId) {
            bannerId = 'banner-' + Date.now();
        }

        const newBanner = {
            id: bannerId,
            image: mainImage,
            title: document.getElementById('banner-title').value,
            subtitle: document.getElementById('banner-subtitle').value,
            discount: document.getElementById('banner-discount').value,
            theme: document.getElementById('banner-theme').value,
            btnText: document.getElementById('banner-btn-text').value,
            btnLink: document.getElementById('banner-btn-link').value
        };

        const existingIndex = window.banners.findIndex(b => b.id === newBanner.id);
        
        if (existingIndex > -1) {
            window.banners[existingIndex] = newBanner;
        } else {
            window.banners.push(newBanner);
        }

        if (typeof saveBannerToDb === 'function') {
            saveBannerToDb(newBanner);
        } else {
            localStorage.setItem('marwa_banners', JSON.stringify(window.banners));
        }
        
        if (typeof window.renderBannersTable === 'function') window.renderBannersTable();
        closeBannerModal();
    });

    // --- Collection Form Submission ---
    if(collectionForm) {
        collectionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const imageInputs = collectionImageContainer.querySelectorAll('.base64-input');
            const imagesArray = Array.from(imageInputs).map(inp => inp.value).filter(val => val !== '');
            const mainImage = imagesArray.length > 0 ? imagesArray[0] : '';

            if (!mainImage) {
                alert('Please provide an image for the collection.');
                return;
            }

            let colId = document.getElementById('collection-id').value;
            if (!colId) {
                colId = 'col-' + Date.now();
            }

            const newCollection = {
                id: colId,
                image: mainImage,
                title: document.getElementById('collection-title').value,
                link: document.getElementById('collection-link').value
            };

            const existingIndex = window.collections.findIndex(c => c.id === newCollection.id);
            
            if (existingIndex > -1) {
                window.collections[existingIndex] = newCollection;
            } else {
                window.collections.push(newCollection);
            }

            if (typeof saveCollectionToDb === 'function') {
                saveCollectionToDb(newCollection);
            } else {
                localStorage.setItem('marwa_collections', JSON.stringify(window.collections));
            }
            
            if (typeof window.renderCollectionsTable === 'function') window.renderCollectionsTable();
            closeCollectionModal();
        });
    }

    // --- Delete Logic ---
    const deleteProduct = (id) => {
        if(confirm("Are you sure you want to delete this product? This will immediately remove it from your website.")) {
            if (typeof deleteProductFromDb === 'function') {
                deleteProductFromDb(id);
            } else {
                window.products = window.products.filter(p => p.id !== id);
                localStorage.setItem('marwa_products', JSON.stringify(window.products));
            }
        }
    };

    const deleteBanner = (id) => {
        if(confirm("Are you sure you want to delete this banner?")) {
            if (typeof deleteBannerFromDb === 'function') {
                deleteBannerFromDb(id);
            } else {
                window.banners = window.banners.filter(b => b.id !== id);
                localStorage.setItem('marwa_banners', JSON.stringify(window.banners));
            }
        }
    };

    const deleteCollection = (id) => {
        if(confirm("Are you sure you want to delete this collection?")) {
            if (typeof deleteCollectionFromDb === 'function') {
                deleteCollectionFromDb(id);
            } else {
                window.collections = window.collections.filter(c => c.id !== id);
                localStorage.setItem('marwa_collections', JSON.stringify(window.collections));
            }
        }
    };

    // --- Orders Logic ---
    const ordersTbody = document.getElementById('orders-tbody');
    const orderModal = document.getElementById('order-modal');
    const orderModalOverlay = document.getElementById('order-modal-overlay');
    const closeOrderModalBtn = document.getElementById('close-order-modal-btn');
    const orderDetailsContent = document.getElementById('order-details-content');
    const orderStatusSelect = document.getElementById('order-status-select');
    const updateOrderStatusBtn = document.getElementById('update-order-status-btn');
    
    let currentOrders = [];
    let currentOpenOrderId = null;

    if (typeof db !== 'undefined') {
        db.collection('marwa_orders').orderBy('date', 'desc').onSnapshot(snapshot => {
            currentOrders = [];
            snapshot.forEach(doc => {
                currentOrders.push(doc.data());
            });
            renderOrdersTable();
        });
    }

    const renderOrdersTable = () => {
        if (!ordersTbody) return;
        ordersTbody.innerHTML = '';
        if (currentOrders.length === 0) {
            ordersTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No orders found.</td></tr>';
            return;
        }

        currentOrders.forEach(order => {
            const tr = document.createElement('tr');
            const dateStr = new Date(order.date).toLocaleDateString() + ' ' + new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            let statusColor = '#f59e0b'; // Pending
            if (order.status === 'Dispatched') statusColor = '#3b82f6';
            if (order.status === 'Delivered') statusColor = '#10b981';
            if (order.status === 'Cancelled') statusColor = '#ef4444';

            tr.innerHTML = `
                <td><strong>${order.orderId}</strong></td>
                <td>${dateStr}</td>
                <td>${order.customer.firstName} ${order.customer.lastName}</td>
                <td>Rs. ${order.total.toLocaleString()}</td>
                <td><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${order.status}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm view-order-btn" data-id="${order.orderId}">View Details</button>
                </td>
            `;
            ordersTbody.appendChild(tr);
        });

        document.querySelectorAll('.view-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.getAttribute('data-id');
                openOrderModal(orderId);
            });
        });
    };

    const openOrderModal = (orderId) => {
        const order = currentOrders.find(o => o.orderId === orderId);
        if (!order) return;
        
        currentOpenOrderId = orderId;
        
        const dateStr = new Date(order.date).toLocaleDateString() + ' ' + new Date(order.date).toLocaleTimeString();
        
        let itemsHtml = order.items.map(item => `
            <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <img src="${item.image}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 6px;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 15px;">${item.title}</h4>
                    <p style="margin: 0; color: #666; font-size: 13px;">Size: ${item.size} | Qty: ${item.quantity}</p>
                    <p style="margin: 5px 0 0 0; font-weight: 600;">Rs. ${(item.price * item.quantity).toLocaleString()}</p>
                </div>
            </div>
        `).join('');

        orderDetailsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h3 style="margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Customer Info</h3>
                    <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    <p><strong>Address:</strong><br>${order.customer.address}<br>${order.customer.apartment ? order.customer.apartment + '<br>' : ''}${order.customer.city}</p>
                </div>
                <div>
                    <h3 style="margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Order Summary</h3>
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Date:</strong> ${dateStr}</p>
                    <p><strong>Subtotal:</strong> Rs. ${order.subtotal.toLocaleString()}</p>
                    <p><strong>Shipping:</strong> Rs. ${order.shipping.toLocaleString()}</p>
                    <p style="font-size: 18px;"><strong>Total:</strong> Rs. ${order.total.toLocaleString()}</p>
                </div>
            </div>
            
            <h3 style="margin: 20px 0 15px 0; font-size: 16px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Items</h3>
            <div>${itemsHtml}</div>
        `;
        
        orderStatusSelect.value = order.status;
        
        orderModalOverlay.style.display = 'block';
        orderModal.classList.add('active');
    };

    if (closeOrderModalBtn) {
        closeOrderModalBtn.addEventListener('click', () => {
            orderModalOverlay.style.display = 'none';
            orderModal.classList.remove('active');
        });
    }

    if (orderModalOverlay) {
        orderModalOverlay.addEventListener('click', () => {
            orderModalOverlay.style.display = 'none';
            orderModal.classList.remove('active');
        });
    }

    if (updateOrderStatusBtn) {
        updateOrderStatusBtn.addEventListener('click', () => {
            if (currentOpenOrderId && typeof db !== 'undefined') {
                const newStatus = orderStatusSelect.value;
                updateOrderStatusBtn.textContent = 'Updating...';
                db.collection('marwa_orders').doc(currentOpenOrderId).update({
                    status: newStatus
                }).then(() => {
                    updateOrderStatusBtn.textContent = 'Update';
                    orderModalOverlay.style.display = 'none';
                    orderModal.classList.remove('active');
                }).catch(err => {
                    console.error('Error updating order:', err);
                    updateOrderStatusBtn.textContent = 'Update';
                    alert('Failed to update order status.');
                });
            }
        });
    }

    // Initial render
    if (typeof window.renderTable === 'function') {
        window.renderTable();
    }
    if (typeof window.renderBannersTable === 'function') {
        window.renderBannersTable();
    }
    if (typeof window.renderCollectionsTable === 'function') {
        window.renderCollectionsTable();
    }

    // --- Home Categories Admin Logic ---
    const womenHcTbody = document.getElementById('women-categories-tbody');
    const menHcTbody = document.getElementById('men-categories-tbody');
    const kidsHcTbody = document.getElementById('kids-categories-tbody');
    
    const hcModal = document.getElementById('home-category-modal');
    const closeHcBtn = document.getElementById('close-home-category-modal-btn');
    const cancelHcBtn = document.getElementById('cancel-home-category-modal-btn');
    const hcForm = document.getElementById('home-category-form');
    const hcModalTitle = document.getElementById('home-category-modal-title');
    const hcImageContainer = document.getElementById('home-category-image-upload-container');

    window.renderHomeCategoriesTable = () => {
        const categories = window.homeCategories || [];
        
        const renderGroup = (tbody, groupName) => {
            if (!tbody) return;
            tbody.innerHTML = '';
            
            const groupCategories = categories.filter(c => c.group === groupName);
            
            if(groupCategories.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center" style="padding: 40px;">No categories found. Add a new category to get started.</td></tr>`;
                return;
            }

            groupCategories.forEach(cat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${cat.image}" alt="${cat.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"></td>
                    <td>${cat.title}</td>
                    <td>${cat.link}</td>
                    <td>
                        <button class="action-btn edit-hc-btn" data-id="${cat.id}" title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="action-btn delete delete-hc-btn" data-id="${cat.id}" title="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        };

        renderGroup(womenHcTbody, "SHOP WOMEN'S CATEGORIES");
        renderGroup(menHcTbody, "SHOP MEN'S CATEGORIES");
        renderGroup(kidsHcTbody, "SHOP KIDS CATEGORIES");

        // Attach actions
        document.querySelectorAll('.edit-hc-btn').forEach(btn => {
            btn.addEventListener('click', () => openHcModal(btn.getAttribute('data-id')));
        });
        document.querySelectorAll('.delete-hc-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteHc(btn.getAttribute('data-id')));
        });
    };

    let currentAddGroup = '';

    const openHcModal = (id = null, group = null) => {
        if (!hcForm) return;
        hcForm.reset();
        
        if (id) {
            hcModalTitle.textContent = "Edit Category";
            const cat = window.homeCategories.find(c => c.id === id);
            
            document.getElementById('home-category-id').value = cat.id;
            document.getElementById('home-category-group').value = cat.group; // hidden input
            document.getElementById('home-category-title').value = cat.title;
            document.getElementById('home-category-link').value = cat.link;
            
            hcImageContainer.innerHTML = '';
            addImageRow(hcImageContainer, cat.image);
        } else {
            hcModalTitle.textContent = "Add Category";
            document.getElementById('home-category-id').value = '';
            document.getElementById('home-category-group').value = group || ''; // hidden input
            currentAddGroup = group;
            hcImageContainer.innerHTML = '';
            addImageRow(hcImageContainer);
        }

        hcModal.classList.add('active');
    };

    const closeHcModal = () => {
        if (hcModal) hcModal.classList.remove('active');
    };

    // Bind Add Buttons for the three tabs
    document.querySelectorAll('.add-hc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.getAttribute('data-group');
            openHcModal(null, group);
        });
    });
    
    if (closeHcBtn) closeHcBtn.addEventListener('click', closeHcModal);
    if (cancelHcBtn) cancelHcBtn.addEventListener('click', closeHcModal);

    const deleteHc = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            window.homeCategories = window.homeCategories.filter(c => c.id !== id);
            
            if (typeof deleteHomeCategoryFromDb === 'function') {
                deleteHomeCategoryFromDb(id);
            } else {
                localStorage.setItem('marwa_home_categories', JSON.stringify(window.homeCategories));
            }
            
            if (typeof window.renderHomeCategoriesTable === 'function') window.renderHomeCategoriesTable();
        }
    };

    if (hcForm) {
        hcForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const imageInputs = hcImageContainer.querySelectorAll('.base64-input');
            const imagesArray = Array.from(imageInputs).map(inp => inp.value).filter(val => val !== '');
            const mainImage = imagesArray.length > 0 ? imagesArray[0] : '';

            if (!mainImage) {
                alert('Please provide an image for the category.');
                return;
            }

            let catId = document.getElementById('home-category-id').value;
            if (!catId) {
                catId = 'hc-' + Date.now();
            }

            const newCategory = {
                id: catId,
                group: document.getElementById('home-category-group').value,
                title: document.getElementById('home-category-title').value,
                image: mainImage,
                link: document.getElementById('home-category-link').value
            };

            const existingIndex = window.homeCategories.findIndex(c => c.id === newCategory.id);
            
            if (existingIndex > -1) {
                window.homeCategories[existingIndex] = newCategory;
            } else {
                window.homeCategories.push(newCategory);
            }

            if (typeof saveHomeCategoryToDb === 'function') {
                saveHomeCategoryToDb(newCategory);
            } else {
                localStorage.setItem('marwa_home_categories', JSON.stringify(window.homeCategories));
            }
            
            if (typeof window.renderHomeCategoriesTable === 'function') window.renderHomeCategoriesTable();
            closeHcModal();
        });
    }

    if (typeof window.renderHomeCategoriesTable === 'function') {
        window.renderHomeCategoriesTable();
    }
});
