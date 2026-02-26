const https = require('https');

// 配置需要保活的地址
const URL_LIST = [
  'https://apoastron-n8n.hf.space/healthz',
  'https://apoastron-ffmpeg.hf.space/healthz'
]; 

function wakeUp() {
  URL_LIST.forEach(url => {
    // 配置请求选项：设置 5 秒超时和 User-Agent
    const options = {
      timeout: 5000, 
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KeepAliveBot/1.0; +https://example.com/bot)'
      }
    };

    const req = https.get(url, options, (res) => {
      // 修复内存泄漏：必须消费流
      res.resume();
      console.log(`[${new Date().toISOString()}] ✅ Ping ${url} | Status: ${res.statusCode}`);
    });

    // 监听超时事件
    req.on('timeout', () => {
      console.error(`[${new Date().toISOString()}] ⏱️ Ping ${url} Error: Request Timed Out`);
      req.destroy(); // 手动销毁请求
    });

    // 监听网络错误
    req.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] ❌ Ping ${url} Error: ${err.message}`);
    });
  });
}

// 每 15 分钟执行一次
setInterval(wakeUp, 15 * 60 * 1000);

// 启动时立即执行一次
wakeUp();

// 启动 HTTP 服务用于健康检查
const server = require('http').createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Alive');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] 🚀 Keep-alive service is running on port ${PORT}`);
});
