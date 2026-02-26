const https = require('https');
const http = require('http');

// 配置常量
const URL_LIST = [
  'https://apoastron-n8n.hf.space/healthz',
  'https://apoastron-ffmpeg.hf.space/healthz'
];
const INTERVAL_MS = 15 * 60 * 1000; // 15分钟
const REQUEST_TIMEOUT = 30000; // 30秒

// 错误处理
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
});

function wakeUp() {
  URL_LIST.forEach(url => {
    const req = https.get(url, (res) => {
      res.resume();
      console.log(`[${new Date().toISOString()}] Ping ${url} | Status: ${res.statusCode}`);
    });
    
    req.setTimeout(REQUEST_TIMEOUT, () => {
      req.destroy();
      console.error(`[${new Date().toISOString()}] Ping ${url} Timeout`);
    });
    
    req.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] Ping ${url} Error: ${err.message}`);
    });
  });
}

// 定时保活
setInterval(wakeUp, INTERVAL_MS);
wakeUp(); // 立即执行一次

// HTTP 服务
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Alive');
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${server.address().port}`)
