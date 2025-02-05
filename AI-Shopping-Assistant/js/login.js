// 更新导航栏
function updateAuthButtons() {
    const authContainer = document.querySelector(".auth-buttons");
    const username = localStorage.getItem("username");

    if (authContainer) {
        if (username) {
            // 如果用户已登录
            authContainer.innerHTML = `
                <span>こんにちは、${username}さん</span>
                <button id="logout-button">ログアウト</button>
            `;
            const logoutButton = document.getElementById("logout-button");
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                location.reload();
            });
        } else {
            // 如果用户未登录
            authContainer.innerHTML = `
                <a href="login.html" class="btn">ログイン/登録</a>
            `;
        }
    } else {
        console.error(".auth-buttons element not found.");
    }
}


// 注册功能
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

            console.log("Submitting register request...");
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            console.log("Response status:", response.status);
            console.log("Response body:", result);

            if (response.ok) {
                alert(result.message);
                console.log("Register successful, redirecting to login page...");
                location.assign("login.html"); // 确保路径正确
            } else {
                alert(result.message);
                console.log("Register failed:", result.message);
            }
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            console.log("Response status:", response.status);
            console.log("Response body:", result);

            if (response.ok) {
                alert("ログイン成功！");
                localStorage.setItem("token", result.token);
                localStorage.setItem("username", username);
                location.assign = "index.html";
            } else {
                alert(result.message);
                console.log("Login failed:", result.message);
            }
        });
    }

    updateAuthButtons();
});


