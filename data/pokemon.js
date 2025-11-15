/**
 * 宝可梦数据库
 * 包含所有可用宝可梦的基础属性和技能
 * 
 * 数据结构：
 * {
 *   id: number,           // 宝可梦图鉴编号
 *   name: string,         // 宝可梦名称
 *   type: string[],       // 属性类型数组（可以是单属性或双属性）
 *   hp: number,           // 生命值
 *   attack: number,       // 攻击力
 *   defense: number,      // 防御力
 *   speed: number,        // 速度
 *   skills: Skill[]       // 技能列表
 * }
 * 
 * 技能数据结构：
 * {
 *   name: string,         // 技能名称
 *   type: string,         // 技能属性
 *   power: number,        // 威力（0表示变化技能）
 *   accuracy: number,     // 命中率（百分比）
 *   priority: number,     // 优先度（数值越大越先出手）
 *   effect?: {            // 可选的附加效果
 *     type: string,       // 效果类型（'status' 状态异常 / 'stat' 能力变化）
 *     status?: string,    // 状态异常类型（poison, burn, paralysis等）
 *     stat?: string,      // 能力变化目标（attack, defense, speed等）
 *     change?: number     // 能力变化等级（-6 到 +6）
 *   }
 * }
 */

const pokemonData = {
    1: { 
        id: 1, 
        name: '妙蛙种子', 
        type: ['grass', 'poison'], 
        hp: 45, 
        attack: 49, 
        defense: 49, 
        speed: 45, 
        skills: [
            { 
                name: '撞击', 
                type: 'normal', 
                power: 40, 
                accuracy: 100, 
                priority: 0 
            },
            { 
                name: '藤鞭', 
                type: 'grass', 
                power: 45, 
                accuracy: 100, 
                priority: 0 
            },
            { 
                name: '毒粉', 
                type: 'poison', 
                power: 0, 
                accuracy: 75, 
                priority: 0, 
                effect: { 
                    type: 'status', 
                    status: 'poison' 
                } 
            }
        ]
    },
    4: { 
        id: 4, 
        name: '小火龙', 
        type: ['fire'], 
        hp: 39, 
        attack: 52, 
        defense: 43, 
        speed: 65, 
        skills: [
            { 
                name: '撞击', 
                type: 'normal', 
                power: 40, 
                accuracy: 100, 
                priority: 0 
            },
            { 
                name: '火花', 
                type: 'fire', 
                power: 40, 
                accuracy: 100, 
                priority: 0 
            },
            { 
                name: '烟幕', 
                type: 'normal', 
                power: 0, 
                accuracy: 100, 
                priority: 0, 
                effect: { 
                    type: 'stat', 
                    stat: 'accuracy', 
                    change: -1 
                } 
            }
        ]
    },
    7: { 
        id: 7, 
        name: '杰尼龟', 
        type: ['water'], 
        hp: 44, 
        attack: 48, 
        defense: 65, 
        speed: 43, 
        skills: [
            { 
                name: '撞击', 
                type: 'normal', 
                power: 40, 
                accuracy: 100, 
                priority: 0 
            },
            { 
                name: '水枪', 
                type: 'water', 
                power: 40, 
                accuracy: 100, 
                priority: 0 
            },
            { 
                name: '缩入壳中', 
                type: 'water', 
                power: 0, 
                accuracy: 100, 
                priority: 1, 
                effect: { 
                    type: 'stat', 
                    stat: 'defense', 
                    change: 1 
                } 
            }
        ]
    },
    25: { 
        id: 25, 
        name: '皮卡丘', 
        type: ['electric'], 
        hp: 35, 
        attack: 55, 
        defense: 40, 
        speed: 90, 
        skills: [
            {
                name: '撞击',
                type: 'normal',
                power: 40,
                accuracy: 100,
                priority: 0
            },
            {
                name: '电击',
                type: 'electric',
                power: 40,
                accuracy: 100,
                priority: 0
            },
            {
                name: '电光一闪',
                type: 'normal',
                power: 40,
                accuracy: 100,
                priority: 1
            }
        ]
    }
};

// 如果在浏览器环境中，将数据暴露到全局
if (typeof window !== 'undefined') {
    window.pokemonData = pokemonData;
}
