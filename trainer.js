// 训练师数据
const trainerData = {
    name: '训练师小明',
    level: 42,
    exp: 8450,
    maxExp: 10000,
    rank: '钻石训练师',
    wins: 1247,
    losses: 386,
    totalBattles: 1633,
    winRate: 76.4,
    streak: 15,
    perfectWins: 89,
    points: 2580,
    avatar: '👨‍💻'
};

// 宝可梦数据（简版）
const pokemonData = {
    pikachu: { name: '皮卡丘', type: 'electric', emoji: '⚡' },
    charizard: { name: '喷火龙', type: 'fire', emoji: '🔥' },
    blastoise: { name: '水箭龟', type: 'water', emoji: '💧' },
    venusaur: { name: '妙蛙花', type: 'grass', emoji: '🌿' },
    mewtwo: { name: '超梦', type: 'psychic', emoji: '💜' },
    dragonite: { name: '快龙', type: 'dragon', emoji: '🐉' }
};

// 成就数据
const achievements = [
    { id: 'first_win', name: '初出茅庐', description: '获得第一场胜利', emoji: '🏆', unlocked: true },
    { id: 'win_streak_10', name: '连胜高手', description: '获得10连胜', emoji: '⚡', unlocked: true },
    { id: 'win_streak_50', name: '无敌战神', description: '获得50连胜', emoji: '👑', unlocked: false },
    { id: 'perfect_win', name: '完美胜利', description: '获得完美胜利', emoji: '💎', unlocked: true },
    { id: 'battle_100', name: '百战勇士', description: '进行100场对战', emoji: '⚔️', unlocked: true },
    { id: 'battle_500', name: '千战将军', description: '进行500场对战', emoji: '🎖️', unlocked: true },
    { id: 'battle_1000', name: '万战元帅', description: '进行1000场对战', emoji: '🌟', unlocked: true },
    { id: 'level_50', name: '登峰造极', description: '达到50级', emoji: '🏔️', unlocked: false },
    { id: 'all_types', name: '属性大师', description: '使用所有属性获胜', emoji: '🌈', unlocked: false }
];

// 对战历史数据
const battleHistory = [
    { opponent: '训练师小红', result: 'win', pokemon: 'pikachu', opponentPokemon: 'charizard', date: '2025-11-10 14:30' },
    { opponent: '训练师小刚', result: 'win', pokemon: 'blastoise', opponentPokemon: 'venusaur', date: '2025-11-10 13:45' },
    { opponent: '训练师小美', result: 'lose', pokemon: 'charizard', opponentPokemon: 'blastoise', date: '2025-11-10 12:20' },
    { opponent: '训练师小绿', result: 'win', pokemon: 'mewtwo', opponentPokemon: 'dragonite', date: '2025-11-10 11:15' },
    { opponent: '训练师小蓝', result: 'win', pokemon: 'dragonite', opponentPokemon: 'pikachu', date: '2025-11-10 10:30' },
    { opponent: '训练师小黄', result: 'lose', pokemon: 'venusaur', opponentPokemon: 'charizard', date: '2025-11-09 16:45' },
    { opponent: '训练师小黑', result: 'win', pokemon: 'blastoise', opponentPokemon: 'mewtwo', date: '2025-11-09 15:20' },
    { opponent: '训练师小白', result: 'win', pokemon: 'pikachu', opponentPokemon: 'blastoise', date: '2025-11-09 14:10' }
];

// 用户战队数据
let userTeam = [
    { pokemon: 'pikachu', level: 45 },
    { pokemon: 'charizard', level: 42 },
    { pokemon: 'blastoise', level: 40 },
    null,
    null,
    null
];

// 游戏状态
let gameState = {
    selectedSlot: null,
    teamEditMode: false
};

// DOM元素
const elements = {
    teamGrid: document.getElementById('team-grid'),
    achievementsGrid: document.getElementById('achievements-grid'),
    battleHistory: document.getElementById('battle-history'),
    autoTeamBtn: document.getElementById('auto-team-btn'),
    typeDistributionChart: document.getElementById('type-distribution-chart'),
    winrateTrendChart: document.getElementById('winrate-trend-chart')
};

// 初始化页面
function initPage() {
    renderTeamGrid();
    renderAchievements();
    renderBattleHistory();
    initCharts();
    setupEventListeners();
    animateStats();
}

