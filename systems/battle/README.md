# 战斗系统模块化架构

## 📋 概述

本目录包含宝可梦战斗系统的核心模块。通过模块化设计，每个模块负责特定的功能，提高了代码的可维护性、可测试性和可扩展性。

## 🏗️ 架构图

```
战斗系统架构
├── MicroTurnScheduler (核心调度器)
│   ├── EventBus (事件总线)
│   ├── BattlePhaseHandler (阶段处理器)
│   │   ├── ActionExecutor (动作执行器)
│   │   │   ├── DamageCalculator (伤害计算)
│   │   │   ├── TypeEffectiveness (属性相克)
│   │   │   └── StatusEffectManager (状态管理)
│   │   └── StatusEffectManager
│   └── 各个战斗阶段
```

## 📦 模块说明

### 1. DamageCalculator.js - 伤害计算模块

**职责：** 计算战斗中的伤害值

**主要方法：**
- `calculateDamage(attacker, defender, skill, options)` - 计算最终伤害
- `calculateTypeEffectiveness(attackType, defenderTypes)` - 计算属性相克倍率
- `applyWeatherModifier(damage, moveType, weather)` - 应用天气修正
- `checkCritical(attacker, options)` - 判断是否暴击
- `checkHit(attacker, defender, skill)` - 命中判定

**特性：**
- 使用官方宝可梦伤害公式
- 支持属性相克计算
- 支持同属性加成（STAB）
- 支持暴击判定
- 支持天气效果
- 随机波动（85%-100%）

**使用示例：**
```javascript
const damage = DamageCalculator.calculateDamage(attacker, defender, skill, {
    level: 50,
    weather: 'rain',
    critical: false
});
```

### 2. TypeEffectiveness.js - 属性相克模块

**职责：** 计算和显示属性相克关系

**主要方法：**
- `calculate(attackType, defenderTypes)` - 计算属性相克倍率
- `getEffectivenessText(effectiveness)` - 获取文字描述
- `display(effectiveness, logCallback)` - 显示属性相克信息
- `isImmune(attackType, defenderTypes)` - 检查是否免疫
- `isSuperEffective(attackType, defenderTypes)` - 检查是否效果拔群
- `isNotVeryEffective(attackType, defenderTypes)` - 检查是否效果不佳

**使用示例：**
```javascript
const effectiveness = TypeEffectiveness.calculate('fire', ['grass', 'bug']);
// 返回: 4 (火克草×2, 火克虫×2)

TypeEffectiveness.display(effectiveness, addBattleLog);
// 输出: "💥 效果拔群！（4倍伤害）"
```

### 3. StatusEffectManager.js - 状态效果管理模块

**职责：** 管理宝可梦的状态效果（中毒、灼伤、麻痹等）

**主要方法：**
- `applyStatus(pokemon, status, source)` - 应用状态效果
- `removeStatus(pokemon)` - 移除状态效果
- `processStatusEffect(pokemon)` - 处理状态效果（每回合）
- `isImmune(pokemon, status)` - 检查是否免疫某个状态
- `getStatusName(status)` - 获取状态名称

**支持的状态：**
- `poison` - 中毒（每回合损失最大HP的1/8）
- `burn` - 灼伤（每回合损失最大HP的1/16）
- `paralysis` - 麻痹（速度降低75%）
- `sleep` - 睡眠（1-3回合无法行动）
- `freeze` - 冰冻（20%概率解冻）
- `confusion` - 混乱

**使用示例：**
```javascript
const manager = new StatusEffectManager(eventBus);
await manager.applyStatus(pokemon, 'burn', skill);
await manager.processStatusEffect(pokemon); // 每回合调用
```

### 4. ActionExecutor.js - 动作执行模块

**职责：** 执行战斗中的各种动作

**主要方法：**
- `executeSkill(action, logCallback)` - 执行技能动作
- `executeSwitch(action, logCallback)` - 执行换宝可梦动作
- `executeItem(action, logCallback)` - 执行使用道具动作
- `processSkillEffect(skill, attacker, target)` - 处理技能效果
- `applyStatChanges(pokemon, statChanges)` - 应用能力变化

**使用示例：**
```javascript
const executor = new ActionExecutor(eventBus, DamageCalculator, TypeEffectiveness, statusManager);
await executor.executeSkill({
    pokemon: attacker,
    skill: move,
    target: defender,
    side: 'player'
}, addBattleLog);
```

### 5. BattlePhaseHandler.js - 战斗阶段处理模块

**职责：** 处理战斗的各个阶段

**主要方法：**
- `handleTurnStart(battleState, turnNumber, logCallback)` - 回合开始
- `handleActionPriority(actions)` - 动作优先级排序
- `handleActionExecute(action, logCallback)` - 执行动作
- `handleAbilityTrigger(battleState)` - 特性触发
- `handleStatusEffect(battleState)` - 状态效果处理
- `handleTurnEnd(turnNumber, logCallback)` - 回合结束
- `getEffectiveSpeed(pokemon)` - 获取有效速度

**使用示例：**
```javascript
const handler = new BattlePhaseHandler(eventBus, actionExecutor, statusManager);
await handler.handleTurnStart(gameState, 1, addBattleLog);
const sortedActions = handler.handleActionPriority(actions);
```

## 🔄 战斗流程

一个完整的战斗回合包含以下阶段：

1. **TURN_START** - 回合开始
   - 天气效果处理
   - 场地效果处理
   
2. **ACTION_PRIORITY** - 动作优先级排序
   - 按技能优先级排序
   - 相同优先级按速度排序
   - 速度相同随机决定

3. **ACTION_EXECUTE** - 执行动作
   - 执行技能
   - 执行换宝可梦
   - 执行使用道具

4. **ABILITY_TRIGGER** - 特性触发
   - 检查并触发所有宝可梦的特性

5. **STATUS_EFFECT** - 状态效果
   - 处理中毒、灼伤等状态伤害

6. **TURN_END** - 回合结束
   - 清理临时效果
   - 更新持续回合数

## 🎯 优势

### 1. 模块化设计
- 每个模块职责单一，易于理解和维护
- 模块之间低耦合，高内聚

### 2. 可测试性
- 每个模块可以独立测试
- 易于编写单元测试

### 3. 可扩展性
- 添加新功能只需修改相关模块
- 不影响其他模块的功能

### 4. 可复用性
- 模块可以在不同的战斗系统中复用
- 易于集成到其他项目

## 📝 使用指南

### 在HTML中加载模块

```html
<!-- 1. 加载数据文件 -->
<script src="data/pokemon.js"></script>
<script src="data/types.js"></script>

<!-- 2. 加载战斗模块 -->
<script src="systems/battle/DamageCalculator.js"></script>
<script src="systems/battle/TypeEffectiveness.js"></script>
<script src="systems/battle/StatusEffectManager.js"></script>
<script src="systems/battle/ActionExecutor.js"></script>
<script src="systems/battle/BattlePhaseHandler.js"></script>

<!-- 3. 加载核心系统 -->
<script src="systems/core/EventBus.js"></script>
<script src="systems/core/MicroTurnScheduler.js"></script>
```

## 🔧 扩展建议

1. **添加新的状态效果**
   - 在 `StatusEffectManager.js` 中添加新的状态处理逻辑

2. **添加新的伤害计算因素**
   - 在 `DamageCalculator.js` 中扩展计算公式

3. **添加新的战斗阶段**
   - 在 `BattlePhaseHandler.js` 中添加新的阶段处理方法
   - 在 `MicroTurnScheduler.js` 中注册新阶段

4. **添加新的动作类型**
   - 在 `ActionExecutor.js` 中添加新的执行方法

