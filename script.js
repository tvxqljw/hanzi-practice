let writers = [];
const { pinyin } = pinyinPro;

function getCharSize() {
    return window.innerWidth >= 768 ? 140 : 90;
}

function renderAll() {
    const input = document.getElementById('chars-input').value;
    const container = document.getElementById('writer-container');
    container.innerHTML = '';
    writers = [];

    const size = getCharSize();
    const pinyinList = pinyin(input, { type: 'array' });

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char.match(/[^\x00-\xff]/)) {
            const unitDiv = document.createElement('div');
            unitDiv.className = 'char-unit';

            const pinyinDiv = document.createElement('div');
            pinyinDiv.className = 'pinyin-label';
            pinyinDiv.innerText = pinyinList[i] || '';
            unitDiv.appendChild(pinyinDiv);

            const charBox = document.createElement('div');
            charBox.className = 'char-box';
            unitDiv.appendChild(charBox);
            container.appendChild(unitDiv);

            const writer = HanziWriter.create(charBox, char, {
                width: size,
                height: size,
                padding: 10,
                showOutline: true,
                showCharacter: true,      // 核心：初始显示
                strokeColor: '#333333',
                radicalColor: '#CC0000',
                outlineColor: '#F0F0F0',
                drawingColor: '#333333',
                drawingWidth: 6,
                highlightOnComplete: true,
                highlightColor: '#333333'
            });

            // 强制立即显示汉字，防止某些环境下默认隐藏
            writer.showCharacter();

            writers.push({
                instance: writer,
                el: charBox
            });
        }
    }
}

// --- 统一进入练习状态 ---
function startQuizMode() {
    writers.forEach(item => {
        const writer = item.instance;
        const charBox = item.el;

        charBox.classList.remove('finished');
        writer.updateColor('outlineColor', '#F0F0F0');
        
        // 关键：先取消之前的任何练习状态，隐藏字符，再重新开启 Quiz
        writer.cancelQuiz(); 
        writer.hideCharacter();
        writer.quiz(); 
    });
}

function animateAll() {
    writers.forEach(item => {
        // 播放前确保字是可见的，且停止练习模式
        item.instance.cancelQuiz();
        item.instance.showCharacter();
        item.instance.animateCharacter();
    });
}

// 初始化加载
renderAll();