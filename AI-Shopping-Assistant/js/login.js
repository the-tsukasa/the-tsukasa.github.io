document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("ログイン成功！");
                window.location.href = "index.html";  // 登录成功后跳转到首页
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("エラー:", error);
            alert("サーバーに接続できません。");
        }
    });
});
