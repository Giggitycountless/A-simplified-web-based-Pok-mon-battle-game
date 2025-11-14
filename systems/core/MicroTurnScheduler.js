/**
 * 微回合调度器 - 核心战斗流程管理
 */
class MicroTurnScheduler {
    constructor(battleSystem) {
        this.battleSystem = battleSystem;
        this.eventBus = new EventBus();
        this.currentTurn = 1;
        this.currentSubTurn = 0;
        this.actionQueue = [];
        this.phaseHandlers = new Map();

        // ⏱️ 延迟配置（毫秒）
        this.delays = {
            phaseTransition: 200,    // 阶段切换延迟
            actionExecution: 400,    // 动作执行延迟
            damageAnimation: 300,    // 伤害动画延迟
            statusEffect: 250        // 状态效果延迟
        };

        this.initializePhaseHandlers();
        this.setupEventListeners();
    }

    // 初始化阶段处理器
    initializePhaseHandlers() {
        this.phaseHandlers.set('TURN_START', this.handleTurnStart.bind(this));
        this.phaseHandlers.set('ACTION_PRIORITY', this.handleActionPriority.bind(this));
        this.phaseHandlers.set('ACTION_EXECUTE', this.handleActionExecute.bind(this));
        this.phaseHandlers.set('ABILITY_TRIGGER', this.handleAbilityTrigger.bind(this));
        this.phaseHandlers.set('STATUS_EFFECT', this.handleStatusEffect.bind(this));
        this.phaseHandlers.set('TURN_END', this.handleTurnEnd.bind(this));
    }

    // 设置事件监听器
    setupEventListeners() {
        // 伤害事件
        this.eventBus.on('pokemon:damage', this.onPokemonDamage.bind(this), 100);
        this.eventBus.on('pokemon:heal', this.onPokemonHeal.bind(this), 100);
        this.eventBus.on('pokemon:faint', this.onPokemonFaint.bind(this), 200);
        
        // 状态事件
        this.eventBus.on('status:apply', this.onStatusApply.bind(this), 100);
        this.eventBus.on('status:remove', this.onStatusRemove.bind(this), 100);
        
        // 技能事件
        this.eventBus.on('move:use', this.onMoveUse.bind(this), 100);
        this.eventBus.on('move:hit', this.onMoveHit.bind(this), 100);
        this.eventBus.on('move:miss', this.onMoveMiss.bind(this), 100);
        
        // 特性事件
        this.eventBus.on('ability:trigger', this.onAbilityTrigger.bind(this), 150);
    }

    // 执行完整回合
    async executeTurn(playerAction, opponentAction) {
        console.log(`\n🎯 ===== 第 ${this.currentTurn} 回合开始 =====`);
        this.currentSubTurn = 0;

        try {
            // 阶段1: 回合开始
            await this.executePhase('TURN_START');
            await this.delay(this.delays.phaseTransition);

            // 阶段2: 动作优先级排序
            const sortedActions = await this.executePhase('ACTION_PRIORITY', {
                playerAction,
                opponentAction
            });
            await this.delay(this.delays.phaseTransition);

            // 阶段3: 执行动作
            for (const action of sortedActions) {
                if (!this.battleSystem.gameState.battleActive) break;

                await this.executePhase('ACTION_EXECUTE', action);
                await this.delay(this.delays.actionExecution);
                await this.eventBus.processTriggerQueue();
                await this.delay(this.delays.damageAnimation);
            }

            // 阶段4: 特性触发
            await this.executePhase('ABILITY_TRIGGER');
            await this.delay(this.delays.phaseTransition);

            // 阶段5: 状态效果
            await this.executePhase('STATUS_EFFECT');
            await this.delay(this.delays.statusEffect);

            // 阶段6: 回合结束
            await this.executePhase('TURN_END');
            await this.delay(this.delays.phaseTransition);

            this.currentTurn++;

        } catch (error) {
            console.error('❌ 回合执行错误:', error);
            this.battleSystem.addBattleLog(`⚠️ 系统错误: ${error.message}`);
        }

        console.log(`🏁 ===== 第 ${this.currentTurn - 1} 回合结束 =====\n`);
        return this.battleSystem.gameState;
    }

