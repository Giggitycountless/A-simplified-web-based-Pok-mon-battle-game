// 宝可梦数据（与battle.js中的数据保持一致）
const pokemonData = {
    pikachu: {
        name: '皮卡丘',
        type: 'electric',
        emoji: '⚡',
        hp: 100,
        maxHp: 100,
        attack: 85,
        defense: 60,
        speed: 90,
        height: 0.4,
        weight: 6.0,
        description: '皮卡丘是一种小型啮齿类宝可梦，全身覆盖着黄色的毛发。它的耳朵很长，尖端是黑色的。当它高兴或兴奋时，脸颊上的红色电气袋会发出电光。',
        skills: [
            { name: '十万伏特', type: 'electric', power: 90, accuracy: 100, description: '向对手发出强力电击进行攻击。' },
            { name: '电光一闪', type: 'electric', power: 40, accuracy: 100, description: '以迅雷不及掩耳之势扑向对手。' },
            { name: '铁尾', type: 'steel', power: 100, accuracy: 75, description: '使用坚硬的尾巴摔打对手进行攻击。' },
            { name: '电磁波', type: 'electric', power: 0, accuracy: 90, description: '向对手发出微弱的电击，从而让对手陷入麻痹状态。' }
        ]
    },
    charizard: {
        name: '喷火龙',
        type: 'fire',
        emoji: '🔥',
        hp: 120,
        maxHp: 120,
        attack: 95,
        defense: 80,
        speed: 85,
        height: 1.7,
        weight: 90.5,
        description: '喷火龙是一种大型龙形宝可梦，全身覆盖着橙红色的鳞片。它能喷出高温的火焰，翅膀能够让它在空中自由飞行。',
        skills: [
            { name: '喷射火焰', type: 'fire', power: 90, accuracy: 100, description: '向对手发射烈焰进行攻击。' },
            { name: '龙之怒', type: 'dragon', power: 80, accuracy: 100, description: '向对手发射冲击波进行攻击。' },
            { name: '翅膀攻击', type: 'flying', power: 60, accuracy: 100, description: '大大地展开美丽的翅膀，将其撞向对手进行攻击。' },
            { name: '烟幕', type: 'fire', power: 0, accuracy: 100, description: '向对手喷出烟或墨汁等，从而降低对手的命中率。' }
        ]
    },
    blastoise: {
        name: '水箭龟',
        type: 'water',
        emoji: '💧',
        hp: 130,
        maxHp: 130,
        attack: 85,
        defense: 100,
        speed: 70,
        height: 1.6,
        weight: 85.5,
        description: '水箭龟是一种大型龟形宝可梦，背上的炮管可以发射高压水柱。它的壳非常坚硬，能够提供优秀的防御能力。',
        skills: [
            { name: '水炮', type: 'water', power: 110, accuracy: 80, description: '向对手猛烈地喷射大量水流进行攻击。' },
            { name: '冰冻光束', type: 'ice', power: 90, accuracy: 100, description: '向对手发射冰冻光束进行攻击。' },
            { name: '火箭头锤', type: 'normal', power: 70, accuracy: 100, description: '第１回合把头缩进去，第２回合攻击对手。' },
            { name: '缩入壳中', type: 'water', power: 0, accuracy: 100, description: '缩入壳里保护身体，从而提高自己的防御。' }
        ]
    },
    venusaur: {
        name: '妙蛙花',
        type: 'grass',
        emoji: '🌿',
        hp: 110,
        maxHp: 110,
        attack: 82,
        defense: 83,
        speed: 60,
        height: 2.0,
        weight: 100.0,
        description: '妙蛙花是一种大型蛙形宝可梦，背上的花朵可以吸收阳光并释放强大的能量。它是草系宝可梦中的强者。',
        skills: [
            { name: '阳光烈焰', type: 'grass', power: 120, accuracy: 100, description: '第１回合收集阳光，第２回合发射光束攻击。' },
            { name: '污泥炸弹', type: 'poison', power: 90, accuracy: 100, description: '用污泥投掷对手进行攻击。' },
            { name: '催眠粉', type: 'grass', power: 0, accuracy: 75, description: '撒出催眠粉，从而让对手陷入睡眠状态。' },
            { name: '生长', type: 'normal', power: 0, accuracy: 100, description: '唤醒身体深处沉睡的力量，从而提高自己的攻击。' }
        ]
    },
    mewtwo: {
        name: '超梦',
        type: 'psychic',
        emoji: '💜',
        hp: 140,
        maxHp: 140,
        attack: 110,
        defense: 90,
        speed: 100,
        height: 2.0,
        weight: 122.0,
        description: '超梦是通过基因工程创造出来的宝可梦，拥有超强的超能力。它能够读取其他生物的思想，并使用强大的精神力量。',
        skills: [
            { name: '精神强念', type: 'psychic', power: 90, accuracy: 100, description: '向对手发送强大的念力进行攻击。' },
            { name: '影子球', type: 'ghost', power: 80, accuracy: 100, description: '将影子凝缩成球状，砸向对手进行攻击。' },
            { name: '自我再生', type: 'psychic', power: 0, accuracy: 100, description: '让全身的细胞再生，回复一半ＨＰ。' },
            { name: '幻象术', type: 'psychic', power: 70, accuracy: 100, description: '向对手发送微弱的念力进行攻击。' }
        ]
    },
    dragonite: {
        name: '快龙',
        type: 'dragon',
        emoji: '🐉',
        hp: 125,
        maxHp: 125,
        attack: 100,
        defense: 95,
        speed: 80,
        height: 2.2,
        weight: 210.0,
        description: '快龙是一种大型龙形宝可梦，虽然体型庞大但飞行速度极快。它性格温和，智力很高，能够理解人类的语言。',
        skills: [
            { name: '龙之怒', type: 'dragon', power: 80, accuracy: 100, description: '向对手发射冲击波进行攻击。' },
            { name: '冰冻光束', type: 'ice', power: 90, accuracy: 100, description: '向对手发射冰冻光束进行攻击。' },
            { name: '地震', type: 'ground', power: 100, accuracy: 100, description: '利用地震的冲击，攻击自己周围所有的宝可梦。' },
            { name: '神速', type: 'normal', power: 80, accuracy: 100, description: '以迅雷不及掩耳之势猛撞向对手。' }
        ]
    }
};

