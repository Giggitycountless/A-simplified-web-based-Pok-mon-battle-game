/**
 * 状态效果管理模块
 * 负责管理宝可梦的状态效果（中毒、灼伤、麻痹等）
 */
class StatusEffectManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.statusNames = {
            poison: '中毒',
            burn: '灼伤',
            paralysis: '麻痹',
            sleep: '睡眠',
            freeze: '冰冻',
            confusion: '混乱',
            normal: '正常'
        };
    }
    
    /**
     * 应用状态效果
     * @param {Object} pokemon - 宝可梦对象
     * @param {string} status - 状态类型
     * @param {Object} source - 状态来源（技能、特性等）
     */
    async applyStatus(pokemon, status, source = null) {
        // 检查是否已有状态（一般情况下宝可梦只能有一个主要状态）
        if (pokemon.status && pokemon.status !== 'normal') {
            console.log(`${pokemon.name} 已经处于 ${this.statusNames[pokemon.status]} 状态`);
            return false;
        }
        
        // 检查免疫
        if (this.isImmune(pokemon, status)) {
            console.log(`${pokemon.name} 对 ${this.statusNames[status]} 免疫`);
            return false;
        }
        
        pokemon.status = status;
        
        // 触发状态应用事件
        if (this.eventBus) {
            await this.eventBus.emit('status:apply', {
                pokemon,
                status,
                source
            });
        }
        
        return true;
    }
    
    /**
     * 移除状态效果
     * @param {Object} pokemon - 宝可梦对象
     */
    async removeStatus(pokemon) {
        const oldStatus = pokemon.status;
        pokemon.status = 'normal';
        
        if (this.eventBus) {
            await this.eventBus.emit('status:remove', {
                pokemon,
                status: oldStatus
            });
        }
    }
    
    /**
     * 处理状态效果（每回合结束时调用）
     * @param {Object} pokemon - 宝可梦对象
     */
    async processStatusEffect(pokemon) {
        if (!pokemon.status || pokemon.status === 'normal') {
            return;
        }
        
        const { status } = pokemon;
        
        switch (status) {
            case 'poison':
                await this.processPoisonDamage(pokemon);
                break;
                
            case 'burn':
                await this.processBurnDamage(pokemon);
                break;
                
            case 'sleep':
                await this.processSleep(pokemon);
                break;
                
            case 'freeze':
                await this.processFreeze(pokemon);
                break;
                
            case 'paralysis':
                // 麻痹状态在速度计算时处理
                break;
        }
    }
    
    /**
     * 处理中毒伤害
     */
    async processPoisonDamage(pokemon) {
        const damage = Math.floor(pokemon.maxHp / 8);
        
        if (this.eventBus) {
            await this.eventBus.emit('pokemon:damage', {
                pokemon,
                damage,
                source: 'poison'
            });
        }
    }
    
    /**
     * 处理灼伤伤害
     */
    async processBurnDamage(pokemon) {
        const damage = Math.floor(pokemon.maxHp / 16);
        
        if (this.eventBus) {
            await this.eventBus.emit('pokemon:damage', {
                pokemon,
                damage,
                source: 'burn'
            });
        }
    }
    
    /**
     * 处理睡眠状态
     */
    async processSleep(pokemon) {
        // 睡眠回合数递减
        if (pokemon.sleepTurns === undefined) {
            pokemon.sleepTurns = Math.floor(Math.random() * 3) + 1; // 1-3回合
        }
        
        pokemon.sleepTurns--;
        
        if (pokemon.sleepTurns <= 0) {
            await this.removeStatus(pokemon);
        }
    }
    
    /**
     * 处理冰冻状态
     */
    async processFreeze(pokemon) {
        // 20%概率解冻
        if (Math.random() < 0.2) {
            await this.removeStatus(pokemon);
        }
    }
    
    /**
     * 检查是否免疫某个状态
     */
    isImmune(pokemon, status) {
        // 火系免疫灼伤
        if (status === 'burn' && pokemon.type.includes('fire')) {
            return true;
        }
        
        // 冰系免疫冰冻
        if (status === 'freeze' && pokemon.type.includes('ice')) {
            return true;
        }
        
        // 电系免疫麻痹
        if (status === 'paralysis' && pokemon.type.includes('electric')) {
            return true;
        }
        
        // 毒系和钢系免疫中毒
        if (status === 'poison' && (pokemon.type.includes('poison') || pokemon.type.includes('steel'))) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 获取状态名称
     */
    getStatusName(status) {
        return this.statusNames[status] || status;
    }
}

