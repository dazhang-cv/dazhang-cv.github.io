/**
 * 用户界面视图 - 负责游戏信息和控制界面
 */
export class UIView {
    constructor() {
        this.gameInfoElement = null;
        this.scoreDisplayElement = null;
        this.playerIndicatorElement = null;
        this.winnerDisplayElement = null;
    }
    
    render() {
        this.createPlayerIndicator();
        this.createScoreDisplay();
    }
    
    createPlayerIndicator() {
        // 创建玩家指示器容器
        this.playerIndicatorElement = document.createElement('div');
        this.playerIndicatorElement.id = 'player-indicator';
        this.playerIndicatorElement.classList.add('fade-in');
        
        // 创建黑方指示器
        const blackIndicator = document.createElement('div');
        blackIndicator.id = 'black-indicator';
        blackIndicator.className = 'player-indicator active';
        
        const blackStone = document.createElement('div');
        blackStone.className = 'indicator-stone black-stone';
        
        const blackLabel = document.createElement('div');
        blackLabel.className = 'indicator-label';
        blackLabel.textContent = '黑方';
        
        blackIndicator.appendChild(blackStone);
        blackIndicator.appendChild(blackLabel);
        
        // 创建白方指示器
        const whiteIndicator = document.createElement('div');
        whiteIndicator.id = 'white-indicator';
        whiteIndicator.className = 'player-indicator';
        
        const whiteStone = document.createElement('div');
        whiteStone.className = 'indicator-stone white-stone';
        
        const whiteLabel = document.createElement('div');
        whiteLabel.className = 'indicator-label';
        whiteLabel.textContent = '白方';
        
        whiteIndicator.appendChild(whiteStone);
        whiteIndicator.appendChild(whiteLabel);
        
        // 添加到容器
        this.playerIndicatorElement.appendChild(blackIndicator);
        this.playerIndicatorElement.appendChild(whiteIndicator);
        
        // 插入到DOM - 现在插入到左侧面板
        const leftPanel = document.getElementById('left-panel');
        if (leftPanel) {
            leftPanel.appendChild(this.playerIndicatorElement);
        } else {
            // 后备方案
            const container = document.querySelector('.container');
            const boardContainer = document.getElementById('board-container');
            
            if (container && boardContainer) {
                container.insertBefore(this.playerIndicatorElement, boardContainer);
            } else {
                document.body.appendChild(this.playerIndicatorElement);
            }
        }
    }
    
    createScoreDisplay() {
        this.scoreDisplayElement = document.createElement('div');
        this.scoreDisplayElement.id = 'score-display';
        this.scoreDisplayElement.style.display = 'none';
        
        // 插入到DOM - 现在插入到棋盘上方
        const scoreContainer = document.getElementById('score-container');
        
        if (scoreContainer) {
            scoreContainer.appendChild(this.scoreDisplayElement);
        } else {
            // 后备方案
            const boardContainer = document.getElementById('board-container');
            const centerPanel = document.querySelector('.center-panel');
            
            if (centerPanel && boardContainer) {
                centerPanel.insertBefore(this.scoreDisplayElement, boardContainer);
            } else {
                document.body.appendChild(this.scoreDisplayElement);
            }
        }
    }
    
    updateGameInfo(player) {
        // 只更新玩家指示器，不再更新游戏信息元素
        const blackIndicator = document.getElementById('black-indicator');
        const whiteIndicator = document.getElementById('white-indicator');
        
        if (blackIndicator && whiteIndicator) {
            if (player === 'black') {
                blackIndicator.classList.add('active', 'pulse');
                whiteIndicator.classList.remove('active', 'pulse');
            } else {
                whiteIndicator.classList.add('active', 'pulse');
                blackIndicator.classList.remove('active', 'pulse');
            }
        }
    }
    