// 属性数据
const types = [
    { id: 'fire', name: '火系', emoji: '🔥', color: 'from-red-500 to-orange-600' },
    { id: 'water', name: '水系', emoji: '💧', color: 'from-blue-500 to-cyan-600' },
    { id: 'electric', name: '电系', emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
    { id: 'grass', name: '草系', emoji: '🌿', color: 'from-green-500 to-emerald-600' },
    { id: 'psychic', name: '超能', emoji: '💜', color: 'from-purple-500 to-pink-600' },
    { id: 'dragon', name: '龙系', emoji: '🐉', color: 'from-indigo-500 to-purple-600' },
    { id: 'ice', name: '冰系', emoji: '🧊', color: 'from-cyan-400 to-blue-500' },
    { id: 'fighting', name: '格斗', emoji: '👊', color: 'from-red-600 to-orange-700' },
    { id: 'poison', name: '毒系', emoji: '☠️', color: 'from-purple-600 to-indigo-700' },
    { id: 'ground', name: '地面', emoji: '🌍', color: 'from-yellow-600 to-amber-700' },
    { id: 'flying', name: '飞行', emoji: '🦅', color: 'from-blue-400 to-indigo-500' },
    { id: 'bug', name: '虫系', emoji: '🐛', color: 'from-lime-500 to-green-600' },
    { id: 'rock', name: '岩石', emoji: '🪨', color: 'from-gray-600 to-stone-700' },
    { id: 'ghost', name: '幽灵', emoji: '👻', color: 'from-purple-800 to-indigo-900' },
    { id: 'dark', name: '恶系', emoji: '🌑', color: 'from-gray-800 to-slate-900' },
    { id: 'steel', name: '钢系', emoji: '⚙️', color: 'from-gray-500 to-slate-600' },
    { id: 'fairy', name: '妖精', emoji: '🧚', color: 'from-pink-400 to-rose-500' },
    { id: 'normal', name: '一般', emoji: '⭐', color: 'from-gray-400 to-slate-500' }
];

// 属性相克关系
const typeMatchups = {
    fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['water', 'ground', 'rock'] },
    water: { strong: ['fire', 'ground', 'rock'], weak: ['electric', 'grass'] },
    electric: { strong: ['water', 'flying'], weak: ['ground'] },
    grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'ice', 'poison', 'flying', 'bug'] },
    psychic: { strong: ['fighting', 'poison'], weak: ['bug', 'ghost', 'dark'] },
    dragon: { strong: ['dragon'], weak: ['ice', 'dragon', 'fairy'] },
    ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'fighting', 'rock', 'steel'] },
    fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['flying', 'psychic', 'fairy'] },
    poison: { strong: ['grass', 'fairy'], weak: ['ground', 'psychic'] },
    ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['water', 'grass', 'ice'] },
    flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'ice', 'rock'] },
    bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'flying', 'rock'] },
    rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['water', 'grass', 'fighting', 'ground', 'steel'] },
    ghost: { strong: ['psychic', 'ghost'], weak: ['ghost', 'dark'] },
    dark: { strong: ['psychic', 'ghost'], weak: ['fighting', 'bug', 'fairy'] },
    steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'fighting', 'ground'] },
    fairy: { strong: ['fighting', 'dragon', 'dark'], weak: ['poison', 'steel'] },
    normal: { strong: [], weak: ['fighting'] }
};