    // ⏱️ 延迟工具函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 执行单个阶段
    async executePhase(phaseName, data = null) {
        const subTurnId = `${this.currentTurn}-${++this.currentSubTurn}`;
        console.log(`📍 [${subTurnId}] 执行阶段: ${phaseName}`);
        
        // 触发阶段开始事件
        await this.eventBus.emit(`phase:${phaseName.toLowerCase()}:start`, {
            turn: this.currentTurn,
            subTurn: this.currentSubTurn,
            data
        });
        
        // 执行阶段处理器
        const handler = this.phaseHandlers.get(phaseName);
        let result = null;
        
        if (handler) {
            result = await handler(data);
        }
        
        // 触发阶段结束事件
        await this.eventBus.emit(`phase:${phaseName.toLowerCase()}:end`, {
            turn: this.currentTurn,
            subTurn: this.currentSubTurn,
            data,
            result
        });
        
        return result;
    }

    // ==================== 阶段处理器 ====================

    async handleTurnStart(data) {
        this.battleSystem.addBattleLog(`⏰ 第 ${this.currentTurn} 回合开始`);
        
        // 天气效果
        if (this.battleSystem.gameState.weather) {
            await this.eventBus.emit('weather:tick', {
                weather: this.battleSystem.gameState.weather
            });
        }
        
        // PP恢复等
        await this.eventBus.emit('turn:start', {
            turn: this.currentTurn
        });
    }

    async handleActionPriority(data) {
        const { playerAction, opponentAction } = data;
        const actions = [];
        
        if (playerAction) {
            actions.push({
                ...playerAction,
                pokemon: this.battleSystem.gameState.playerPokemon,
                side: 'player'
            });
        }
        
        if (opponentAction) {
            actions.push({
                ...opponentAction,
                pokemon: this.battleSystem.gameState.enemyPokemon,
                side: 'enemy'
            });
        }
        
        // 按优先级和速度排序
        return this.sortActionsByPriority(actions);
    }

    async handleActionExecute(action) {
        const { type, pokemon, side } = action;
        
        console.log(`⚡ 执行动作: ${pokemon.name} 使用 ${action.skill?.name || action.type}`);
        
        if (type === 'skill' && action.skill) {
            await this.executeSkillAction(action);
        } else if (type === 'switch') {
            await this.executeSwitchAction(action);
        } else if (type === 'item') {
            await this.executeItemAction(action);
        }
    }

