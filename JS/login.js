const loginIdValidator = new FieldValidator("txtLoginId", function (val) {
    if (!val) {
        return "请输入账号";
    }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
    if (!val) {
        return "请输入密码";
    }
});
const form = document.querySelector(".user-form");
form.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator
    );
    if (!result) {
        // 验证未通过
        return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const resp = await API.log(data);
    if (resp.code === 0) {
        // 登录成功
        alert("登录成功");
        location.href = "../index.html";
    } else {
        loginIdValidator.p.innerHTML = resp.msg;
    }
};
