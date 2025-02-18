// ===================== 基础设置 ===================== //
document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");

    // 加载聊天组件
    fetch("components/chat.html")
        .then(response => response.text())
        .then(data => {
            chatContainer.innerHTML = data;

            // 确保 chat.html 加载完成后再绑定事件
            const userInput = document.getElementById("userInput");

            if (userInput) {
                // 按下 Enter 触发发送
                userInput.addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();  // 防止换行
                        sendMessage();
                    }
                });
            }
        })
        .catch(error => console.error("チャットコンポーネントの読み込みエラー:", error));
});

// ===================== 发送消息 ===================== //
async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();

    if (message !== "") {
        addUserMessage(message);
        userInput.value = "";

        const waitingMsg = addBotMessage("🤔 考え中...");
        console.log("等待消息元素:", waitingMsg); // ✅ 调试用

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error("APIリクエスト失敗");

            const data = await response.json();
            console.log("API返回数据:", data); // ✅ 调试用

            // ✅ 保护 waitingMsg.remove()
            if (waitingMsg && typeof waitingMsg.remove === "function") {
                waitingMsg.remove();
            } else {
                console.warn("⚠️ waitingMsg 未正确创建，跳过 remove()");
            }

            if (data && data.reply) {
                addBotMessage(data.reply);
            } else {
                console.error("❌ API返回数据异常:", data);
                addBotMessage("⚠️ AI返回数据异常，无法解析。");
            }
        } catch (error) {
            console.error("发送消息失败:", error);

            if (waitingMsg && typeof waitingMsg.remove === "function") {
                waitingMsg.remove();
            }

            addBotMessage("⚠️ 接続に問題が発生しました。再試行してください。");
        }
    }
}



// ===================== 添加用户消息 ===================== //
function addUserMessage(message) {
    const chatBody = document.getElementById("chatBody");

    const userMessage = document.createElement("p");
    userMessage.className = "user-message";
    userMessage.innerHTML = `👤: ${message}`;

    chatBody.appendChild(userMessage);
    scrollToBottom();
}

// ===================== 添加机器人消息 ===================== //
function addBotMessage(message) {
    const chatBody = document.getElementById("chatBody");

    if (!message) {
        console.error("❌ addBotMessage 传入了空消息!");
        return null;  // ✅ 如果 message 为空，返回 null，避免报错
    }

    const botMessage = document.createElement("p");
    botMessage.className = "bot-message";
    botMessage.innerHTML = `🤖 Yobi: ${message}`;

    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;

    return botMessage;  // ✅ 确保返回 DOM 元素
}



// ===================== 滚动到底部 ===================== //
function scrollToBottom() {
    const chatBody = document.getElementById("chatBody");
    chatBody.scrollTop = chatBody.scrollHeight;
}

// ===================== 快捷按钮处理 ===================== //
function updateButtons(options) {
    const quickButtons = document.getElementById("quickButtons");
    quickButtons.innerHTML = "";

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => handleQuickAction(option);
        quickButtons.appendChild(btn);
    });
}

// chat.js

// ステップ管理用変数
let pcSelectStep = 0;    // 「🎯 PCを選ぶ」フロー
let aiRecommendStep = 0; // 「✨ AIおすすめ」フロー

// ページ読み込み後、初期ボタンをセット
document.addEventListener("DOMContentLoaded", () => {
    // 初期表示メッセージ
    setTimeout(() => {
        addBotMessage("やあ！今日はどんな商品が気になりますか？");
        updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
    }, 500);
});

// ------------------- チャット本体の関数 ------------------- //