    showWinner(winner) {
        // 更新玩家指示器
        const blackIndicator = document.getElementById('black-indicator');
        const whiteIndicator = document.getElementById('white-indicator');
        
        if (blackIndicator && whiteIndicator) {
            blackIndicator.classList.remove('active', 'pulse');
            whiteIndicator.classList.remove('active', 'pulse');
            
            if (winner === 'black') {
                blackIndicator.classList.add('winner');
            } else if (winner === 'white') {
                whiteIndicator.classList.add('winner');
            }
        }
        
        // 创建或更新获胜信息显示
        if (!this.winnerDisplayElement) {
            this.winnerDisplayElement = document.createElement('div');
            this.winnerDisplayElement.id = 'winner-display';
            this.winnerDisplayElement.classList.add('fade-in', 'score-appear');
            
            // 插入到DOM - 插入到棋盘上方
            const scoreContainer = document.getElementById('score-container');
            if (scoreContainer) {
                scoreContainer.appendChild(this.winnerDisplayElement);
            }
        }
        
        // 设置获胜信息内容
        let winnerText = '';
        if (winner === 'black') {
            winnerText = '黑方获胜!';
            this.winnerDisplayElement.classList.add('winner-black');
        } else if (winner === 'white') {
            winnerText = '白方获胜!';
            this.winnerDisplayElement.classList.add('winner-white');
        } else {
            winnerText = '平局!';
            this.winnerDisplayElement.classList.add('winner-tie');
        }
        
        this.winnerDisplayElement.textContent = winnerText;
        this.winnerDisplayElement.style.display = 'block';
    }
    
    showScore(blackScore, whiteScore) {
        this.scoreDisplayElement.style.display = 'block';
        this.scoreDisplayElement.classList.add('fade-in', 'score-appear');
        
        // 移除之前的获胜者类
        this.scoreDisplayElement.classList.remove('winner-black', 'winner-white', 'winner-tie');
        
        const winner = blackScore > whiteScore ? 'black' : blackScore < whiteScore ? 'white' : 'tie';
        const scoreDiff = Math.abs(blackScore - whiteScore);
        
        // 添加获胜者类
        this.scoreDisplayElement.classList.add(`winner-${winner}`);
        
        let winnerText = '';
        if (winner === 'black') {
            winnerText = '黑方获胜!';
        } else if (winner === 'white') {
            winnerText = '白方获胜!';
        } else {
            winnerText = '平局!';
        }
        
        // 更新为单行显示
        this.scoreDisplayElement.innerHTML = `
            <div><strong>黑方:</strong> ${blackScore}</div>
            <div><strong>白方:</strong> ${whiteScore}</div>
            <div class="score-result">${winnerText} ${scoreDiff > 0 ? `(差${scoreDiff}目)` : ''}</div>
        `;
        
        // 更新玩家指示器
        const blackIndicator = document.getElementById('black-indicator');
        const whiteIndicator = document.getElementById('white-indicator');
        
        if (blackIndicator && whiteIndicator) {
            blackIndicator.classList.remove('active', 'pulse');
            whiteIndicator.classList.remove('active', 'pulse');
            
            if (winner === 'black') {
                blackIndicator.classList.add('winner');
            } else if (winner === 'white') {
                whiteIndicator.classList.add('winner');
            }
        }
    }
    
    disableBoard() {
        document.getElementById('board').style.pointerEvents = 'none';
    }
    
    enableBoard() {
        document.getElementById('board').style.pointerEvents = 'auto';
    }
    
    update(gameState) {
        // 根据游戏状态更新UI
        this.updateGameInfo(gameState.currentPlayer);
        
        if (gameState.isGameEnded) {
            // 游戏结束时的UI更新
        }
    }
    
    /**
     * 重置UI状态
     */
    resetUI() {
        // 重置玩家指示器
        const blackIndicator = document.getElementById('black-indicator');
        const whiteIndicator = document.getElementById('white-indicator');
        
        if (blackIndicator && whiteIndicator) {
            // 移除所有特殊状态类
            blackIndicator.classList.remove('active', 'pulse', 'winner');
            whiteIndicator.classList.remove('active', 'pulse', 'winner');
            
            // 重置为黑方先行
            blackIndicator.classList.add('active');
        }
        
        // 隐藏分数显示
        if (this.scoreDisplayElement) {
            this.scoreDisplayElement.style.display = 'none';
        }
        
        // 隐藏获胜显示
        if (this.winnerDisplayElement) {
            this.winnerDisplayElement.style.display = 'none';
        }
    }
} 