// ========================================
// 滚动渐入动画
// ========================================
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                setTimeout(() => {
                    entry.target.classList.add('settled');
                }, 1000);
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================================
// 数字滚动动画
// ========================================
const numObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.num');
            nums.forEach(num => {
                const target = parseInt(num.dataset.target);
                const suffix = num.dataset.suffix || '';
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        num.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        num.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
            });
            numObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-grid').forEach(el => numObserver.observe(el));

// ========================================
// AI特色功能
// ========================================

// 页面加载动画
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000);
    }
});

// 打字机效果函数
function typeCode(element, speed = 30) {
    const lines = element.querySelectorAll('.code-line');
    const originalTexts = [];
    
    // 保存原始文本并清空
    lines.forEach(line => {
        originalTexts.push(line.innerHTML);
        line.innerHTML = '';
        line.style.opacity = '0';
    });
    
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex >= lines.length) return;
        
        const currentLine = lines[lineIndex];
        const text = originalTexts[lineIndex];
        let charIndex = 0;
        
        currentLine.style.opacity = '1';
        currentLine.classList.add('typing');
        
        function typeChar() {
            if (charIndex < text.length) {
                currentLine.innerHTML = text.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeChar, speed);
            } else {
                currentLine.classList.remove('typing');
                currentLine.classList.add('typed');
                lineIndex++;
                setTimeout(typeLine, 100); // 行间延迟
            }
        }
        
        typeChar();
    }
    
    typeLine();
}

// 代码Tab切换
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.code-tab');
    const contents = document.querySelectorAll('.code-content');
    let hasTypedFirst = false;
    
    // 代码区域首次进入视口时触发打字机效果
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasTypedFirst) {
                hasTypedFirst = true;
                const firstContent = document.getElementById('tab-prompt');
                if (firstContent) {
                    firstContent.classList.add('active');
                    typeCode(firstContent, 20);
                }
                codeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const codeSection = document.querySelector('.code-tabs');
    if (codeSection) {
        codeObserver.observe(codeSection);
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
                typeCode(targetContent, 20);
            }
            
            const titles = {
                'prompt': 'prompt-engineering.js',
                'agent': 'agent-workflow.js',
                'mcp': 'mcp-config.js'
            };
            const titleEl = document.querySelector('.terminal-title');
            if (titleEl) {
                titleEl.textContent = titles[targetTab] || 'code.js';
            }
        });
    });
    
    // AI对话动画 - 滚动到区域时逐条弹出，像真实聊天
    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const messages = entry.target.querySelectorAll('.chat-message, .chat-result');
                messages.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('typing-animation');
                        // 为每条消息设置延迟
                        el.style.animationDelay = (index * 0.8) + 's';
                    }, 100);
                });
                chatObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const chatDemo = document.querySelector('.chat-demo');
    if (chatDemo) {
        chatObserver.observe(chatDemo);
    }
});