// 渲染战队网格
function renderTeamGrid() {
    elements.teamGrid.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = `team-slot ${userTeam[i] ? 'filled' : ''}`;
        slot.dataset.slot = i;
        
        if (userTeam[i]) {
            const pokemon = pokemonData[userTeam[i].pokemon];
            slot.innerHTML = `
                <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span class="text-xl">${pokemon.emoji}</span>
                </div>
                <div class="text-sm font-semibold text-white">${pokemon.name}</div>
                <div class="text-xs text-slate-400">Lv.${userTeam[i].level}</div>
            `;
        } else {
            slot.innerHTML = `
                <div class="w-12 h-12 border-2 border-dashed border-slate-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span class="text-slate-500 text-xl">+</span>
                </div>
                <div class="text-sm text-slate-400">空位置</div>
            `;
        }
        
        slot.addEventListener('click', () => selectTeamSlot(i));
        elements.teamGrid.appendChild(slot);
    }
}

// 选择战队位置
function selectTeamSlot(slotIndex) {
    if (gameState.selectedSlot === slotIndex) {
        gameState.selectedSlot = null;
    } else {
        gameState.selectedSlot = slotIndex;
    }
    
    // 更新选中状态
    document.querySelectorAll('.team-slot').forEach((slot, index) => {
        slot.classList.toggle('selected', index === gameState.selectedSlot);
    });
    
    if (gameState.selectedSlot !== null) {
        showPokemonSelection();
    }
}

// 显示宝可梦选择
function showPokemonSelection() {
    const availablePokemon = Object.keys(pokemonData);
    const selection = prompt(
        `选择宝可梦加入战队：\n${availablePokemon.map((key, index) => `${index + 1}. ${pokemonData[key].name}`).join('\n')}\n\n输入数字 (1-${availablePokemon.length}) 或输入 0 取消:`
    );
    
    const choice = parseInt(selection);
    if (choice > 0 && choice <= availablePokemon.length) {
        const selectedPokemon = availablePokemon[choice - 1];
        userTeam[gameState.selectedSlot] = {
            pokemon: selectedPokemon,
            level: Math.floor(Math.random() * 20) + 35 // 随机等级 35-55
        };
        renderTeamGrid();
        
        // 添加动画
        anime({
            targets: `.team-slot[data-slot="${gameState.selectedSlot}"]`,
            scale: [0.8, 1],
            duration: 500,
            easing: 'easeOutExpo'
        });
    }
    
    gameState.selectedSlot = null;
    document.querySelectorAll('.team-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
}

// 渲染成就网格
function renderAchievements() {
    elements.achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        badge.innerHTML = `
            <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span class="text-xl">${achievement.emoji}</span>
            </div>
            <div class="text-sm font-semibold text-white mb-1">${achievement.name}</div>
            <div class="text-xs text-slate-400">${achievement.description}</div>
        `;
        
        badge.addEventListener('click', () => {
            if (achievement.unlocked) {
                alert(`恭喜解锁成就：${achievement.name}！\n${achievement.description}`);
            } else {
                alert(`成就未解锁：${achievement.name}\n${achievement.description}\n\n继续努力吧！`);
            }
        });
        
        elements.achievementsGrid.appendChild(badge);
    });
}

