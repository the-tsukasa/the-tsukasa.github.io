const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

const DEEPSEEK_API_KEY = "sk-6a06bef309da4537a1e95e0631d98f71"; 
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));  // 允许访问根目录的所有静态文件
app.use(express.static(path.join(__dirname, "components"))); // 确保 components 文件夹可访问
app.use(express.static(path.join(__dirname, "js")));          // 确保 js 文件夹可访问
app.use(express.static(path.join(__dirname, "css")));         // 确保 css 文件夹可访问
app.use(express.static(path.join(__dirname, "img")));         // 确保 img 文件夹可访问

// 路由：访问 /chat 加载 chat.html
app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "components", "chat.html"));
});

// 判断是否需要AI回答
function shouldUseAI(message) {
    const faqKeywords = ["PC", "注文", "配送", "価格", "おすすめ", "人気"];
    return !faqKeywords.some(keyword => new RegExp(keyword, "i").test(message));
}


async function callDeepSeekAPI(message) {
    try {
        const response = await axios.post(
            DEEPSEEK_ENDPOINT,
            {
                model: "deepseek-chat",
                messages: [{ role: "user", content: `質問: ${message}` }], // ✅ 确保 AI 识别问题
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
                timeout: 30000,  // ✅ 增加超时时间
            }
        );

        console.log("DeepSeek API 原始返回数据:", JSON.stringify(response.data, null, 2));

        if (!response.data.choices || response.data.choices.length === 0) {
            console.error("DeepSeek API 返回数据格式异常:", response.data);
            return "⚠️ AI返回数据格式异常，请稍后重试。";
        }

        // ✅ 确保返回 message.content，而不是整个 message 对象
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("DeepSeek API 调用失败:", error.response?.data || error.message);

        if (error.code === "ECONNABORTED") {
            return "⚠️ AI 服务器响应超时，请稍后再试。";
        }

        return "申し訳ありません、現在回答できません。";
    }
}




// 处理聊天请求
app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    console.log("收到前端消息:", message); // ✅ 日志1：查看消息是否正确到达后端

    if (!message) {
        return res.status(400).json({ error: "消息不能为空" });
    }

    try {
        const reply = shouldUseAI(message)
            ? await callDeepSeekAPI(message)
            : "こちらはFAQ対応です。詳細はメニューから選択してください。";

        console.log("AI 回复:", reply); // ✅ 日志2：查看 AI 返回结果
        res.json({ reply });
    } catch (error) {
        console.error("处理请求时出错:", error); // ✅ 日志3：捕获异常
        res.status(500).json({ error: "服务器内部错误" });
    }
});


// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器正在运行：http://localhost:${PORT}`);
});


