const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const profileRoutes = require("./src/routes/profileRoutes");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_jwt_secret";
const DEEPSEEK_API_KEY = "sk-6a06bef309da4537a1e95e0631d98f71"; 
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";  // ✅ 确保这行存在


app.use(express.json());  // ✅ 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }));  // ✅ 解析 URL 编码的表单数据

// 🟢 让 Express 提供所有静态文件（包括 HTML）
app.use(express.static(__dirname)); 

// 🟢 让 Express 提供 CSS、JS、IMG 资源
app.use("/css", express.static(path.join(__dirname, "css")));  
app.use("/js", express.static(path.join(__dirname, "js")));    
app.use("/img", express.static(path.join(__dirname, "img")));  
app.use("/data", express.static(path.join(__dirname, "data"))); 
app.use("/components", express.static(path.join(__dirname, "components"))); 

// 🟢 让 Express 直接提供 `index.html`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🟢 让 Express 提供所有 HTML 页面（index.html, products.html, etc.）
app.get("/:page", (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `${page}`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("404 Not Found");
    }
});

app.use("/data", express.static(path.join(__dirname, "data"))); // 允许访问 data 目录

app.get("/api/products", (req, res) => {
    const filePath = path.join(__dirname, "data", "products.json");

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "商品データが見つかりません。" });
    }

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "商品データの読み込みに失敗しました。" });
        }
        res.json(JSON.parse(data));
    });
});

// 🟢 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器正在运行：http://localhost:${PORT}`);
});


//-------------------------------------------------------------------------------------
// 读取用户数据
const getUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
};

// 生成 JWT Token
const generateToken = (username) => jwt.sign({ username }, SECRET_KEY, { expiresIn: "7d" });

// 注册
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;
    let users = getUsers();

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "ユーザー名は既に存在します。" });
    }

    users.push({ username, password, avatar: "/img/default-avatar.png", orders: [] });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.json({ message: "登録成功！" });
});

// 登录
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    let users = getUsers();

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) return res.status(400).json({ message: "ユーザー名またはパスワードが間違っています。" });

    res.json({ token: generateToken(username), username });
});

// 获取个人信息
app.post("/api/profile", (req, res) => {
    const { username } = req.body;
    let users = getUsers();
    const user = users.find(user => user.username === username);

    if (!user) return res.status(400).json({ message: "ユーザーが見つかりません。" });
    res.json(user);
});

// 更新个人信息
app.post("/api/updateProfile", (req, res) => {
    const { username, newUsername, newAvatar } = req.body;
    let users = getUsers();

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) return res.status(400).json({ message: "ユーザーが見つかりません。" });

    users[userIndex].username = newUsername || users[userIndex].username;
    users[userIndex].avatar = newAvatar || users[userIndex].avatar;

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.json({ message: "更新成功！", user: users[userIndex] });
});

// 删除账户
app.post("/api/deleteAccount", (req, res) => {
    const { username } = req.body;
    let users = getUsers();
    users = users.filter(user => user.username !== username);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.json({ message: "アカウントが削除されました。" });
});
//----------------------------------------------------------------------------------------------
//Expressを使用してJSONデータを返すAPIを作成する
// 创建 API：返回 products.json 数据
app.get("/api/products", (req, res) => {
    fs.readFile("./data/products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "无法读取商品数据" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});
//----------------------------------------------------------------------------------------------




app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "components", "chat.html"));
});



// 判断是否需要AI回答
function shouldUseAI(message) {
    const faqKeywords = ["PC", "注文", "配送", "価格", "おすすめ", "人気"];
    return !faqKeywords.some(keyword => new RegExp(keyword, "i").test(message));
}

// 确保
async function callDeepSeekAPI(message) {
    try {
        const response = await axios.post(
            DEEPSEEK_ENDPOINT,  // ✅ 确保这里使用的是 DEEPSEEK_ENDPOINT
            {
                model: "deepseek-chat",
                messages: [{ role: "user", content: `質問: ${message}` }], 
                temperature: 0.9,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                },
                timeout: 30000,
            }
        );

        console.log("DeepSeek API 原始返回数据:", JSON.stringify(response.data, null, 2));

        if (!response.data.choices || response.data.choices.length === 0) {
            console.error("DeepSeek API 返回数据格式异常:", response.data);
            return "⚠️ AI返回数据格式异常，请稍后重试。";
        }

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("DeepSeek API 调用失败:", error.response?.data || error.message);

        if (error.code === "ECONNABORTED") {
            return "⚠️ AI 服务器响应超时，请稍后再试。";
        }

        return "申し訳ありません、現在回答できません。";
    }
}





app.post("/api/chat", async (req, res) => {
    console.log("🔍 收到请求头:", req.headers); // ✅ 查看请求头是否包含 `application/json`
    console.log("🔍 收到请求体:", req.body); // ✅ 检查 `req.body` 是否有数据

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "消息不能为空" });
    }

    try {
        const reply = shouldUseAI(message)
            ? await callDeepSeekAPI(message)
            : "こちらはFAQ対応です。詳細はメニューから選択してください。";

        console.log("✅ AI 回复:", reply);
        res.json({ reply });
    } catch (error) {
        console.error("❌ 处理请求时出错:", error);
        res.status(500).json({ error: "服务器内部错误" });
    }
});
