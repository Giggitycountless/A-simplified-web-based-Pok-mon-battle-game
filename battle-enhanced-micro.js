/**
 * 宝可梦对战系统 - 微回合调度器集成版
 * 基于事件驱动的现代化战斗系统
 *
 * 数据依赖：
 * - data/pokemon.js: 宝可梦数据（pokemonData）
 * - data/types.js: 属性系统数据（typeMatchups, typeNames, typeColors）
 *
 * 请确保在 HTML 中先加载数据文件，再加载本文件
 */

// 数据验证：确保必要的全局数据已加载
if (typeof pokemonData === 'undefined') {
    console.error('❌ 错误：pokemonData 未定义！请确保已加载 data/pokemon.js');
}
if (typeof typeMatchups === 'undefined') {
    console.error('❌ 错误：typeMatchups 未定义！请确保已加载 data/types.js');
}
if (typeof typeNames === 'undefined') {
    console.error('❌ 错误：typeNames 未定义！请确保已加载 data/types.js');
}
if (typeof typeColors === 'undefined') {
    console.error('❌ 错误：typeColors 未定义！请确保已加载 data/types.js');
}

// 游戏状态（简化版）
let gameState = {
    playerPokemon: null,
    enemyPokemon: null,
    battleActive: false,
    autoBattle: false,
    weather: null,
    field: {},
    isExecuting: false,  // 🔒 执行状态锁定标志
    lastSkillTime: 0,    // 🕐 最后一次技能执行时间戳
    currentTypeView: null // 🆕 当前查看的属性关系视图 ('player' 或 'enemy')
};

// DOM元素缓存
let elements = {};

// 微回合调度器实例
let microTurnScheduler = null;

// ==================== 初始化系统 ====================

function initElements() {
    elements = {
        playerPokemonList: document.getElementById('player-pokemon-list'),
        enemyPokemonList: document.getElementById('enemy-pokemon-list'),
        playerPokemonDisplay: document.getElementById('player-pokemon'),
        enemyPokemonDisplay: document.getElementById('enemy-pokemon'),
        skillsPanel: document.getElementById('skills-panel'),
        skillButtons: document.getElementById('skill-buttons'),
        battleLog: document.getElementById('battle-log'),
        autoBattleBtn: document.getElementById('auto-battle'),
        battleStatus: document.getElementById('battle-status')
    };
}

function initGame() {
    renderPokemonLists();
    setupEventListeners();
    
    // 初始化微回合调度器
    microTurnScheduler = new MicroTurnScheduler({
        gameState,
        addBattleLog,
        updatePokemonDisplay,
        checkBattleEnd,
        calculateDamage
    });
    
    addBattleLog('🎮 微回合调度器已启动！');
    addBattleLog('📋 请选择双方宝可梦开始对战。');
}

// ==================== UI渲染 ====================

function renderPokemonLists() {
    if (elements.playerPokemonList) {
        elements.playerPokemonList.innerHTML = '';
        Object.keys(pokemonData).forEach(key => {
            const pokemon = pokemonData[key];
            const card = createPokemonCard(pokemon, key, 'player');
            elements.playerPokemonList.appendChild(card);
        });
    }

    if (elements.enemyPokemonList) {
        elements.enemyPokemonList.innerHTML = '';
        Object.keys(pokemonData).forEach(key => {
            const pokemon = pokemonData[key];
            const card = createPokemonCard(pokemon, key, 'enemy');
            elements.enemyPokemonList.appendChild(card);
        });
    }
}

function createPokemonCard(pokemon, key, side) {
    const card = document.createElement('div');
    card.className = `pokemon-card ${side}-pokemon cursor-pointer p-2 bg-slate-700 rounded-lg border border-slate-600 hover:border-cyan-400 transition-all`;
    card.dataset.pokemon = key;
    
    const typeColors = {
        fire: 'from-red-500 to-orange-600',
        water: 'from-blue-500 to-cyan-600',
        grass: 'from-green-500 to-emerald-600',
        electric: 'from-yellow-400 to-amber-500',
        normal: 'from-gray-400 to-slate-500',
        poison: 'from-purple-500 to-violet-600'
    };
    
    const primaryType = pokemon.type[0];
    const gradient = typeColors[primaryType] || 'from-gray-500 to-gray-600';
    
    card.innerHTML = `
        <div class="w-12 h-12 bg-gradient-to-r ${gradient} rounded-full mx-auto mb-2 flex items-center justify-center">
            <span class="text-white font-bold text-xs">${pokemon.name.charAt(0)}</span>
        </div>
        <div class="text-center">
            <div class="text-xs font-semibold text-white mb-1">${pokemon.name}</div>
            <div class="text-xs text-slate-300">HP: ${pokemon.hp}</div>
            <div class="text-xs text-slate-400">速度: ${pokemon.speed}</div>
        </div>
    `;
    
    return card;
}

