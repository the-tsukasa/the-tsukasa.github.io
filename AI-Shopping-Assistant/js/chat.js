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
        // =====================================================
        // ✨ AIおすすめ
        // =====================================================
        case "✨ AIおすすめ":
            case "🔁 別のおすすめを見る":
                let recommendedProduct = null;
            
                async function recommendProduct() {
                    // 先发送提示消息
                    addBotMessage("新しいおすすめの商品はこちらです：");
            
                    // 定义推荐产品列表
                    const products = [
                        { id: 32, name: "OMEN Transcend 14" },
                        { id: 19, name: "Lenovo LOQ 15IRX9" },
                        { id: 27, name: "ThinkPad X1" },
                        { id: 33, name: "ASUS ROG Zephyrus" },
                        { id: 31, name: "MacBook Pro 14.2 M4" }
                    ];
            
                    // 随机选择一个新产品
                    let newProduct = products[Math.floor(Math.random() * products.length)];
            
                    // 避免重复推荐相同的产品
                    while (recommendedProduct && recommendedProduct.id === newProduct.id) {
                        newProduct = products[Math.floor(Math.random() * products.length)];
                    }
            
                    recommendedProduct = newProduct;
            
                    // 发送推荐产品信息
                    addBotMessage(`🎯 <a href="./product-detail.html?id=${recommendedProduct.id}" target="_blank">${recommendedProduct.name}</a>`);
            
                    // 确保搜索栏更新并执行搜索
                    let searchBar = document.getElementById("search-bar");
                    if (searchBar) {
                        searchBar.value = "";
                        setTimeout(() => {
                            searchBar.value = recommendedProduct.name;
                            let event = new Event("input", { bubbles: true });
                            searchBar.dispatchEvent(event); // 触发输入事件
            
                            setTimeout(() => {
                                let enterEvent = new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true });
                                searchBar.dispatchEvent(enterEvent); // 触发回车搜索
                            }, 200);
                        }, 200);
                    }
                }
            
                // 立即执行推荐逻辑，避免丢失信息
                recommendProduct();
            
                // 更新按钮
                updateButtons(["🔁 別のおすすめを見る", "🏠 ホームへ戻る"]);
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
            const recommendationMessage = 
            `
                ・MacBook Air 13.3 2020[ID: 11]<br>
                ・Lenovo LOQ RTX 4060 [ID: 19]<br>
                ・ROG Zephyrus [ID: 33]<br>
                ・MacBook Pro M4 Max [ID: 38]<br>
            `;

            addBotMessage("条件に合ったオススメはこちらです。（サンプル）");
            addBotMessage(recommendationMessage);

            // 自动提取ID并刷新搜索
            extractAndSearchIDs(recommendationMessage);

            updateButtons(["🏠 ホームへ戻る"]);
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
// 📦 推荐生成函数
// =====================================================
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

