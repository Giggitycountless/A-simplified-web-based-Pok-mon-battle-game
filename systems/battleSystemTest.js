/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POKÉBATTLE - 对战系统使用示例与测试
 * Battle System Example & Test Suite
 * ═══════════════════════════════════════════════════════════════════════════
 */

// 引入战斗系统（浏览器环境）
// <script src="systems/battleSystem.js"></script>

/**
 * 快速开始示例 - 创建一个完整的对战
 */
async function quickStartBattle() {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('  宝可梦对战系统 - 对战演示');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // ═══════════════════════════════════════════════════════════════════════
    // 创建玩家战队
    // ═══════════════════════════════════════════════════════════════════════

    const playerTeam = [
        new Pokemon(6, 50, 'adamant'), // 喷火龙（攻击性格）
        new Pokemon(9, 50, 'timid'),   // 水箭龟（速度性格）
        new Pokemon(25, 50, 'jolly')   // 皮卡丘（速度性格）
    ];

    const opponentTeam = [
        new Pokemon(150, 50, 'modest'), // 超梦（特攻性格）
        new Pokemon(1, 50, 'bold'),     // 妙蛙种子（防御性格）
        new Pokemon(25, 50, 'hasty')    // 皮卡丘（特攻性格）
    ];

    // ═══════════════════════════════════════════════════════════════════════
    // 初始化战斗
    // ═══════════════════════════════════════════════════════════════════════

    const battle = new BattleStateManager(playerTeam, opponentTeam, {
        isSimulating: true
    });

    console.log('🏟️ 对战开始！\n');
    console.log(`玩家派出：${playerTeam[0].name}`);
    console.log(`  属性：${playerTeam[0].type.join('/')}`);
    console.log(`  HP: ${playerTeam[0].stats.hp}`);
    console.log(`  攻击: ${playerTeam[0].stats.atk}`);
    console.log(`  防御: ${playerTeam[0].stats.def}`);
    console.log(`  特攻: ${playerTeam[0].stats.spAtk}`);
    console.log(`  特防: ${playerTeam[0].stats.spDef}`);
    console.log(`  速度: ${playerTeam[0].stats.spe}\n`);

    console.log(`对手派出：${opponentTeam[0].name}`);
    console.log(`  属性：${opponentTeam[0].type.join('/')}`);
    console.log(`  HP: ${opponentTeam[0].stats.hp}`);
    console.log(`  攻击: ${opponentTeam[0].stats.atk}`);
    console.log(`  防御: ${opponentTeam[0].stats.def}`);
    console.log(`  特攻: ${opponentTeam[0].stats.spAtk}`);
    console.log(`  特防: ${opponentTeam[0].stats.spDef}`);
    console.log(`  速度: ${opponentTeam[0].stats.spe}\n`);

    // ═══════════════════════════════════════════════════════════════════════
    // 执行回合
    // ═══════════════════════════════════════════════════════════════════════

    let turnCount = 0;
    const maxTurns = 10; // 限制回合数

    while (battle.battleState === 'running' && turnCount < maxTurns) {
        // 获取玩家行动（自动AI）
        const playerAction = null;
        
        // 获取对手行动（自动AI）
        const opponentAction = null;

        // 执行回合
        const result = await battle.runTurn(playerAction, opponentAction);
        
        turnCount++;

        // 短暂延迟以便阅读输出
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 显示结果
    // ═══════════════════════════════════════════════════════════════════════

    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('  对战结束');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    if (battle.battleState === 'playerWon') {
        console.log('🎉 玩家赢得了胜利！');
    } else if (battle.battleState === 'opponentWon') {
        console.log('😢 对手赢得了胜利...');
    } else {
        console.log('⏱️ 对战平局！');
    }

    console.log(`\n对战进行了 ${turnCount} 回合`);
    console.log(`\n战斗日志：`);
    battle.battleLog.forEach(log => console.log(log));
}

/**
 * 单元测试 - 测试类型相克系统
 */
function testTypeEffectiveness() {
    console.log('\n\n═══════════════════════════════════════════════════════════════════');
    console.log('  单元测试：属性相克系统');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    const tests = [
        { attack: 'fire', defense: ['grass'], expected: 4, desc: '火克草' },
        { attack: 'fire', defense: ['water'], expected: 0.5, desc: '火被水克' },
        { attack: 'water', defense: ['fire', 'ground'], expected: 4, desc: '水克火和地面' },
        { attack: 'electric', defense: ['water', 'flying'], expected: 4, desc: '电克水和飞行' },
        { attack: 'ice', defense: ['dragon'], expected: 2, desc: '冰克龙' },
        { attack: 'fighting', defense: ['normal'], expected: 2, desc: '格斗克一般' },
        { attack: 'psychic', defense: ['psychic'], expected: 1, desc: '超能与超能' }
    ];

    tests.forEach((test, index) => {
        const result = calculateTypeEffectiveness(test.attack, test.defense);
        const passed = result === test.expected;
        const icon = passed ? '✅' : '❌';
        
        console.log(`${icon} 测试 ${index + 1}: ${test.desc}`);
        console.log(`   攻击属性: ${test.attack}, 防御属性: ${test.defense.join(',')}`);
        console.log(`   期望倍数: ${test.expected}×, 实际倍数: ${result}×`);
        console.log('');
    });
}

/**
 * 单元测试 - 测试宝可梦属性计算
 */
function testPokemonStats() {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('  单元测试：宝可梦属性计算');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // 创建不同性格的喷火龙
    const charizardAdamant = new Pokemon(6, 50, 'adamant'); // 攻击+10%
    const charizardModest = new Pokemon(6, 50, 'modest');   // 特攻+10%
    const charizardTroll = new Pokemon(6, 50, 'bold');      // 防御+10%, 攻击-10%

    console.log('喷火龙 @ 50级');
    console.log(`\n🔴 Adamant性格（攻击+10%, 特攻-10%）:`);
    console.log(`  HP: ${charizardAdamant.stats.hp}`);
    console.log(`  攻击: ${charizardAdamant.stats.atk}`);
    console.log(`  防御: ${charizardAdamant.stats.def}`);
    console.log(`  特攻: ${charizardAdamant.stats.spAtk}`);
    console.log(`  特防: ${charizardAdamant.stats.spDef}`);
    console.log(`  速度: ${charizardAdamant.stats.spe}`);

    console.log(`\n🔵 Modest性格（特攻+10%, 攻击-10%）:`);
    console.log(`  HP: ${charizardModest.stats.hp}`);
    console.log(`  攻击: ${charizardModest.stats.atk}`);
    console.log(`  防御: ${charizardModest.stats.def}`);
    console.log(`  特攻: ${charizardModest.stats.spAtk}`);
    console.log(`  特防: ${charizardModest.stats.spDef}`);
    console.log(`  速度: ${charizardModest.stats.spe}`);

    console.log(`\n🟡 Bold性格（防御+10%, 攻击-10%）:`);
    console.log(`  HP: ${charizardTroll.stats.hp}`);
    console.log(`  攻击: ${charizardTroll.stats.atk}`);
    console.log(`  防御: ${charizardTroll.stats.def}`);
    console.log(`  特攻: ${charizardTroll.stats.spAtk}`);
    console.log(`  特防: ${charizardTroll.stats.spDef}`);
    console.log(`  速度: ${charizardTroll.stats.spe}`);
}

/**
 * 单元测试 - 测试状态系统
 */
function testStatusSystem() {
    console.log('\n\n═══════════════════════════════════════════════════════════════════');
    console.log('  单元测试：状态系统');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    const pikachu = new Pokemon(25, 50);
    
    console.log(`初始状态：${pikachu.name}`);
    console.log(`  HP: ${pikachu.currentHp}/${pikachu.stats.hp}`);
    console.log(`  状态数: ${pikachu.status.length}`);

    // 应用中毒
    pikachu.applyStatus(new StatusCondition('poison', -1));
    console.log(`\n应用中毒状态：`);
    console.log(`  状态: ${pikachu.status.map(s => s.type).join(', ')}`);
    console.log(`  描述: ${pikachu.status[0].getDescription()}`);

    // 应用麻痹
    pikachu.applyStatus(new StatusCondition('paralyze', -1));
    console.log(`\n应用麻痹状态：`);
    console.log(`  状态: ${pikachu.status.map(s => s.type).join(', ')}`);

    // 清除状态
    pikachu.clearAllStatus();
    console.log(`\n清除所有状态：`);
    console.log(`  状态数: ${pikachu.status.length}`);
}

/**
 * 单元测试 - 测试伤害计算
 */
function testDamageCalculation() {
    console.log('\n\n═══════════════════════════════════════════════════════════════════');
    console.log('  单元测试：伤害计算');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    const attacker = new Pokemon(6, 50, 'adamant');  // 喷火龙
    const defender = new Pokemon(9, 50, 'bold');     // 水箭龟

    console.log(`攻击方：${attacker.name}`);
    console.log(`  攻击力: ${attacker.stats.atk}`);
    console.log(`  特攻: ${attacker.stats.spAtk}\n`);

    console.log(`防御方：${defender.name}`);
    console.log(`  防御: ${defender.stats.def}`);
    console.log(`  特防: ${defender.stats.spDef}\n`);

    // 测试多个招式
    const movesToTest = [
        { name: 'flamethrower', desc: '喷射火焰' },
        { name: 'earthquake', desc: '地震' },
        { name: 'dragonClaw', desc: '龙爪' }
    ];

    console.log('伤害计算结果：\n');
    movesToTest.forEach(moveData => {
        const move = MOVE_LIBRARY[moveData.name];
        if (move) {
            const damages = [];
            for (let i = 0; i < 5; i++) {
                const damage = DamageCalculator.calculateDamage(attacker, defender, move);
                damages.push(damage);
            }

            const avgDamage = damages.reduce((a, b) => a + b) / damages.length;
            const minDamage = Math.min(...damages);
            const maxDamage = Math.max(...damages);
            const hpPercent = ((avgDamage / defender.stats.hp) * 100).toFixed(1);

            console.log(`${moveData.desc} (${move.type}型)`);
            console.log(`  威力: ${move.power}, 命中: ${move.accuracy}%`);
            console.log(`  伤害范围: ${minDamage} - ${maxDamage}`);
            console.log(`  平均伤害: ${avgDamage.toFixed(0)} (${hpPercent}% HP)`);
            console.log('');
        }
    });
}

/**
 * 性能测试 - 测试系统性能
 */
async function performanceTest() {
    console.log('\n\n═══════════════════════════════════════════════════════════════════');
    console.log('  性能测试：完整对战');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    const playerTeam = Array(3).fill(0).map((_, i) => new Pokemon([6, 9, 25][i], 50));
    const opponentTeam = Array(3).fill(0).map((_, i) => new Pokemon([150, 1, 25][i], 50));

    const battle = new BattleStateManager(playerTeam, opponentTeam, { isSimulating: true });

    const startTime = performance.now();

    let turnCount = 0;
    while (battle.battleState === 'running' && turnCount < 100) {
        await battle.runTurn(null, null);
        turnCount++;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`⏱️ 对战性能统计：`);
    console.log(`  总回合数: ${turnCount}`);
    console.log(`  总耗时: ${duration.toFixed(2)}ms`);
    console.log(`  平均每回合: ${(duration / turnCount).toFixed(2)}ms`);
    console.log(`  最终状态: ${battle.battleState}`);
}

/**
 * 执行所有测试
 */
async function runAllTests() {
    console.clear();
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                 宝可梦对战系统 - 完整测试套件                      ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');

    testTypeEffectiveness();
    testPokemonStats();
    testStatusSystem();
    testDamageCalculation();
    await performanceTest();
    await quickStartBattle();

    console.log('\n\n✅ 所有测试完成！\n');
}

// 如果直接运行此文件，执行所有测试
if (typeof require !== 'undefined') {
    // Node.js 环境
    (async () => {
        await runAllTests();
    })();
} else {
    // 浏览器环境 - 提供给控制台调用
    window.PokemonBattleTests = {
        quickStartBattle,
        testTypeEffectiveness,
        testPokemonStats,
        testStatusSystem,
        testDamageCalculation,
        performanceTest,
        runAllTests
    };

    console.log('💡 宝可梦对战系统已加载，在控制台运行 runAllTests() 开始测试');
}
