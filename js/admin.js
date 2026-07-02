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
        loginBtn.addEventListener('click', () => {
            if (passInput.value === ADMIN_PASSWORD) {
                loginScreen.style.display = 'none';
                mainLayout.style.display = 'flex';
            } else {
                loginError.style.display = 'block';
            }
        });
        
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    }

    // --- State Management ---
    // Products will be populated dynamically from js/data/products.js via Firebase onSnapshot
    // We just declare the global `products` variable here to be populated
    window.products = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
    
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

    const addImageRow = (initialValue = '') => {
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

        imageContainer.appendChild(row);
    };

    if (addImageRowBtn) {
        addImageRowBtn.addEventListener('click', () => addImageRow());
    }

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

    // --- Modal Logic ---
    const openModal = (id = null) => {
        form.reset();
        
        if (id) {
            modalTitle.textContent = "Edit Product";
            const product = window.products.find(p => p.id === id);
            
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-title').value = product.title;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-original-price').value = product.originalPrice;
            document.getElementById('product-collection').value = product.collection;
            document.getElementById('product-badge').value = product.badge || '';
            
            imageContainer.innerHTML = '';
            let imagesToLoad = [];
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                imagesToLoad = product.images;
            } else if (product.localImage || product.image) {
                imagesToLoad = [product.localImage || product.image];
            }

            if (imagesToLoad.length > 0) {
                imagesToLoad.forEach(img => addImageRow(img));
            } else {
                addImageRow();
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
            imageContainer.innerHTML = '';
            addImageRow();
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

    // --- Delete Logic ---
    const deleteProduct = (id) => {
        if(confirm("Are you sure you want to delete this product? This will immediately remove it from your website.")) {
            if (typeof deleteProductFromDb === 'function') {
                deleteProductFromDb(id);
            } else {
                window.products = window.products.filter(p => p.id !== id);
                localStorage.setItem('marwa_products', JSON.stringify(window.products));
            }
            // renderTable() is triggered automatically by Firebase onSnapshot
        }
    };

    // Initial render
    if (typeof window.renderTable === 'function') {
        window.renderTable();
    }
});
