const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
    if (!val) {
        return "账号不能为空";
    }
    const resp = await API.exists(val);
    if (resp.data === true) {
        return "账号已存在，请直接登录或输入新的账号";
    }
});
const nicknameValidator = new FieldValidator("txtNickname", function (val) {
    if (!val) {
        return "请输入昵称";
    }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
    if (!val) {
        return "请输入密码";
    }
});
const loginPwdConfirm = new FieldValidator("txtLoginPwdConfirm", function (
    val
) {
    if (!val) {
        return "请确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
        return "两次输入密码不一致";
    }
});
const form = document.querySelector(".user-form");
form.onsubmit = async function (e) {
    e.preventDefault();
    const result = FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator,
        nicknameValidator,
        loginPwdConfirm
    );
    if (!result) {
        // 验证未通过
        return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const resp = await API.reg(data);
    console.log(resp);
    if (resp.code === 0) {
        alert("注册成功");
        location.href = "./login.html";
    }
};
