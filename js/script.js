/**
 * 花村紅 公式サイト メインスクリプト
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // ヘッダースクロール時のスタイル変更
    // ==========================================
    const header = document.querySelector('.header');
    
    // .main-contentのスクロールイベントを監視（パララックスラッパーのため）
    const mainContent = document.querySelector('.main-content');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // ==========================================
        // Scroll Reveal Animation
        // ==========================================
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 150;
            
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
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 通常のbodyスクロールではなく、パララックスラッパー内のスクロール
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 音源販売画像のランダム表示処理
    // ==========================================
    const randomMusicImg1 = document.getElementById('random-music-img-1');
    const randomMusicImg2 = document.getElementById('random-music-img-2');
    
    if (randomMusicImg1 && randomMusicImg2) {
        // 画像リスト (music_01.jpg 〜 music_07.jpg)
        const musicImages = [
            'images/music_thmb/music_01.jpg',
            'images/music_thmb/music_02.jpg',
            'images/music_thmb/music_03.jpg',
            'images/music_thmb/music_04.jpg',
            'images/music_thmb/music_05.jpg',
            'images/music_thmb/music_06.jpg',
            'images/music_thmb/music_07.jpg'
        ];
        
        // 重複しないように2つランダムに選択
        const shuffled = [...musicImages].sort(() => 0.5 - Math.random());
        const selectedImages = shuffled.slice(0, 2);
        
        // フワッと切り替えるためのスタイル処理
        [randomMusicImg1, randomMusicImg2].forEach(img => {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = 0;
        });
        
        setTimeout(() => {
            randomMusicImg1.src = selectedImages[0];
            randomMusicImg2.src = selectedImages[1];
            
            randomMusicImg1.onload = () => randomMusicImg1.style.opacity = 1;
            randomMusicImg2.onload = () => randomMusicImg2.style.opacity = 1;
        }, 300);
    }

    // ==========================================
    // グッズ画像のランダム表示処理
    // ==========================================
    const randomGoodsImg = document.getElementById('random-goods-img');
    if (randomGoodsImg) {
        // 画像が存在するかチェックする関数
        const checkImageExists = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        };

        const setupRandomGoods = async () => {
            let availableIndexes = [];
            // goods01.png は左側固定なので、右側は02以降を探す
            let checkIndex = 2;
            let keepChecking = true;

            // 最大50個まで探す(無限ループ防止)
            while (keepChecking && checkIndex <= 50) {
                const numStr = checkIndex.toString().padStart(2, '0');
                const url = `images/goods/goods${numStr}.png`;
                const exists = await checkImageExists(url);
                if (exists) {
                    availableIndexes.push(numStr);
                    checkIndex++;
                } else {
                    keepChecking = false; // 連番が途切れたら探索終了
                }
            }

            if (availableIndexes.length > 0) {
                // ランダムに1つ選定
                const randomIdx = Math.floor(Math.random() * availableIndexes.length);
                const selectedNum = availableIndexes[randomIdx];
                
                // フワッと切り替えるためのスタイル処理を含める
                randomGoodsImg.style.transition = 'opacity 0.3s ease';
                randomGoodsImg.style.opacity = 0;
                
                setTimeout(() => {
                    randomGoodsImg.src = `images/goods/goods${selectedNum}.png`;
                    randomGoodsImg.onload = () => {
                        randomGoodsImg.style.opacity = 1;
                    };
                }, 300);
            }
        };

        setupRandomGoods();
    }

});
