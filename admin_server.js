const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'data', 'news.json');
const INDEX_FILE = path.join(__dirname, 'index.html');

// ニュースオブジェクトからHTMLを組み立てる関数
function generateNewsHtml(newsItems) {
    let html = '';
    // 公開済みの記事だけをフィルタリングして最大3件取得
    const publicNews = newsItems.filter(item => item.status === 'public').slice(0, 3);
    
    publicNews.forEach(item => {
        // [IMAGE: xxx.jpg] を <img> タグに置換 (images/ フォルダからの相対パスとみなす)
        let contentHtml = item.content.replace(/\[IMAGE:\s*(.+?)\]/g, '<img src="images/$1" alt="image" class="news-modal-image">');
        
        // テキストエリアの改行を <br> に変換
        contentHtml = contentHtml.replace(/\n/g, '<br>\n');

        html += `
                    <!-- 記事 ${item.id} -->
                    <article class="news-item" data-id="${item.id}">
                        <div class="news-date">${item.date}</div>
                        <h3 class="news-title">${item.title}</h3>
                        <!-- モーダル展開用の詳細データ (非表示) -->
                        <div class="news-detail-content" style="display: none;">
                            <div class="news-modal-date">${item.date}</div>
                            <h3 class="news-modal-title">${item.title}</h3>
                            <div class="news-modal-body">
                                ${contentHtml}
                            </div>
                        </div>
                    </article>\n`;
    });
    return html;
}

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(200);
        return res.end();
    }

    if (req.method === 'GET' && req.url === '/api/news') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end('[]');
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/api/news') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                // 1. JSONに保存 (UTF-8指定)
                fs.writeFileSync(DATA_FILE, body, 'utf8');
                
                // 2. index.html を書き換え
                const newsItems = JSON.parse(body);
                const newsHtml = generateNewsHtml(newsItems);
                
                let indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
                const startMarker = '<!-- NEWS_START -->';
                const endMarker = '<!-- NEWS_END -->';
                
                const startIndex = indexContent.indexOf(startMarker);
                const endIndex = indexContent.indexOf(endMarker);
                
                if (startIndex !== -1 && endIndex !== -1) {
                    const before = indexContent.substring(0, startIndex + startMarker.length);
                    const after = indexContent.substring(endIndex);
                    indexContent = before + '\n' + newsHtml + '                    ' + after;
                    fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/api/deploy') {
        // デプロイ（Git コマンドの実行） Windows cmd (chcp 65001) 対応
        const cmd = 'chcp 65001 > nul && git add . && git commit -m "Update NEWS via Admin Tool" && git push';
        exec(cmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: error.message, stderr }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, stdout }));
        });
    } else {
        // 静的ファイルの配信
        // クエリパラメータを除去してパスだけにする (?v=2 など)
        const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
        let filePath = parsedUrl.pathname === '/' ? '/admin/index.html' : parsedUrl.pathname;
        
        // プレビュー用に /preview で元の index.html を配信
        if (filePath === '/preview') {
            filePath = '/index.html';
        }

        // デコード（日本語ファイル名対応）
        filePath = decodeURIComponent(filePath);

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'text/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.ico': 'image/x-icon'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';
        const fullPath = path.join(__dirname, filePath);

        fs.readFile(fullPath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File Not Found');
                } else {
                    res.writeHead(500);
                    res.end('Server Error: ' + err.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`  管理ツールが起動しました！`);
    console.log(`  管理画面: http://localhost:${PORT}/`);
    console.log(`  プレビュー: http://localhost:${PORT}/preview`);
    console.log(`==========================================\n`);
});