// ユーザーがボタンを押したときに呼び出される
function handleQuickAction(action) {
    addUserMessage(action); // ユーザーの選択を表示

    switch (action) {
        // =====================================================
        // 初期ボタン4つ
        // =====================================================
        case "🎯 PCを選ぶ":
            pcSelectStep = 1;   // フロー開始
            aiRecommendStep = 0; // 他フローリセット
            setTimeout(() => {
                addBotMessage("どのような用途でPCを使いますか？");
                updateButtons(["学習", "仕事", "ゲーム", "日常", "🏠 ホームへ戻る"]);
            }, 500);
            break;

            case "✨ AIおすすめ":
    setTimeout(() => {
        addBotMessage("最新入荷の製品はこちらです：");

        // 定义推荐产品列表
        const products = [
            { id: 31, name: "MacBook Pro 14インチ M4" },
            { id: 33, name: "ASUS ROG Zephyrus G14" },
            { id: 25, name: "Surface Pro 9 Core i7" },
            { id: 27, name: "ThinkPad X1 Carbon Gen 11" }
        ];

        // 随机选择一个产品
        const randomProduct = products[Math.floor(Math.random() * products.length)];

        // 发送推荐产品消息
        addBotMessage(`🎯 <a href="./product-detail.html?id=${randomProduct.id}" target="_blank">${randomProduct.name}</a>`);


        // 更新按钮
        updateButtons(["🏠 ホームへ戻る"]);
    }, 500);
    break;



        case "🔥 人気商品":
            pcSelectStep = 0;
            aiRecommendStep = 0;
            setTimeout(() => {
                addBotMessage("人気のあるカテゴリをお選びください。");
                updateButtons(["Macノート", "Windowsノート", "ゲーミングノート", "デスクトップ", "タブレット", "🏠 ホームへ戻る"]);
            }, 500);
            break;

        case "🚚 注文・配送":
            pcSelectStep = 0;
            aiRecommendStep = 0;
            setTimeout(() => {
                addBotMessage("注文履歴をご覧になりますか？ それとも配送状況を確認しますか？");
                updateButtons(["注文履歴を見る", "配送状況を確認", "🏠 ホームへ戻る"]);
            }, 500);
            break;


// =====================================================
// 🎯 「PCを選ぶ」用フロー
// =====================================================

case "学習":
case "仕事":
case "ゲーム":
case "日常":
    if (pcSelectStep === 1) {
        pcSelectStep = 2;
        setTimeout(() => {
            addBotMessage("どのタイプのPCをお探しですか？");
            updateButtons(["ノートPC", "デスクトップ", "タブレット", "🏠 ホームへ戻る"]);
        }, 500);
    }
    break;

case "ノートPC":
case "デスクトップ":
case "タブレット":
    if (pcSelectStep === 2) {
        pcSelectStep = 3;
        setTimeout(() => {
            addBotMessage("ご予算はどのくらいですか？");
            updateButtons(["~10万円", "~20万円", "~30万円", "30万円以上", "🏠 ホームへ戻る"]);
        }, 500);
    }
    break;

case "~10万円":
case "~20万円":
case "~30万円":
case "30万円以上":
    if (pcSelectStep === 3) {
        pcSelectStep = 4;
        setTimeout(() => {
            addBotMessage("ブランドやOSの好みはありますか？");
            updateButtons(["Apple", "Windows系", "特になし", "🏠 ホームへ戻る"]);
        }, 500);
    }
    break;

case "Apple":
case "Windows系":
case "特になし":
    if (pcSelectStep === 4) {
        pcSelectStep = 5;
        setTimeout(() => {
            const recommendationMessage = `
                ・MacBook Air 13.3 (2020)（1~10万円） [ID: 11]<br>
                ・Lenovo LOQ RTX 4060（~20万円） [ID: 19]<br>
                ・ROG Zephyrus（~30万円） [ID: 33]<br>
                ・MacBook Pro M4 Max（30万円以上） [ID: 38]<br>
            `;

            addBotMessage("条件に合ったオススメはこちらです。（サンプル）");
            addBotMessage(recommendationMessage);

            // 自动提取ID并刷新搜索
            extractAndSearchIDs(recommendationMessage);

            updateButtons(["🏠 ホームへ戻る", "🔄 最初からやり直す"]);
        }, 800);
    }
    break;

// 🏠 ホームへ戻る按钮处理
document.addEventListener('click', function(event) {
    if (event.target.innerText === "🏠 ホームへ戻る") {
        clearSearchBar();
    }
});

// 🔍 ID提取与搜索函数
function extractAndSearchIDs(message) {
    const idPattern = /\[ID:\s*(\d+)\]/g;
    const ids = [];
    let match;

    while ((match = idPattern.exec(message)) !== null) {
        ids.push(match[1]);
    }

    if (ids.length > 0) {
        const searchBar = document.getElementById("search-bar");
        const formattedIds = `id: ${ids.join(", ")}`;
        searchBar.value = formattedIds;

        // 确保搜索功能被正确触发
        triggerSearch(searchBar);
    }
}

// 🔄 触发搜索功能
function triggerSearch(inputElement) {
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    inputElement.dispatchEvent(event); // 触发输入事件
}

// 🧹 清空搜索栏
function clearSearchBar() {
    const searchBar = document.getElementById("search-bar");
    searchBar.value = "";  // 清空输入框
    triggerSearch(searchBar);  // 重新刷新页面以展示全部产品
}

// 📦 示例搜索功能（可替换为实际逻辑）
function searchProducts(searchText) {
    console.log(`検索実行中: ${searchText}`);
    // 这里可以加入实际的产品搜索逻辑
}

    

      

        // =====================================================
        // ✨ 「AIおすすめ」用フロー
        // =====================================================
        case "ざっくり知りたい":
            if (aiRecommendStep === 1) {
                aiRecommendStep = 2;
                setTimeout(() => {
                    addBotMessage("用途は何ですか？（学習 / 仕事 / ゲーム / 日常）");
                    updateButtons(["学習用途", "仕事用途", "ゲーム用途", "日常用途", "🏠 ホームへ戻る"]);
                }, 500);
            }
            break;

        case "学習用途":
        case "仕事用途":
        case "ゲーム用途":
        case "日常用途":
            if (aiRecommendStep === 2) {
                aiRecommendStep = 3;
                setTimeout(() => {
                    addBotMessage("予算はどのくらいですか？");
                    updateButtons(["~10万円", "~20万円", "~30万円", "30万円以上", "🏠 ホームへ戻る"]);
                }, 500);
            }
            break;

        case "詳しく選ぶ":
            if (aiRecommendStep === 1) {
                aiRecommendStep = 10; // 詳細モードスタート
                setTimeout(() => {
                    addBotMessage("まずは主な用途を選択してください。（動画編集 / プログラミング / ゲームなど）");
                    updateButtons(["動画編集", "プログラミング", "ゲーム", "その他", "🏠 ホームへ戻る"]);
                }, 500);
            }
            break;

        case "動画編集":
        case "プログラミング":
        case "ゲーム":
        case "その他":
            if (aiRecommendStep === 10) {
                aiRecommendStep = 11;
                setTimeout(() => {
                    addBotMessage("重視するスペックは何ですか？");
                    updateButtons(["CPU性能", "GPU性能", "軽量・バッテリー", "特になし", "🏠 ホームへ戻る"]);
                }, 500);
            }
            break;

        case "CPU性能":
        case "GPU性能":
        case "軽量・バッテリー":
        case "特になし":
            if (aiRecommendStep === 11) {
                aiRecommendStep = 12;
                setTimeout(() => {
                    addBotMessage("予算を教えてください。");
                    updateButtons(["~10万円", "~20万円", "~30万円", "30万円以上", "🏠 ホームへ戻る"]);
                }, 500);
            }
            break;

        // --- AIおすすめ (すぐにおすすめ / 詳しく選ぶ) の予算回答 ---
        case "~10万円":
        case "~20万円":
        case "~30万円":
        case "30万円以上":
            // 既にpcSelectStep = 3 でも使っているが、
            // こちらは aiRecommendStep === 3 or === 12 をチェック
            if (aiRecommendStep === 3) {
                aiRecommendStep = 4;
                setTimeout(() => {
                    addBotMessage("ざっくりおすすめすると、以下が人気です。（サンプル）");
                    addBotMessage("・Acer Nitro 5 (12万円)<br>・MacBook Air (10万円)<br>・Dell XPS 13 (20万円)");
                    updateButtons(["🏠 ホームへ戻る", "🔄 最初からやり直す"]);
                }, 500);
            } else if (aiRecommendStep === 12) {
                aiRecommendStep = 13;
                setTimeout(() => {
                    addBotMessage("詳しい条件から導いたおすすめはこちら。（サンプル）");
                    addBotMessage("・MSI GF65 (18万円)<br>・MacBook Pro 13 (15万円)<br>・Lenovo IdeaPad (10万円)");
                    updateButtons(["🏠 ホームへ戻る", "🔄 最初からやり直す"]);
                }, 500);
            }
            break;

// ざっくり知りたい
case "ざっくり知りたい":
    aiRecommendStep = 1; // 开始推荐流程
    setTimeout(() => {
        const product = getQuickRecommendation();
        addBotMessage("おすすめの商品はこちらです：");
        addBotMessage(`・${product.name}（${product.price}） [ID: ${product.id}]`);

        // 自动提取产品ID并触发搜索
        extractAndSearchIDs(`[ID: ${product.id}]`);

        updateButtons(["🏠 ホームへ戻る", "🔄 最初からやり直す"]);
    }, 500);
    break;

// 詳しく選ぶ
case "詳しく選ぶ":
    aiRecommendStep = 2; // 开始详细推荐流程
    setTimeout(() => {
        const product = getDetailedRecommendation();
        addBotMessage("詳しい条件から導いたおすすめはこちらです：");
        addBotMessage(`・${product.name}（${product.price}） [ID: ${product.id}]`);

        // 自动提取产品ID并触发搜索
        extractAndSearchIDs(`[ID: ${product.id}]`);

        updateButtons(["🏠 ホームへ戻る", "🔄 最初からやり直す"]);
    }, 500);
    break;

// =====================================================
// 📦 推荐生成函数
// =====================================================

// 快速推荐（ざっくり知りたい）
function getQuickRecommendation() {
    const recommendations = [
        { name: "Acer Nitro 5", price: "12万円", id: 101 },
        { name: "MacBook Air", price: "10万円", id: 102 },
        { name: "Dell XPS 13", price: "20万円", id: 103 }
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
}

// 详细推荐（詳しく選ぶ）
function getDetailedRecommendation() {
    const recommendations = [
        { name: "MSI GF65", price: "18万円", id: 201 },
        { name: "MacBook Pro 13", price: "15万円", id: 202 },
        { name: "Lenovo IdeaPad", price: "10万円", id: 203 }
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
}

// =====================================================
// 🔍 ID提取与搜索函数
// =====================================================
function extractAndSearchIDs(message) {
    const idPattern = /\[ID:\s*(\d+)\]/g;
    const ids = [];
    let match;

    while ((match = idPattern.exec(message)) !== null) {
        ids.push(match[1]);
    }

    if (ids.length > 0) {
        const searchBar = document.getElementById("search-bar");
        searchBar.value = `id: ${ids.join(", ")}`;

        // 确保搜索功能被正确触发
        triggerSearch(searchBar);
    }
}

// 🔄 触发搜索功能
function triggerSearch(inputElement) {
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    inputElement.dispatchEvent(event);
}

// 🏠 ホームへ戻る 按钮处理，重置流程
document.addEventListener('click', function(event) {
    if (event.target.innerText === "🏠 ホームへ戻る") {
        clearSearchBar();
        aiRecommendStep = 0; // 返回首页时重置AI推荐流程
    }
});

// ❌ 清空搜索栏
function clearSearchBar() {
    const searchBar = document.getElementById("search-bar");
    searchBar.value = "";  // 清空输入框
    triggerSearch(searchBar);  // 重新刷新页面以展示全部产品
}

      

// =====================================================
// 🔥 人気商品 - ランダムな商品おすすめ
// =====================================================

function handleProductRecommendation(category, products) {
    try {
        setTimeout(() => {
            addBotMessage(`人気の${category}はこちらです。`);

            const randomProduct = products[Math.floor(Math.random() * products.length)];

            addBotMessage(`人気No.1: <strong>${randomProduct}</strong>`);

            setTimeout(() => {
                autoFillSearchBar(randomProduct);
            }, 800);

            updateButtons(["🏠 ホームへ戻る"]);
        }, 500);
    } catch (error) {
        console.error("handleProductRecommendation エラー:", error);
    }
}


// Mac ノート
case "Macノート":
    handleProductRecommendation("Macノート", [
        "MacBook Pro 13.3 M1 8GB 256GB (2021)",
        "MacBook Pro 16.2 M4 Pro 48GB 512GB (2024)",
        "MacBook Air 15.3 M3 16GB 512GB (2024)"
    ]);
    break;

// Windows ノート
case "Windowsノート":
    handleProductRecommendation("Windowsノート", [
        "HP Stream 14 (5万円)",
        "Dell XPS 13 (20万円)",
        "Lenovo IdeaPad (10万円)"
    ]);
    break;

// ゲーミングノート
case "ゲーミングノート":
    handleProductRecommendation("ゲーミングノート", [
        "Acer Nitro 5 (12万円)",
        "MSI GF65 (18万円)",
        "ASUS ROG Zephyrus (30万円)"
    ]);
    break;

case "デスクトップ": // ボタンラベルと完全一致させる
    handleProductRecommendation("デスクトップ", [
        "HP Pavilion (8万円)",
        "Dell Inspiron (12万円)",
        "iMac (25万円)"
    ]);
    break;



// タブレット
case "タブレット":
    handleProductRecommendation("タブレット", [
        "Amazon Fire HD (1万円)",
        "iPad (5万円)",
        "iPad Pro (12万円)"
    ]);
    break;

// =====================================================
// 🏠 ホームへ戻る - 自动清空搜索栏
// =====================================================
case "🏠 ホームへ戻る":
    setTimeout(() => {
        

        // ⏳ 延迟 800 毫秒清空搜索栏
        setTimeout(() => {
            clearSearchBar();
        }, 800);

        updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
    }, 500);
    break;

                // =====================================================
                // 🚚 注文・配送メニュー
                // =====================================================
        case "注文履歴を見る":
            setTimeout(() => {
                addBotMessage(`こちらが過去の注文履歴です。<br> 
                ・2025年02月05日 14:10 ご注文: #10001 MacBook Air<br>
                ・2025年01月25日 09:45 ご注文: #10002 Acer Nitro 5`);

                updateButtons(["🏠 ホームへ戻る"]);
            }, 500);
            break;


            case "配送状況を確認":
                setTimeout(() => {
                    // ===================== 随机生成配送状态 ===================== //
                    const statusList = [
                        "準備中（千葉船橋倉庫）",
                        "発送済み（黒猫営業所）",
                        "配送中（渋谷郵便局から）",
                        `配達完了（${getRandomDeliveredDays()}日前に配達済み）`  // 动态生成配達完了的天数
                    ];
            
                    // 先随机选择状态
                    const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];
            
                    // 再展示配送状态
                    addBotMessage(`🚚 現在の配送状況: <strong>${randomStatus}</strong> です。`);
            
                    // 返回按钮
                    updateButtons(["🏠 ホームへ戻る"]);
                }, 500);
                break;
            
            // ===================== 动态生成随机“配達完了”天数 ===================== //
            function getRandomDeliveredDays() {
                return Math.floor(Math.random() * 5) + 1;  // 生成 1~5 天前的随机数字
            }
            


        // =====================================================
        // 共通操作
        // =====================================================
        case "🏠 ホームへ戻る":
            // ステップリセット
            pcSelectStep = 0;
            aiRecommendStep = 0;
            setTimeout(() => {
                addBotMessage("ホームに戻りました。何をお探しでしょうか？");
                updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
            }, 500);
            break;

        case "🔄 最初からやり直す":
            // フロー完全リセット
            pcSelectStep = 0;
            aiRecommendStep = 0;
            setTimeout(() => {
                addBotMessage("了解しました。改めてご案内します。");
                updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
            }, 500);
            break;

        // =====================================================
        // 想定外の入力
        // =====================================================
       
    }
}

// ------------------- メッセージ表示関連 ------------------- //

// ユーザーのメッセージを表示
function addUserMessage(text) {
    const chatBody = document.getElementById("chatBody");
    chatBody.innerHTML += `<p><strong>👤:</strong> ${text}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}

// ボットのメッセージを表示
function addBotMessage(text) {
    const chatBody = document.getElementById("chatBody");
    chatBody.innerHTML += `<p><strong>🤖 Yobi:</strong> ${text}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}

// ------------------- ボタン更新関数 ------------------- //
function updateButtons(options) {
    const quickButtons = document.getElementById("quickButtons");
    quickButtons.innerHTML = "";
    options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => handleQuickAction(option);
        quickButtons.appendChild(btn);
    });
}

