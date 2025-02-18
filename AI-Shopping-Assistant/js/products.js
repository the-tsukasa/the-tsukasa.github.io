let allProducts = [];

// 1️⃣ 动态加载商品数据
function loadProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '<p>商品を読み込んでいます...</p>';

    fetch('../data/products.json')  // 省略 ./
        .then(response => {
            if (!response.ok) throw new Error('JSONデータの読み込みに失敗しました');
            return response.json();
        })
        .then(data => {
            allProducts = data;
            displayProducts(allProducts);
        })
        .catch(error => {
            console.error('エラー:', error);
            container.innerHTML = '<p>商品データを読み込めませんでした。</p>';
        });
}

// 2️⃣ 显示商品列表
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>該当する商品がありません。</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">¥${product.price.toLocaleString()}</p>
            <button class="add-to-cart-btn">カートに追加</button>
        `;

        // 点击商品卡片跳转到详情页
        card.addEventListener('click', () => openProductDetail(product.id));

        // 阻止冒泡：点击“カートに追加”按钮时不跳转
        card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });

        container.appendChild(card);
    });
}

// 3️⃣ 商品详情页跳转
function openProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// 4️⃣ 添加到购物车
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.name} をカートに追加しました！`);
}

// 5️⃣ 搜索商品（支持多关键词 & 多ID）






// 6️⃣ 商品フィルター & ソート
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const brand = document.getElementById('brand-filter').value.toLowerCase();
    const system = document.getElementById('system-filter').value.toLowerCase();
    const sortOrder = document.getElementById('sort-filter').value; // ✅ 新增排序筛选器

    let filteredProducts = allProducts;

    // ✅ カテゴリ フィルター
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            return product.category && (
                (category === 'notebook' && product.category.includes("ノートパソコン")) ||
                (category === 'gaming' && product.category.includes("ゲーミングPC")) ||
                (category === 'desktop' && product.category.includes("デスクトップPC")) ||
                (category === 'tablet' && product.category.includes("タブレット")) ||
                (category === '2in1' && product.category.includes("2-in-1 デバイス"))
            );
        });
    }

    // ✅ 価格範囲 フィルター
    if (priceRange !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price || 0;
            if (priceRange === 'range1') return price <= 100000;
            if (priceRange === 'range2') return price > 100000 && price <= 200000;
            if (priceRange === 'range3') return price > 200000 && price <= 300000;
            return price > 300000;
        });
    }

    // ✅ ブランド フィルター
    if (brand !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.keywords && product.keywords.some(keyword =>
                keyword.toLowerCase().includes(brand)
            )
        );
    }

    // ✅ システム フィルター
    if (system !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.keywords && product.keywords.some(keyword =>
                keyword.toLowerCase().includes(system)
            )
        );
    }

    // ✅ 価格順ソート
    if (sortOrder === 'asc') {
        filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0)); // 安い順
    } else if (sortOrder === 'desc') {
        filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0)); // 高い順
    }

    displayProducts(filteredProducts); // ✅ 最終結果を表示
}


// 页面加载时调用
document.addEventListener('DOMContentLoaded', loadProducts);
