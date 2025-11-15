/**
 * 属性系统数据
 * 包含属性相克关系、属性名称映射、属性颜色映射
 */

/**
 * 属性相克表
 * 
 * 数据结构：
 * {
 *   [攻击属性]: {
 *     [防御属性]: 倍率
 *   }
 * }
 * 
 * 倍率说明：
 * - 2.0: 效果拔群（克制）
 * - 1.0: 普通效果（默认，不在表中列出）
 * - 0.5: 效果不佳（抵抗）
 * - 0.0: 完全无效（免疫）
 * 
 * 双属性宝可梦的防御倍率计算：
 * - 最终倍率 = 属性1倍率 × 属性2倍率
 * - 例如：水系+飞行系被电系攻击 = 2 × 2 = 4倍伤害
 */
const typeMatchups = {
    fire: { 
        grass: 2,      // 火克制草
        water: 0.5,    // 火被水抵抗
        fire: 0.5,     // 火被火抵抗
        ice: 2,        // 火克制冰
        bug: 2,        // 火克制虫
        steel: 2       // 火克制钢
    },
    water: { 
        fire: 2,       // 水克制火
        grass: 0.5,    // 水被草抵抗
        water: 0.5,    // 水被水抵抗
        ground: 2,     // 水克制地面
        rock: 2        // 水克制岩石
    },
    grass: { 
        water: 2,      // 草克制水
        fire: 0.5,     // 草被火抵抗
        grass: 0.5,    // 草被草抵抗
        ground: 2,     // 草克制地面
        rock: 2,       // 草克制岩石
        poison: 0.5,   // 草被毒抵抗
        flying: 0.5,   // 草被飞行抵抗
        bug: 0.5,      // 草被虫抵抗
        steel: 0.5     // 草被钢抵抗
    },
    electric: { 
        water: 2,      // 电克制水
        flying: 2,     // 电克制飞行
        electric: 0.5, // 电被电抵抗
        grass: 0.5,    // 电被草抵抗
        ground: 0      // 电对地面无效
    },
    normal: { 
        rock: 0.5,     // 一般被岩石抵抗
        ghost: 0,      // 一般对幽灵无效
        steel: 0.5     // 一般被钢抵抗
    },
    poison: { 
        grass: 2,      // 毒克制草
        poison: 0.5,   // 毒被毒抵抗
        ground: 0.5,   // 毒被地面抵抗
        rock: 0.5,     // 毒被岩石抵抗
        ghost: 0.5,    // 毒被幽灵抵抗
        steel: 0       // 毒对钢无效
    }
};

/**
 * 属性中文名称映射
 * 用于UI显示
 */
const typeNames = {
    fire: '火系',
    water: '水系',
    grass: '草系',
    electric: '电系',
    normal: '一般',
    poison: '毒系',
    ice: '冰系',
    bug: '虫系',
    steel: '钢系',
    ground: '地面系',
    rock: '岩石系',
    flying: '飞行系',
    ghost: '幽灵系',
    psychic: '超能力系',
    fighting: '格斗系',
    dark: '恶系',
    dragon: '龙系',
    fairy: '妖精系'
};

/**
 * 属性颜色映射（Tailwind CSS 渐变类）
 * 用于UI显示属性标签和图标
 */
const typeColors = {
    fire: 'from-red-500 to-orange-600',
    water: 'from-blue-500 to-cyan-600',
    grass: 'from-green-500 to-emerald-600',
    electric: 'from-yellow-400 to-amber-500',
    normal: 'from-gray-400 to-slate-500',
    poison: 'from-purple-500 to-violet-600',
    ice: 'from-cyan-300 to-blue-400',
    bug: 'from-lime-500 to-green-600',
    steel: 'from-slate-400 to-gray-500',
    ground: 'from-amber-600 to-yellow-700',
    rock: 'from-stone-500 to-amber-700',
    flying: 'from-indigo-300 to-sky-400',
    ghost: 'from-purple-600 to-indigo-700',
    psychic: 'from-pink-500 to-purple-600',
    fighting: 'from-red-600 to-orange-700',
    dark: 'from-gray-700 to-slate-800',
    dragon: 'from-indigo-600 to-purple-700',
    fairy: 'from-pink-400 to-rose-500'
};

// 如果在浏览器环境中，将数据暴露到全局
if (typeof window !== 'undefined') {
    window.typeMatchups = typeMatchups;
    window.typeNames = typeNames;
    window.typeColors = typeColors;
}

