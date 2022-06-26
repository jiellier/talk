// 用户登录和注册的表单项通用验证代码

// 对某一个表单项进行验证的构造函数
class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId 文本框的ID
     * @param {Function} validatorFunc 验证规则函数，当表单项需要验证时调用该函数，函数的参数为当前文本框的值，函数返回错误消息，若通过验证则没有返回值
     */
    constructor(txtId, validatorFunc) {
        this.input = document.querySelector(`#${txtId}`);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        };
    }

    // 构造函数的原型方法，用于验证表单项，成功返回true，失败返回false
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerHTML = err;
            return false;
        } else {
            this.p.innerHTML = "";
            return true;
        }
    }

    // 对传入的所有验证器进行统一的验证
    static async validate(...validators) {
        const proms = validators.map((v) => v.validate());
        const result = await Promise.all(proms);
        return result.every((r) => r === true);
    }
}
