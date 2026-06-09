const http = require('http');
const fs = require('fs');
const path = require('path');
//cd /Users/paulomendoza/Documents/PDM-Bacolod/pdm-bacolod-operator/Build/web-build
//node server.js
//http://localhost:9000/
const PORT = 9000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.wasm': 'application/wasm',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.data': 'application/octet-stream',
    '.br': 'application/x-brotli'
};

http.createServer((req, res) => {
    // Clean up the URL path
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Fallback if a compressed file or sub-resource is requested without extension
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.br')) {
        filePath += '.br';
        res.setHeader('Content-Encoding', 'br');
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        // CRITICAL COOP & COEP SECURITY HEADERS FOR UNITY MULTITHREADING
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    });
}).listen(PORT, () => {
    console.log(`🚀 Secure Unity WebGL Server running at http://localhost:${PORT}`);
});