(async function () {
    // 获取需要的DOM
    const doms = {
        nickname: document.getElementById("nickname"),
        loginId: document.getElementById("loginId"),
        close: document.querySelector(".close"),
        chatContainer: document.querySelector(".chat-container"),
        msgForm: document.querySelector(".msg-container"),
        txtMsg: document.querySelector("#txtMsg"),
    };

    // 验证是否登录，没有登录则跳转到登录页，登录则获取用户信息
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        // 如果user没有值，表示没有登录，跳转到登录页
        alert("您还未登录或登录已过期，请先登录");
        location.href = "./login.html";
        return;
    }
    // 将用户信息展示到侧边栏
    setUserInfo();

    // 注销事件
    doms.close.onclick = function () {
        API.logOut();
        location.href = "../login.html";
    };

    // 加载聊天记录
    await setHistory();
    async function setHistory() {
        const resp = await API.getHistory();
        for (let item of resp.data) {
            setChat(item);
        }
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    // 发送消息事件
    doms.msgForm.onsubmit = function (e) {
        e.preventDefault();
        sendChat();
    };

    // 发送消息
    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        setChat({
            content: content,
            createdAt: Date.now(),
            from: user.loginId,
            to: null,
        });
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
        doms.txtMsg.value = "";
        const resp = await API.setChart(content);
        setChat({
            from: null,
            to: user.loginId,
            ...resp.data,
        });
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    // 根据传入的对象添加一条消息到页面中
    /*
    content: "hello"
    createdAt: 1655775210176
    from: "yueyue"
    to: null
    */
    function setChat(chatItem) {
        const div = document.createElement("div");
        div.className = chatItem.from ? "chat-item me" : "chat-item";
        const img = document.createElement("img");
        img.className = "chat-avatar";
        img.src = chatItem.from
            ? "./asset/avatar.png"
            : "./asset/robot-avatar.jpg";
        const content = document.createElement("div");
        content.className = "chat-content";
        content.innerText = chatItem.content;
        const date = document.createElement("div");
        date.className = "chat-date";
        date.innerText = dateForm(chatItem.createdAt);
        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);
        doms.chatContainer.appendChild(div);

        // 格式化时间戳
        function dateForm(date) {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, "0");
            const day = d.getDate().toString().padStart(2, "0");
            const hour = d.getHours().toString().padStart(2, "0");
            const minute = d.getMinutes().toString().padStart(2, "0");
            const second = d.getSeconds().toString().padStart(2, "0");
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }
    }

    // 设置用户信息函数
    function setUserInfo() {
        doms.nickname.innerText = user.nickname;
        doms.loginId.innerText = user.loginId;
    }
})();
