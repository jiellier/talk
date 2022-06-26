const API = (function () {
    const BASE_URL = "https://study.duyiedu.com";
    const TOKEN_KEY = "token";

    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return fetch(`${BASE_URL}${path}`, { headers });
    }

    function post(path, bodyObj) {
        const headers = {
            "Content-Type": "application/json",
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            headers,
            method: "POST",
            body: JSON.stringify(bodyObj),
        });
    }

    // 注册接口函数
    async function reg(userInfo) {
        const resp = await post("/api/user/reg", userInfo);
        return await resp.json();
    }

    // 登录接口函数
    async function log(logInfo) {
        const resp = await post("/api/user/login", logInfo);
        const result = await resp.json();
        if (result.code === 0) {
            const token = resp.headers.get("Authorization");
            localStorage.setItem(TOKEN_KEY, token);
        }
        return result;
    }

    // 验证账号接口函数
    async function exists(logId) {
        const resp = await get(`/api/user/exists?loginId=${logId}`);
        return resp.json();
    }

    // 当前登录的用户信息
    async function profile() {
        const resp = await get("/api/user/profile");
        return resp.json();
    }

    // 获取聊天记录
    async function getHistory() {
        const resp = await get("/api/chat/history");
        return resp.json();
    }

    // 发送聊天消息
    async function setChart(content) {
        const resp = await post("/api/chat", { content: content });
        return resp.json();
    }

    // 退出登录
    function logOut() {
        localStorage.removeItem(TOKEN_KEY);
    }
    return {
        reg,
        log,
        exists,
        profile,
        getHistory,
        setChart,
        logOut,
    };
})();
