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
    
    mainContent.addEventListener('scroll', () => {
        if (mainContent.scrollTop > 50) {
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

});
