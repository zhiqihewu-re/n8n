const https = require('https');

// 替换为你的 Hugging Face Space 访问地址
const URL = 'https://apoastron-n8n.hf.space/healthz'; 

function wakeUp() {
    https.get(URL, (res) => {
        console.log(`[${new Date().toISOString()}] Ping status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
    });
}

// 每 15 分钟访问一次
setInterval(wakeUp, 15 * 60 * 1000);

// 启动时先执行一次
wakeUp();

// 简单的 HTTP 服务防止 Zeabur 认为应用崩溃
require('http').createServer((req, res) => res.end('Alive')).listen(process.env.PORT || 3000);
