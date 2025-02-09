const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get('id')); // 确保 id 是数字
let allProducts = [];

fetch('../products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('JSON データの読み込みに失敗しました');
        }
        return response.json();
    })
    .then(data => {
        allProducts = data;

        const product = allProducts.find(p => p.id === productId);
        if (!product) {
            document.getElementById('product-detail').innerHTML = '<p>商品が見つかりません。</p>';
            return;
        }

        document.getElementById('product-image').src = product.image_url;
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = `¥${product.price.toLocaleString()}`;

        // 渲染产品规格
        renderSpecs(product.specs);
    })
    .catch(error => {
        console.error('エラー:', error);
        document.getElementById('product-detail').innerHTML = '<p>商品データを読み込めませんでした。</p>';
    });

// 渲染产品规格信息的函数
function renderSpecs(specs) {
    const specsTable = document.getElementById('specs-table').querySelector('tbody');
    specsTable.innerHTML = ''; // 清空现有内容

    for (const [key, value] of Object.entries(specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${key}</strong></td>
            <td>${value}</td>
        `;
        specsTable.appendChild(row);
    }
}



    document.addEventListener("DOMContentLoaded", function () {
        const breadcrumb = document.getElementById("breadcrumb");
    
        // 定义页面名称映射
        const pathMap = {
            "index.html": "ホーム",
            "products.html": "商品",
            "about Us.html": "会社概要",
            "After Support Maintenance.html": "お問い合わせ"
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
    