// 游戏状态
let gameState = {
    selectedPokemon: null,
    selectedAttackType: null,
    selectedDefenseType: null,
    filteredType: 'all',
    searchQuery: ''
};

// DOM元素
const elements = {
    pokemonGrid: document.getElementById('pokemon-grid'),
    searchInput: document.getElementById('search-input'),
    typeFilters: document.querySelectorAll('.type-filter'),
    attackTypes: document.getElementById('attack-types'),
    defenseTypes: document.getElementById('defense-types'),
    multiplierResult: document.getElementById('multiplier-result'),
    resultDescription: document.getElementById('result-description'),
    recommendedTypes: document.getElementById('recommended-types'),
    typeChart: document.getElementById('type-chart'),
    pokemonModal: document.getElementById('pokemon-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    closeModal: document.getElementById('close-modal')
};

// 初始化游戏
function initGame() {
    renderPokemonGrid();
    renderTypeSelectors();
    initTypeChart();
    setupEventListeners();
}

// 渲染宝可梦网格
function renderPokemonGrid() {
    elements.pokemonGrid.innerHTML = '';
    
    const filteredPokemon = getFilteredPokemon();
    
    Object.keys(filteredPokemon).forEach(key => {
        const pokemon = filteredPokemon[key];
        const card = createPokemonCard(pokemon, key);
        elements.pokemonGrid.appendChild(card);
    });
    
    // 添加动画
    anime({
        targets: '.pokemon-card',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
}

// 获取过滤后的宝可梦
function getFilteredPokemon() {
    let filtered = { ...pokemonData };
    
    // 按类型过滤
    if (gameState.filteredType !== 'all') {
        filtered = Object.keys(filtered).reduce((acc, key) => {
            if (filtered[key].type === gameState.filteredType) {
                acc[key] = filtered[key];
            }
            return acc;
        }, {});
    }
    
    // 按搜索查询过滤
    if (gameState.searchQuery) {
        filtered = Object.keys(filtered).reduce((acc, key) => {
            if (filtered[key].name.toLowerCase().includes(gameState.searchQuery.toLowerCase())) {
                acc[key] = filtered[key];
            }
            return acc;
        }, {});
    }
    
    return filtered;
}

// 创建宝可梦卡片
function createPokemonCard(pokemon, key) {
    const card = document.createElement('div');
    card.className = 'pokemon-card rounded-xl p-6';
    card.dataset.pokemon = key;
    
    const maxStat = Math.max(pokemon.attack, pokemon.defense, pokemon.speed);
    
    card.innerHTML = `
        <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span class="text-3xl">${pokemon.emoji}</span>
            </div>
            <div class="orbitron font-bold text-white mb-2">${pokemon.name}</div>
            <div class="type-badge ${pokemon.type} mb-4">${getTypeName(pokemon.type)}</div>
            
            <div class="space-y-3 text-sm">
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>攻击</span>
                        <span>${pokemon.attack}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.attack / maxStat) * 100}%"></div>
                    </div>
                </div>
                
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>防御</span>
                        <span>${pokemon.defense}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.defense / maxStat) * 100}%"></div>
                    </div>
                </div>
                
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>速度</span>
                        <span>${pokemon.speed}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.speed / maxStat) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 text-xs text-slate-400">
                HP: ${pokemon.hp} | 技能: ${pokemon.skills.length}个
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showPokemonDetails(pokemon, key));
    
    return card;
}

// 渲染属性选择器
function renderTypeSelectors() {
    // 渲染攻击方属性选择器
    elements.attackTypes.innerHTML = '';
    types.forEach(type => {
        const selector = createTypeSelector(type, 'attack');
        elements.attackTypes.appendChild(selector);
    });
    
    // 渲染防御方属性选择器
    elements.defenseTypes.innerHTML = '';
    types.forEach(type => {
        const selector = createTypeSelector(type, 'defense');
        elements.defenseTypes.appendChild(selector);
    });
}

// 创建属性选择器
function createTypeSelector(type, side) {
    const selector = document.createElement('div');
    selector.className = 'type-selector text-center';
    selector.dataset.type = type.id;
    selector.dataset.side = side;
    
    selector.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r ${type.color} rounded-full mx-auto mb-2 flex items-center justify-center">
            <span class="text-white font-bold text-sm">${type.emoji}</span>
        </div>
        <div class="text-xs text-white">${type.name}</div>
    `;
    
    selector.addEventListener('click', () => selectType(type.id, side));
    
    return selector;
}

// 选择属性
function selectType(typeId, side) {
    // 清除同侧的选中状态
    document.querySelectorAll(`[data-side="${side}"]`).forEach(el => {
        el.classList.remove('selected');
    });
    
    // 设置新的选中状态
    document.querySelector(`[data-type="${typeId}"][data-side="${side}"]`).classList.add('selected');
    
    // 更新游戏状态
    if (side === 'attack') {
        gameState.selectedAttackType = typeId;
    } else {
        gameState.selectedDefenseType = typeId;
    }
    
    // 更新计算器结果
    updateCalculatorResult();
}

// 更新计算器结果
function updateCalculatorResult() {
    if (!gameState.selectedAttackType || !gameState.selectedDefenseType) {
        elements.multiplierResult.textContent = '1×';
        elements.resultDescription.textContent = '效果一般';
        elements.recommendedTypes.textContent = '选择属性查看相克关系';
        return;
    }
    
    const multiplier = calculateTypeMultiplier(gameState.selectedAttackType, gameState.selectedDefenseType);
    
    // 更新倍数显示
    elements.multiplierResult.textContent = multiplier + '×';
    elements.multiplierResult.className = 'multiplier-display ' + getMultiplierClass(multiplier);
    
    // 更新描述
    let description = '效果一般';
    if (multiplier > 1) description = '效果绝佳！';
    else if (multiplier < 1) description = '效果不好...';
    elements.resultDescription.textContent = description;
    
    // 更新推荐属性
    const recommended = getRecommendedTypes(gameState.selectedDefenseType);
    elements.recommendedTypes.textContent = `推荐属性: ${recommended.join(', ')}`;
    
    // 更新图表
    updateTypeChart();
}

// 计算属性相克倍数
function calculateTypeMultiplier(attackType, defenseType) {
    if (!typeMatchups[attackType] || !typeMatchups[defenseType]) {
        return 1;
    }
    
    if (typeMatchups[attackType].strong.includes(defenseType)) {
        return 2;
    } else if (typeMatchups[attackType].weak.includes(defenseType)) {
        return 0.5;
    }
    
    return 1;
}

// 获取倍数CSS类
function getMultiplierClass(multiplier) {
    if (multiplier === 0) return 'multiplier-0';
    if (multiplier === 0.5) return 'multiplier-05';
    if (multiplier === 1) return 'multiplier-1';
    if (multiplier === 2) return 'multiplier-2';
    if (multiplier === 4) return 'multiplier-4';
    return 'multiplier-1';
}

// 获取推荐属性
function getRecommendedTypes(defenseType) {
    const recommended = [];
    Object.keys(typeMatchups).forEach(type => {
        if (typeMatchups[type].strong.includes(defenseType)) {
            const typeData = types.find(t => t.id === type);
            if (typeData) recommended.push(typeData.name);
        }
    });
    return recommended.length > 0 ? recommended : ['无特殊克制'];
}

// 初始化属性图表
function initTypeChart() {
    const chart = echarts.init(elements.typeChart);
    updateTypeChart();
    return chart;
}

// 更新属性图表
function updateTypeChart() {
    if (!gameState.selectedAttackType || !gameState.selectedDefenseType) return;
    
    const chart = echarts.getInstanceByDom(elements.typeChart);
    if (!chart) return;
    
    // 创建数据
    const data = [];
    const attackTypeName = types.find(t => t.id === gameState.selectedAttackType)?.name || '';
    const defenseTypeName = types.find(t => t.id === gameState.selectedDefenseType)?.name || '';
    
    // 获取所有属性对防御方的克制关系
    Object.keys(typeMatchups).forEach(type => {
        const multiplier = calculateTypeMultiplier(type, gameState.selectedDefenseType);
        const typeData = types.find(t => t.id === type);
        if (typeData) {
            data.push({
                name: typeData.name,
                value: multiplier,
                itemStyle: {
                    color: getMultiplierColor(multiplier)
                }
            });
        }
    });
    
    const option = {
        title: {
            text: `${defenseTypeName}属性防御分析`,
            textStyle: {
                color: '#ffffff',
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}×'
        },
        series: [{
            type: 'pie',
            radius: '60%',
            data: data,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                color: '#ffffff',
                fontSize: 10
            }
        }]
    };
    
    chart.setOption(option);
}

// 获取倍数颜色
function getMultiplierColor(multiplier) {
    if (multiplier === 0.5) return '#F59E0B';
    if (multiplier === 1) return '#10B981';
    if (multiplier === 2) return '#3B82F6';
    return '#6B7280';
}

// 显示宝可梦详情
function showPokemonDetails(pokemon, key) {
    gameState.selectedPokemon = pokemon;
    
    elements.modalTitle.textContent = pokemon.name;
    elements.modalContent.innerHTML = createPokemonDetailContent(pokemon, key);
    elements.pokemonModal.classList.add('active');
    
    // 添加动画
    anime({
        targets: '.modal-content',
        scale: [0.8, 1],
        duration: 300,
        easing: 'easeOutExpo'
    });
}

// 创建宝可梦详情内容
function createPokemonDetailContent(pokemon, key) {
    const maxStat = Math.max(pokemon.attack, pokemon.defense, pokemon.speed, pokemon.hp);
    
    return `
        <div class="text-center mb-6">
            <div class="w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span class="text-6xl">${pokemon.emoji}</span>
            </div>
            <div class="type-badge ${pokemon.type} mb-4">${getTypeName(pokemon.type)}</div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div class="bg-slate-800 rounded-lg p-3">
                <div class="text-slate-400 mb-1">身高</div>
                <div class="text-white font-semibold">${pokemon.height}m</div>
            </div>
            <div class="bg-slate-800 rounded-lg p-3">
                <div class="text-slate-400 mb-1">体重</div>
                <div class="text-white font-semibold">${pokemon.weight}kg</div>
            </div>
        </div>
        
        <div class="mb-6">
            <h4 class="text-lg font-semibold text-white mb-3">能力值</h4>
            <div class="space-y-3">
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>HP</span>
                        <span>${pokemon.hp}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.hp / maxStat) * 100}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>攻击</span>
                        <span>${pokemon.attack}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.attack / maxStat) * 100}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>防御</span>
                        <span>${pokemon.defense}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.defense / maxStat) * 100}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-slate-300 mb-1">
                        <span>速度</span>
                        <span>${pokemon.speed}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${(pokemon.speed / maxStat) * 100}%"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mb-6">
            <h4 class="text-lg font-semibold text-white mb-3">描述</h4>
            <p class="text-slate-300 text-sm leading-relaxed">${pokemon.description}</p>
        </div>
        
        <div>
            <h4 class="text-lg font-semibold text-white mb-3">技能列表</h4>
            <div class="space-y-2">
                ${pokemon.skills.map(skill => `
                    <div class="bg-slate-800 rounded-lg p-3">
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-semibold text-white">${skill.name}</div>
                            <div class="type-badge ${skill.type} text-xs">${getTypeName(skill.type)}</div>
                        </div>
                        <div class="text-xs text-slate-400 grid grid-cols-2 gap-2 mb-2">
                            <div>威力: ${skill.power || '-'}</div>
                            <div>命中: ${skill.accuracy}%</div>
                        </div>
                        <div class="text-xs text-slate-300">${skill.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 获取属性中文名
function getTypeName(type) {
    const typeNames = {
        fire: '火系',
        water: '水系',
        electric: '电系',
        grass: '草系',
        psychic: '超能',
        dragon: '龙系',
        ice: '冰系',
        fighting: '格斗',
        poison: '毒系',
        ground: '地面',
        flying: '飞行',
        bug: '虫系',
        rock: '岩石',
        ghost: '幽灵',
        dark: '恶系',
        steel: '钢系',
        fairy: '妖精',
        normal: '一般'
    };
    return typeNames[type] || type;
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索输入
    elements.searchInput.addEventListener('input', (e) => {
        gameState.searchQuery = e.target.value;
        renderPokemonGrid();
    });
    
    // 类型筛选
    elements.typeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            elements.typeFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            gameState.filteredType = filter.dataset.type;
            renderPokemonGrid();
        });
    });
    
    // 模态框关闭
    elements.closeModal.addEventListener('click', closeModal);
    elements.pokemonModal.addEventListener('click', (e) => {
        if (e.target === elements.pokemonModal) {
            closeModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 关闭模态框
function closeModal() {
    elements.pokemonModal.classList.remove('active');
    gameState.selectedPokemon = null;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // 添加页面加载动画
    anime({
        targets: '.pokedex-bg > div',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
    });
});

// 导出函数供其他模块使用
window.PokedexSystem = {
    pokemonData,
    types,
    typeMatchups,
    gameState,
    initGame,
    renderPokemonGrid,
    updateCalculatorResult
};