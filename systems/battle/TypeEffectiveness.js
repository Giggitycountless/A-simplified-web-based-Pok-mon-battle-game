/**
 * 属性相克模块
 * 负责计算和显示属性相克关系
 */
class TypeEffectiveness {
    /**
     * 计算属性相克倍率
     * @param {string} attackType - 攻击属性
     * @param {Array} defenderTypes - 防御方的属性数组
     * @returns {number} 属性相克倍率
     */
    static calculate(attackType, defenderTypes) {
        let multiplier = 1;
        
        // 检查 typeMatchups 是否存在
        if (typeof typeMatchups === 'undefined') {
            console.warn('⚠️ typeMatchups 未定义，无法计算属性相克');
            return multiplier;
        }
        
        defenderTypes.forEach(defType => {
            if (typeMatchups[attackType] && typeMatchups[attackType][defType] !== undefined) {
                multiplier *= typeMatchups[attackType][defType];
            }
        });
        
        return multiplier;
    }
    
    /**
     * 获取属性相克的文字描述
     * @param {number} effectiveness - 属性相克倍率
     * @returns {string} 文字描述
     */
    static getEffectivenessText(effectiveness) {
        if (effectiveness === 0) {
            return '🚫 没有效果...';
        } else if (effectiveness <= 0.25) {
            return '🛡️ 效果不佳...（0.25倍伤害）';
        } else if (effectiveness <= 0.5) {
            return '🛡️ 效果不佳...';
        } else if (effectiveness >= 4) {
            return '💥 效果拔群！（4倍伤害）';
        } else if (effectiveness >= 2) {
            return '✨ 效果拔群！';
        } else if (effectiveness > 1) {
            return `✨ 效果拔群！（${effectiveness}倍伤害）`;
        } else if (effectiveness < 1) {
            return `🛡️ 效果不佳...（${effectiveness}倍伤害）`;
        }
        return ''; // 普通效果不显示
    }
    
    /**
     * 显示属性相克信息（通过回调函数）
     * @param {number} effectiveness - 属性相克倍率
     * @param {Function} logCallback - 日志回调函数
     */
    static display(effectiveness, logCallback) {
        const text = this.getEffectivenessText(effectiveness);
        if (text && logCallback) {
            logCallback(text);
        }
    }
    
    /**
     * 获取属性相克的颜色类
     * @param {number} effectiveness - 属性相克倍率
     * @returns {string} CSS颜色类
     */
    static getEffectivenessColor(effectiveness) {
        if (effectiveness === 0) {
            return 'text-gray-500';
        } else if (effectiveness < 1) {
            return 'text-blue-500';
        } else if (effectiveness > 1) {
            return 'text-red-500';
        }
        return 'text-gray-700';
    }
    
    /**
     * 获取属性相克的图标
     * @param {number} effectiveness - 属性相克倍率
     * @returns {string} 图标emoji
     */
    static getEffectivenessIcon(effectiveness) {
        if (effectiveness === 0) {
            return '🚫';
        } else if (effectiveness <= 0.25) {
            return '🛡️🛡️';
        } else if (effectiveness <= 0.5) {
            return '🛡️';
        } else if (effectiveness >= 4) {
            return '💥💥';
        } else if (effectiveness >= 2) {
            return '✨';
        }
        return '';
    }
    
    /**
     * 检查是否免疫
     * @param {string} attackType - 攻击属性
     * @param {Array} defenderTypes - 防御方的属性数组
     * @returns {boolean} 是否免疫
     */
    static isImmune(attackType, defenderTypes) {
        return this.calculate(attackType, defenderTypes) === 0;
    }
    
    /**
     * 检查是否效果拔群
     * @param {string} attackType - 攻击属性
     * @param {Array} defenderTypes - 防御方的属性数组
     * @returns {boolean} 是否效果拔群
     */
    static isSuperEffective(attackType, defenderTypes) {
        return this.calculate(attackType, defenderTypes) > 1;
    }
    
    /**
     * 检查是否效果不佳
     * @param {string} attackType - 攻击属性
     * @param {Array} defenderTypes - 防御方的属性数组
     * @returns {boolean} 是否效果不佳
     */
    static isNotVeryEffective(attackType, defenderTypes) {
        const effectiveness = this.calculate(attackType, defenderTypes);
        return effectiveness > 0 && effectiveness < 1;
    }
}

