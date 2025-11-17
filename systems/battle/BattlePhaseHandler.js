/**
 * 战斗阶段处理模块
 * 负责处理战斗的各个阶段
 */
class BattlePhaseHandler {
    constructor(eventBus, actionExecutor, statusEffectManager) {
        this.eventBus = eventBus;
        this.actionExecutor = actionExecutor;
        this.statusEffectManager = statusEffectManager;
    }
    
    /**
     * 处理回合开始阶段
     * @param {Object} battleState - 战斗状态
     * @param {number} turnNumber - 回合数
     * @param {Function} logCallback - 日志回调函数
     */
    async handleTurnStart(battleState, turnNumber, logCallback) {
        if (logCallback) {
            logCallback(`⏰ 第 ${turnNumber} 回合开始`);
        }
        
        // 天气效果
        if (battleState.weather) {
            await this.eventBus.emit('weather:tick', {
                weather: battleState.weather
            });
        }
        
        // 触发回合开始事件
        await this.eventBus.emit('turn:start', {
            turn: turnNumber
        });
    }
    
    /**
     * 处理动作优先级排序阶段
     * @param {Array} actions - 动作数组
     * @returns {Array} 排序后的动作数组
     */
    handleActionPriority(actions) {
        return actions.sort((a, b) => {
            // 1. 优先级比较
            const priorityA = a.skill?.priority || 0;
            const priorityB = b.skill?.priority || 0;
            
            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }
            
            // 2. 速度比较
            const speedA = this.getEffectiveSpeed(a.pokemon);
            const speedB = this.getEffectiveSpeed(b.pokemon);
            
            if (speedA !== speedB) {
                return speedB - speedA;
            }
            
            // 3. 随机决定
            return Math.random() - 0.5;
        });
    }
    
    /**
     * 处理动作执行阶段
     * @param {Object} action - 动作对象
     * @param {Function} logCallback - 日志回调函数
     */
    async handleActionExecute(action, logCallback) {
        const { type, pokemon } = action;
        
        console.log(`⚡ 执行动作: ${pokemon.name} 使用 ${action.skill?.name || action.type}`);
        
        if (type === 'skill' && action.skill) {
            await this.actionExecutor.executeSkill(action, logCallback);
        } else if (type === 'switch') {
            await this.actionExecutor.executeSwitch(action, logCallback);
        } else if (type === 'item') {
            await this.actionExecutor.executeItem(action, logCallback);
        }
    }
    
    /**
     * 处理特性触发阶段
     * @param {Object} battleState - 战斗状态
     */
    async handleAbilityTrigger(battleState) {
        const allPokemon = [
            battleState.playerPokemon,
            battleState.enemyPokemon
        ].filter(p => p && p.hp > 0);
        
        for (const pokemon of allPokemon) {
            if (pokemon.ability) {
                await this.eventBus.emit('ability:check', {
                    pokemon,
                    ability: pokemon.ability,
                    trigger: 'turn_ability_phase'
                });
            }
        }
    }
    
    /**
     * 处理状态效果阶段
     * @param {Object} battleState - 战斗状态
     */
    async handleStatusEffect(battleState) {
        const allPokemon = [
            battleState.playerPokemon,
            battleState.enemyPokemon
        ].filter(p => p && p.hp > 0);
        
        for (const pokemon of allPokemon) {
            if (pokemon.status && pokemon.status !== 'normal') {
                await this.statusEffectManager.processStatusEffect(pokemon);
            }
        }
    }
    
    /**
     * 处理回合结束阶段
     * @param {number} turnNumber - 回合数
     * @param {Function} logCallback - 日志回调函数
     */
    async handleTurnEnd(turnNumber, logCallback) {
        if (logCallback) {
            logCallback(`🔚 第 ${turnNumber} 回合结束`);
        }
        
        await this.eventBus.emit('turn:end', {
            turn: turnNumber
        });
    }
    
    /**
     * 获取有效速度（考虑状态效果）
     * @param {Object} pokemon - 宝可梦对象
     * @returns {number} 有效速度
     */
    getEffectiveSpeed(pokemon) {
        let speed = pokemon.speed || pokemon.stats?.speed || 100;
        
        // 应用状态效果
        if (pokemon.status === 'paralysis') {
            speed = Math.floor(speed * 0.25);
        }
        
        // 应用能力变化
        if (pokemon.statStages && pokemon.statStages.speed) {
            const stage = pokemon.statStages.speed;
            const multiplier = stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
            speed = Math.floor(speed * multiplier);
        }
        
        return speed;
    }
}

