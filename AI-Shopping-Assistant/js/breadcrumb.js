document.addEventListener("DOMContentLoaded", function () {
    const breadcrumb = document.getElementById("breadcrumb");

    // 定义页面名称映射
    const pathMap = {
        "index.html": "ホーム",
        "products.html": "商品",
        "about%20Us.html": "会社概要",  // 修正路径，使用编码后的格式
        "After%20Support%20Maintenance.html": "お問い合わせ"
    };

    let breadcrumbHTML = '<a href="index.html">ホーム</a>'; // 默认首页

    if (window.location.pathname.includes("product-detail.html")) {
        breadcrumbHTML += ` > <a href="products.html">商品</a>`;

        // 获取产品名称，若没有则显示 "商品詳細"
        const productTitle = document.getElementById("product-title")?.textContent || "商品詳細";
        breadcrumbHTML += ` > <span>${productTitle}</span>`;
    } else {
        const path = window.location.pathname.split("/").filter(Boolean);
        let cumulativePath = "";

        path.forEach((fileName, index) => {
            cumulativePath += "/" + fileName;
            const pageName = pathMap[fileName] || decodeURIComponent(fileName.replace(/-/g, " "));

            if (index < path.length - 1) {
                breadcrumbHTML += ` > <a href="${cumulativePath}">${pageName}</a>`;
            } else {
                breadcrumbHTML += ` > <span>${pageName}</span>`;
            }
        });
    }

    breadcrumb.innerHTML = breadcrumbHTML;
});