// 渲染对战历史
function renderBattleHistory() {
    elements.battleHistory.innerHTML = '';
    
    battleHistory.forEach((battle, index) => {
        const item = document.createElement('div');
        item.className = 'battle-history-item';
        
        const pokemon = pokemonData[battle.pokemon];
        const opponentPokemon = pokemonData[battle.opponentPokemon];
        
        item.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                    <div class="win-indicator ${battle.result}"></div>
                    <span class="font-semibold text-white">${battle.opponent}</span>
                </div>
                <span class="text-xs text-slate-400">${battle.date}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-2">
                    <span class="text-xl">${pokemon.emoji}</span>
                    <span class="text-slate-300">${pokemon.name}</span>
                </div>
                <span class="text-slate-400">VS</span>
                <div class="flex items-center space-x-2">
                    <span class="text-slate-300">${opponentPokemon.name}</span>
                    <span class="text-xl">${opponentPokemon.emoji}</span>
                </div>
            </div>
            <div class="mt-2 text-right">
                <span class="text-xs ${battle.result === 'win' ? 'text-green-400' : 'text-red-400'}">
                    ${battle.result === 'win' ? '胜利' : '失败'}
                </span>
            </div>
        `;
        
        elements.battleHistory.appendChild(item);
    });
}

// 初始化图表
function initCharts() {
    initTypeDistributionChart();
    initWinrateTrendChart();
}

// 初始化属性分布图表
function initTypeDistributionChart() {
    const chart = echarts.init(elements.typeDistributionChart);
    
    // 模拟数据
    const typeData = [
        { name: '火系', value: 245 },
        { name: '水系', value: 189 },
        { name: '电系', value: 156 },
        { name: '草系', value: 134 },
        { name: '超能', value: 98 },
        { name: '龙系', value: 87 },
        { name: '其他', value: 156 }
    ];
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [{
            name: '属性使用',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#1E293B',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#ffffff'
                }
            },
            labelLine: {
                show: false
            },
            data: typeData.map((item, index) => ({
                ...item,
                itemStyle: {
                    color: getTypeColor(index)
                }
            }))
        }]
    };
    
    chart.setOption(option);
}

// 初始化胜率趋势图表
function initWinrateTrendChart() {
    const chart = echarts.init(elements.winrateTrendChart);
    
    // 模拟数据 - 最近30天的胜率
    const dates = [];
    const winRates = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        
        // 生成波动的胜率数据
        const baseRate = 75;
        const variation = Math.sin(i * 0.2) * 10 + Math.random() * 5;
        winRates.push(Math.max(60, Math.min(90, baseRate + variation)));
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: {
                lineStyle: {
                    color: '#475569'
                }
            },
            axisLabel: {
                color: '#94a3b8'
            }
        },
        yAxis: {
            type: 'value',
            min: 50,
            max: 100,
            axisLine: {
                lineStyle: {
                    color: '#475569'
                }
            },
            axisLabel: {
                color: '#94a3b8',
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: '#334155'
                }
            }
        },
        series: [{
            name: '胜率',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: '#06B6D4',
                width: 3
            },
            itemStyle: {
                color: '#06B6D4'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(6, 182, 212, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(6, 182, 212, 0.05)'
                    }]
                }
            },
            data: winRates
        }]
    };
    
    chart.setOption(option);
}

// 获取属性颜色
function getTypeColor(index) {
    const colors = [
        '#EF4444', '#3B82F6', '#F59E0B', '#10B981',
        '#8B5CF6', '#6366F1', '#06B6D4', '#DC2626',
        '#7C3AED', '#D97706', '#818CF8', '#10B981',
        '#78716C', '#3730A3', '#1F2937', '#6B7280',
        '#EC4899', '#9CA3AF'
    ];
    return colors[index % colors.length];
}

// 设置事件监听器
function setupEventListeners() {
    // 智能推荐按钮
    elements.autoTeamBtn.addEventListener('click', generateRecommendedTeam);
    
    // 窗口大小调整时重新渲染图表
    window.addEventListener('resize', () => {
        const typeChart = echarts.getInstanceByDom(elements.typeDistributionChart);
        const winrateChart = echarts.getInstanceByDom(elements.winrateTrendChart);
        
        if (typeChart) typeChart.resize();
        if (winrateChart) winrateChart.resize();
    });
}

// 生成推荐战队
function generateRecommendedTeam() {
    const availablePokemon = Object.keys(pokemonData);
    const recommendedTeam = [];
    
    // 智能推荐算法：平衡属性分布
    const selectedTypes = new Set();
    let attempts = 0;
    
    while (recommendedTeam.length < 6 && attempts < 100) {
        const randomPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
        const pokemon = pokemonData[randomPokemon];
        
        // 检查是否已经有相同类型的宝可梦
        if (!selectedTypes.has(pokemon.type) || recommendedTeam.length >= availablePokemon.length) {
            recommendedTeam.push({
                pokemon: randomPokemon,
                level: Math.floor(Math.random() * 20) + 35
            });
            selectedTypes.add(pokemon.type);
        }
        
        attempts++;
    }
    
    // 填充剩余位置
    while (recommendedTeam.length < 6) {
        const randomPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
        recommendedTeam.push({
            pokemon: randomPokemon,
            level: Math.floor(Math.random() * 20) + 35
        });
    }
    
    userTeam = recommendedTeam;
    renderTeamGrid();
    
    // 添加动画效果
    anime({
        targets: '.team-slot',
        scale: [0.8, 1],
        duration: 500,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
    
    alert('智能推荐战队已生成！');
}

// 动画化统计数据
function animateStats() {
    // 统计卡片动画
    anime({
        targets: '.stat-card',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
    
    // 成就徽章动画
    anime({
        targets: '.achievement-badge',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        delay: anime.stagger(50),
        easing: 'easeOutExpo'
    });
    
    // 对战历史动画
    anime({
        targets: '.battle-history-item',
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 400,
        delay: anime.stagger(50),
        easing: 'easeOutExpo'
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    
    // 添加页面加载动画
    anime({
        targets: '.trainer-bg > div',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
    });
});

// 导出函数供其他模块使用
window.TrainerSystem = {
    trainerData,
    pokemonData,
    achievements,
    battleHistory,
    userTeam,
    initPage,
    renderTeamGrid,
    generateRecommendedTeam
};