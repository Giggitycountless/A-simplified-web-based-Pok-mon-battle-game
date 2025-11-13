/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POKÉBATTLE - 宝可梦对战系统核心模块
 * Battle System Architecture
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 核心组成部分：
 * ① Pokédex System - 宝可梦数据库
 * ② Type System - 属性系统（18种属性及相克表）
 * ③ Move System - 招式系统
 * ④ Ability / Item System - 特性与道具系统
 * ⑤ Status System - 状态系统
 * ⑥ Pokemon Class - 宝可梦个体对象
 * ⑦ BattleField - 战场状态
 * ⑧ Action - 回合行动
 * ⑨ BattleStateManager - 核心战斗管理器
 * ⑩ AI Engine - 人工智能决策引擎
 */

// ═══════════════════════════════════════════════════════════════════════════
// ① POKÉDEX SYSTEM - 宝可梦基础数据库
// ═══════════════════════════════════════════════════════════════════════════

const POKEDEX = {
    // 喷火龙 - 火/飞行系
    6: {
        id: 6,
        name: '喷火龙',
        type: ['fire', 'flying'],
        baseStats: {
            hp: 78,
            atk: 84,
            def: 78,
            spAtk: 109,
            spDef: 85,
            spe: 100
        },
        abilities: {
            normal: 'blaze', // 主要特性：火焰身躯
            hidden: 'solarPower' // 隐藏特性：太阳之力
        },
        movePool: ['flamethrower', 'dragonClaw', 'roost', 'earthquake', 'swordsDance'],
        weight: 90.5,
        height: 1.7
    },
    // 水箭龟 - 水系
    9: {
        id: 9,
        name: '水箭龟',
        type: ['water'],
        baseStats: {
            hp: 79,
            atk: 83,
            def: 100,
            spAtk: 83,
            spDef: 100,
            spe: 78
        },
        abilities: {
            normal: 'torrent', // 主要特性：激流
            hidden: 'rainDish' // 隐藏特性：雨碟
        },
        movePool: ['hydropump', 'iceBeam', 'earthquake', 'protect', 'scald'],
        weight: 85.3,
        height: 1.6
    },
    // 皮卡丘 - 电系
    25: {
        id: 25,
        name: '皮卡丘',
        type: ['electric'],
        baseStats: {
            hp: 35,
            atk: 55,
            def: 40,
            spAtk: 50,
            spDef: 50,
            spe: 90
        },
        abilities: {
            normal: 'static', // 主要特性：静电
            hidden: 'lightningRod' // 隐藏特性：避雷针
        },
        movePool: ['thunderbolt', 'quickAttack', 'thunder', 'playTough', 'irontail'],
        weight: 6.0,
        height: 0.4
    },
    // 妙蛙种子 - 草/毒系
    1: {
        id: 1,
        name: '妙蛙种子',
        type: ['grass', 'poison'],
        baseStats: {
            hp: 45,
            atk: 49,
            def: 49,
            spAtk: 65,
            spDef: 65,
            spe: 45
        },
        abilities: {
            normal: 'overgrow', // 主要特性：茂盛
            hidden: 'chlorophyll' // 隐藏特性：叶绿素
        },
        movePool: ['razorLeaf', 'leechSeed', 'synthesis', 'sludgeBomb', 'growthRangeAttack'],
        weight: 6.9,
        height: 0.7
    },
    // 超梦 - 超能力系
    150: {
        id: 150,
        name: '超梦',
        type: ['psychic'],
        baseStats: {
            hp: 106,
            atk: 110,
            def: 90,
            spAtk: 154,
            spDef: 90,
            spe: 130
        },
        abilities: {
            normal: 'pressure', // 主要特性：压迫感
            hidden: 'unaware' // 隐藏特性：浑然一体
        },
        movePool: ['psychic', 'iceBeam', 'fireBlast', 'thunderbolt', 'recover'],
        weight: 122.0,
        height: 2.0
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ② TYPE SYSTEM - 属性系统（18种属性）
// ═══════════════════════════════════════════════════════════════════════════

const TYPE_MATCHUP = {
    // 键：攻击方属性，值：{克制: [], 被克制: [], 抗性: []}
    fire: {
        superEffectiveAgainst: ['grass', 'ice', 'bug', 'steel'],
        weakTo: ['water', 'ground', 'rock'],
        resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy']
    },
    water: {
        superEffectiveAgainst: ['fire', 'ground', 'rock'],
        weakTo: ['electric', 'grass'],
        resistantTo: ['steel', 'fire', 'water', 'ice']
    },
    electric: {
        superEffectiveAgainst: ['water', 'flying'],
        weakTo: ['ground'],
        resistantTo: ['electric', 'flying', 'steel']
    },
    grass: {
        superEffectiveAgainst: ['water', 'ground', 'rock'],
        weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
        resistantTo: ['ground', 'water', 'grass', 'electric']
    },
    ice: {
        superEffectiveAgainst: ['flying', 'ground', 'grass', 'dragon'],
        weakTo: ['fire', 'fighting', 'rock', 'steel'],
        resistantTo: ['ice']
    },
    fighting: {
        superEffectiveAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
        weakTo: ['flying', 'psychic', 'fairy'],
        resistantTo: ['rock', 'bug', 'dark']
    },
    poison: {
        superEffectiveAgainst: ['grass', 'fairy'],
        weakTo: ['ground', 'psychic'],
        resistantTo: ['fighting', 'poison', 'bug', 'grass']
    },
    ground: {
        superEffectiveAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
        weakTo: ['water', 'grass', 'ice'],
        resistantTo: ['poison', 'rock']
    },
    flying: {
        superEffectiveAgainst: ['fighting', 'bug', 'grass'],
        weakTo: ['electric', 'ice', 'rock'],
        resistantTo: ['fighting', 'bug', 'grass']
    },
    psychic: {
        superEffectiveAgainst: ['fighting', 'poison'],
        weakTo: ['bug', 'ghost', 'dark'],
        resistantTo: ['fighting', 'psychic']
    },
    bug: {
        superEffectiveAgainst: ['grass', 'psychic', 'dark'],
        weakTo: ['fire', 'flying', 'rock'],
        resistantTo: ['fighting', 'ground', 'grass']
    },
    rock: {
        superEffectiveAgainst: ['flying', 'bug', 'fire', 'ice'],
        weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
        resistantTo: ['normal', 'flying', 'poison', 'fire']
    },
    ghost: {
        superEffectiveAgainst: ['ghost', 'psychic'],
        weakTo: ['ghost', 'dark'],
        resistantTo: ['poison', 'bug']
    },
    dragon: {
        superEffectiveAgainst: ['dragon'],
        weakTo: ['ice', 'dragon', 'fairy'],
        resistantTo: ['fire', 'water', 'grass', 'electric']
    },
    dark: {
        superEffectiveAgainst: ['ghost', 'psychic'],
        weakTo: ['fighting', 'bug', 'fairy'],
        resistantTo: ['ghost', 'dark']
    },
    steel: {
        superEffectiveAgainst: ['ice', 'rock', 'fairy'],
        weakTo: ['fire', 'water', 'ground'],
        resistantTo: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy']
    },
    fairy: {
        superEffectiveAgainst: ['fighting', 'dragon', 'dark'],
        weakTo: ['poison', 'steel'],
        resistantTo: ['fighting', 'bug', 'dark']
    },
    normal: {
        superEffectiveAgainst: [],
        weakTo: ['fighting'],
        resistantTo: []
    }
};

/**
 * 计算属性相克倍数
 * @param {string} attackType - 攻击方属性
 * @param {string[]} defenseTypes - 防御方属性数组
 * @returns {number} 伤害倍数（0.25, 0.5, 1, 2, 4）
 */
function calculateTypeEffectiveness(attackType, defenseTypes) {
    let multiplier = 1;
    const attackData = TYPE_MATCHUP[attackType];
    
    defenseTypes.forEach(defType => {
        if (attackData.superEffectiveAgainst.includes(defType)) {
            multiplier *= 2;
        } else if (attackData.weakTo.includes(defType)) {
            multiplier *= 0.5;
        }
    });
    
    return multiplier;
}

// ═══════════════════════════════════════════════════════════════════════════
// ③ MOVE SYSTEM - 招式系统
// ═══════════════════════════════════════════════════════════════════════════

class Move {
    constructor(name, type, power, accuracy, ppMax, priority = 0, effect = null) {
        this.name = name;
        this.type = type;
        this.power = power; // 招式威力 (1-150)
        this.accuracy = accuracy; // 命中率 (0-100)
        this.ppMax = ppMax; // 最大PP数
        this.pp = ppMax; // 当前PP
        this.priority = priority; // 优先级 (-7到+5)
        this.effect = effect; // 附加效果
        this.category = this.getCategory(); // 物理/特殊/变化
    }

    getCategory() {
        // 简化分类：通常高威力认为是物理/特殊
        const physicalTypes = ['normal', 'fighting', 'rock', 'bug', 'steel'];
        const specialTypes = ['fire', 'water', 'electric', 'grass', 'ice', 'psychic', 'dragon', 'dark'];
        
        if (physicalTypes.includes(this.type)) return 'physical';
        if (specialTypes.includes(this.type)) return 'special';
        return 'status';
    }

    usePP() {
        if (this.pp > 0) {
            this.pp--;
            return true;
        }
        return false;
    }

    restorePP() {
        this.pp = this.ppMax;
    }
}

// 招式库
const MOVE_LIBRARY = {
    flamethrower: new Move('喷射火焰', 'fire', 90, 100, 15),
    waterPulse: new Move('水之波动', 'water', 60, 100, 20),
    thunderbolt: new Move('十万伏特', 'electric', 90, 100, 15),
    razorLeaf: new Move('叶刃', 'grass', 55, 95, 25),
    psychic: new Move('精神强念', 'psychic', 90, 100, 10),
    iceBeam: new Move('冰冻光束', 'ice', 90, 100, 10),
    earthquake: new Move('地震', 'ground', 100, 100, 10),
    quickAttack: new Move('电光一闪', 'normal', 40, 100, 30, 1), // 优先级+1
    dragonClaw: new Move('龙爪', 'dragon', 80, 100, 15),
    recover: new Move('自我再生', 'normal', 0, 100, 10, 0, { type: 'heal', value: 0.5 }) // 回复50% HP
};

// ═══════════════════════════════════════════════════════════════════════════
// ④ ABILITY & ITEM SYSTEM - 特性与道具系统
// ═══════════════════════════════════════════════════════════════════════════

class Ability {
    constructor(name, description, triggers = []) {
        this.name = name;
        this.description = description;
        this.triggers = triggers; // 触发时机：'onSwitch', 'onAttack', 'onDamage', 'endOfTurn'等
    }

    onTrigger(context) {
        // 特性触发逻辑，由具体子类实现
    }
}

class Item {
    constructor(name, description, effect = null) {
        this.name = name;
        this.description = description;
        this.effect = effect; // 道具效果
    }

    activate(context) {
        // 道具激活逻辑
    }
}

// 特性库
const ABILITY_LIBRARY = {
    blaze: new Ability(
        '火焰身躯',
        '火系招式威力提升',
        ['onAttack']
    ),
    torrent: new Ability(
        '激流',
        '水系招式威力提升',
        ['onAttack']
    ),
    pressure: new Ability(
        '压迫感',
        '对手招式PP消耗增加',
        ['onOpponentAttack']
    )
};

// 道具库
const ITEM_LIBRARY = {
    choiceBand: new Item(
        '选择带',
        '攻击力+1.5倍，但只能使用一个招式',
        { type: 'statBoost', stat: 'atk', multiplier: 1.5 }
    ),
    lifeOrb: new Item(
        '生命宝珠',
        '所有招式威力+1.3倍，每次攻击失去1/10 HP',
        { type: 'powerBoost', power: 1.3, recoil: 0.1 }
    ),
    stickyBarb: new Item(
        '粘着钉',
        '每回合失去1/8 HP，被接触的对手也会被粘住',
        { type: 'damageOverTime', rate: 0.125 }
    )
};

// ═══════════════════════════════════════════════════════════════════════════
// ⑤ STATUS & CONDITION SYSTEM - 状态系统
// ═══════════════════════════════════════════════════════════════════════════

class StatusCondition {
    constructor(type, duration = -1, effect = null) {
        this.type = type; // 'burn', 'poison', 'paralyze', 'sleep', 'freeze', 'confuse'
        this.duration = duration; // 持续回合数，-1表示无限
        this.effect = effect; // 状态效果数据
    }

    tick() {
        if (this.duration > 0) {
            this.duration--;
        }
        return this.duration !== 0;
    }

    getDescription() {
        const descriptions = {
            burn: '燃烧：每回合失去1/8 HP，物理攻击力降低50%',
            poison: '中毒：每回合失去1/8 HP',
            paralyze: '麻痹：速度降低50%，25%概率无法行动',
            sleep: '睡眠：无法行动',
            freeze: '冰冻：无法行动，需要用火系招式解除',
            confuse: '混乱：50%概率攻击自己'
        };
        return descriptions[this.type] || '未知状态';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⑥ POKEMON CLASS - 宝可梦个体对象
// ═══════════════════════════════════════════════════════════════════════════

class Pokemon {
    constructor(speciesId, level = 50, nature = 'hardy', ivs = null, evs = null) {
        const species = POKEDEX[speciesId];
        if (!species) throw new Error(`Unknown Pokémon ID: ${speciesId}`);

        // 基本信息
        this.speciesId = speciesId;
        this.name = species.name;
        this.level = level;
        this.type = species.type;
        this.baseStats = species.baseStats;
        this.abilities = species.abilities;
        this.movePool = species.movePool;

        // 个体参数 (Individual Values)
        this.iv = ivs || {
            hp: Math.random() * 31,
            atk: Math.random() * 31,
            def: Math.random() * 31,
            spAtk: Math.random() * 31,
            spDef: Math.random() * 31,
            spe: Math.random() * 31
        };

        // 努力值 (Effort Values)
        this.ev = evs || {
            hp: 0,
            atk: 0,
            def: 0,
            spAtk: 0,
            spDef: 0,
            spe: 0
        };

        // 性格 (Nature) - 影响属性倍数
        this.nature = nature;
        this.natureMultiplier = this.getNatureMultiplier();

        // 计算实际属性
        this.stats = this.calculateStats();

        // 当前HP
        this.currentHp = this.stats.hp;

        // 能力变化 (Stat Changes -6到+6)
        this.statChanges = {
            atk: 0,
            def: 0,
            spAtk: 0,
            spDef: 0,
            spe: 0
        };

        // 招式
        this.moves = this.selectMoves();

        // 特性
        this.ability = ABILITY_LIBRARY[this.abilities.normal];

        // 道具
        this.item = null;

        // 状态
        this.status = []; // 状态条件数组
        this.active = true; // 是否在场
    }

    calculateStats() {
        const stats = {};
        const statNames = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spe'];

        statNames.forEach(stat => {
            const base = this.baseStats[stat];
            const iv = this.iv[stat];
            const ev = this.ev[stat];
            const multiplier = this.natureMultiplier[stat] || 1;

            if (stat === 'hp') {
                // HP计算：((2*B + I + E/4) * L / 100 + L + 5)
                stats[stat] = Math.floor((2 * base + iv + ev / 4) * this.level / 100 + this.level + 5);
            } else {
                // 其他属性：(((2*B + I + E/4) * L / 100 + 5) * N)
                stats[stat] = Math.floor(((2 * base + iv + ev / 4) * this.level / 100 + 5) * multiplier);
            }
        });

        return stats;
    }

    getNatureMultiplier() {
        // 简化性格实现
        const natures = {
            hardy: { atk: 1, def: 1, spAtk: 1, spDef: 1, spe: 1 },
            adamant: { atk: 1.1, def: 1, spAtk: 0.9, spDef: 1, spe: 1 },
            jolly: { atk: 1, def: 1, spAtk: 0.9, spDef: 1, spe: 1.1 },
            modest: { atk: 0.9, def: 1, spAtk: 1.1, spDef: 1, spe: 1 },
            timid: { atk: 0.9, def: 1, spAtk: 1, spDef: 1, spe: 1.1 }
        };
        return natures[this.nature] || natures.hardy;
    }

    selectMoves() {
        // 从移动池中随机选择4个招式
        const selectedMoves = [];
        const pool = [...this.movePool];

        while (selectedMoves.length < 4 && pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            const moveName = pool[randomIndex];
            if (MOVE_LIBRARY[moveName]) {
                selectedMoves.push(new Move(
                    MOVE_LIBRARY[moveName].name,
                    MOVE_LIBRARY[moveName].type,
                    MOVE_LIBRARY[moveName].power,
                    MOVE_LIBRARY[moveName].accuracy,
                    MOVE_LIBRARY[moveName].ppMax,
                    MOVE_LIBRARY[moveName].priority,
                    MOVE_LIBRARY[moveName].effect
                ));
            }
            pool.splice(randomIndex, 1);
        }

        return selectedMoves;
    }

    getEffectiveStats() {
        // 获取考虑能力变化后的属性
        const effective = { ...this.stats };
        const changeMultipliers = {
            '-6': 0.25,
            '-5': 0.29,
            '-4': 0.33,
            '-3': 0.4,
            '-2': 0.5,
            '-1': 0.67,
            '0': 1,
            '1': 1.5,
            '2': 2,
            '3': 2.5,
            '4': 3,
            '5': 3.5,
            '6': 4
        };

        Object.keys(this.statChanges).forEach(stat => {
            const change = this.statChanges[stat];
            const multiplier = changeMultipliers[change] || 1;
            effective[stat] = Math.floor(effective[stat] * multiplier);
        });

        return effective;
    }

    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
        return this.currentHp === 0;
    }

    heal(amount) {
        this.currentHp = Math.min(this.stats.hp, this.currentHp + amount);
    }

    applyStatus(condition) {
        // 检查是否已有相同状态
        if (!this.status.find(s => s.type === condition.type)) {
            this.status.push(condition);
        }
    }

    removeStatus(type) {
        this.status = this.status.filter(s => s.type !== type);
    }

    clearAllStatus() {
        this.status = [];
    }

    isFainted() {
        return this.currentHp === 0;
    }

    getHpPercentage() {
        return (this.currentHp / this.stats.hp) * 100;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⑦ BATTLEFIELD - 战场状态
// ═══════════════════════════════════════════════════════════════════════════

class BattleField {
    constructor() {
        // 天气状态：'none', 'rain', 'sun', 'hail', 'sandstorm'
        this.weather = 'none';
        this.weatherDuration = 0;

        // 场地状态：'none', 'electricTerrain', 'grassyTerrain', 'mistyTerrain', 'psychicTerrain'
        this.terrain = 'none';
        this.terrainDuration = 0;

        // 双方反射壁/避雷针等
        this.playerReflectWall = 0; // 回合数
        this.playerLightScreen = 0;
        this.playerSpikes = 0; // 刺钉层数 0-3

        this.opponentReflectWall = 0;
        this.opponentLightScreen = 0;
        this.opponentSpikes = 0;

        // 双方欺诈空间
        this.trickRoom = false;
        this.trickroomDuration = 0;

        // 天气对速度等的影响
        this.weatherEffects = {
            rain: { type: 'water', multiplier: 1.5 },
            sun: { type: 'fire', multiplier: 1.5 },
            hail: { type: 'ice', multiplier: 1.5 },
            sandstorm: { type: 'rock', multiplier: 1.5 }
        };
    }

    setWeather(type, duration = 5) {
        this.weather = type;
        this.weatherDuration = duration;
    }

    setTerrain(type, duration = 5) {
        this.terrain = type;
        this.terrainDuration = duration;
    }

    tickWeather() {
        if (this.weatherDuration > 0) {
            this.weatherDuration--;
        } else if (this.weatherDuration === 0) {
            this.weather = 'none';
        }
    }

    tickTerrain() {
        if (this.terrainDuration > 0) {
            this.terrainDuration--;
        } else if (this.terrainDuration === 0) {
            this.terrain = 'none';
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⑧ ACTION - 回合行动
// ═══════════════════════════════════════════════════════════════════════════

class Action {
    constructor(actor, type, target = null, data = null) {
        this.actor = actor; // 执行者（Player 或 Opponent）
        this.type = type; // 'move', 'switch', 'item'
        this.target = target; // 目标
        this.data = data; // 具体数据 (招式索引/宝可梦索引/道具等)
        this.priority = this.calculatePriority();
    }

    calculatePriority() {
        if (this.type === 'move') {
            const move = this.data;
            return move.priority || 0;
        }
        if (this.type === 'switch') return -7; // 最低优先级
        if (this.type === 'item') return -6; // 次低优先级
        return 0;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⑨ DAMAGE CALCULATION ENGINE - 伤害计算引擎
// ═══════════════════════════════════════════════════════════════════════════

class DamageCalculator {
    /**
     * 计算伤害
     * Damage = ((2 * A / 5 + 2) * P * D / 50 + 2) * Mod
     */
    static calculateDamage(attacker, defender, move) {
        // 基础伤害计算
        let damage = Math.floor(
            (((2 * attacker.level) / 5 + 2) * move.power * (attacker.stats[this.getMoveCategory(move, attacker)] / defender.stats[this.getDefenseStat(move, defender)])) / 50 + 2
        );

        // 属性相克倍数
        const typeMultiplier = calculateTypeEffectiveness(move.type, defender.type);
        damage *= typeMultiplier;

        // 命中判定
        if (Math.random() * 100 > move.accuracy) {
            return 0; // 未命中
        }

        // 暴击判定 (1/16 概率)
        if (Math.random() < 1 / 16) {
            damage *= 1.5;
        }

        // 随机波动 (85% - 100%)
        damage *= (85 + Math.random() * 15) / 100;

        return Math.floor(damage);
    }

    static getMoveCategory(move, pokemon) {
        // 根据宝可梦的高属性值选择适用的属性
        const isPhysical = move.category === 'physical' || move.category === 'status';
        if (move.category === 'status') return 'spAtk'; // 特殊情况

        // 简化：如果是物理类，使用攻击；特殊类，使用特攻
        return move.category === 'physical' ? 'atk' : 'spAtk';
    }

    static getDefenseStat(move, defender) {
        // 根据招式类型选择对应的防御
        return move.category === 'physical' ? 'def' : 'spDef';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⑩ BATTLE STATE MANAGER - 核心战斗管理器
// ═══════════════════════════════════════════════════════════════════════════

class BattleStateManager {
    constructor(playerTeam, opponentTeam, options = {}) {
        this.playerTeam = playerTeam; // [Pokemon, Pokemon, ...]
        this.opponentTeam = opponentTeam;

        this.playerPokemon = playerTeam[0]; // 当前宝可梦
        this.opponentPokemon = opponentTeam[0];

        this.battleField = new BattleField();
        this.turnCount = 0;
        this.battleLog = [];
        this.battleState = 'running'; // 'running', 'playerWon', 'opponentWon', 'draw'

        this.isSimulating = options.isSimulating || false; // AI自动对战模式
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * 主回合流程控制器 - run_turn()
     * ═══════════════════════════════════════════════════════════════════════
     * 一个完整回合的8个阶段：
     * 1. Start of Turn - 状态更新、天气结算
     * 2. Player Command Input - 获取双方行动
     * 3. Switch Phase - 处理换人事件
     * 4. Priority Phase - 确定行动顺序
     * 5. Action Phase - 执行技能、判定命中、结算伤害
     * 6. Trigger Phase - 执行特性、道具、状态事件
     * 7. End of Turn - 剩饭、天气、中毒等
     * 8. Win Check - 判定胜负
     */
    async runTurn(playerAction, opponentAction) {
        this.turnCount++;
        this.log(`\n┌─── 第 ${this.turnCount} 回合 ───┐`);

        try {
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 1: Start of Turn - 状态更新、天气结算
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第1阶段】回合开始');
            await this.phaseStartOfTurn();

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 2: Player Command Input - 获取双方行动
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第2阶段】获取行动指令');
            
            // 如果不提供行动，使用AI决策
            if (!playerAction) {
                playerAction = this.getAIAction(this.playerTeam, this.opponentPokemon, 'player');
            }
            if (!opponentAction) {
                opponentAction = this.getAIAction(this.opponentTeam, this.playerPokemon, 'opponent');
            }

            this.log(`玩家行动: ${this.formatAction(playerAction)}`);
            this.log(`对手行动: ${this.formatAction(opponentAction)}`);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 3: Switch Phase - 处理换人事件
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第3阶段】处理换人');
            await this.phaseSwitchPokemon(playerAction, opponentAction);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 4: Priority Phase - 确定行动顺序
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第4阶段】确定行动顺序');
            const actionOrder = this.determinePriority(playerAction, opponentAction);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 5: Action Phase - 执行技能、判定命中、结算伤害
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第5阶段】执行行动');
            for (const action of actionOrder) {
                if (!this.isBattleOver()) {
                    await this.phaseExecuteAction(action);
                }
            }

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 6: Trigger Phase - 执行特性、道具、状态事件
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第6阶段】触发特性与道具效果');
            await this.phaseTriggerEffects();

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 7: End of Turn - 剩饭、天气、中毒等
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第7阶段】回合结束效果');
            await this.phaseEndOfTurn();

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 阶段 8: Win Check - 判定胜负
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            this.log('\n【第8阶段】判定胜负');
            await this.phaseWinCheck();

            this.log(`\n└─── 第 ${this.turnCount} 回合结束 ───┘`);

        } catch (error) {
            this.log(`⚠️ 错误：${error.message}`);
        }

        return {
            turnCount: this.turnCount,
            battleState: this.battleState,
            playerPokemon: this.playerPokemon,
            opponentPokemon: this.opponentPokemon,
            battleLog: this.battleLog
        };
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 各阶段具体实现
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    async phaseStartOfTurn() {
        this.log('⏱️ 状态更新中...');

        // 天气效果
        this.battleField.tickWeather();
        if (this.battleField.weather !== 'none') {
            this.log(`🌦️ ${this.battleField.weather} 持续中 (剩余 ${this.battleField.weatherDuration} 回合)`);
        }

        // 地形效果
        this.battleField.tickTerrain();
        if (this.battleField.terrain !== 'none') {
            this.log(`🌍 ${this.battleField.terrain} 持续中 (剩余 ${this.battleField.terrainDuration} 回合)`);
        }

        // 技能PP恢复（某些道具/特性）
        // ...

        // 能力变化自然恢复（某些特性）
        // ...
    }

    async phaseSwitchPokemon(playerAction, opponentAction) {
        if (playerAction.type === 'switch') {
            this.playerPokemon = playerAction.data;
            this.log(`✨ 玩家派出 ${this.playerPokemon.name}！`);
        }

        if (opponentAction.type === 'switch') {
            this.opponentPokemon = opponentAction.data;
            this.log(`✨ 对手派出 ${this.opponentPokemon.name}！`);
        }
    }

    determinePriority(playerAction, opponentAction) {
        const actions = [];

        // 筛选出非switch的行动
        if (playerAction.type !== 'switch') {
            playerAction.priority = playerAction.data?.priority || 0;
            playerAction.actor = 'player';
            actions.push(playerAction);
        }

        if (opponentAction.type !== 'switch') {
            opponentAction.priority = opponentAction.data?.priority || 0;
            opponentAction.actor = 'opponent';
            actions.push(opponentAction);
        }

        // 根据优先级排序（优先级高的先执行）
        // 优先级相同，根据速度排序
        actions.sort((a, b) => {
            if (a.priority !== b.priority) {
                return b.priority - a.priority;
            }

            const playerSpeed = this.playerPokemon.getEffectiveStats().spe;
            const opponentSpeed = this.opponentPokemon.getEffectiveStats().spe;

            // 欺诈空间翻转速度
            if (this.battleField.trickroom) {
                return playerSpeed - opponentSpeed;
            }

            return opponentSpeed - playerSpeed;
        });

        this.log(`🔄 行动顺序：${actions.map(a => a.actor).join(' → ')}`);
        return actions;
    }

    async phaseExecuteAction(action) {
        if (action.type === 'move') {
            const attacker = action.actor === 'player' ? this.playerPokemon : this.opponentPokemon;
            const defender = action.actor === 'player' ? this.opponentPokemon : this.playerPokemon;
            const move = action.data;

            // 检查PP
            if (!move.usePP()) {
                this.log(`❌ ${attacker.name} 的 ${move.name} PP不足！`);
                return;
            }

            // 检查是否被麻痹
            const hasParalyze = attacker.status.find(s => s.type === 'paralyze');
            if (hasParalyze && Math.random() < 0.25) {
                this.log(`⚡ ${attacker.name} 麻痹了，无法行动！`);
                return;
            }

            // 检查睡眠状态
            const hasSleep = attacker.status.find(s => s.type === 'sleep');
            if (hasSleep && hasSleep.duration > 0) {
                this.log(`😴 ${attacker.name} 还在睡眠中...`);
                return;
            }

            // 计算伤害
            const damage = DamageCalculator.calculateDamage(attacker, defender, move);

            if (damage === 0) {
                this.log(`❌ ${attacker.name} 使用 ${move.name}，但没有命中！`);
            } else {
                this.log(`⚔️ ${attacker.name} 使用 ${move.name}！`);
                this.log(`💥 造成 ${damage} 伤害！`);

                // 结算伤害
                const fainted = defender.takeDamage(damage);
                const hpPercent = defender.getHpPercentage();
                this.log(`${defender.name} 剩余 HP: ${defender.currentHp}/${defender.stats.hp} (${hpPercent.toFixed(1)}%)`);

                if (fainted) {
                    this.log(`💀 ${defender.name} 倒下了！`);
                }
            }

            // 处理招式附加效果
            if (move.effect) {
                await this.applyMoveEffect(move, attacker, defender);
            }
        }
    }

    async phaseTriggerEffects() {
        // 特性触发
        const playerAbility = this.playerPokemon.ability;
        const opponentAbility = this.opponentPokemon.ability;

        // 道具触发
        if (this.playerPokemon.item) {
            this.log(`🎁 ${this.playerPokemon.name} 的 ${this.playerPokemon.item.name} 发动效果！`);
        }

        if (this.opponentPokemon.item) {
            this.log(`🎁 ${this.opponentPokemon.name} 的 ${this.opponentPokemon.item.name} 发动效果！`);
        }

        // 天气特性触发
        if (this.battleField.weather !== 'none') {
            // 晴天下，火系招式威力提升
            // 雨天下，水系招式威力提升
            // ...
        }
    }

    async phaseEndOfTurn() {
        // 状态伤害
        if (this.playerPokemon.status.length > 0) {
            this.playerPokemon.status.forEach(status => {
                if (status.type === 'burn') {
                    const damageHp = Math.floor(this.playerPokemon.stats.hp / 8);
                    this.playerPokemon.takeDamage(damageHp);
                    this.log(`🔥 ${this.playerPokemon.name} 被燃烧伤害，失去 ${damageHp} HP！`);
                } else if (status.type === 'poison') {
                    const damageHp = Math.floor(this.playerPokemon.stats.hp / 8);
                    this.playerPokemon.takeDamage(damageHp);
                    this.log(`☠️ ${this.playerPokemon.name} 被中毒伤害，失去 ${damageHp} HP！`);
                } else if (status.type === 'sleep') {
                    status.tick();
                }
            });
        }

        if (this.opponentPokemon.status.length > 0) {
            this.opponentPokemon.status.forEach(status => {
                if (status.type === 'burn') {
                    const damageHp = Math.floor(this.opponentPokemon.stats.hp / 8);
                    this.opponentPokemon.takeDamage(damageHp);
                    this.log(`🔥 ${this.opponentPokemon.name} 被燃烧伤害，失去 ${damageHp} HP！`);
                } else if (status.type === 'poison') {
                    const damageHp = Math.floor(this.opponentPokemon.stats.hp / 8);
                    this.opponentPokemon.takeDamage(damageHp);
                    this.log(`☠️ ${this.opponentPokemon.name} 被中毒伤害，失去 ${damageHp} HP！`);
                }
            });
        }

        // 剩饭恢复HP（如果携带）
        if (this.playerPokemon.item?.name === '剩饭') {
            const healHp = Math.floor(this.playerPokemon.stats.hp / 8);
            this.playerPokemon.heal(healHp);
            this.log(`🍚 ${this.playerPokemon.name} 的剩饭恢复了 ${healHp} HP！`);
        }

        if (this.opponentPokemon.item?.name === '剩饭') {
            const healHp = Math.floor(this.opponentPokemon.stats.hp / 8);
            this.opponentPokemon.heal(healHp);
            this.log(`🍚 ${this.opponentPokemon.name} 的剩饭恢复了 ${healHp} HP！`);
        }
    }

    async phaseWinCheck() {
        // 检查是否有宝可梦倒下
        if (this.playerPokemon.isFainted()) {
            const hasAvailable = this.playerTeam.some(p => !p.isFainted());
            if (!hasAvailable) {
                this.battleState = 'opponentWon';
                this.log('\n🏆 对手赢得了战斗！');
            }
        }

        if (this.opponentPokemon.isFainted()) {
            const hasAvailable = this.opponentTeam.some(p => !p.isFainted());
            if (!hasAvailable) {
                this.battleState = 'playerWon';
                this.log('\n🎉 玩家赢得了战斗！');
            }
        }
    }

    async applyMoveEffect(move, attacker, defender) {
        if (move.effect) {
            if (move.effect.type === 'heal') {
                const healAmount = Math.floor(attacker.stats.hp * move.effect.value);
                attacker.heal(healAmount);
                this.log(`💚 ${attacker.name} 恢复了 ${healAmount} HP！`);
            } else if (move.effect.type === 'paralyze') {
                defender.applyStatus(new StatusCondition('paralyze', -1));
                this.log(`⚡ ${defender.name} 陷入了麻痹！`);
            } else if (move.effect.type === 'burn') {
                defender.applyStatus(new StatusCondition('burn', -1));
                this.log(`🔥 ${defender.name} 陷入了燃烧！`);
            } else if (move.effect.type === 'poison') {
                defender.applyStatus(new StatusCondition('poison', -1));
                this.log(`☠️ ${defender.name} 陷入了中毒！`);
            }
        }
    }

    getAIAction(team, opponent, side) {
        const activePokemon = team.find(p => !p.isFainted());
        
        if (!activePokemon) {
            return new Action(side, 'switch', null, team[0]);
        }

        // 简单AI：随机选择一个招式
        const randomMoveIndex = Math.floor(Math.random() * activePokemon.moves.length);
        const move = activePokemon.moves[randomMoveIndex];

        return new Action(side, 'move', opponent, move);
    }

    isBattleOver() {
        return this.battleState !== 'running';
    }

    formatAction(action) {
        if (action.type === 'move') {
            return `使用 ${action.data.name}`;
        } else if (action.type === 'switch') {
            return `派出 ${action.data.name}`;
        }
        return '使用道具';
    }

    log(message) {
        this.battleLog.push(message);
        console.log(message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 导出模块
// ═══════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POKEDEX,
        TYPE_MATCHUP,
        calculateTypeEffectiveness,
        Move,
        MOVE_LIBRARY,
        Ability,
        ABILITY_LIBRARY,
        Item,
        ITEM_LIBRARY,
        StatusCondition,
        Pokemon,
        BattleField,
        Action,
        DamageCalculator,
        BattleStateManager
    };
}
