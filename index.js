const https = require('https');

// 配置需要保活的 2 个 Hugging Face Space 地址（已添加你要的第二个）
const URL_LIST = [
  'https://apoastron-n8n.hf.space/healthz',
  'https://apoastron-ffmpeg.hf.space/healthz'
]; 

function wakeUp() {
  // 循环请求数组里的所有地址
  URL_LIST.forEach(url => {
    https.get(url, (res) => {
      // 修复原代码内存泄漏问题：res.resume() 必须加
      res.resume();
      console.log(`[${new Date().toISOString()}] Ping ${url} | Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[${new Date().toISOString()}] Ping ${url} Error: ${err.message}`);
    });
  })
}

// 每 15 分钟执行一次保活请求
setInterval(wakeUp, 15 * 60 * 1000);

// 启动项目时立即执行一次，防止初始休眠
wakeUp();

// 启动Http服务，防止Zeabur判定应用崩溃，端口自适应
require('http').createServer((req, res) => res.end('Alive')).listen(process.env.PORT || 3000);
