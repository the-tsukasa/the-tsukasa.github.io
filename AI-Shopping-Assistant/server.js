const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const PORT = 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ 允许访问根目录的静态文件
app.use(express.static(__dirname));


// ✅ 支持 css、js、img 目录的静态资源加载
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 注册接口
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码是必填项。' });
    }
    return res.status(200).json({ message: '注册成功！' });
});

// 登录接口
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        return res.status(200).json({ message: '登录成功！' });
    } else {
        return res.status(400).json({ message: '用户名或密码错误。' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ 服务器正在运行：http://localhost:${PORT}`);
});
