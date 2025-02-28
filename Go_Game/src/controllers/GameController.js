/**
 * 游戏控制器 - 协调模型和视图
 */
import { GameState } from '../models/GameState.js';
import { BoardView } from '../views/BoardView.js';
import { UIView } from '../views/UIView.js';

export class GameController {
    constructor(config) {
        this.config = config;
        this.gameState = new GameState(config.boardSize);
        this.boardView = new BoardView(document.getElementById('board'), config);
        this.uiView = new UIView();
        this.currentPlayer = 'black';
        this.gameEnded = false;
        
        this.init();
    }
    
    init() {
        // 初始化视图
        this.boardView.render();
        this.uiView.render();
        
        // 添加观察者
        this.gameState.addObserver(this.boardView);
        this.gameState.addObserver(this.uiView);
        
        // 设置事件处理
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        // 棋盘点击
        this.boardView.on('click', (x, y) => {
            if (this.gameEnded) return;
            
            if (this.gameState.board[y][x] === null) {
                // 放置棋子
                this.boardView.placeStone(x, y, this.currentPlayer);
                this.gameState.board[y][x] = this.currentPlayer;
                
                // 检查提子
                const capturedGroups = this.checkCaptures(x, y, this.currentPlayer);
                capturedGroups.forEach(group => {
                    group.forEach(stone => {
                        this.gameState.board[stone.y][stone.x] = null;
                        this.boardView.removeStoneElement(stone.x, stone.y);
                    });
                });
                
                // 高亮最后一手棋
                this.boardView.highlightLastMove(x, y);
                
                // 切换玩家
                this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
                
                // 更新游戏状态显示
                this.uiView.updateGameInfo(this.currentPlayer);
            }
        });
        
        // 按钮事件
        this.setupButtonEvents();
    }
    
    /**
     * 设置按钮事件处理
     */
    setupButtonEvents() {
        // 重置按钮事件
        document.getElementById('reset-button').addEventListener('click', () => {
            this.resetGame();
        });
        
        // 数子按钮事件
        const scoreButton = document.getElementById('score-button');
        if (scoreButton) {
            scoreButton.addEventListener('click', () => {
                this.countScore();
            });
        }
        
        // 认输按钮事件
        const resignButton = document.getElementById('resign-button');
        if (resignButton) {
            resignButton.addEventListener('click', () => {
                if (this.gameEnded) return;
                
                const loser = this.currentPlayer;
                const winner = loser === 'black' ? 'white' : 'black';
                
                this.gameEnded = true;
                
                // 显示获胜方
                this.uiView.showWinner(winner);
                
                // 更新玩家指示器，添加获胜效果
                const blackIndicator = document.getElementById('black-indicator');
                const whiteIndicator = document.getElementById('white-indicator');
                
                if (blackIndicator && whiteIndicator) {
                    blackIndicator.classList.remove('active', 'pulse');
                    whiteIndicator.classList.remove('active', 'pulse');
                    
                    if (winner === 'black') {
                        blackIndicator.classList.add('winner');
                    } else {
                        whiteIndicator.classList.add('winner');
                    }
                }
                
                // 禁用棋盘点击
                this.uiView.disableBoard();
            });
        }
    }
    
    /**
     * 检查提子
     * @param {number} x - 横坐标
     * @param {number} y - 纵坐标
     * @param {string} color - 棋子颜色
     * @returns {Array} 被提掉的棋子组
     */
    checkCaptures(x, y, color) {
        const opponent = color === 'black' ? 'white' : 'black';
        const capturedGroups = [];
        
        // 检查四个方向的相邻点
        const directions = [
            {dx: 1, dy: 0},  // 右
            {dx: -1, dy: 0}, // 左
            {dx: 0, dy: 1},  // 下
            {dx: 0, dy: -1}  // 上
        ];
        
        // 检查每个方向上的相邻棋子
        directions.forEach(dir => {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            // 确保相邻点在棋盘范围内
            if (nx >= 0 && nx < this.config.boardSize && ny >= 0 && ny < this.config.boardSize) {
                // 如果相邻点是对手的棋子，检查它是否被围住
                if (this.gameState.board[ny][nx] === opponent) {
                    const group = this.findGroup(nx, ny);
                    if (!this.hasLiberty(group)) {
                        capturedGroups.push(group);
                    }
                }
            }
        });
        
        return capturedGroups;
    }
    
    /**
     * 查找棋子组
     * @param {number} x - 横坐标
     * @param {number} y - 纵坐标
     * @returns {Array} 棋子组
     */
    findGroup(x, y) {
        const color = this.gameState.board[y][x];
        const group = [];
        const visited = Array(this.config.boardSize).fill().map(() => Array(this.config.boardSize).fill(false));
        
        const dfs = (cx, cy) => {
            // 如果超出棋盘范围，或者已访问过，或者不是同色棋子，则返回
            if (cx < 0 || cx >= this.config.boardSize || cy < 0 || cy >= this.config.boardSize || 
                visited[cy][cx] || this.gameState.board[cy][cx] !== color) {
                return;
            }
            
            // 标记为已访问
            visited[cy][cx] = true;
            group.push({x: cx, y: cy});
            
            // 递归检查四个方向
            dfs(cx + 1, cy);
            dfs(cx - 1, cy);
            dfs(cx, cy + 1);
            dfs(cx, cy - 1);
        };
        
        dfs(x, y);
        return group;
    }
    