// ------------------- 手入力メッセージ送信例 ------------------- //
function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();

    if (message !== "") {
        addUserMessage(message);

        // 自动回复逻辑
        handleUserInput(message);

        userInput.value = "";
    }
}

// 处理用户输入内容的逻辑
async function handleUserInput(message) {
    if (message.includes("おすすめ")) {
        const product = "Acer Nitro 5";
        addBotMessage(`おすすめの商品は、${product}やMacBook Airです！`);
        autoFillSearchBar(product);
        updateButtons(["🔄 他のおすすめを見る", "🏠 ホームへ戻る"]);

    } else if (message.includes("注文")) {
        addBotMessage("注文状況を確認します。注文番号を教えてください。");

    } else if (message.includes("配送")) {
        addBotMessage("配送状況を確認しています。少々お待ちください。");

    } else {
        // ✅ 新增：调用 DeepSeek API
        const waitingMsg = addBotMessage("🤔 考え中...");
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error("API リクエスト失敗");

            const data = await response.json();

            // ✅ 保护 waitingMsg.remove()
            if (waitingMsg && typeof waitingMsg.remove === "function") {
                waitingMsg.remove();
            } else {
                console.warn("⚠️ waitingMsg 未正确创建，跳过 remove()");
            }

            addBotMessage(data.reply);
        } catch (error) {
            // ✅ 保护 waitingMsg.remove()
            if (waitingMsg && typeof waitingMsg.remove === "function") {
                waitingMsg.remove();
            }

            addBotMessage("⚠️ AIとの接続に失敗しました。もう一度お試しください。");
        }


        updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
    }
}