function renderSkillButtons() {
    if (!elements.skillButtons || !gameState.playerPokemon) return;

    elements.skillButtons.innerHTML = '';

    gameState.playerPokemon.skills.forEach((skill) => {
        const button = document.createElement('button');
        button.className = 'skill-button bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded text-xs font-semibold transition-all border border-slate-500 relative group';

        // Create skill name and info
        const skillName = document.createElement('div');
        skillName.className = 'font-bold mb-1';
        skillName.textContent = skill.name;

        const skillInfo = document.createElement('div');
        skillInfo.className = 'text-xs opacity-75';

        // Build skill info text
        let infoText = `威力: ${skill.power || '-'} | 命中: ${skill.accuracy}%`;
        if (skill.priority > 0) {
            infoText += ` | 先制+${skill.priority}`;
        }
        skillInfo.textContent = infoText;

        button.appendChild(skillName);
        button.appendChild(skillInfo);

        // Add tooltip with description
        if (skill.description) {
            const tooltip = document.createElement('div');
            tooltip.className = 'skill-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 z-50';
            tooltip.textContent = skill.description;
            button.appendChild(tooltip);
        }

        button.onclick = () => useSkill(skill);

        const typeColor = {
            fire: 'border-red-500',
            water: 'border-blue-500',
            grass: 'border-green-500',
            electric: 'border-yellow-500',
            normal: 'border-gray-500',
            poison: 'border-purple-500',
            ground: 'border-yellow-700',
            ice: 'border-cyan-400'
        }[skill.type] || 'border-gray-500';

        button.classList.add(typeColor);
        elements.skillButtons.appendChild(button);
    });
}

// ==================== 事件处理 ====================

function setupEventListeners() {
    if (elements.playerPokemonList) {
        elements.playerPokemonList.addEventListener('click', (e) => {
            const card = e.target.closest('.player-pokemon');
            if (card) {
                selectPokemon(card.dataset.pokemon, 'player');
            }
        });
    }

    if (elements.enemyPokemonList) {
        elements.enemyPokemonList.addEventListener('click', (e) => {
            const card = e.target.closest('.enemy-pokemon');
            if (card) {
                selectPokemon(card.dataset.pokemon, 'enemy');
            }
        });
    }

    if (elements.autoBattleBtn) {
        elements.autoBattleBtn.addEventListener('click', toggleAutoBattle);
    }
}

// ==================== 游戏逻辑 ====================

function selectPokemon(pokemonId, side) {
    const pokemon = pokemonData[pokemonId];
    if (!pokemon) return;

    const pokemonInstance = {
        ...pokemon,
        maxHp: pokemon.hp,
        status: 'normal',
        statChanges: { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 }
    };

    if (side === 'player') {
        gameState.playerPokemon = pokemonInstance;
        addBattleLog(`✅ 你选择了 ${pokemon.name}！`);
    } else {
        gameState.enemyPokemon = pokemonInstance;
        addBattleLog(`🔴 对手选择了 ${pokemon.name}！`);
    }

    updatePokemonDisplay(pokemonInstance, side);
    updateSelectionUI(pokemonId, side);

    // 🆕 自动更新属性关系展示
    // 如果还没有设置当前查看的视图，默认显示刚选择的宝可梦
    if (!gameState.currentTypeView) {
        gameState.currentTypeView = side;
    }
    updateTypeRelationDisplay(gameState.currentTypeView);

    if (gameState.playerPokemon && gameState.enemyPokemon && !gameState.battleActive) {
        startBattle();
    }
}