    /**
     * 检查棋子组是否有气
     * @param {Array} group - 棋子组
     * @returns {boolean} 是否有气
     */
    hasLiberty(group) {
        for (const stone of group) {
            const directions = [
                {dx: 1, dy: 0},
                {dx: -1, dy: 0},
                {dx: 0, dy: 1},
                {dx: 0, dy: -1}
            ];
            
            for (const dir of directions) {
                const nx = stone.x + dir.dx;
                const ny = stone.y + dir.dy;
                
                if (nx >= 0 && nx < this.config.boardSize && ny >= 0 && ny < this.config.boardSize) {
                    if (this.gameState.board[ny][nx] === null) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * 计算得分
     */
    countScore() {
        // 创建一个临时的棋盘状态，用于标记领地
        const tempBoard = Array(this.config.boardSize).fill().map(() => Array(this.config.boardSize).fill(null));
        
        // 复制当前棋子状态
        for (let i = 0; i < this.config.boardSize; i++) {
            for (let j = 0; j < this.config.boardSize; j++) {
                tempBoard[i][j] = this.gameState.board[i][j];
            }
        }
        
        let blackScore = 0;
        let whiteScore = 0;
        
        // 标记空点的归属
        for (let i = 0; i < this.config.boardSize; i++) {
            for (let j = 0; j < this.config.boardSize; j++) {
                if (tempBoard[i][j] === null) {
                    const territory = this.findTerritory(j, i, tempBoard);
                    const owner = this.determineOwner(territory, tempBoard);
                    
                    if (owner === 'black') {
                        blackScore += territory.length;
                        // 标记为黑方领地
                        territory.forEach(point => {
                            tempBoard[point.y][point.x] = 'black-territory';
                        });
                    } else if (owner === 'white') {
                        whiteScore += territory.length;
                        // 标记为白方领地
                        territory.forEach(point => {
                            tempBoard[point.y][point.x] = 'white-territory';
                        });
                    }
                } else if (tempBoard[i][j] === 'black') {
                    blackScore++;
                } else if (tempBoard[i][j] === 'white') {
                    whiteScore++;
                }
            }
        }
        
        // 显示分数
        this.uiView.showScore(blackScore, whiteScore);
        
        // 结束游戏
        this.gameEnded = true;
        
        // 更新游戏状态显示
        if (blackScore > whiteScore) {
            this.uiView.showWinner('black');
        } else if (whiteScore > blackScore) {
            this.uiView.showWinner('white');
        } else {
            this.uiView.showWinner('tie');
        }
        
        // 禁用棋盘点击
        this.uiView.disableBoard();
        
        return { blackScore, whiteScore };
    }
    
    /**
     * 查找领地
     * @param {number} x - 横坐标
     * @param {number} y - 纵坐标
     * @param {Array} board - 棋盘状态
     * @returns {Array} 领地
     */
    findTerritory(x, y, board) {
        const territory = [];
        const visited = Array(this.config.boardSize).fill().map(() => Array(this.config.boardSize).fill(false));
        
        const dfs = (cx, cy) => {
            if (cx < 0 || cx >= this.config.boardSize || cy < 0 || cy >= this.config.boardSize || 
                visited[cy][cx] || board[cy][cx] !== null) {
                return;
            }
            
            visited[cy][cx] = true;
            territory.push({x: cx, y: cy});
            
            dfs(cx + 1, cy);
            dfs(cx - 1, cy);
            dfs(cx, cy + 1);
            dfs(cx, cy - 1);
        };
        
        dfs(x, y);
        return territory;
    }
    
    /**
     * 确定领地归属
     * @param {Array} territory - 领地
     * @param {Array} board - 棋盘状态
     * @returns {string|null} 归属方 ('black', 'white' 或 null)
     */
    determineOwner(territory, board) {
        let blackBorder = 0;
        let whiteBorder = 0;
        
        // 检查领地边界的棋子颜色
        territory.forEach(point => {
            const directions = [
                {dx: 1, dy: 0},
                {dx: -1, dy: 0},
                {dx: 0, dy: 1},
                {dx: 0, dy: -1}
            ];
            
            directions.forEach(dir => {
                const nx = point.x + dir.dx;
                const ny = point.y + dir.dy;
                
                if (nx >= 0 && nx < this.config.boardSize && ny >= 0 && ny < this.config.boardSize) {
                    if (board[ny][nx] === 'black') {
                        blackBorder++;
                    } else if (board[ny][nx] === 'white') {
                        whiteBorder++;
                    }
                }
            });
        });
        
        // 如果只有一种颜色的棋子围绕，则该领地归属于该颜色
        if (blackBorder > 0 && whiteBorder === 0) {
            return 'black';
        } else if (whiteBorder > 0 && blackBorder === 0) {
            return 'white';
        } else {
            // 如果两种颜色都有，则为中立区域
            return null;
        }
    }
    
    /**
     * 重置游戏
     */
    resetGame() {
        // 重置游戏状态
        this.gameState.board = Array(this.config.boardSize).fill().map(() => Array(this.config.boardSize).fill(null));
        
        // 重置棋盘
        this.boardView.render();
        
        // 重置当前玩家为黑棋
        this.currentPlayer = 'black';
        
        // 重置游戏结束状态
        this.gameEnded = false;
        
        // 启用棋盘点击
        this.uiView.enableBoard();
        
        // 重置UI状态
        this.uiView.resetUI();
        
        // 更新游戏状态显示
        this.uiView.updateGameInfo(this.currentPlayer);
        
        console.log('游戏已重置');
    }
} 