// 服务器端 API
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const usersFilePath = path.join(__dirname, "../../data/users.json");

// 读取用户数据
const getUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
};

// 获取个人信息
router.post("/profile", (req, res) => {
    const { username } = req.body;
    let users = getUsers();
    const user = users.find(user => user.username === username);

    if (!user) return res.status(400).json({ message: "用户不存在" });
    res.json(user);
});

// 更新用户信息
router.post("/updateProfile", (req, res) => {
    const { username, email, avatar } = req.body;
    let users = getUsers();

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) return res.status(400).json({ message: "用户不存在" });

    users[userIndex].email = email || users[userIndex].email;
    users[userIndex].avatar = avatar || users[userIndex].avatar;

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.json({ message: "个人信息更新成功", user: users[userIndex] });
});

// 获取用户订单
router.post("/orders", (req, res) => {
    const { username } = req.body;
    let users = getUsers();
    const user = users.find(user => user.username === username);

    if (!user) return res.status(400).json({ message: "用户不存在" });
    res.json(user.orders || []);
});

module.exports = router;