// 自动填入搜索栏并触发搜索
function autoFillSearchBar(productName) {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.value = productName;

        // 触发搜索逻辑
        triggerSearch(searchBar);
    }
}

// 触发搜索功能
function triggerSearch(inputElement) {
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    inputElement.dispatchEvent(event);
}

// 处理按钮点击事件
document.addEventListener('click', function (event) {
    if (event.target.innerText === "🔄 他のおすすめを見る") {
        handleRefreshRecommendation(); // 刷新推荐逻辑
    }

    if (event.target.innerText === "🏠 ホームへ戻る") {
        addBotMessage("ホームに戻りました。ご用件は何でしょうか？");
        clearSearchBar();
        updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
    }
});

// 刷新推荐逻辑
function handleRefreshRecommendation() {
    clearSearchBar(); // 清空搜索栏

    const newRecommendation = getRandomProduct(); // 获取新的随机推荐
    addBotMessage(`新しいおすすめの商品は、${newRecommendation} です！`);

    autoFillSearchBar(newRecommendation); // 自动填入搜索栏并触发搜索

    // 保持刷新按钮继续可用
    updateButtons(["🔄 他のおすすめを見る", "🏠 ホームへ戻る"]);
}

// 获取随机推荐产品
function getRandomProduct() {
    const products = [
        "OMEN Transcend 14",
        "Lenovo LOQ 15IRX9",
        "ThinkPad X1",
        "ASUS ROG Zephyrus",
        "MacBook Pro 14.2 M4"
    ];
    return products[Math.floor(Math.random() * products.length)];
}
// 清空搜索栏
function clearSearchBar() {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.value = ""; // 清空输入框
        triggerSearch(searchBar); // 触发搜索，展示全部产品
    }
}


// =====================================================
// 🔍 自动填入搜索栏的函数
// =====================================================
function autoFillSearchBar(productName) {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        // 只提取商品名称，不包含价格部分
        const cleanProductName = productName.split(" (")[0];

        searchBar.value = cleanProductName;

        // 触发搜索功能
        searchProducts(cleanProductName);
    }
}

// =====================================================
// ❌ 清空搜索栏的函数
// =====================================================
function clearSearchBar() {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.value = "";           // 清空输入框内容
        searchProducts("");             // 触发搜索逻辑，清空搜索结果或显示所有商品
    }
}
