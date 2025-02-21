document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");

    if (searchBar) {
        // 监听 Enter 事件，确保至少 1 个字符才搜索
        searchBar.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const searchText = searchBar.value.trim();

                if (searchText.length < 1) {
                    alert("🔍 検索するには、少なくとも1文字を入力してください！");
                    return;
                }

                // ✅ 如果当前不在 products.html，则跳转过去，并附带搜索参数
                if (!window.location.pathname.includes("products.html")) {
                    window.location.href = `products.html?search=${encodeURIComponent(searchText)}&autoSearch=true`;
                } else {
                    // ✅ 直接执行搜索
                    searchProducts(searchText);
                }
            }
        });
    }

    // ✅ 如果是 `products.html`，读取 URL 参数并自动搜索
    if (window.location.pathname.includes("products.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("search");
        const autoSearch = urlParams.get("autoSearch"); // 是否是自动搜索

        if (searchQuery) {
            searchBar.value = searchQuery;

            if (autoSearch) {
                // ✅ 模拟回车按下，触发搜索
                setTimeout(() => {
                    const event = new KeyboardEvent("keypress", { key: "Enter" });
                    searchBar.dispatchEvent(event);
                }, 300); // 0.3 秒后触发
            } else {
                searchProducts(searchQuery); // 直接执行搜索
            }
        }
    }
});

// ✅ 只在 `products.html` 执行搜索逻辑
function searchProducts(searchText) {
    if (!window.location.pathname.includes("products.html")) {
        console.warn("⚠️ searchProducts() 只在 products.html 执行");
        return;
    }

    if (!searchText.trim()) {
        displayProducts(allProducts);
        return;
    }

    console.log(`🔍 検索: ${searchText}`);

    // ✅ 解析 "id: 1,2,3" 格式
    const idPattern = /id:\s*(\d+(?:,\s*\d+)*)/i;
    const idMatch = searchText.match(idPattern);

    if (idMatch) {
        const ids = idMatch[1].split(",").map(id => parseInt(id.trim(), 10));

        if (ids.length > 5) {
            alert("⚠️ IDは最大5つまで指定できます。");
            return;
        }

        const filteredProducts = allProducts.filter(product => ids.includes(product.id));
        displayProducts(filteredProducts);
        return;
    }

    // ✅ 解析普通关键词搜索（去除空格 & 小写化）
    const normalizeText = text => text.replace(/\s+/g, "").toLowerCase(); // 去空格 & 小写
    const keywords = searchText.split(",").map(kw => normalizeText(kw)).filter(kw => kw);

    if (keywords.length > 5) {
        alert("⚠️ キーワードは最大5つまで指定できます。");
        return;
    }

    // ✅ 进行模糊匹配（忽略空格 & 大小写）
    const filteredProducts = allProducts.filter(product =>
        keywords.some(keyword =>
            normalizeText(product.name).includes(keyword) ||
            normalizeText(product.description).includes(keyword) ||
            (product.keywords && product.keywords.some(kw => normalizeText(kw).includes(keyword)))
        )
    );

    displayProducts(filteredProducts);
}