// 处理用户输入内容的逻辑(--FAQ問題ここに設定する、FAQ 以外の質問、API の呼び出し----)
async function handleUserInput(message) {
    if (message.includes("おすすめ")) {
        const product = "Acer Nitro 5";
        addBotMessage(`おすすめの商品は、${product}やMacBook Airです！`);
        autoFillSearchBar(product);
        updateButtons(["🔄 他のおすすめを見る", "🏠 ホームへ戻る"]);
       // 1. 产品推荐 (Product Recommendation)
    } else if (message.includes("人気商品")) {
        addBotMessage("現在の人気商品はこちらです。MacBook Pro, ASUS ROG, Lenovo LOQなど！");
    } else if (message.includes("どれを選ぶべき")) {
        addBotMessage("用途に応じて最適な商品をおすすめします。学習用、仕事用、ゲーム用など用途を教えてください！");
    } else if (message.includes("おすすめのノートPC")) {
        addBotMessage("おすすめのノートPCは、MacBook Air、Lenovo ThinkPad、ASUS ZenBook です！");
    } else if (message.includes("ゲーミングPCのおすすめ")) {
        addBotMessage("ゲーミングPCには、ASUS ROG、Acer Predator、Alienwareがおすすめです！");
       // 2. 订单问题 (Order Issues)
    } else if (message.includes("注文")) {
        addBotMessage("注文状況を確認します。注文番号を教えてください。");
    } else if (message.includes("注文履歴の確認")) {
        addBotMessage("注文履歴は、マイページの注文履歴セクションで確認できます。");
    } else if (message.includes("注文キャンセル")) {
        addBotMessage("注文キャンセルは、発送前であれば可能です。マイページから手続きしてください。");
    } else if (message.includes("注文内容の変更")) {
        addBotMessage("注文内容の変更は、発送前に限り可能です。サポートセンターにお問い合わせください。");
    } else if (message.includes("注文の確認メールが届かない")) {
        addBotMessage("確認メールが届かない場合、迷惑メールフォルダを確認してください。");
     // 3.配送问题 (Shipping & Delivery)
    } else if (message.includes("配送")) {
        addBotMessage("配送状況を確認しています。少々お待ちください。");
    } else if (message.includes("配送状況の確認")) {
        addBotMessage("配送状況は、注文履歴ページから追跡できます。");
    } else if (message.includes("配送の遅延")) {
        addBotMessage("配送遅延の場合、配送会社のステータスをご確認ください。");
    } else if (message.includes("送料はいくら")) {
        addBotMessage("送料は、地域と商品のサイズによって異なります。詳しくは配送ポリシーをご確認ください。");
    } else if (message.includes("配送日時の変更")) {
        addBotMessage("配送日時の変更は、配送会社の追跡ページから手続き可能です。");
    // 4. 付款问题 (Payment Issues)
    } else if (message.includes("支払い方法")) {
        addBotMessage("支払い方法は、クレジットカード、銀行振込、コンビニ払い、PayPayなどが利用可能です。");
    } else if (message.includes("クレジットカードのエラー")) {
        addBotMessage("クレジットカードのエラーが発生した場合、カード会社にご確認ください。");
    } else if (message.includes("分割払いできますか")) {
        addBotMessage("クレジットカードの分割払いが利用可能です。詳細は決済ページをご確認ください。");
    } else if (message.includes("領収書の発行")) {
        addBotMessage("領収書は、注文履歴ページからダウンロードできます。");
    } else if (message.includes("支払い完了メールが届かない")) {
        addBotMessage("支払い完了メールが届かない場合、迷惑メールフォルダをご確認ください。");
        // 5.退货与取消 (Return & Cancellation)
    } else if (message.includes("返品")) {
        addBotMessage("返品は、商品到着後7日以内に手続きしてください。");
    } else if (message.includes("返品ポリシー")) {
        addBotMessage("返品ポリシーは、未開封・未使用の商品のみ受け付けています。");
    } else if (message.includes("返品方法")) {
        addBotMessage("返品方法は、マイページの返品申請フォームから申請してください。");
    } else if (message.includes("返品の送料")) {
        addBotMessage("初期不良の場合、返品送料は弊社負担となります。");
    } else if (message.includes("キャンセルできますか")) {
        addBotMessage("注文のキャンセルは、発送前であれば可能です。");
        // 6. 保修与修理 (Warranty & Repairs)
    } else if (message.includes("保証")) {
        addBotMessage("保証期間は商品によって異なります。通常は1年間のメーカー保証が付きます。");
    } else if (message.includes("保証の確認方法")) {
        addBotMessage("保証の確認は、購入時のレシートまたは注文履歴から可能です。");
    } else if (message.includes("修理依頼")) {
        addBotMessage("修理依頼は、サポートセンターにお問い合わせください。");
    } else if (message.includes("修理の進捗確認")) {
        addBotMessage("修理の進捗は、修理依頼番号を使用して確認できます。");
    } else if (message.includes("延長保証")) {
        addBotMessage("延長保証は、購入時にオプションで追加可能です。");
    // 7. 账户与会员 (Account & Membership)
    } else if (message.includes("アカウント作成")) {
        addBotMessage("アカウント作成は、登録ページから行えます。");
    } else if (message.includes("パスワードを忘れた")) {
        addBotMessage("パスワードを忘れた場合、パスワードリセットページから再設定してください。");
    } else if (message.includes("会員ランク")) {
        addBotMessage("会員ランクは、購入金額に応じてランクアップします。");
    } else if (message.includes("メールアドレスの変更")) {
        addBotMessage("メールアドレスの変更は、アカウント設定から行えます。");
    } else if (message.includes("退会したい")) {
        addBotMessage("退会手続きは、アカウント設定ページから行えます。");
    // 8.技术支持 (Technical Support)
    } else if (message.includes("インターネットに接続できない")) {
        addBotMessage("インターネットに接続できない場合、ルーターの再起動をお試しください。");
    } else if (message.includes("画面が表示されない")) {
        addBotMessage("画面が表示されない場合、ケーブルの接続状態を確認してください。");
    } else if (message.includes("エラーメッセージが出る")) {
        addBotMessage("エラーメッセージが表示された場合、エラーコードをサポートセンターにお伝えください。");
    } else if (message.includes("初期設定の方法")) {
        addBotMessage("初期設定の方法は、同梱の取扱説明書をご確認ください。");
    } else if (message.includes("ソフトウェアのアップデート")) {
        addBotMessage("ソフトウェアのアップデートは、公式サイトからダウンロードしてください。");

            //1. 问候语 (Greetings)
    } else if (message.includes("こんにちは")) {
        addBotMessage("こんにちは！今日はどんなお手伝いができますか？");
    } else if (message.includes("こんばんは")) {
        addBotMessage("こんばんは！何かお困りのことはありますか？");
    } else if (message.includes("おはよう")) {
        addBotMessage("おはようございます！今日も元気にいきましょう！");
    } else if (message.includes("hello")) {
        addBotMessage("Hello! How can I assist you today?");
    } else if (message.includes("hi")) {
        addBotMessage("Hi there! What can I do for you?");
    } else if (message.includes("你好")) {
        addBotMessage("你好！请问有什么可以帮助您的？");
    } else if (message.includes("やあ")) {
        addBotMessage("やあ！今日はどんな商品が気になりますか？");
    } else if (message.includes("よう！")) {
        addBotMessage("よう！今日は元気そうですね！");
    } else if (message.includes("久しぶり")) {
        addBotMessage("お久しぶりです！またお会いできて嬉しいです。");
    } else if (message.includes("はじめまして")) {
        addBotMessage("はじめまして！どうぞよろしくお願いします。");
    //2. 感谢 (Thank You)
    } else if (message.includes("ありがとう")) {
        addBotMessage("どういたしまして！また何かあれば聞いてください。");
    } else if (message.includes("感謝")) {
        addBotMessage("こちらこそ感謝です！ご利用ありがとうございます。");
    } else if (message.includes("Thank you")) {
        addBotMessage("You're welcome! Let me know if you need more help.");
    } else if (message.includes("thanks")) {
        addBotMessage("No problem! Glad to help!");
    } else if (message.includes("多谢")) {
        addBotMessage("不客气！欢迎再次光临。");
    } else if (message.includes("ありがと")) {
        addBotMessage("いえいえ、またどうぞ！");
    } else if (message.includes("助かった")) {
        addBotMessage("お役に立てて光栄です！");
    } else if (message.includes("Thanks a lot")) {
        addBotMessage("You're very welcome! Have a great day!");
    } else if (message.includes("thank you very much")) {
        addBotMessage("You're very welcome! I'm glad I could help.");
    } else if (message.includes("感謝します")) {
        addBotMessage("こちらこそ、ありがとうございます！");
    //3. 道别 (Farewell)
    } else if (message.includes("さようなら")) {
        addBotMessage("さようなら！またお会いしましょう。");
    } else if (message.includes("バイバイ")) {
        addBotMessage("バイバイ！またのご利用をお待ちしています。");
    } else if (message.includes("goodbye")) {
        addBotMessage("Goodbye! Have a wonderful day!");
    } else if (message.includes("bye")) {
        addBotMessage("Bye! See you next time!");
    } else if (message.includes("再见")) {
        addBotMessage("再见！欢迎下次光临。");
    } else if (message.includes("またね")) {
        addBotMessage("またね！次回もお待ちしています。");
    } else if (message.includes("じゃあね")) {
        addBotMessage("じゃあね！元気でね！");
    } else if (message.includes("おやすみ")) {
        addBotMessage("おやすみなさい！良い夢を！");
    } else if (message.includes("See you")) {
        addBotMessage("See you! Have a good one!");
    } else if (message.includes("Take care")) {
        addBotMessage("Take care! Stay safe and healthy!");
    //4. 确认 (Confirmation)} else if (message.includes("本当ですか")) {
        addBotMessage("はい、本当です。ご安心ください。");
    } else if (message.includes("マジ？")) {
        addBotMessage("マジです！嘘じゃないですよ。");
    } else if (message.includes("真的吗")) {
        addBotMessage("真的！请放心。");
    } else if (message.includes("Sure?")) {
        addBotMessage("Absolutely sure! No doubt about it.");
    } else if (message.includes("本気？")) {
        addBotMessage("本気です！真剣に言ってます。");
    } else if (message.includes("本当に？")) {
        addBotMessage("本当です！疑わないでください。");
    } else if (message.includes("Are you sure")) {
        addBotMessage("Yes, I am absolutely sure!");
    } else if (message.includes("確かですか")) {
        addBotMessage("はい、確かです。");
    } else if (message.includes("間違いない")) {
        addBotMessage("間違いありません。安心してください。");
    } else if (message.includes("正しい？")) {
        addBotMessage("正しいです。信じてください。");
    //5. 请求 (Requests)} else if (message.includes("お願いします")) {
        addBotMessage("かしこまりました。すぐに対応いたします。");
    } else if (message.includes("助けて")) {
        addBotMessage("もちろん！何をお手伝いしましょうか？");
    } else if (message.includes("お願いがある")) {
        addBotMessage("はい、どんなお願いでしょうか？");
    } else if (message.includes("Help me")) {
        addBotMessage("Sure! What do you need help with?");
    } else if (message.includes("Could you please")) {
        addBotMessage("Of course! I'm here to help.");
    } else if (message.includes("ちょっと手伝って")) {
        addBotMessage("はい、喜んでお手伝いします。");
    } else if (message.includes("お願いできますか")) {
        addBotMessage("もちろんです！どのような内容でしょうか？");
    } else if (message.includes("頼む")) {
        addBotMessage("任せてください！すぐに対応します。");
    } else if (message.includes("Can you help")) {
        addBotMessage("Yes, I'm here to help you. What do you need?");
    } else if (message.includes("Could you do me a favor")) {
        addBotMessage("Certainly! What do you need?");




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