    async handleAbilityTrigger(data) {
        // 触发所有宝可梦的特性
        const allPokemon = [
            this.battleSystem.gameState.playerPokemon,
            this.battleSystem.gameState.enemyPokemon
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

    async handleStatusEffect(data) {
        const allPokemon = [
            this.battleSystem.gameState.playerPokemon,
            this.battleSystem.gameState.enemyPokemon
        ].filter(p => p && p.hp > 0);
        
        for (const pokemon of allPokemon) {
            if (pokemon.status && pokemon.status !== 'normal') {
                await this.processStatusEffect(pokemon);
            }
        }
    }

    async handleTurnEnd(data) {
        this.battleSystem.addBattleLog(`🔚 第 ${this.currentTurn} 回合结束`);
        
        await this.eventBus.emit('turn:end', {
            turn: this.currentTurn
        });
    }

    // ==================== 动作执行器 ====================

    async executeSkillAction(action) {
        const { pokemon, skill, side } = action;
        const target = side === 'player' ? 
            this.battleSystem.gameState.enemyPokemon : 
            this.battleSystem.gameState.playerPokemon;
        
        // 触发技能使用事件
        await this.eventBus.emit('move:use', {
            attacker: pokemon,
            defender: target,
            move: skill,
            side
        });
        
        // 命中判定
        const hitResult = this.calculateHitChance(pokemon, target, skill);
        
        if (hitResult.hit) {
            // 技能命中
            await this.eventBus.emit('move:hit', {
                attacker: pokemon,
                defender: target,
                move: skill,
                side
            });
            
            // 计算伤害
            const damage = this.battleSystem.calculateDamage(pokemon, target, skill);
            
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

    async executeSwitchAction(action) {
        // 换宝可梦逻辑
        this.battleSystem.addBattleLog(`🔄 ${action.pokemon.name} 准备换宝可梦`);
    }

    async executeItemAction(action) {
        // 使用道具逻辑
        this.battleSystem.addBattleLog(`🎒 ${action.pokemon.name} 使用了道具`);
    }

    // ==================== 工具方法 ====================

    sortActionsByPriority(actions) {
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

    getEffectiveSpeed(pokemon) {
        let speed = pokemon.speed || pokemon.stats?.speed || 100;
        
        // 应用状态效果
        if (pokemon.status === 'paralysis') {
            speed = Math.floor(speed * 0.25);
        }
        
        return speed;
    }

    calculateHitChance(attacker, defender, skill) {
        const baseAccuracy = skill.accuracy || 100;
        const random = Math.random() * 100;
        
        return {
            hit: random <= baseAccuracy,
            accuracy: baseAccuracy,
            roll: random
        };
    }

    async processSkillEffect(skill, attacker, target) {
        if (skill.effect?.type === 'status') {
            await this.eventBus.emit('status:apply', {
                pokemon: target,
                status: skill.effect.status,
                source: skill
            });
        }
    }

    async processStatusEffect(pokemon) {
        const { status } = pokemon;
        
        switch (status) {
            case 'poison':
                const poisonDamage = Math.floor(pokemon.maxHp / 8);
                await this.eventBus.emit('pokemon:damage', {
                    pokemon,
                    damage: poisonDamage,
                    source: 'poison'
                });
                break;
                
            case 'burn':
                const burnDamage = Math.floor(pokemon.maxHp / 16);
                await this.eventBus.emit('pokemon:damage', {
                    pokemon,
                    damage: burnDamage,
                    source: 'burn'
                });
                break;
        }
    }

    // ==================== 事件处理器 ====================

    async onPokemonDamage(data) {
        const { pokemon, damage, source } = data;
        const oldHp = pokemon.hp;
        pokemon.hp = Math.max(0, pokemon.hp - damage);
        
        this.battleSystem.addBattleLog(
            `💥 ${pokemon.name} 受到 ${damage} 伤害！(${oldHp} → ${pokemon.hp})`
        );
        
        // 更新UI
        this.battleSystem.updatePokemonDisplay(pokemon);
        
        // 检查是否倒下
        if (pokemon.hp <= 0) {
            await this.eventBus.emit('pokemon:faint', { pokemon });
        }
    }

    async onPokemonHeal(data) {
        const { pokemon, heal } = data;
        const oldHp = pokemon.hp;
        pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + heal);
        
        this.battleSystem.addBattleLog(
            `💚 ${pokemon.name} 恢复了 ${heal} HP！(${oldHp} → ${pokemon.hp})`
        );
        
        this.battleSystem.updatePokemonDisplay(pokemon);
    }

    async onPokemonFaint(data) {
        const { pokemon } = data;
        this.battleSystem.addBattleLog(`💀 ${pokemon.name} 倒下了！`);
        
        // 检查战斗是否结束
        this.battleSystem.checkBattleEnd();
    }

    async onStatusApply(data) {
        const { pokemon, status, source } = data;
        pokemon.status = status;
        
        this.battleSystem.addBattleLog(
            `🌟 ${pokemon.name} 陷入了${this.getStatusName(status)}状态！`
        );
    }

    async onStatusRemove(data) {
        const { pokemon, status } = data;
        pokemon.status = 'normal';
        
        this.battleSystem.addBattleLog(
            `✨ ${pokemon.name} 的${this.getStatusName(status)}状态解除了！`
        );
    }

    async onMoveUse(data) {
        const { attacker, move } = data;
        this.battleSystem.addBattleLog(`⚔️ ${attacker.name} 使用了 ${move.name}！`);
    }

    async onMoveHit(data) {
        // 技能命中的额外处理
    }

    async onMoveMiss(data) {
        const { attacker, move } = data;
        this.battleSystem.addBattleLog(`❌ ${attacker.name} 的 ${move.name} 没有命中！`);
    }

    async onAbilityTrigger(data) {
        const { pokemon, ability } = data;
        this.battleSystem.addBattleLog(`✨ ${pokemon.name} 的特性 ${ability.name} 发动了！`);
    }

    getStatusName(status) {
        const statusNames = {
            poison: '中毒',
            burn: '灼伤',
            paralysis: '麻痹',
            sleep: '睡眠',
            freeze: '冰冻'
        };
        return statusNames[status] || status;
    }
}