document.addEventListener("DOMContentLoaded", async () => {
    const username = localStorage.getItem("username");

    if (!username) {
        alert("ログインしてください！");
        window.location.href = "/login.html";
        return;
    }

    // ユーザー情報を取得
    const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });

    const user = await res.json();
    document.getElementById("avatar").src = user.avatar || "/img/default-avatar.png";
    document.getElementById("username").innerText = user.username;

    // 注文履歴を取得
    const orderList = document.getElementById("orderList");
    user.orders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `${order.product} - ${order.price}円 - ${order.date}`;
        orderList.appendChild(li);
    });

    // 更新ボタンの動作
    document.getElementById("updateBtn").addEventListener("click", async () => {
        const newUsername = document.getElementById("newUsername").value;
        const newAvatar = document.getElementById("newAvatar").value;

        const updateRes = await fetch("/api/updateProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newUsername, newAvatar })
        });

        const data = await updateRes.json();
        alert(data.message);
        if (updateRes.ok) {
            localStorage.setItem("username", newUsername || username);
            location.reload();
        }
    });

    // アカウント削除ボタン
    document.getElementById("deleteBtn").addEventListener("click", async () => {
        if (!confirm("本当にアカウントを削除しますか？")) return;

        await fetch("/api/deleteAccount", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });

        localStorage.removeItem("username");
        alert("アカウントが削除されました。");
        window.location.href = "/register.html";
    });
});
