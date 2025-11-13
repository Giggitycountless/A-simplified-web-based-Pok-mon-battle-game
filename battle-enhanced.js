/**
 * 宝可梦对战系统增强版 - 集成新的战斗系统与UI
 * 支持使用battleSystem.js核心模块或保持原有简化版本
 */

// ═══════════════════════════════════════════════════════════════════════════
// 旧系统数据（保留兼容性）
// ═══════════════════════════════════════════════════════════════════════════

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
        skills: [
            { name: '十万伏特', type: 'electric', power: 90, accuracy: 100 },
            { name: '电光一闪', type: 'electric', power: 40, accuracy: 100 },
            { name: '铁尾', type: 'steel', power: 100, accuracy: 75 },
            { name: '电磁波', type: 'electric', power: 0, accuracy: 90 }
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
        skills: [
            { name: '喷射火焰', type: 'fire', power: 90, accuracy: 100 },
            { name: '龙之怒', type: 'dragon', power: 80, accuracy: 100 },
            { name: '翅膀攻击', type: 'flying', power: 60, accuracy: 100 },
            { name: '烟幕', type: 'fire', power: 0, accuracy: 100 }
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
        skills: [
            { name: '水炮', type: 'water', power: 110, accuracy: 80 },
            { name: '冰冻光束', type: 'ice', power: 90, accuracy: 100 },
            { name: '火箭头锤', type: 'normal', power: 70, accuracy: 100 },
            { name: '缩入壳中', type: 'water', power: 0, accuracy: 100 }
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
        skills: [
            { name: '阳光烈焰', type: 'grass', power: 120, accuracy: 100 },
            { name: '污泥炸弹', type: 'poison', power: 90, accuracy: 100 },
            { name: '催眠粉', type: 'grass', power: 0, accuracy: 75 },
            { name: '生长', type: 'normal', power: 0, accuracy: 100 }
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
        skills: [
            { name: '精神强念', type: 'psychic', power: 90, accuracy: 100 },
            { name: '影子球', type: 'ghost', power: 80, accuracy: 100 },
            { name: '自我再生', type: 'psychic', power: 0, accuracy: 100, effect: { type: 'recover', amount: 0.5 } },
            { name: '幻象术', type: 'psychic', power: 70, accuracy: 100 }
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
        skills: [
            { name: '龙之怒', type: 'dragon', power: 80, accuracy: 100 },
            { name: '冰冻光束', type: 'ice', power: 90, accuracy: 100 },
            { name: '地震', type: 'ground', power: 100, accuracy: 100 },
            { name: '神速', type: 'normal', power: 80, accuracy: 100 }
        ]
    }
};

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

// ========== 技能效果处理器表 ==========
const effectHandlers = {
    // 回复（按最大HP的比例或固定量）
    recover: ({ attacker, defender, skill }) => {
        const eff = skill.effect || {};
        const amount = typeof eff.amount === 'number' ? eff.amount : (typeof eff.percent === 'number' ? eff.percent : null);
        const healPercent = amount && amount <= 1 ? amount : (amount ? null : (eff.percent || 0.5));
        // 如果是小于等于1则按比例，否则如果是大于1则当作固定值
        let healAmount = 0;
        if (typeof eff.amount === 'number' && eff.amount > 1) {
            healAmount = Math.floor(eff.amount);
        } else {
            const base = attacker.maxHp || attacker.hp || 0;
            healAmount = Math.max(1, Math.floor(base * (healPercent || 0.5)));
        }

        const prevHp = attacker.hp || 0;
        attacker.hp = Math.min(attacker.maxHp || attacker.hp || prevHp, prevHp + healAmount);
        updateHealthDisplay(attacker === gameState.playerPokemon ? 'player' : 'enemy');
        const actualHealed = attacker.hp - prevHp;
        if (actualHealed > 0) {
            addBattleLog(`💚 ${attacker.name} 回复了 ${actualHealed} 点 HP！`);
            showDamageText(`+${actualHealed}`, attacker === gameState.playerPokemon ? 'player' : 'enemy', false);
        } else {
            addBattleLog(`ℹ️ ${attacker.name} 的 HP 已满，未能恢复 HP。`);
        }
    },

    // 状态类（占位）：如催眠、麻痹等
    status: ({ attacker, defender, skill }) => {
        const eff = skill.effect || {};
        const status = eff.status || eff.name || 'status';
        // 简单实现：标记在目标对象上
        defender.status = defender.status || {};
        defender.status[status] = true;
        addBattleLog(`😴 ${defender.name} 受到状态：${status}`);
    },

    // 增益/降低（占位）：修改临时属性
    buff: ({ attacker, defender, skill }) => {
        const eff = skill.effect || {};
        const stat = eff.stat || 'attack';
        const amount = eff.amount || eff.multiplier || 0.1; // 0.1 表示 +10%
        attacker._buffs = attacker._buffs || {};
        attacker._buffs[stat] = (attacker._buffs[stat] || 0) + amount;
        addBattleLog(`🔺 ${attacker.name} 的 ${stat} 提高了 ${Math.round(amount * 100)}%（临时）。`);
    }
};

// 游戏状态
let gameState = {
    playerPokemon: null,
    enemyPokemon: null,
    currentTurn: 'player',
    battleActive: false,
    autoBattle: false
};

// DOM元素（延迟初始化至 DOMContentLoaded）
let elements = {};

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
        resetBattleBtn: document.getElementById('reset-battle'),
        battleStatus: document.getElementById('battle-status')
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// 初始化游戏
// ═══════════════════════════════════════════════════════════════════════════

function initGame() {
    renderPokemonLists();
    setupEventListeners();
    addBattleLog('欢迎来到宝可梦对战模拟器！请选择你的宝可梦开始对战。');
}

// 渲染宝可梦列表
function renderPokemonLists() {
    // 渲染我方宝可梦列表
    if (elements.playerPokemonList) {
        elements.playerPokemonList.innerHTML = '';
        Object.keys(pokemonData).forEach(key => {
            const pokemon = pokemonData[key];
            const card = createPokemonCard(pokemon, key, 'player');
            elements.playerPokemonList.appendChild(card);
        });
    }

    // 渲染敌方宝可梦列表
    if (elements.enemyPokemonList) {
        elements.enemyPokemonList.innerHTML = '';
        Object.keys(pokemonData).forEach(key => {
            const pokemon = pokemonData[key];
            const card = createPokemonCard(pokemon, key, 'enemy');
            elements.enemyPokemonList.appendChild(card);
        });
    }
}

// 创建宝可梦卡片
function createPokemonCard(pokemon, key, side) {
    const card = document.createElement('div');
    card.className = `pokemon-card rounded-xl p-4 cursor-pointer ${side === 'player' ? 'player-pokemon' : 'enemy-pokemon'}`;
    card.dataset.pokemon = key;
    
    card.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span class="text-2xl">${pokemon.emoji}</span>
            </div>
            <div class="orbitron font-bold text-white mb-2">${pokemon.name}</div>
            <div class="type-badge ${pokemon.type} mb-3">${getTypeName(pokemon.type)}</div>
            <div class="text-xs text-slate-300 space-y-1">
                <div>攻击: ${pokemon.attack}</div>
                <div>防御: ${pokemon.defense}</div>
                <div>速度: ${pokemon.speed}</div>
            </div>
        </div>
    `;
    
    return card;
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
    // 我方宝可梦选择
    if (elements.playerPokemonList) {
        elements.playerPokemonList.addEventListener('click', (e) => {
            const card = e.target.closest('.player-pokemon');
            if (card) {
                selectPokemon(card.dataset.pokemon, 'player');
            }
        });
    }

    // 敌方宝可梦选择
    if (elements.enemyPokemonList) {
        elements.enemyPokemonList.addEventListener('click', (e) => {
            const card = e.target.closest('.enemy-pokemon');
            if (card) {
                selectPokemon(card.dataset.pokemon, 'enemy');
            }
        });
    }

    // 自动对战按钮
    if (elements.autoBattleBtn) {
        elements.autoBattleBtn.addEventListener('click', toggleAutoBattle);
    }

    // 重置对战按钮
    if (elements.resetBattleBtn) {
        elements.resetBattleBtn.addEventListener('click', resetBattle);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 宝可梦选择
// ═══════════════════════════════════════════════════════════════════════════

function selectPokemon(pokemonKey, side) {
    const pokemon = { ...pokemonData[pokemonKey] }; // 创建副本
    
    if (side === 'player') {
        gameState.playerPokemon = pokemon;
        updatePokemonDisplay(pokemon, 'player');
        highlightSelectedCard('.player-pokemon', pokemonKey);
        addBattleLog(`✨ 你选择了 ${pokemon.name}！`);
        // 更新属性相克网络
        updateTypeMatchupDisplay();
    } else {
        gameState.enemyPokemon = pokemon;
        updatePokemonDisplay(pokemon, 'enemy');
        highlightSelectedCard('.enemy-pokemon', pokemonKey);
        addBattleLog(`🔴 对手派出了 ${pokemon.name}！`);
    }

    // 检查是否可以开始对战
    if (gameState.playerPokemon && gameState.enemyPokemon) {
        startBattle();
    }
}

// 高亮选中的卡片
function highlightSelectedCard(selector, pokemonKey) {
    document.querySelectorAll(selector).forEach(card => {
        card.classList.remove('selected');
    });
    const targetCard = document.querySelector(`${selector}[data-pokemon="${pokemonKey}"]`);
    if (targetCard) {
        targetCard.classList.add('selected');
    }
}

// 更新宝可梦显示
function updatePokemonDisplay(pokemon, side) {
    const display = side === 'player' ? elements.playerPokemonDisplay : elements.enemyPokemonDisplay;
    
    display.innerHTML = `
        <div class="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center poke-icon">
            <span class="text-3xl">${pokemon.emoji}</span>
        </div>
        <div class="type-badge ${pokemon.type} mb-2 poke-type">${getTypeName(pokemon.type)}</div>
        <div class="text-sm text-slate-300 mb-2 poke-name">${pokemon.name}</div>
        <div class="health-bar w-32 h-4 mx-auto">
            <div class="health-fill" style="width: 100%"></div>
        </div>
        <div class="text-xs text-slate-400 mt-1 poke-hp">HP: ${pokemon.hp}/${pokemon.maxHp}</div>
    `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 对战系统
// ═══════════════════════════════════════════════════════════════════════════

function startBattle() {
    gameState.battleActive = true;
    gameState.currentTurn = 'player';
    
    addBattleLog('⚔️ 对战开始！');
    addBattleLog(`📊 我方: ${gameState.playerPokemon.name} VS 敌方: ${gameState.enemyPokemon.name}`);
    
    // 更新VS状态
    if (elements.battleStatus) {
        elements.battleStatus.textContent = '对战进行中...';
    }
    
    // 显示技能面板
    if (elements.skillsPanel) {
        elements.skillsPanel.style.display = 'block';
    }
    renderSkillButtons();
    
    // 动画效果
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.battle-arena',
            scale: [0.95, 1],
            duration: 500,
            easing: 'easeOutExpo'
        });
    }
}

// 渲染技能按钮
function renderSkillButtons() {
    if (!elements.skillButtons || !gameState.playerPokemon) return;
    
    const pokemon = gameState.playerPokemon;
    elements.skillButtons.innerHTML = '';
    
    pokemon.skills.forEach((skill, index) => {
        const button = document.createElement('button');
        button.className = `skill-button ${skill.type}`;
        button.innerHTML = `
            <div class="font-bold">${skill.name}</div>
            <div class="text-xs text-slate-400 mt-1">
                威力: ${skill.power} | 命中: ${skill.accuracy}%
            </div>
        `;
        button.addEventListener('click', () => useSkill(skill));
        elements.skillButtons.appendChild(button);
    });
}

// 使用技能
function useSkill(skill) {
    if (!gameState.battleActive || gameState.currentTurn !== 'player') return;
    
    const attacker = gameState.playerPokemon;
    const defender = gameState.enemyPokemon;
    
    performAttack(attacker, defender, skill, 'player');
    
    // 检查战斗是否结束
    if (defender.hp <= 0) {
        endBattle('player');
        return;
    }
    
    // 禁用按钮
    if (elements.skillButtons) {
        Array.from(elements.skillButtons.children).forEach(btn => {
            btn.disabled = true;
        });
    }
    
    // 敌方回合
    if (!gameState.autoBattle) {
        setTimeout(() => {
            enemyTurn();
        }, 1500);
    }
}

// 敌方回合
function enemyTurn() {
    if (!gameState.battleActive) return;
    
    gameState.currentTurn = 'enemy';
    
    const attacker = gameState.enemyPokemon;
    const defender = gameState.playerPokemon;
    
    // 随机选择技能
    const randomSkill = attacker.skills[Math.floor(Math.random() * attacker.skills.length)];
    
    setTimeout(() => {
        performAttack(attacker, defender, randomSkill, 'enemy');
        
        // 检查战斗是否结束
        if (defender.hp <= 0) {
            endBattle('enemy');
            return;
        }
        
        // 回到玩家回合并启用按钮
        gameState.currentTurn = 'player';
        if (elements.skillButtons) {
            Array.from(elements.skillButtons.children).forEach(btn => {
                btn.disabled = false;
            });
        }
        
        // 继续自动对战
        if (gameState.autoBattle) {
            setTimeout(() => {
                const playerSkill = gameState.playerPokemon.skills[Math.floor(Math.random() * gameState.playerPokemon.skills.length)];
                useSkill(playerSkill);
            }, 1000);
        }
    }, 1500);
}

// 执行攻击
function performAttack(attacker, defender, skill, attackerSide) {
    const isHit = Math.random() * 100 <= skill.accuracy;
    
    if (!isHit) {
        addBattleLog(`❌ ${attacker.name} 使用了 ${skill.name}，但是没有命中！`);
        showDamageText('Miss', defender === gameState.playerPokemon ? 'player' : 'enemy', false);
        return;
    }
    
    let damage = 0;
    if (skill.power > 0) {
        // 基础伤害计算
        damage = Math.floor((attacker.attack * skill.power) / (defender.defense * 2)) + 10;
        
        // 属性相克计算
        const multiplier = calculateTypeMultiplier(skill.type, defender.type);
        damage = Math.floor(damage * multiplier);
        
        // 随机波动 (±10%)
        const randomFactor = 0.9 + Math.random() * 0.2;
        damage = Math.floor(damage * randomFactor);
    }
    
    // 应用伤害/效果
    if (skill.power > 0) {
        defender.hp = Math.max(0, defender.hp - damage);
        updateHealthDisplay(defender === gameState.playerPokemon ? 'player' : 'enemy');
        
        addBattleLog(`⚡ ${attacker.name} 使用了 ${skill.name}！`);
        
        if (damage > 0) {
            const multiplier = calculateTypeMultiplier(skill.type, defender.type);
            if (multiplier > 1) {
                addBattleLog('🎯 效果绝佳！');
            } else if (multiplier < 1) {
                addBattleLog('😐 效果不好...');
            }
            addBattleLog(`💥 ${defender.name} 受到了 ${damage} 点伤害！`);
            showDamageText(damage, defender === gameState.playerPokemon ? 'player' : 'enemy', true);
        }
    } else {
        // 特殊效果（技能没有直接伤害，如回复、状态、增益等）
        addBattleLog(`✨ ${attacker.name} 使用了 ${skill.name}！`);

        // 支持结构化 effect: { type: 'recover'|'status'|'buff', ... }
        if (skill.effect && typeof skill.effect === 'object') {
            const handler = effectHandlers[skill.effect.type];
            if (handler) {
                try {
                    handler({ attacker, defender, skill, attackerSide });
                } catch (e) {
                    console.warn('effect handler error', e);
                    addBattleLog(`⚠️ 效果执行出错：${e.message}`);
                }
            } else {
                addBattleLog(`ℹ️ 未知效果类型：${skill.effect.type}`);
            }
        } else {
            // 兼容旧字符串形式（向后兼容）
            if (skill.effect === 'recover') {
                // 回退到基础回复行为（50%）
                const healPercent = skill.healPercent || skill.amount || 0.5;
                const healAmount = Math.max(1, Math.floor((attacker.maxHp || attacker.hp) * healPercent));
                const prevHp = attacker.hp;
                attacker.hp = Math.min(attacker.maxHp || attacker.hp, (attacker.hp || 0) + healAmount);
                updateHealthDisplay(attacker === gameState.playerPokemon ? 'player' : 'enemy');
                const actualHealed = attacker.hp - prevHp;
                if (actualHealed > 0) {
                    addBattleLog(`💚 ${attacker.name} 回复了 ${actualHealed} 点 HP！`);
                    showDamageText(`+${actualHealed}`, attacker === gameState.playerPokemon ? 'player' : 'enemy', false);
                } else {
                    addBattleLog(`ℹ️ ${attacker.name} 的 HP 已满，未能恢复 HP。`);
                }
            } else {
                addBattleLog(`${defender.name} 受到了特殊效果影响！`);
            }
        }
    }
    
    // 动画效果
    animateAttack(attackerSide);
}

// 计算属性相克倍数
function calculateTypeMultiplier(attackType, defenderType) {
    if (!typeMatchups[attackType] || !typeMatchups[defenderType]) {
        return 1;
    }
    
    if (typeMatchups[attackType].strong.includes(defenderType)) {
        return 2;
    } else if (typeMatchups[attackType].weak.includes(defenderType)) {
        return 0.5;
    }
    
    return 1;
}

// 更新血量显示
function updateHealthDisplay(side) {
    const pokemon = side === 'player' ? gameState.playerPokemon : gameState.enemyPokemon;
    if (!pokemon) return;
    
    const healthPercentage = (pokemon.hp / pokemon.maxHp) * 100;
    
    const display = side === 'player' ? elements.playerPokemonDisplay : elements.enemyPokemonDisplay;
    if (!display) return;
    
    const healthBar = display.querySelector('.health-fill');
    const hpText = display.querySelector('.poke-hp');
    
    if (healthBar) {
        healthBar.style.width = healthPercentage + '%';
        
        // 根据血量改变颜色
        if (healthPercentage <= 25) {
            healthBar.classList.add('low');
            healthBar.classList.remove('medium');
        } else if (healthPercentage <= 50) {
            healthBar.classList.add('medium');
            healthBar.classList.remove('low');
        } else {
            healthBar.classList.remove('low', 'medium');
        }
    }
    
    if (hpText) {
        hpText.textContent = `HP: ${pokemon.hp}/${pokemon.maxHp}`;
    }
}

// 显示伤害文字
function showDamageText(damage, side, isDamage) {
    const display = side === 'player' ? elements.playerPokemonDisplay : elements.enemyPokemonDisplay;
    if (!display) return;
    
    const damageElement = document.createElement('div');
    damageElement.className = isDamage ? 'damage-text' : 'heal-text';
    damageElement.textContent = isDamage ? `-${damage}` : damage;
    
    display.appendChild(damageElement);
    
    // 动画效果
    if (typeof anime !== 'undefined') {
        anime({
            targets: damageElement,
            translateY: [-20, -60],
            opacity: [1, 0],
            duration: 1000,
            easing: 'easeOutExpo',
            complete: () => damageElement.remove()
        });
    } else {
        // 如果没有anime.js，手动移除
        setTimeout(() => damageElement.remove(), 1000);
    }
}

// 攻击动画
function animateAttack(side) {
    const target = side === 'player' ? elements.enemyPokemonDisplay : elements.playerPokemonDisplay;
    if (!target) return;
    
    if (typeof anime !== 'undefined') {
        anime({
            targets: target,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    }
}

// 结束战斗
function endBattle(winner) {
    gameState.battleActive = false;
    gameState.autoBattle = false;
    
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
    
    // 禁用按钮
    if (elements.skillButtons) {
        Array.from(elements.skillButtons.children).forEach(btn => {
            btn.disabled = true;
        });
    }
    
    // 重置游戏状态
    setTimeout(() => {
        resetBattle();
    }, 3000);
}

// 重置战斗
function resetBattle() {
    gameState.playerPokemon = null;
    gameState.enemyPokemon = null;
    gameState.battleActive = false;
    gameState.currentTurn = 'player';
    gameState.autoBattle = false;
    
    // 重置显示
    elements.playerPokemonDisplay.innerHTML = `
        <div class="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center poke-icon">
            <span class="text-2xl">❓</span>
        </div>
        <div class="type-badge mb-2 poke-type text-xs">未选择</div>
        <div class="text-xs text-slate-300 mb-2 poke-name">请选择</div>
        <div class="health-bar w-24 h-3 mx-auto">
            <div class="health-fill" style="width: 0%"></div>
        </div>
        <div class="text-xs text-slate-400 mt-1 poke-hp">HP: 0/0</div>
    `;
    
    elements.enemyPokemonDisplay.innerHTML = `
        <div class="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center poke-icon">
            <span class="text-2xl">❓</span>
        </div>
        <div class="type-badge mb-2 poke-type text-xs">未选择</div>
        <div class="text-xs text-slate-300 mb-2 poke-name">等待对手</div>
        <div class="health-bar w-24 h-3 mx-auto">
            <div class="health-fill" style="width: 0%"></div>
        </div>
        <div class="text-xs text-slate-400 mt-1 poke-hp">HP: 0/0</div>
    `;
    
    if (elements.skillsPanel) {
        elements.skillsPanel.style.display = 'none';
    }
    
    if (elements.battleStatus) {
        elements.battleStatus.textContent = '准备开始';
    }
    
    if (elements.autoBattleBtn) {
        elements.autoBattleBtn.textContent = '▶️ 自动对战';
    }
    
    // 清除选中状态
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    addBattleLog('✨ 对战已重置，请选择宝可梦重新开始...');
}

// 切换自动对战
function toggleAutoBattle() {
    if (!gameState.battleActive) {
        addBattleLog('❌ 请先开始对战！');
        return;
    }
    
    gameState.autoBattle = !gameState.autoBattle;
    
    if (elements.autoBattleBtn) {
        elements.autoBattleBtn.textContent = gameState.autoBattle ? '⏸️ 停止自动' : '▶️ 自动对战';
    }
    
    if (gameState.autoBattle && gameState.currentTurn === 'player') {
        setTimeout(() => {
            const randomSkill = gameState.playerPokemon.skills[Math.floor(Math.random() * gameState.playerPokemon.skills.length)];
            useSkill(randomSkill);
        }, 1000);
    }
}

// 添加战斗日志
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
    
    // 限制日志数量（保留最多30条）
    while (elements.battleLog.children.length > 30) {
        elements.battleLog.removeChild(elements.battleLog.firstChild);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 属性相克网络
// ═══════════════════════════════════════════════════════════════════════════

let typeChart = null;

// 获取所有属性数据
const allTypes = [
    { id: 'fire', name: '火系', emoji: '🔥', color: '#EF4444' },
    { id: 'water', name: '水系', emoji: '💧', color: '#3B82F6' },
    { id: 'electric', name: '电系', emoji: '⚡', color: '#FBBF24' },
    { id: 'grass', name: '草系', emoji: '🌿', color: '#10B981' },
    { id: 'psychic', name: '超能', emoji: '💜', color: '#A855F7' },
    { id: 'dragon', name: '龙系', emoji: '🐉', color: '#6366F1' },
    { id: 'ice', name: '冰系', emoji: '🧊', color: '#06B6D4' },
    { id: 'fighting', name: '格斗', emoji: '👊', color: '#DC2626' },
    { id: 'poison', name: '毒系', emoji: '☠️', color: '#7C3AED' },
    { id: 'ground', name: '地面', emoji: '🌍', color: '#D97706' },
    { id: 'flying', name: '飞行', emoji: '🦅', color: '#0EA5E9' },
    { id: 'bug', name: '虫系', emoji: '🐛', color: '#22C55E' },
    { id: 'rock', name: '岩石', emoji: '🪨', color: '#78716C' },
    { id: 'ghost', name: '幽灵', emoji: '👻', color: '#7E22CE' },
    { id: 'dark', name: '恶系', emoji: '🌑', color: '#1F2937' },
    { id: 'steel', name: '钢系', emoji: '⚙️', color: '#60A5FA' },
    { id: 'fairy', name: '妖精', emoji: '🧚', color: '#EC4899' },
    { id: 'normal', name: '一般', emoji: '⭐', color: '#9CA3AF' }
];

// 初始化属性相克网络
function initTypeMatchupChart() {
    const typeChartElement = document.getElementById('type-chart');
    if (!typeChartElement) return;
    
    if (typeChart) {
        typeChart.dispose();
    }
    
    typeChart = echarts.init(typeChartElement);
}

// 更新属性相克网络显示
function updateTypeMatchupDisplay() {
    if (!gameState.playerPokemon) {
        // 没有选择宝可梦时显示提示信息
        updateTypeMatchupText('未选择宝可梦');
        return;
    }
    
    const pokemonType = gameState.playerPokemon.type;
    const matchupData = typeMatchups[pokemonType];
    
    if (!matchupData) {
        updateTypeMatchupText('属性数据错误');
        return;
    }
    
    // 更新文字说明
    updateTypeMatchupText(pokemonType, matchupData);
    
    // 更新图表
    updateTypeMatchupChart(pokemonType, matchupData);
}

// 更新属性相克文字说明
function updateTypeMatchupText(pokemonType, matchupData) {
    const textElement = document.getElementById('type-matchup-text');
    if (!textElement) return;
    
    if (!matchupData) {
        textElement.innerHTML = `<div class="text-slate-500">${pokemonType}</div>`;
        return;
    }
    
    const typeName = getTypeName(pokemonType);
    
    // 获取克制的属性
    const strongAgainst = matchupData.strong
        .map(type => {
            const typeData = allTypes.find(t => t.id === type);
            return `<span class="inline-block bg-slate-700 px-2 py-1 rounded text-xs mr-1 mb-1">${typeData ? typeData.emoji + ' ' + typeData.name : type}</span>`;
        })
        .join('');
    
    // 获取被克制的属性
    const weakAgainst = matchupData.weak
        .map(type => {
            const typeData = allTypes.find(t => t.id === type);
            return `<span class="inline-block bg-slate-700 px-2 py-1 rounded text-xs mr-1 mb-1">${typeData ? typeData.emoji + ' ' + typeData.name : type}</span>`;
        })
        .join('');
    
    textElement.innerHTML = `
        <div class="mb-3">
            <div class="text-slate-400 text-xs mb-1">🎯 ${typeName} 克制:</div>
            <div class="flex flex-wrap">${strongAgainst || '<span class="text-slate-500">无</span>'}</div>
        </div>
        <div>
            <div class="text-slate-400 text-xs mb-1">⚠️ ${typeName} 被克制:</div>
            <div class="flex flex-wrap">${weakAgainst || '<span class="text-slate-500">无</span>'}</div>
        </div>
    `;
}

// 更新属性相克图表
function updateTypeMatchupChart(pokemonType, matchupData) {
    if (!typeChart) {
        initTypeMatchupChart();
    }
    
    if (!typeChart) return;
    
    const chartData = [];
    
    // 遍历所有属性，计算对防御方的克制关系
    allTypes.forEach(type => {
        const multiplier = calculateTypeMultiplier(type.id, pokemonType);
        let effectiveness = '中立';
        let color = '#6B7280';
        
        if (multiplier === 2) {
            effectiveness = '克制';
            color = '#EF4444';
        } else if (multiplier === 0.5) {
            effectiveness = '被克制';
            color = '#10B981';
        }
        
        chartData.push({
            name: type.name,
            value: multiplier,
            itemStyle: { color: color },
            effectiveness: effectiveness
        });
    });
    
    const option = {
        title: {
            text: `${getTypeName(pokemonType)} 属性对战分析`,
            textStyle: {
                color: '#E5E7EB',
                fontSize: 12,
                fontWeight: 500
            },
            left: 'center',
            top: 5
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.data) {
                    return `${params.data.name}: ${params.data.effectiveness} (${params.data.value}×)`;
                }
                return '';
            },
            backgroundColor: '#1E293B',
            borderColor: '#475569',
            textStyle: { color: '#E5E7EB' }
        },
        series: [{
            type: 'pie',
            radius: ['0%', '65%'],
            center: ['50%', '55%'],
            data: chartData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(255, 255, 255, 0.3)'
                }
            },
            label: {
                color: '#E5E7EB',
                fontSize: 9,
                formatter: '{b}\n{c}×'
            }
        }]
    };
    
    typeChart.setOption(option);
}

// ═══════════════════════════════════════════════════════════════════════════
// 页面加载
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initElements();  // 初始化 DOM 元素引用
    initGame();
    initTypeMatchupChart();
    
    // 添加页面加载动画
    if (typeof anime !== 'undefined') {
        const battleBg = document.querySelector('.battle-bg');
        if (battleBg) {
            anime({
                targets: battleBg,
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo'
            });
        }
    }
});

// 导出函数供其他模块使用
window.BattleSystem = {
    pokemonData,
    typeMatchups,
    gameState,
    initGame,
    selectPokemon,
    useSkill,
    addBattleLog,
    performAttack,
    calculateTypeMultiplier
};