function updateSelectionUI(pokemonId, side) {
    document.querySelectorAll(`.${side}-pokemon`).forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-pokemon="${pokemonId}"].${side}-pokemon`).classList.add('selected');
}

function startBattle() {
    gameState.battleActive = true;
    
    addBattleLog('⚔️ 对战开始！');
    addBattleLog(`📊 我方: ${gameState.playerPokemon.name} VS 敌方: ${gameState.enemyPokemon.name}`);
    
    if (elements.battleStatus) {
        elements.battleStatus.textContent = '对战进行中...';
    }
    
    if (elements.skillsPanel) {
        elements.skillsPanel.style.display = 'block';
    }
    
    renderSkillButtons();
}

async function useSkill(skill) {
    if (!gameState.battleActive) return;

    // 🔒 防重复点击保护机制
    const currentTime = Date.now();
    const timeSinceLastSkill = currentTime - gameState.lastSkillTime;

    // 防抖：300ms内不允许重复执行
    if (timeSinceLastSkill < 300) {
        console.warn('⚠️ 技能执行过快，已被防抖机制拦截');
        return;
    }

    // 执行状态锁定：如果正在执行，直接返回
    if (gameState.isExecuting) {
        console.warn('⚠️ 技能正在执行中，请勿重复点击');
        addBattleLog('⚠️ 请等待当前技能执行完毕！');
        return;
    }

    // 🔒 设置执行锁定
    gameState.isExecuting = true;
    gameState.lastSkillTime = currentTime;

    // 禁用按钮防止重复点击
    toggleSkillButtons(false);

    const playerAction = {
        type: 'skill',
        skill: skill,
        pokemon: gameState.playerPokemon,
        side: 'player'
    };

    // AI随机选择技能
    const enemySkills = gameState.enemyPokemon.skills;
    const randomSkill = enemySkills[Math.floor(Math.random() * enemySkills.length)];
    const opponentAction = {
        type: 'skill',
        skill: randomSkill,
        pokemon: gameState.enemyPokemon,
        side: 'enemy'
    };

    try {
        // 使用微回合调度器执行回合
        await microTurnScheduler.executeTurn(playerAction, opponentAction);

        // 🔓 解除执行锁定
        gameState.isExecuting = false;

        // 重新启用按钮
        if (gameState.battleActive) {
            toggleSkillButtons(true);

            // 自动对战继续
            if (gameState.autoBattle) {
                setTimeout(() => {
                    const randomPlayerSkill = gameState.playerPokemon.skills[
                        Math.floor(Math.random() * gameState.playerPokemon.skills.length)
                    ];
                    useSkill(randomPlayerSkill);
                }, 1500);
            }
        }

    } catch (error) {
        console.error('技能执行错误:', error);
        addBattleLog(`⚠️ 技能执行出错: ${error.message}`);

        // 🔓 出错时也要解除锁定
        gameState.isExecuting = false;
        toggleSkillButtons(true);
    }
}

function toggleSkillButtons(enabled) {
    if (elements.skillButtons) {
        Array.from(elements.skillButtons.children).forEach(btn => {
            btn.disabled = !enabled;

            // 🎨 增强视觉反馈和交互控制
            if (!enabled) {
                // 禁用时：添加禁用样式和阻止点击
                btn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
                btn.style.pointerEvents = 'none';
            } else {
                // 启用时：移除禁用样式
                btn.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
                btn.style.pointerEvents = 'auto';
            }
        });
    }
}

function toggleAutoBattle() {
    if (!gameState.battleActive) {
        addBattleLog('❌ 请先开始对战！');
        return;
    }
    
    gameState.autoBattle = !gameState.autoBattle;
    
    if (elements.autoBattleBtn) {
        elements.autoBattleBtn.textContent = gameState.autoBattle ? '⏸️ 停止自动' : '▶️ 自动对战';
    }
    
    if (gameState.autoBattle) {
        setTimeout(() => {
            const randomSkill = gameState.playerPokemon.skills[
                Math.floor(Math.random() * gameState.playerPokemon.skills.length)
            ];
            useSkill(randomSkill);
        }, 1000);
    }
}

// ==================== 工具函数 ====================

function updatePokemonDisplay(pokemon, side = null) {
    if (!side) {
        side = pokemon === gameState.playerPokemon ? 'player' : 'enemy';
    }

    const display = side === 'player' ? elements.playerPokemonDisplay : elements.enemyPokemonDisplay;
    if (!display) return;

    const icon = display.querySelector('.poke-icon');
    const name = display.querySelector('.poke-name');
    const type = display.querySelector('.poke-type');
    const hp = display.querySelector('.poke-hp');
    const healthFill = display.querySelector('.health-fill');
    const itemDisplay = display.querySelector('.poke-item');
    const itemName = display.querySelector('.item-name');

    if (icon) {
        const typeColors = {
            fire: 'from-red-500 to-orange-600',
            water: 'from-blue-500 to-cyan-600',
            grass: 'from-green-500 to-emerald-600',
            electric: 'from-yellow-400 to-amber-500',
            normal: 'from-gray-400 to-slate-500',
            poison: 'from-purple-500 to-violet-600'
        };

        const gradient = typeColors[pokemon.type[0]] || 'from-gray-500 to-gray-600';
        icon.className = `w-16 h-16 bg-gradient-to-r ${gradient} rounded-full mx-auto mb-2 flex items-center justify-center poke-icon`;
        icon.innerHTML = `<span class="text-xl text-white font-bold">${pokemon.name.charAt(0)}</span>`;
    }

    if (name) name.textContent = pokemon.name;
    if (type) {
        type.textContent = pokemon.type.join('/');
        type.className = `type-badge mb-1 poke-type text-xs inline-block bg-${pokemon.type[0]}`;
    }
    if (hp) hp.textContent = `HP: ${pokemon.hp}/${pokemon.maxHp}`;

    // Display held item if present
    if (itemDisplay && itemName) {
        if (pokemon.heldItem) {
            itemName.textContent = pokemon.heldItem;
            itemDisplay.style.display = 'block';
        } else {
            itemDisplay.style.display = 'none';
        }
    }

    if (healthFill) {
        const hpPercent = (pokemon.hp / pokemon.maxHp) * 100;
        healthFill.style.width = `${hpPercent}%`;

        if (hpPercent > 50) {
            healthFill.className = 'health-fill bg-green-500';
        } else if (hpPercent > 25) {
            healthFill.className = 'health-fill bg-yellow-500';
        } else {
            healthFill.className = 'health-fill bg-red-500';
        }
    }
}

function calculateDamage(attacker, defender, skill) {
    if (skill.power === 0) return 0;
    
    const level = 50;
    const attack = attacker.attack;
    const defense = defender.defense;
    const power = skill.power;
    
    // 基础伤害公式
    let damage = Math.floor(((2 * level / 5 + 2) * power * attack / defense) / 50) + 2;
    
    // 属性相克
    const effectiveness = calculateTypeMultiplier(skill.type, defender.type);
    damage = Math.floor(damage * effectiveness);
    
    // 同属性加成
    if (attacker.type.includes(skill.type)) {
        damage = Math.floor(damage * 1.5);
    }
    
    // 随机因子
    const randomFactor = 0.85 + Math.random() * 0.15;
    damage = Math.floor(damage * randomFactor);
    
    return Math.max(1, damage);
}

function calculateTypeMultiplier(attackType, defenderTypes) {
    let multiplier = 1;
    
    defenderTypes.forEach(defType => {
        if (typeMatchups[attackType] && typeMatchups[attackType][defType] !== undefined) {
            multiplier *= typeMatchups[attackType][defType];
        }
    });
    
    return multiplier;
}

function checkBattleEnd() {
    if (gameState.playerPokemon.hp <= 0) {
        endBattle('enemy');
    } else if (gameState.enemyPokemon.hp <= 0) {
        endBattle('player');
    }
}

function endBattle(winner) {
    gameState.battleActive = false;
    gameState.autoBattle = false;

    // 🔓 解除执行锁定
    gameState.isExecuting = false;

    if (winner === 'player') {
        addBattleLog('🎉 恭喜！你赢得了胜利！');
        if (elements.battleStatus) {
            elements.battleStatus.textContent = '🎉 你赢得了胜利！';
        }
    } else {
        addBattleLog('😢 很遗憾，你输了...');
        if (elements.battleStatus) {
            elements.battleStatus.textContent = '😢 你输了...';
        }
    }

    toggleSkillButtons(false);

    // 3秒后重置
    setTimeout(() => {
        resetBattle();
    }, 3000);
}

function resetBattle() {
    gameState.battleActive = false;
    gameState.autoBattle = false;
    gameState.playerPokemon = null;
    gameState.enemyPokemon = null;

    // 🔓 重置执行状态
    gameState.isExecuting = false;
    gameState.lastSkillTime = 0;
    gameState.currentTypeView = null;

    // 重置UI
    if (elements.skillsPanel) {
        elements.skillsPanel.style.display = 'none';
    }

    if (elements.battleStatus) {
        elements.battleStatus.textContent = '准备开始';
    }

    if (elements.autoBattleBtn) {
        elements.autoBattleBtn.textContent = '▶️ 自动对战';
    }

    // 🆕 清空战斗日志
    if (elements.battleLog) {
        elements.battleLog.innerHTML = '';
    }

    // 重置宝可梦显示
    resetPokemonDisplay();

    // 清除选中状态
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.classList.remove('selected');
    });

    // 🆕 重新显示欢迎信息
    addBattleLog('🎮 微回合调度器已启动！');
    addBattleLog('📋 请选择双方宝可梦开始对战。');
}

function resetPokemonDisplay() {
    [elements.playerPokemonDisplay, elements.enemyPokemonDisplay].forEach((display) => {
        if (display) {
            const icon = display.querySelector('.poke-icon');
            const name = display.querySelector('.poke-name');
            const type = display.querySelector('.poke-type');
            const hp = display.querySelector('.poke-hp');
            const healthFill = display.querySelector('.health-fill');

            if (icon) {
                icon.className = 'w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center poke-icon';
                icon.innerHTML = '<span class="text-xl">❓</span>';
            }
            if (name) name.textContent = '请选择';
            if (type) {
                type.textContent = '未选择';
                type.className = 'type-badge mb-1 poke-type text-xs inline-block';
            }
            if (hp) hp.textContent = 'HP: 0/0';
            if (healthFill) healthFill.style.width = '0%';
        }
    });

    // 隐藏属性关系区域
    document.getElementById('type-relation-section').classList.add('hidden');
}

function addBattleLog(message) {
    if (!elements.battleLog) return;
    
    const logEntry = document.createElement('div');
    logEntry.className = 'text-xs text-slate-300 mb-1 px-2 py-1 rounded hover:bg-slate-700/30 transition-colors';
    logEntry.textContent = message;
    
    elements.battleLog.appendChild(logEntry);
    
    // 自动滚动到底部
    setTimeout(() => {
        elements.battleLog.scrollTop = elements.battleLog.scrollHeight;
    }, 0);
    
    // 限制日志数量
    while (elements.battleLog.children.length > 50) {
        elements.battleLog.removeChild(elements.battleLog.firstChild);
    }
}

// ==================== 页面初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initGame();
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .selected {
            border-color: #06b6d4 !important;
            box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3);
        }

        .skill-button:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
            filter: grayscale(50%);
        }

        .skill-button.pointer-events-none {
            pointer-events: none !important;
        }

        .health-fill {
            height: 100%;
            transition: width 0.5s ease, background-color 0.3s ease;
            border-radius: 2px;
        }

        .pokemon-card:hover {
            transform: translateY(-2px);
        }

        /* 🎨 增强按钮禁用视觉效果 */
        .skill-button {
            transition: all 0.2s ease;
        }

        .skill-button:not(:disabled):hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .skill-button:not(:disabled):active {
            transform: translateY(0);
        }

        /* 技能提示框样式 */
        .skill-tooltip {
            white-space: normal;
            line-height: 1.4;
        }

        .skill-button {
            overflow: visible;
        }

        /* 🎨 属性关系展示区域样式 */
        #type-relation-section {
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 切换按钮样式 */
        #view-player-type,
        #view-enemy-type {
            transition: all 0.2s ease;
        }

        #view-player-type:hover,
        #view-enemy-type:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        /* 属性关系区域滚动条样式 */
        #type-relation-section ::-webkit-scrollbar {
            width: 6px;
        }

        #type-relation-section ::-webkit-scrollbar-track {
            background: #1e293b;
            border-radius: 3px;
        }

        #type-relation-section ::-webkit-scrollbar-thumb {
            background: #475569;
            border-radius: 3px;
        }

        #type-relation-section ::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }
    `;
    document.head.appendChild(style);
});

