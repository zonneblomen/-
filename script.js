// 游戏主逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const gameContainer = document.getElementById('game-container');
    
    // 初始化游戏
    initGame();
    
    function initGame() {
        // 显示家长选择界面
        showParentSelection();
    }
    
    // 显示家长选择界面
    function showParentSelection() {
        gameContainer.innerHTML = `
            <div class="parent-selection">
                <h2>选择家长类型</h2>
                <p>不同家长需要不同的沟通策略，选择一种家长人格开始游戏</p>
                
                <div class="parent-grid">
                    ${parentTypes.map(parent => `
                        <div class="parent-card" data-type="${parent.id}">
                            <div class="parent-icon">${parent.icon}</div>
                            <h3>${parent.name}</h3>
                            <p><strong>特征：</strong>${parent.traits}</p>
                            <p><strong>通关秘诀：</strong>${parent.strategy}</p>
                        </div>
                    `).join('')}
                </div>
                
                <button id="start-game" class="start-button">开始沟通挑战</button>
            </div>
        `;
        
        // 添加家长选择事件
        const parentCards = document.querySelectorAll('.parent-card');
        parentCards.forEach(card => {
            card.addEventListener('click', () => {
                // 移除之前的选择
                parentCards.forEach(c => c.classList.remove('selected'));
                // 选择当前卡片
                card.classList.add('selected');
            });
        });
        
        // 添加开始游戏按钮事件
        document.getElementById('start-game').addEventListener('click', () => {
            const selectedCard = document.querySelector('.parent-card.selected');
            if (selectedCard) {
                const parentType = selectedCard.dataset.type;
                startGame(parentType);
            } else {
                alert('请先选择一种家长类型！');
            }
        });
    }
    
    // 开始游戏
    function startGame(parentTypeId) {
        // 随机选择一个事件
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const parentType = parentTypes.find(p => p.id === parentTypeId);
        
        // 初始化游戏状态
        const gameState = {
            satisfaction: 25,
            currentRound: 0,
            maxRounds: 8,
            dialogueHistory: [
                { sender: 'parent', text: randomEvent.description }
            ],
            currentEvent: randomEvent,
            parentType: parentType,
            gameEnded: false
        };
        
        // 渲染游戏界面
        renderGame(gameState);
    }
    
    // 渲染游戏界面
    function renderGame(gameState) {
        const { satisfaction, dialogueHistory, currentEvent, parentType } = gameState;
        
        // 获取满意度颜色
        const satisfactionColor = getSatisfactionColor(satisfaction);
        
        gameContainer.innerHTML = `
            <div class="game-status">
                <div>
                    <h3>${currentEvent.title}</h3>
                    <p>${parentType.name} · 第 ${gameState.currentRound + 1} 轮对话</p>
                </div>
                
                <div class="satisfaction-display">
                    <div class="satisfaction-icon">${getSatisfactionIcon(satisfaction)}</div>
                    <div>
                        <div class="satisfaction-value" style="color: ${satisfactionColor}">
                            满意度: ${satisfaction}/100
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${satisfaction > 100 ? 100 : satisfaction}%; background: ${satisfactionColor}"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dialogue-area">
                ${dialogueHistory.map(msg => renderMessage(msg)).join('')}
                <div id="message-end"></div>
            </div>
            
            <div class="input-area">
                <textarea id="message-input" placeholder="与${parentType.name}沟通... (提示: 避免使用禁忌词: ${currentEvent.tabooWords.join(', ')})"></textarea>
                <button id="send-button">发送</button>
            </div>
            
            <div class="progress-container">
                <div class="progress-label">对话轮数: ${gameState.currentRound}/${gameState.maxRounds}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(gameState.currentRound / gameState.maxRounds) * 100}%; background: #4a6fa5"></div>
                </div>
            </div>
        `;
        
        // 滚动到底部
        const messageEnd = document.getElementById('message-end');
        if (messageEnd) {
            messageEnd.scrollIntoView({ behavior: 'smooth' });
        }
        
        // 添加发送按钮事件
        document.getElementById('send-button').addEventListener('click', sendMessage);
        
        // 添加回车发送事件
        document.getElementById('message-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        function sendMessage() {
            if (gameState.gameEnded) return;
            
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if (message) {
                // 添加玩家消息
                gameState.dialogueHistory.push({
                    sender: 'teacher',
                    text: message
                });
                
                // 计算满意度变化
                const change = calculateSatisfactionChange(message, gameState);
                gameState.satisfaction += change;
                
                // 添加家长回复
                setTimeout(() => {
                    const aiResponse = getAIResponse(message, gameState, change);
                    gameState.dialogueHistory.push({
                        sender: 'parent',
                        text: aiResponse
                    });
                    
                    gameState.currentRound++;
                    
                    // 检查游戏结束条件
                    if (gameState.satisfaction >= 100) {
                        endGame('win', '恭喜！你成功安抚了家长！', gameState);
                    } else if (gameState.satisfaction <= 0 || gameState.currentRound >= gameState.maxRounds) {
                        const message = gameState.satisfaction <= 0 
                            ? '家长满意度降至0，游戏失败！' 
                            : '对话轮数已用尽！';
                        endGame('lose', message, gameState);
                    } else {
                        // 更新游戏界面
                        renderGame(gameState);
                    }
                }, 800);
                
                // 清空输入框并禁用
                input.value = '';
                input.disabled = true;
                document.getElementById('send-button').disabled = true;
                
                // 更新界面（显示发送的消息）
                renderGame(gameState);
            }
        }
    }
    
    // 渲染消息
    function renderMessage(msg) {
        const isTeacher = msg.sender === 'teacher';
        return `
            <div class="message ${isTeacher ? 'teacher-message' : 'parent-message'}">
                <div class="message-label ${isTeacher ? 'teacher-label' : 'parent-label'}">
                    ${isTeacher ? '你' : '家长'}
                </div>
                ${msg.text}
            </div>
        `;
    }
    
    // 计算满意度变化
    function calculateSatisfactionChange(message, gameState) {
        let change = 0;
        const { currentEvent, parentType } = gameState;
        
        // 检查禁忌词
        if (currentEvent.tabooWords.some(word => message.includes(word))) {
            change -= 25;
        }
        
        // 检查专业术语
        const eduTerms = ["最近发展区", "形成性评价", "多元智能", "学习迁移"];
        if (eduTerms.some(term => message.includes(term))) {
            change += 15;
        }
        
        // 检查解决方案
        if (message.includes("学习计划") || message.includes("1v1")) {
            change += 18;
        }
        
        // 情感连接
        if (message.includes("共同成长") || message.includes("家校合力")) {
            change += 12;
        }
        
        // 模糊承诺惩罚
        if (message.includes("应该会") || message.includes("尽量")) {
            change -= 15;
        }
        
        // 随机波动 (-5 到 +5)
        change += Math.floor(Math.random() * 11) - 5;
        
        // 根据家长类型调整
        if (parentType) {
            if (message.includes("分数") || message.includes("排名")) {
                change *= parentType.sensitivity.scores;
            }
            if (message.includes("情绪") || message.includes("心理")) {
                change *= parentType.sensitivity.emotions;
            }
            if (message.includes("理论") || message.includes("方法")) {
                change *= parentType.sensitivity.academics;
            }
        }
        
        return Math.round(change);
    }
    
    // 获取AI回复
    function getAIResponse(userMessage, gameState, satisfactionChange) {
        // 在实际应用中，这里会调用AI接口
        // 这里使用简单的逻辑模拟
        
        const responses = {
            positive: [
                "这个方案听起来不错，但具体怎么实施呢？",
                "嗯，有道理，不过我担心孩子的时间安排...",
                "专业术语我听不太懂，能用简单的话解释吗？",
                "这样啊，那我再观察一段时间看看效果",
                "你们有类似学生的成功案例可以分享吗？"
            ],
            negative: [
                "这完全不能解决我的问题！",
                "你就是在推卸责任！",
                "我要找你们领导谈谈！",
                "这种空头承诺我听多了",
                "别的机构都能做到，为什么你们不行？"
            ]
        };
        
        // 根据满意度变化选择回复类型
        const responseType = satisfactionChange > 0 ? 'positive' : 'negative';
        const randomIndex = Math.floor(Math.random() * responses[responseType].length);
        
        return responses[responseType][randomIndex];
    }
    
    // 结束游戏
    function endGame(result, message, gameState) {
        gameState.gameEnded = true;
        
        // 显示结束面板
        gameContainer.innerHTML = `
            <div class="end-panel ${result}">
                <div class="end-icon">${result === 'win' ? '✓' : '✗'}</div>
                <h2 class="end-message">${message}</h2>
                <p>最终满意度: <span style="color: ${getSatisfactionColor(gameState.satisfaction)}">
                    ${gameState.satisfaction}/100
                </span></p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>📊 沟通策略分布</h3>
                        <p><strong>专业话术:</strong> 45%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 45%; background: #4a6fa5"></div>
                        </div>
                        
                        <p><strong>情感共鸣:</strong> 30%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 30%; background: #ff6b6b"></div>
                        </div>
                        
                        <p><strong>解决方案:</strong> 25%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 25%; background: #6bcc77"></div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>📝 沟通数据</h3>
                        <p><strong>对话轮数:</strong> ${gameState.currentRound}</p>
                        <p><strong>禁忌词触发:</strong> 2次</p>
                        <p><strong>最佳话术:</strong> "您孩子的思维活跃度超过87%同学" +24分</p>
                        <p><strong>最高满意度:</strong> ${Math.min(gameState.satisfaction + 15, 100)}分</p>
                    </div>
                    
                    <div class="stat-card">
                        <h3>💡 提升建议</h3>
                        <p>✓ 多使用"家校合力"等情感连接词</p>
                        <p>✓ 提供具体学习计划而非模糊承诺</p>
                        <p>✓ 用专业术语提升信任</p>
                        <p>✓ 避免与其他学生直接对比</p>
                    </div>
                </div>
                
                <button class="restart-button" id="restart-game">重新开始挑战</button>
            </div>
        `;
        
        // 添加重新开始按钮事件
        document.getElementById('restart-game').addEventListener('click', () => {
            initGame();
        });
    }
    
    // 获取满意度对应的表情符号
    function getSatisfactionIcon(satisfaction) {
        if (satisfaction < 20) return '😠';
        if (satisfaction < 50) return '😕';
        if (satisfaction < 80) return '🙂';
        return '😊';
    }
    
    // 获取满意度颜色
    function getSatisfactionColor(satisfaction) {
        if (satisfaction < 20) return '#ff5252';
        if (satisfaction < 50) return '#ffa62b';
        if (satisfaction < 80) return '#4caf50';
        return '#2e7d32';
    }
});