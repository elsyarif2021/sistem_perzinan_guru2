const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const allowed = new Map([['/', 'index.html'], ['/app.js', 'app.js'], ['/model.js', 'model.js'], ['/style.css', 'style.css']]);
http.createServer((req, res) => {
  const file = allowed.get(new URL(req.url, 'http://localhost').pathname);
  if (!file) { res.writeHead(404); return res.end('Tidak ditemukan'); }
  const mime = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8'};
  res.writeHead(200, {'Content-Type': mime[path.extname(file)], 'X-Content-Type-Options': 'nosniff'});
  fs.createReadStream(path.join(__dirname, file)).pipe(res);
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Sistem perizinan guru berjalan pada port ' + (process.env.PORT || 3000)));