// ==================== 属性关系系统 ====================

/**
 * 更新属性关系展示区域
 * @param {string} side - 'player' 或 'enemy'
 */
function updateTypeRelationDisplay(side) {
    const pokemon = side === 'player' ? gameState.playerPokemon : gameState.enemyPokemon;

    if (!pokemon) {
        // 隐藏属性关系区域
        document.getElementById('type-relation-section').classList.add('hidden');
        return;
    }

    // 显示属性关系区域
    document.getElementById('type-relation-section').classList.remove('hidden');

    // 更新当前查看的宝可梦信息
    const icon = document.getElementById('current-type-icon');
    const name = document.getElementById('current-type-name');
    const types = document.getElementById('current-type-types');

    const typeColors = {
        fire: 'from-red-500 to-orange-600',
        water: 'from-blue-500 to-cyan-600',
        grass: 'from-green-500 to-emerald-600',
        electric: 'from-yellow-400 to-amber-500',
        normal: 'from-gray-400 to-slate-500',
        poison: 'from-purple-500 to-violet-600'
    };

    const gradient = typeColors[pokemon.type[0]] || 'from-gray-500 to-gray-600';
    icon.className = `w-12 h-12 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center`;
    icon.innerHTML = `<span class="text-xl text-white font-bold">${pokemon.name.charAt(0)}</span>`;

    name.textContent = pokemon.name;
    const typesText = pokemon.type.map(t => typeNames[t] || t).join(' / ');
    types.textContent = `属性：${typesText}`;

    // 计算属性关系
    const relations = calculateTypeRelations(pokemon.type);

    // 渲染攻击优势
    renderAttackAdvantages(relations.attackAdvantages);

    // 渲染防御劣势
    renderDefenseWeaknesses(relations.defenseWeaknesses);

    // 渲染防御优势
    renderDefenseResistances(relations.defenseResistances);

    // 渲染战术建议
    renderTacticalAdvice(pokemon, relations);

    // 更新按钮状态
    updateTypeViewButtons(side);
}

