// 获取表单和输入框
const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// 实时验证 - 用户名
usernameInput.addEventListener("input", function() {
    if (usernameInput.value.trim() === "") {
        showError(usernameInput, "ユーザー名を入力してください。");
    } else {
        clearError(usernameInput);
    }
});

// 实时验证 - 密码
passwordInput.addEventListener("input", function() {
    if (passwordInput.value.trim().length < 6) {
        showError(passwordInput, "パスワードは6文字以上で入力してください。");
    } else {
        clearError(passwordInput);
    }
});

// 表单提交事件
registerForm.addEventListener("submit", function(event) {
    event.preventDefault(); // 阻止表单提交

    // 清除之前的错误信息
    clearErrors();

    // 验证输入
    let isValid = true;

    if (usernameInput.value.trim() === "") {
        showError(usernameInput, "ユーザー名を入力してください。");
        isValid = false;
    }

    if (passwordInput.value.trim().length < 6) {
        showError(passwordInput, "パスワードは6文字以上で入力してください。");
        isValid = false;
    }

    // 验证通过后执行注册逻辑
    if (isValid) {
        console.log("登録情報：", {
            username: usernameInput.value,
            password: passwordInput.value
        });
        alert("登録成功！");
        // 在此处可以执行实际的注册请求
    }
});

// 显示错误信息
function showError(inputElement, message) {
    clearError(inputElement);
    const errorMessage = document.createElement("small");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    inputElement.parentNode.appendChild(errorMessage);
    inputElement.style.borderColor = "#e74c3c";
}

// 清除特定输入框的错误信息
function clearError(inputElement) {
    const errorMessage = inputElement.parentNode.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.remove();
    }
    inputElement.style.borderColor = "";
}

// 清除所有错误信息
function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(function(message) {
        message.remove();
    });
    usernameInput.style.borderColor = "";
    passwordInput.style.borderColor = "";
}
