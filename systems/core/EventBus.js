/**
 * 事件总线系统 - 处理特性、道具、状态触发
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
        this.triggerQueue = [];
        this.isProcessing = false;
    }

    // 注册事件监听器
    on(event, callback, priority = 0, context = null) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push({ 
            callback, 
            priority, 
            context,
            id: Math.random().toString(36).substr(2, 9)
        });
        
        // 按优先级排序（高优先级先执行）
        this.listeners.get(event).sort((a, b) => b.priority - a.priority);
    }

    // 移除事件监听器
    off(event, callbackOrId) {
        if (!this.listeners.has(event)) return;
        
        const listeners = this.listeners.get(event);
        const index = listeners.findIndex(listener => 
            listener.callback === callbackOrId || listener.id === callbackOrId
        );
        
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    // 触发事件
    async emit(event, data = {}) {
        const listeners = this.listeners.get(event) || [];
        const results = [];
        
        console.log(`🔔 触发事件: ${event}`, data);
        
        for (const { callback, context } of listeners) {
            try {
                const result = await callback.call(context, data);
                if (result !== undefined) {
                    results.push(result);
                }
            } catch (error) {
                console.error(`❌ 事件处理错误 [${event}]:`, error);
            }
        }
        
        return results;
    }

    // 添加到触发队列
    queueTrigger(event, data, delay = 0) {
        this.triggerQueue.push({
            event,
            data,
            delay,
            timestamp: Date.now()
        });
    }

    // 处理触发队列
    async processTriggerQueue() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        while (this.triggerQueue.length > 0) {
            const trigger = this.triggerQueue.shift();
            const elapsed = Date.now() - trigger.timestamp;
            
            if (elapsed >= trigger.delay) {
                await this.emit(trigger.event, trigger.data);
            } else {
                // 重新加入队列
                this.triggerQueue.unshift(trigger);
                break;
            }
        }
        
        this.isProcessing = false;
    }

    // 清空所有监听器
    clear() {
        this.listeners.clear();
        this.triggerQueue = [];
    }
}