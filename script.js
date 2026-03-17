let writers = [];
const { pinyin } = pinyinPro;

// 根据屏幕宽度获取汉字尺寸
function getCharSize() {
    return window.innerWidth >= 768 ? 140 : 90;
}

// 核心渲染函数
function renderAll() {
    const input = document.getElementById('chars-input').value;
    const container = document.getElementById('writer-container');
    container.innerHTML = ''; // 清空旧内容
    writers = [];

    const pinyinList = pinyin(input, { type: 'array' });
    const size = getCharSize();

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        // 仅处理中文字符
        if (char.match(/[^\x00-\xff]/)) {
            const unitDiv = document.createElement('div');
            unitDiv.className = 'char-unit';

            // 拼音
            const pinyinDiv = document.createElement('div');
            pinyinDiv.className = 'pinyin-label';
            pinyinDiv.innerText = pinyinList[i];
            unitDiv.appendChild(pinyinDiv);

            // 汉字框
            const charBox = document.createElement('div');
            charBox.className = 'char-box';
            unitDiv.appendChild(charBox);
            container.appendChild(unitDiv);

            // 创建实例
            const writer = HanziWriter.create(charBox, char, {
                width: size,
                height: size,
                padding: 5,
                strokeColor: '#2c3e50',
                radicalColor: '#e74c3c', // 红色显示偏旁
                showOutline: true
            });

            // 点击启动测验（写字模式）
            charBox.addEventListener('click', () => writer.quiz());
            writers.push(writer);
        }
    }
}

// 异步顺序播放动画
async function animateAll() {
    for (const writer of writers) {
        await writer.animateCharacter();
    }
}

// 重置所有字到练习模式
function resetAll() {
    writers.forEach(writer => writer.quiz());
}

// 窗口大小改变时重新渲染（适配横竖屏切换）
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderAll, 300);
});

// 初始化加载
renderAll();