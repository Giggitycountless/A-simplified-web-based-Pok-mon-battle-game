/**
 * 动作执行模块
 * 负责执行战斗中的各种动作（技能、换宝可梦、使用道具）
 */
class ActionExecutor {
    constructor(eventBus, damageCalculator, typeEffectiveness, statusEffectManager) {
        this.eventBus = eventBus;
        this.damageCalculator = damageCalculator;
        this.typeEffectiveness = typeEffectiveness;
        this.statusEffectManager = statusEffectManager;
    }
    
    /**
     * 执行技能动作
     * @param {Object} action - 动作对象
     * @param {Function} logCallback - 日志回调函数
     */
    async executeSkill(action, logCallback) {
        const { pokemon, skill, side, target } = action;
        
        // 触发技能使用事件
        await this.eventBus.emit('move:use', {
            attacker: pokemon,
            defender: target,
            move: skill,
            side
        });
        
        // 命中判定
        const hitResult = this.damageCalculator.checkHit(pokemon, target, skill);
        
        if (hitResult.hit) {
            // 技能命中
            await this.eventBus.emit('move:hit', {
                attacker: pokemon,
                defender: target,
                move: skill,
                side
            });
            
            // 计算属性相克倍率
            const effectiveness = this.typeEffectiveness.calculate(skill.type, target.type);
            
            // 显示属性相克信息
            if (skill.power > 0) {
                this.typeEffectiveness.display(effectiveness, logCallback);
            }
            
            // 计算伤害
            const damage = this.damageCalculator.calculateDamage(pokemon, target, skill);
            
            if (damage > 0) {
                // 造成伤害
                await this.eventBus.emit('pokemon:damage', {
                    pokemon: target,
                    damage,
                    source: skill,
                    attacker: pokemon
                });
            }
            
            // 处理技能效果
            if (skill.effect) {
                await this.processSkillEffect(skill, pokemon, target);
            }
            
        } else {
            // 技能未命中
            await this.eventBus.emit('move:miss', {
                attacker: pokemon,
                defender: target,
                move: skill,
                side
            });
        }
    }
    
    /**
     * 执行换宝可梦动作
     * @param {Object} action - 动作对象
     * @param {Function} logCallback - 日志回调函数
     */
    async executeSwitch(action, logCallback) {
        const { pokemon, newPokemon, side } = action;
        
        if (logCallback) {
            logCallback(`🔄 ${pokemon.name} 准备换宝可梦`);
        }
        
        // 触发换宝可梦事件
        await this.eventBus.emit('pokemon:switch', {
            oldPokemon: pokemon,
            newPokemon,
            side
        });
    }
    
    /**
     * 执行使用道具动作
     * @param {Object} action - 动作对象
     * @param {Function} logCallback - 日志回调函数
     */
    async executeItem(action, logCallback) {
        const { pokemon, item, side } = action;
        
        if (logCallback) {
            logCallback(`🎒 ${pokemon.name} 使用了道具`);
        }
        
        // 触发道具使用事件
        await this.eventBus.emit('item:use', {
            pokemon,
            item,
            side
        });
    }
    
    /**
     * 处理技能效果
     * @param {Object} skill - 技能对象
     * @param {Object} attacker - 攻击方
     * @param {Object} target - 目标
     */
    async processSkillEffect(skill, attacker, target) {
        if (!skill.effect) return;
        
        const { type, status, statChanges, probability } = skill.effect;
        
        // 概率判定
        if (probability && Math.random() * 100 > probability) {
            return;
        }
        
        switch (type) {
            case 'status':
                // 施加状态效果
                if (status) {
                    await this.statusEffectManager.applyStatus(target, status, skill);
                }
                break;
                
            case 'statChange':
                // 能力变化
                if (statChanges) {
                    await this.applyStatChanges(target, statChanges);
                }
                break;
                
            case 'heal':
                // 治疗效果
                const healAmount = Math.floor(target.maxHp * (skill.effect.amount || 0.5));
                await this.eventBus.emit('pokemon:heal', {
                    pokemon: target,
                    heal: healAmount,
                    source: skill
                });
                break;
        }
    }
    
    /**
     * 应用能力变化
     * @param {Object} pokemon - 宝可梦对象
     * @param {Object} statChanges - 能力变化对象
     */
    async applyStatChanges(pokemon, statChanges) {
        if (!pokemon.statStages) {
            pokemon.statStages = {
                attack: 0,
                defense: 0,
                spAttack: 0,
                spDefense: 0,
                speed: 0
            };
        }
        
        for (const [stat, change] of Object.entries(statChanges)) {
            pokemon.statStages[stat] = Math.max(-6, Math.min(6, pokemon.statStages[stat] + change));
        }
        
        await this.eventBus.emit('stat:change', {
            pokemon,
            statChanges
        });
    }
}

