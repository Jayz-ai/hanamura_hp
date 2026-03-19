/**
 * 花村紅 公式サイト メインスクリプト
 */

document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD

=======
    
>>>>>>> 0d2f5ad8d2b1d5a3c887e4453b124f08822ef005
    // ==========================================
    // ヘッダースクロール時のスタイル変更
    // ==========================================
    const header = document.querySelector('.header');
<<<<<<< HEAD

    // .main-contentのスクロールイベントを監視（パララックスラッパーのため）
    const mainContent = document.querySelector('.main-content');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
=======
    
    // .main-contentのスクロールイベントを監視（パララックスラッパーのため）
    const mainContent = document.querySelector('.main-content');
    
    mainContent.addEventListener('scroll', () => {
        if (mainContent.scrollTop > 50) {
>>>>>>> 0d2f5ad8d2b1d5a3c887e4453b124f08822ef005
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
<<<<<<< HEAD

=======
        
>>>>>>> 0d2f5ad8d2b1d5a3c887e4453b124f08822ef005
        // ==========================================
        // Scroll Reveal Animation
        // ==========================================
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const windowHeight = window.innerHeight;
<<<<<<< HEAD

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 150;

=======
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 150;
            
>>>>>>> 0d2f5ad8d2b1d5a3c887e4453b124f08822ef005
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('is-visible');
            }
        });
    });

    // 初期ロード時にもRevealをチェック
    // 少し遅延を入れて発火
    setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                el.classList.add('is-visible');
            }
        });
    }, 300);

    // ==========================================
    // スムーススクロール (内部リンク)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
<<<<<<< HEAD
            if (targetId === '#') return;

=======
            if(targetId === '#') return;
            
>>>>>>> 0d2f5ad8d2b1d5a3c887e4453b124f08822ef005
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 通常のbodyスクロールではなく、パララックスラッパー内のスクロール
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

<<<<<<< HEAD

    // ==========================================
    // グッズサムネイル ランダム表示
    // goods01.png は固定。goods02.png 以降からランダムで1枚選ぶ。
    // 画像が増えた場合は GOODS_MAX_NUMBER の値を更新するだけでOK。
    // ==========================================
    const GOODS_MAX_NUMBER = 5; // 現在の最大ファイル番号（goods05.pngまで）
    const GOODS_MIN_RANDOM = 2; // ランダム選択の開始番号

    const randomImg = document.getElementById('goods-random-img');
    if (randomImg && GOODS_MAX_NUMBER >= GOODS_MIN_RANDOM) {
        // 2〜GOODS_MAX_NUMBER の中からランダムに1つ選ぶ
        const randomNum = Math.floor(
            Math.random() * (GOODS_MAX_NUMBER - GOODS_MIN_RANDOM + 1)
        ) + GOODS_MIN_RANDOM;

        // 番号を2桁ゼロ埋めしてパスを生成（例: goods03.png）
        const paddedNum = String(randomNum).padStart(2, '0');
        randomImg.src = `images/goods/goods${paddedNum}.png`;
        randomImg.alt = `グッズサンプル${randomNum}`;
    }

=======
>>>>>>> 0d2f5ad8d2b1d5a3c887e4453b124f08822ef005
});