/**
 * 切换属性关系查看视图
 * @param {string} side - 'player' 或 'enemy'
 */
function switchTypeView(side) {
    gameState.currentTypeView = side;
    updateTypeRelationDisplay(side);
}

/**
 * 更新切换按钮状态
 */
function updateTypeViewButtons(side) {
    const playerBtn = document.getElementById('view-player-type');
    const enemyBtn = document.getElementById('view-enemy-type');

    if (side === 'player') {
        playerBtn.classList.remove('opacity-50');
        enemyBtn.classList.add('opacity-50');
    } else {
        playerBtn.classList.add('opacity-50');
        enemyBtn.classList.remove('opacity-50');
    }
}

/**
 * 计算宝可梦的属性关系
 * @param {Array} types - 宝可梦的属性数组
 * @returns {Object} 包含攻击优势、防御劣势、防御优势的对象
 */
function calculateTypeRelations(types) {
    const attackAdvantages = new Map(); // 攻击时克制的属性
    const defenseWeaknesses = new Map(); // 防御时被克制的属性
    const defenseResistances = new Map(); // 防御时抵抗的属性

    // 计算攻击优势（这个宝可梦的技能克制哪些属性）
    types.forEach(type => {
        if (typeMatchups[type]) {
            Object.entries(typeMatchups[type]).forEach(([targetType, multiplier]) => {
                if (multiplier > 1) {
                    const current = attackAdvantages.get(targetType) || 1;
                    attackAdvantages.set(targetType, current * multiplier);
                }
            });
        }
    });

    // 计算防御劣势和优势（其他属性攻击这个宝可梦的效果）
    Object.keys(typeMatchups).forEach(attackType => {
        let totalMultiplier = 1;

        types.forEach(defenseType => {
            if (typeMatchups[attackType] && typeMatchups[attackType][defenseType] !== undefined) {
                totalMultiplier *= typeMatchups[attackType][defenseType];
            }
        });

        if (totalMultiplier > 1) {
            defenseWeaknesses.set(attackType, totalMultiplier);
        } else if (totalMultiplier < 1) {
            defenseResistances.set(attackType, totalMultiplier);
        }
    });

    return {
        attackAdvantages,
        defenseWeaknesses,
        defenseResistances
    };
}

