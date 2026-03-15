/**
 * 舞い散る花びら（牡丹・桜）のパーティクルアニメーション
 */

const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 40; // 花びらの数

// 色のバリエーション（深紅〜ピンク）
const colors = [
    'rgba(181, 19, 34, 0.8)',   // 深紅 (Botan Red)
    'rgba(196, 40, 56, 0.7)',
    'rgba(232, 91, 117, 0.8)',  // ピンク (Botan Pink)
    'rgba(245, 133, 153, 0.7)',
    'rgba(255, 180, 195, 0.6)'
];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Petal {
    constructor() {
        this.reset();
        // 初期配置は画面全体に散らす
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -50 - Math.random() * 50; // 画面上部から出現
        this.z = Math.random() * 0.8 + 0.2; // 奥行き・サイズ用 (0.2 ~ 1.0)
        this.size = this.z * 15 + 5; // 花びらの大きさ
        this.speedY = this.z * 1.5 + 0.5; // 落下速度
        this.speedX = (Math.random() - 0.5) * 1.5; // 横揺れ速度
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // 回転と揺らぎ
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
        this.waveX = Math.random() * Math.PI * 2;
        this.waveSpeed = (Math.random() * 0.02) + 0.01;
    }

    update() {
        // 落下と揺らぎの計算
        this.y += this.speedY;
        this.waveX += this.waveSpeed;
        this.x += this.speedX + Math.sin(this.waveX) * 1.5 * this.z;
        this.angle += this.spin;

        // 画面外に出たらリセット
        if (this.y > height + 50 || this.x < -50 || this.x > width + 50) {
            this.reset();
            this.y = -50; 
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 花びらの形を描画 (ベジェ曲線で簡易的に表現)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size/2, -this.size, 0, -this.size);
        ctx.bezierCurveTo(this.size/2, -this.size, this.size/2, -this.size/2, 0, 0);
        
        ctx.fillStyle = this.color;
        
        // ぼかし効果をつけて遠近感を出す
        if(this.z < 0.4) {
             ctx.filter = 'blur(2px)';
        } else if (this.z > 0.8) {
             ctx.filter = 'blur(0.5px)';
        } else {
             ctx.filter = 'none';
        }
        
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Petal());
    }
}

function animate() {
    // 軌跡を残さず全体をクリア
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
});

// 初期化とアニメーション開始
init();
animate();
