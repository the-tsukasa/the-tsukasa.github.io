/***********************
 * server.js
 * 完整示例
 ***********************/
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

/* =======================
   配置信息 
======================= */
const PORT = 3000;                     // 服务器运行端口
const SECRET_KEY = "yobi_secret";      // JWT 密钥 (示例)
const DEEPSEEK_API_KEY = "sk-25042e8e081542289dc20c6ef0c64cff"; // AI 接口示例Key
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

// 定义数据文件路径
const USERS_FILE = path.join(__dirname, "data", "users.json");
const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");

/* =======================
   启动 Express 
======================= */
const app = express();

// 允许跨域 (如有需要)
app.use(cors());

// 解析请求体 (JSON / URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   辅助函数：读写 users.json 
======================= */
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* =======================
   1️⃣ 用户注册 
======================= */
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // 判空
  if (!username || !email || !password) {
    return res.status(400).json({ message: "すべての項目を入力してください。" });
  }

  // 读取用户
  let users = readUsers();

  // 检查邮箱是否已存在
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
  }

  // 密码加密
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, email, password: hashedPassword };

  // 写入
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "登録が完了しました！" });
});

/* =======================
   2️⃣ 用户登录 
======================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 判空
  if (!email || !password) {
    return res.status(400).json({ message: "メールとパスワードを入力してください。" });
  }

  // 查找用户
  let users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "ユーザーが見つかりません。" });
  }

  // 校验密码
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "パスワードが間違っています。" });
  }

  // 生成 JWT
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "ログイン成功", token });
});

/* =======================
   3️⃣ 获取当前用户信息
======================= */
app.get("/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "認証が必要です。" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    let users = readUsers();
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません。" });
    }
    // 返回用户资料
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(401).json({ message: "トークンが無効です。" });
  }
});

/* =======================
   4️⃣ 商品信息 API
======================= */
app.get("/api/products", (req, res) => {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    return res.status(404).json({ error: "商品データが見つかりません。" });
  }
  fs.readFile(PRODUCTS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "商品データの読み込みに失敗しました。" });
    }
    res.json(JSON.parse(data));
  });
});

/* =======================
   5️⃣ AI 聊天接口 (DeepSeek 示例)
======================= */
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "メッセージが空です。" });
  }

  try {
    // 是否需要AI回答：简单示例
    const isAI = shouldUseAI(message);
    let reply;

    if (isAI) {
      // 调用 DeepSeek
      reply = await callDeepSeekAPI(message);
    } else {
      // FAQ 或不调用AI
      reply = "こちらはFAQ対応です。詳細はメニューから選択してください。";
    }

    res.json({ reply });
  } catch (err) {
    console.error("AIチャットエラー:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました。" });
  }
});

// 判断是否需要AI回答的示例 (你可以自定义逻辑)
function shouldUseAI(msg) {
  const faqKeywords = ["PC", "注文", "配送", "価格", "おすすめ", "人気"];
  return !faqKeywords.some(keyword => new RegExp(keyword, "i").test(msg));
}

// 调用 DeepSeek API 的示例
async function callDeepSeekAPI(content) {
  try {
    const response = await axios.post(
      DEEPSEEK_ENDPOINT,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: `質問: ${content}` }],
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
        timeout: 30000
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      console.error("DeepSeek API 返回异常:", response.data);
      return "申し訳ありません、現在回答できません。";
    }
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek API エラー:", error.response?.data || error.message);
    if (error.code === "ECONNABORTED") {
      return "⚠️ AIサーバー応答がタイムアウトしました。";
    }
    return "申し訳ありません、現在回答できません。";
  }
}

/* =======================
   静态文件 & SPA 路由
======================= */

// 提供静态资源：public/ 下的文件
app.use(express.static(path.join(__dirname, "public")));

// 如果你想用 SPA 模式，让所有未知路由都返回 index.html
// (若是多页网站就不需要此段)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =======================
   启动服务器
======================= */
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
});