/**
 * 渲染攻击优势
 */
function renderAttackAdvantages(advantages) {
    const container = document.getElementById('attack-advantages');

    if (advantages.size === 0) {
        container.innerHTML = '<p class="text-slate-400 text-xs">无特殊攻击优势</p>';
        return;
    }

    const sorted = Array.from(advantages.entries()).sort((a, b) => b[1] - a[1]);

    container.innerHTML = sorted.map(([type, multiplier]) => {
        const typeName = typeNames[type] || type;
        const gradient = typeColors[type] || 'from-gray-500 to-gray-600';

        return `
            <div class="flex items-center justify-between bg-slate-800 rounded p-2 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center">
                        <span class="text-white text-xs font-bold">${typeName.charAt(0)}</span>
                    </div>
                    <span class="text-white text-sm">${typeName}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <span class="text-green-400 font-bold">${multiplier}×</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染防御劣势
 */
function renderDefenseWeaknesses(weaknesses) {
    const container = document.getElementById('defense-weaknesses');

    if (weaknesses.size === 0) {
        container.innerHTML = '<p class="text-slate-400 text-xs">无特殊防御劣势</p>';
        return;
    }

    const sorted = Array.from(weaknesses.entries()).sort((a, b) => b[1] - a[1]);

    container.innerHTML = sorted.map(([type, multiplier]) => {
        const typeName = typeNames[type] || type;
        const gradient = typeColors[type] || 'from-gray-500 to-gray-600';

        return `
            <div class="flex items-center justify-between bg-slate-800 rounded p-2 border border-red-500/20 hover:border-red-500/50 transition-all">
                <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center">
                        <span class="text-white text-xs font-bold">${typeName.charAt(0)}</span>
                    </div>
                    <span class="text-white text-sm">${typeName}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <span class="text-red-400 font-bold">${multiplier}×</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染防御优势
 */
function renderDefenseResistances(resistances) {
    const container = document.getElementById('defense-resistances');

    if (resistances.size === 0) {
        container.innerHTML = '<p class="text-slate-400 text-xs">无特殊防御优势</p>';
        return;
    }

    const sorted = Array.from(resistances.entries()).sort((a, b) => a[1] - b[1]);

    container.innerHTML = sorted.map(([type, multiplier]) => {
        const typeName = typeNames[type] || type;
        const gradient = typeColors[type] || 'from-gray-500 to-gray-600';

        return `
            <div class="flex items-center justify-between bg-slate-800 rounded p-2 border border-blue-500/20 hover:border-blue-500/50 transition-all">
                <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center">
                        <span class="text-white text-xs font-bold">${typeName.charAt(0)}</span>
                    </div>
                    <span class="text-white text-sm">${typeName}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <span class="text-blue-400 font-bold">${multiplier}×</span>
                    ${multiplier === 0 ? '<span class="text-xs text-blue-400">免疫</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染战术建议
 */
function renderTacticalAdvice(pokemon, relations) {
    const container = document.getElementById('tactical-advice');
    const advice = [];

    // 属性说明（对于双属性宝可梦）
    if (pokemon.type.length > 1) {
        const typeNamesStr = pokemon.type.map(t => typeNames[t] || t).join('、');
        advice.push(`<p class="text-cyan-300">📌 <strong>${pokemon.name}</strong> 拥有 <strong>${typeNamesStr}</strong> 双属性，攻击优势来自两种属性的技能</p>`);
    }

    // 攻击建议
    if (relations.attackAdvantages.size > 0) {
        const bestTargets = Array.from(relations.attackAdvantages.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type]) => typeNames[type] || type);
        advice.push(`<p>✅ <strong>优先攻击：</strong>${bestTargets.join('、')}属性的宝可梦</p>`);
    }

    // 防御建议
    if (relations.defenseWeaknesses.size > 0) {
        const threats = Array.from(relations.defenseWeaknesses.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type]) => typeNames[type] || type);
        advice.push(`<p>⚠️ <strong>小心防范：</strong>${threats.join('、')}属性的攻击</p>`);
    }

    // 抵抗建议
    if (relations.defenseResistances.size > 0) {
        const resistances = Array.from(relations.defenseResistances.entries())
            .filter(([, mult]) => mult === 0)
            .map(([type]) => typeNames[type] || type);

        if (resistances.length > 0) {
            advice.push(`<p>🛡️ <strong>完全免疫：</strong>${resistances.join('、')}属性的攻击</p>`);
        }
    }

    container.innerHTML = advice.length > 0 ? advice.join('') : '<p class="text-slate-400">暂无特殊战术建议</p>';
}

// 导出API
window.MicroBattleSystem = {
    gameState,
    microTurnScheduler,
    useSkill,
    selectPokemon,
    addBattleLog,
    updateTypeRelationDisplay,
    switchTypeView
};


