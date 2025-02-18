document.addEventListener("DOMContentLoaded", function () {
    const breadcrumb = document.getElementById("breadcrumb");

    // 页面映射
    const pathMap = {
        "index.html": "トップページ",
        "products.html": "商品",
        "about-us.html": "企業情報",
        "after-support-maintenance.html": "サポート"
    };

    let breadcrumbHTML = '<a href="index.html">トップページ</a>'; // 默认首页

    // 仅获取当前文件名
    const fileName = window.location.pathname.split("/").pop();

    if (fileName.includes("product-detail.html")) {
        breadcrumbHTML += ` > <a href="products.html">商品</a>`;

        // 获取产品名称，若没有则显示 "商品詳細"
        const productTitle = document.getElementById("product-title")?.textContent || "商品詳細";
        breadcrumbHTML += ` > <span>${productTitle}</span>`;
    } else {
        const pageName = pathMap[fileName] || decodeURIComponent(fileName.replace(/-/g, " "));

        if (pageName) {
            breadcrumbHTML += ` > <span>${pageName}</span>`;
        }
    }

    breadcrumb.innerHTML = breadcrumbHTML;
});
