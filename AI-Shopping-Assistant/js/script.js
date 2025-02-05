document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (!username || !password) {
                alert("ユーザー名とパスワードを入力してください。");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = "login.html";
                } else {
                    alert(result.message);  // エラーの詳細メッセージ
                }
            } catch (error) {
                console.error("エラー:", error);
                alert("サーバーへの接続に失敗しました。");
            }
        });
    }
});

// 1️⃣ 登录/注册功能
function updateAuthButtons() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const authContainer = document.querySelector(".auth-buttons");
    authContainer.innerHTML = token && username
        ? `<a href="profile.html" class="btn">${username} さん</a>
           <button id="logout-button" class="btn">ログアウト</button>`
        : `<a href="login.html" class="btn">ログイン/登録</a>`;

    if (token && username) {
        document.getElementById("logout-button").addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            alert("ログアウトしました。");
            updateAuthButtons();
            window.location.href = "index.html";
        });
    }
}
console.log("受信したデータ:", req.body);


// 2️⃣ 注册功能
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("パスワードが一致しません！");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = "login.html";
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("登録エラー:", error);
                alert("登録に失敗しました。");
            }
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert("ログイン成功！");
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("username", username);
                    window.location.href = "index.html";
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("ログインエラー:", error);
                alert("ログインに失敗しました。");
            }
        });
    }

    updateAuthButtons();
});

// 3️⃣ 打开 products.html 页面
function openProductsPage() {
    window.location.href = "products.html"; 
}

// 4️⃣ 聊天窗口的开关逻辑
function toggleChat() {
    const chatModal = document.getElementById("chatModal");
    chatModal.style.display = (chatModal.style.display === "block") ? "none" : "block";
}

// 5️⃣ AI 聊天发送消息
function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    const chatBody = document.getElementById("chatBody");

    if (userInput === "") return;

    const userMessage = document.createElement("p");
    userMessage.textContent = `👤: ${userInput}`;
    chatBody.appendChild(userMessage);

    setTimeout(() => {
        const botResponse = document.createElement("p");
        botResponse.textContent = `🤖: ご質問ありがとうございます！ただいま確認します。`;
        chatBody.appendChild(botResponse);
        chatBody.scrollTop = chatBody.scrollHeight;  // 自动滚动到底部
    }, 1000);

    document.getElementById("userInput").value = "";
}
