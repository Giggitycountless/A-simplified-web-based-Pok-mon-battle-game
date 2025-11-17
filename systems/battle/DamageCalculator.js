/**
 * 伤害计算模块
 * 负责计算宝可梦战斗中的伤害值
 */
class DamageCalculator {
    /**
     * 计算伤害
     * @param {Object} attacker - 攻击方宝可梦
     * @param {Object} defender - 防御方宝可梦
     * @param {Object} skill - 使用的技能
     * @param {Object} options - 额外选项（暴击、天气等）
     * @returns {number} 最终伤害值
     */
    static calculateDamage(attacker, defender, skill, options = {}) {
        // 如果技能威力为0（变化类技能），不造成伤害
        if (skill.power === 0) return 0;
        
        const level = options.level || 50;
        const attack = attacker.attack;
        const defense = defender.defense;
        const power = skill.power;
        
        // 基础伤害公式：((2 * Level / 5 + 2) * Power * Attack / Defense) / 50 + 2
        let damage = Math.floor(((2 * level / 5 + 2) * power * attack / defense) / 50) + 2;
        
        // 属性相克倍率
        const effectiveness = this.calculateTypeEffectiveness(skill.type, defender.type);
        damage = Math.floor(damage * effectiveness);
        
        // 同属性加成（STAB - Same Type Attack Bonus）
        if (attacker.type.includes(skill.type)) {
            damage = Math.floor(damage * 1.5);
        }
        
        // 暴击
        if (options.critical) {
            damage = Math.floor(damage * 1.5);
        }
        
        // 随机因子（85%-100%）
        const randomFactor = 0.85 + Math.random() * 0.15;
        damage = Math.floor(damage * randomFactor);
        
        // 天气加成
        if (options.weather) {
            damage = this.applyWeatherModifier(damage, skill.type, options.weather);
        }
        
        // 确保至少造成1点伤害
        return Math.max(1, damage);
    }
    
    /**
     * 计算属性相克倍率
     * @param {string} attackType - 攻击属性
     * @param {Array} defenderTypes - 防御方的属性数组
     * @returns {number} 属性相克倍率
     */
    static calculateTypeEffectiveness(attackType, defenderTypes) {
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
     * 应用天气修正
     * @param {number} damage - 基础伤害
     * @param {string} moveType - 技能属性
     * @param {string} weather - 天气类型
     * @returns {number} 修正后的伤害
     */
    static applyWeatherModifier(damage, moveType, weather) {
        switch (weather) {
            case 'sunny':
                if (moveType === 'fire') return Math.floor(damage * 1.5);
                if (moveType === 'water') return Math.floor(damage * 0.5);
                break;
            case 'rain':
                if (moveType === 'water') return Math.floor(damage * 1.5);
                if (moveType === 'fire') return Math.floor(damage * 0.5);
                break;
            case 'sandstorm':
                // 沙暴天气下岩石系特防提升
                break;
            case 'hail':
                // 冰雹天气效果
                break;
        }
        return damage;
    }
    
    /**
     * 判断是否暴击
     * @param {Object} attacker - 攻击方宝可梦
     * @param {Object} options - 额外选项
     * @returns {boolean} 是否暴击
     */
    static checkCritical(attacker, options = {}) {
        // 基础暴击率 1/16
        let criticalRate = 1 / 16;
        
        // 高暴击率技能
        if (options.highCritical) {
            criticalRate = 1 / 8;
        }
        
        // 暴击率提升道具或特性
        if (options.criticalBoost) {
            criticalRate *= 2;
        }
        
        return Math.random() < criticalRate;
    }
    
    /**
     * 计算命中判定
     * @param {Object} attacker - 攻击方宝可梦
     * @param {Object} defender - 防御方宝可梦
     * @param {Object} skill - 使用的技能
     * @returns {Object} 命中结果 {hit: boolean, accuracy: number, roll: number}
     */
    static checkHit(attacker, defender, skill) {
        const baseAccuracy = skill.accuracy || 100;
        const random = Math.random() * 100;
        
        return {
            hit: random <= baseAccuracy,
            accuracy: baseAccuracy,
            roll: random
        };
    }
}

