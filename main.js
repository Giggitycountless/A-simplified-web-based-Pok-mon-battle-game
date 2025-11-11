// 粒子系统
let particles = [];
let particleCount = 100;

// 初始化粒子背景
function initParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        container.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1
        });
    }

    animateParticles();
}

// 动画粒子
function animateParticles() {
    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

        // 更新位置
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.width = particle.size + 'px';
        particle.element.style.height = particle.size + 'px';
    });

    requestAnimationFrame(animateParticles);
}

// 初始化轮播
function initCarousel() {
    if (document.getElementById('pokemon-carousel')) {
        new Splide('#pokemon-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
            breakpoints: {
                768: {
                    perPage: 1,
                },
                1024: {
                    perPage: 2,
                }
            }
        }).mount();
    }
}

// 英雄区域动画
function initHeroAnimations() {
    // 标题动画
    anime({
        targets: '.orbitron',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        delay: 500,
        easing: 'easeOutExpo'
    });

    // 描述文本动画
    anime({
        targets: '.hero-bg p',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 800,
        easing: 'easeOutExpo'
    });

    // 按钮动画
    anime({
        targets: '.battle-button',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        delay: 1200,
        easing: 'easeOutBack'
    });

    // 对战预览动画
    anime({
        targets: '.battle-arena',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1000,
        delay: 1000,
        easing: 'easeOutExpo'
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('card-hover')) {
                    anime({
                        targets: element,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        easing: 'easeOutExpo'
                    });
                }
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    document.querySelectorAll('.card-hover').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // 这里可以添加移动端菜单的显示/隐藏逻辑
            alert('移动端菜单功能开发中...');
        });
    }
}

// 技能图标动画
function initSkillAnimations() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    skillIcons.forEach((icon, index) => {
        anime({
            targets: icon,
            rotate: [0, 360],
            duration: 2000,
            delay: index * 500,
            loop: true,
            easing: 'linear'
        });
    });
}

// 血量条动画
function initHealthBarAnimations() {
    const healthBars = document.querySelectorAll('.bg-green-400');
    healthBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        anime({
            targets: bar,
            width: width,
            duration: 1500,
            delay: 1500 + (index * 200),
            easing: 'easeOutExpo'
        });
    });
}

// 导航栏滚动效果
function initNavbarScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 按钮点击效果
function initButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            anime({
                targets: ripple,
                scale: [0, 2],
                opacity: [0.3, 0],
                duration: 600,
                easing: 'easeOutExpo',
                complete: () => ripple.remove()
            });
        });
    });
}

// 窗口大小调整
function handleResize() {
    window.addEventListener('resize', () => {
        // 重新初始化粒子系统
        particles = [];
        const container = document.getElementById('particle-container');
        if (container) {
            container.innerHTML = '';
            initParticles();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initParticles();
    initCarousel();
    initHeroAnimations();
    initScrollAnimations();
    initMobileMenu();
    initSkillAnimations();
    initHealthBarAnimations();
    initNavbarScroll();
    initButtonEffects();
    handleResize();
    
    // 添加加载完成动画
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });
});

// 导出函数供其他页面使用
window.PokemonBattle = {
    initParticles,
    initCarousel,
    initHeroAnimations,
    initScrollAnimations,
    initMobileMenu,
    initSkillAnimations,
    initHealthBarAnimations,
    initNavbarScroll,
    initButtonEffects
};