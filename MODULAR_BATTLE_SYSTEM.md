# 🎮 模块化战斗系统架构文档

## 📋 目录

1. [概述](#概述)
2. [架构设计](#架构设计)
3. [模块详解](#模块详解)
4. [战斗流程](#战斗流程)
5. [使用指南](#使用指南)
6. [扩展开发](#扩展开发)

---

## 概述

本项目采用**模块化架构**重构了宝可梦战斗系统，将原本耦合在一起的代码拆分为多个独立的、职责单一的模块。这种设计提高了代码的可维护性、可测试性和可扩展性。

### 🎯 设计目标

- **单一职责原则**：每个模块只负责一个特定的功能
- **低耦合高内聚**：模块之间通过清晰的接口通信
- **易于测试**：每个模块可以独立测试
- **易于扩展**：添加新功能不影响现有模块

### 📊 重构前后对比

| 方面 | 重构前 | 重构后 |
|------|--------|--------|
| 代码组织 | 所有逻辑混在一起 | 按功能分模块 |
| 可维护性 | 难以定位和修改 | 清晰的模块边界 |
| 可测试性 | 难以单元测试 | 每个模块可独立测试 |
| 可扩展性 | 修改影响范围大 | 只需修改相关模块 |
| 代码复用 | 代码重复多 | 模块可复用 |

---

## 架构设计

### 🏗️ 分层架构

```
┌─────────────────────────────────────────┐
│         核心调度层 (Core Layer)          │
│  MicroTurnScheduler + EventBus          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       阶段处理层 (Phase Layer)           │
│       BattlePhaseHandler                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       动作执行层 (Action Layer)          │
│         ActionExecutor                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    计算与管理层 (Calculation Layer)      │
│  DamageCalculator + TypeEffectiveness   │
│     + StatusEffectManager               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         数据层 (Data Layer)              │
│    Pokemon Data + Type Data             │
└─────────────────────────────────────────┘
```

### 🔄 模块依赖关系

```
MicroTurnScheduler
├── EventBus
├── BattlePhaseHandler
│   ├── ActionExecutor
│   │   ├── DamageCalculator
│   │   ├── TypeEffectiveness
│   │   └── StatusEffectManager
│   └── StatusEffectManager
└── 战斗阶段管理
```

---

## 模块详解

### 1️⃣ DamageCalculator - 伤害计算模块

**文件位置：** `systems/battle/DamageCalculator.js`

**职责：** 计算战斗中的伤害值

**核心功能：**
- ✅ 基础伤害计算（官方公式）
- ✅ 属性相克倍率
- ✅ 同属性加成（STAB）
- ✅ 暴击判定
- ✅ 天气修正
- ✅ 随机波动（85%-100%）

**API：**
```javascript
// 计算伤害
DamageCalculator.calculateDamage(attacker, defender, skill, {
    level: 50,
    weather: 'rain',
    critical: false
});

// 暴击判定
DamageCalculator.checkCritical(attacker, { highCritical: true });

// 命中判定
DamageCalculator.checkHit(attacker, defender, skill);
```

---

### 2️⃣ TypeEffectiveness - 属性相克模块

**文件位置：** `systems/battle/TypeEffectiveness.js`

**职责：** 计算和显示属性相克关系

**核心功能：**
- ✅ 属性相克倍率计算
- ✅ 双属性组合计算
- ✅ 文字描述生成
- ✅ 免疫判定
- ✅ 效果拔群/不佳判定

**API：**
```javascript
// 计算属性相克
const effectiveness = TypeEffectiveness.calculate('fire', ['grass', 'bug']);
// 返回: 4 (火克草×2, 火克虫×2)

// 获取文字描述
const text = TypeEffectiveness.getEffectivenessText(4);
// 返回: "💥 效果拔群！（4倍伤害）"

// 显示信息
TypeEffectiveness.display(effectiveness, addBattleLog);

// 判定方法
TypeEffectiveness.isImmune('electric', ['ground']); // true
TypeEffectiveness.isSuperEffective('water', ['fire']); // true
```

---

### 3️⃣ StatusEffectManager - 状态效果管理模块

**文件位置：** `systems/battle/StatusEffectManager.js`

**职责：** 管理宝可梦的状态效果

**支持的状态：**
- 🟣 **poison** - 中毒（每回合损失最大HP的1/8）
- 🔥 **burn** - 灼伤（每回合损失最大HP的1/16，物攻减半）
- ⚡ **paralysis** - 麻痹（速度降低75%）
- 💤 **sleep** - 睡眠（1-3回合无法行动）
- ❄️ **freeze** - 冰冻（20%概率解冻）
- 😵 **confusion** - 混乱（50%概率自伤）

**API：**
```javascript
const manager = new StatusEffectManager(eventBus);

// 应用状态
await manager.applyStatus(pokemon, 'burn', skill);

// 处理状态效果（每回合调用）
await manager.processStatusEffect(pokemon);

// 移除状态
await manager.removeStatus(pokemon);

// 检查免疫
manager.isImmune(pokemon, 'burn'); // 火系免疫灼伤
```

---

### 4️⃣ ActionExecutor - 动作执行模块

**文件位置：** `systems/battle/ActionExecutor.js`

**职责：** 执行战斗中的各种动作

**支持的动作类型：**
- ⚔️ **技能** - 使用技能攻击
- 🔄 **换宝可梦** - 切换出战宝可梦
- 🎒 **使用道具** - 使用战斗道具

**API：**
```javascript
const executor = new ActionExecutor(
    eventBus,
    DamageCalculator,
    TypeEffectiveness,
    statusManager
);

// 执行技能
await executor.executeSkill({
    pokemon: attacker,
    skill: move,
    target: defender,
    side: 'player'
}, addBattleLog);

// 执行换宝可梦
await executor.executeSwitch(action, addBattleLog);

// 执行使用道具
await executor.executeItem(action, addBattleLog);
```

---

### 5️⃣ BattlePhaseHandler - 战斗阶段处理模块

**文件位置：** `systems/battle/BattlePhaseHandler.js`

**职责：** 处理战斗的各个阶段

**战斗阶段：**
1. **TURN_START** - 回合开始
2. **ACTION_PRIORITY** - 动作优先级排序
3. **ACTION_EXECUTE** - 执行动作
4. **ABILITY_TRIGGER** - 特性触发
5. **STATUS_EFFECT** - 状态效果处理
6. **TURN_END** - 回合结束

**API：**
```javascript
const handler = new BattlePhaseHandler(
    eventBus,
    actionExecutor,
    statusManager
);

// 处理回合开始
await handler.handleTurnStart(gameState, turnNumber, addBattleLog);

// 动作优先级排序
const sortedActions = handler.handleActionPriority(actions);

// 执行动作
await handler.handleActionExecute(action, addBattleLog);
```

---

## 战斗流程

### 完整回合流程图

```
开始回合
    ↓
[1] TURN_START - 回合开始
    ├─ 天气效果
    ├─ 场地效果
    └─ 触发回合开始事件
    ↓
[2] ACTION_PRIORITY - 动作排序
    ├─ 按技能优先级排序
    ├─ 相同优先级按速度排序
    └─ 速度相同随机决定
    ↓
[3] ACTION_EXECUTE - 执行动作
    ├─ 命中判定
    ├─ 伤害计算
    ├─ 属性相克判定
    ├─ 造成伤害
    └─ 处理技能效果
    ↓
[4] ABILITY_TRIGGER - 特性触发
    └─ 检查并触发所有特性
    ↓
[5] STATUS_EFFECT - 状态效果
    ├─ 中毒伤害
    ├─ 灼伤伤害
    └─ 其他状态处理
    ↓
[6] TURN_END - 回合结束
    ├─ 清理临时效果
    └─ 更新持续回合数
    ↓
结束回合
```

---

## 使用指南

### 📦 安装和加载

在HTML文件中按顺序加载模块：

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

<!-- 4. 加载主逻辑 -->
<script src="battle-enhanced-micro.js"></script>
```

### 🚀 快速开始

```javascript
// 初始化战斗系统
const scheduler = new MicroTurnScheduler(battleSystem);

// 执行一个回合
await scheduler.executeTurn(playerAction, opponentAction);
```

---

## 扩展开发

### 🔧 添加新的状态效果

1. 在 `StatusEffectManager.js` 中添加新状态：

```javascript
async processStatusEffect(pokemon) {
    switch (status) {
        case 'newStatus':
            // 处理新状态的逻辑
            break;
    }
}
```

2. 添加免疫判定：

```javascript
isImmune(pokemon, status) {
    if (status === 'newStatus' && pokemon.type.includes('someType')) {
        return true;
    }
}
```

### 🎯 添加新的伤害计算因素

在 `DamageCalculator.js` 中扩展：

```javascript
static calculateDamage(attacker, defender, skill, options) {
    // ... 现有逻辑
    
    // 添加新的修正因素
    if (options.newFactor) {
        damage = this.applyNewFactor(damage, options.newFactor);
    }
    
    return damage;
}
```

### 📊 添加新的战斗阶段

1. 在 `BattlePhaseHandler.js` 中添加处理方法
2. 在 `MicroTurnScheduler.js` 的 `executePhase` 中注册新阶段

---

## 📚 相关文档

- [战斗系统详细文档](./BATTLE_SYSTEM_DOCUMENTATION.md)
- [模块API文档](./systems/battle/README.md)
- [数据结构分析](./DATA_STRUCTURE_ANALYSIS.md)

---

**版本：** 2.0 (模块化重构版)  
**最后更新：** 2025-11-17

