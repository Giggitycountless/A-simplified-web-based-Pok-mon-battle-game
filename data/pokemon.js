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
 *   skills: Skill[],      // 技能列表
 *   legendary?: boolean,  // 可选：是否为传说宝可梦
 *   heldItem?: string     // 可选：携带道具
 * }
 *
 * 技能数据结构：
 * {
 *   name: string,         // 技能名称
 *   type: string,         // 技能属性
 *   power: number,        // 威力（0表示变化技能）
 *   accuracy: number,     // 命中率（百分比）
 *   priority: number,     // 优先度（数值越大越先出手）
 *   description?: string, // 可选：技能描述
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
                priority: 0,
                description: '用整个身体撞向对手进行攻击。'
            },
            {
                name: '藤鞭',
                type: 'grass',
                power: 45,
                accuracy: 100,
                priority: 0,
                description: '用藤鞭抽打对手进行攻击。'
            },
            {
                name: '毒粉',
                type: 'poison',
                power: 0,
                accuracy: 75,
                priority: 0,
                description: '散布有毒的粉末，使对手陷入中毒状态。',
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
                priority: 0,
                description: '用整个身体撞向对手进行攻击。'
            },
            {
                name: '火花',
                type: 'fire',
                power: 40,
                accuracy: 100,
                priority: 0,
                description: '向对手发射小火焰进行攻击，有时会让对手陷入灼伤状态。'
            },
            {
                name: '烟幕',
                type: 'normal',
                power: 0,
                accuracy: 100,
                priority: 0,
                description: '喷出烟雾降低对手的命中率。',
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
                priority: 0,
                description: '用整个身体撞向对手进行攻击。'
            },
            {
                name: '水枪',
                type: 'water',
                power: 40,
                accuracy: 100,
                priority: 0,
                description: '向对手喷射水流进行攻击。'
            },
            {
                name: '缩入壳中',
                type: 'water',
                power: 0,
                accuracy: 100,
                priority: 1,
                description: '缩入坚硬的壳里，提高自己的防御。',
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
                priority: 0,
                description: '用整个身体撞向对手进行攻击。'
            },
            {
                name: '电击',
                type: 'electric',
                power: 40,
                accuracy: 100,
                priority: 0,
                description: '发出电流刺激对手进行攻击，有时会让对手陷入麻痹状态。'
            },
            {
                name: '电光一闪',
                type: 'normal',
                power: 40,
                accuracy: 100,
                priority: 1,
                description: '以迅雷不及掩耳之势扑向对手，必定能够先制攻击。'
            }
        ]
    },
    493: {
        id: 493,
        name: '阿尔宙斯',
        type: ['normal'],
        hp: 120,
        attack: 120,
        defense: 120,
        speed: 120,
        legendary: true,
        heldItem: '石板',
        skills: [
            {
                name: '制裁光砾',
                type: 'normal',
                power: 100,
                accuracy: 100,
                priority: 0,
                description: '阿尔宙斯的专属技能。向对手发射无数光弹进行攻击，属性会根据携带的石板而改变。'
            },
            {
                name: '大地之力',
                type: 'ground',
                power: 90,
                accuracy: 100,
                priority: 0,
                description: '在对手脚下释放大地之力进行攻击，有时会降低对手的特防。'
            },
            {
                name: '冰冻光束',
                type: 'ice',
                power: 90,
                accuracy: 100,
                priority: 0,
                description: '向对手发射冰冻光束进行攻击，有时会让对手陷入冰冻状态。'
            },
            {
                name: '极速',
                type: 'normal',
                power: 80,
                accuracy: 100,
                priority: 2,
                description: '以肉眼无法辨识的极速扑向对手，必定能够先制攻击。'
            },
            {
                name: '剑舞',
                type: 'normal',
                power: 0,
                accuracy: 100,
                priority: 0,
                description: '激烈地跳起战舞提高气势，大幅提高自己的攻击。',
                effect: {
                    type: 'stat',
                    stat: 'attack',
                    change: 2
                }
            }
        ]
    }
};

// 如果在浏览器环境中，将数据暴露到全局
if (typeof window !== 'undefined') {
    window.pokemonData = pokemonData;
}
