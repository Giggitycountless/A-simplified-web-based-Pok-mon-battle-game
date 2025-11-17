/**
 * 微回合调度器 - 核心战斗流程管理
 * 重构版：使用模块化架构
 */
class MicroTurnScheduler {
    constructor(battleSystem) {
        this.battleSystem = battleSystem;
        this.eventBus = new EventBus();
        this.currentTurn = 1;
        this.currentSubTurn = 0;
        this.actionQueue = [];

        // ⏱️ 延迟配置（毫秒）
        this.delays = {
            phaseTransition: 200,    // 阶段切换延迟
            actionExecution: 400,    // 动作执行延迟
            damageAnimation: 300,    // 伤害动画延迟
            statusEffect: 250        // 状态效果延迟
        };

        // 初始化模块化组件
        this.initializeModules();
        this.setupEventListeners();
    }

    /**
     * 初始化模块化组件
     */
    initializeModules() {
        // 状态效果管理器
        this.statusEffectManager = new StatusEffectManager(this.eventBus);

        // 动作执行器
        this.actionExecutor = new ActionExecutor(
            this.eventBus,
            DamageCalculator,
            TypeEffectiveness,
            this.statusEffectManager
        );

        // 战斗阶段处理器
        this.phaseHandler = new BattlePhaseHandler(
            this.eventBus,
            this.actionExecutor,
            this.statusEffectManager
        );
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

        // 使用模块化的阶段处理器
        let result = null;

        switch (phaseName) {
            case 'TURN_START':
                await this.phaseHandler.handleTurnStart(
                    this.battleSystem.gameState,
                    this.currentTurn,
                    this.battleSystem.addBattleLog.bind(this.battleSystem)
                );
                break;

            case 'ACTION_PRIORITY':
                const { playerAction, opponentAction } = data;
                const actions = [];

                if (playerAction) {
                    actions.push({
                        ...playerAction,
                        pokemon: this.battleSystem.gameState.playerPokemon,
                        target: this.battleSystem.gameState.enemyPokemon,
                        side: 'player'
                    });
                }

                if (opponentAction) {
                    actions.push({
                        ...opponentAction,
                        pokemon: this.battleSystem.gameState.enemyPokemon,
                        target: this.battleSystem.gameState.playerPokemon,
                        side: 'enemy'
                    });
                }

                result = this.phaseHandler.handleActionPriority(actions);
                break;

            case 'ACTION_EXECUTE':
                await this.phaseHandler.handleActionExecute(
                    data,
                    this.battleSystem.addBattleLog.bind(this.battleSystem)
                );
                break;

            case 'ABILITY_TRIGGER':
                await this.phaseHandler.handleAbilityTrigger(this.battleSystem.gameState);
                break;

            case 'STATUS_EFFECT':
                await this.phaseHandler.handleStatusEffect(this.battleSystem.gameState);
                break;

            case 'TURN_END':
                await this.phaseHandler.handleTurnEnd(
                    this.currentTurn,
                    this.battleSystem.addBattleLog.bind(this.battleSystem)
                );
                break;
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

    // ==================== 工具方法（保留用于向后兼容）====================

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
        return this.statusEffectManager.getStatusName(status);
    }
}