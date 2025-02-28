/**
 * 游戏状态模型 - 负责管理游戏的核心数据
 */
export class GameState {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        this.currentPlayer = 'black';
        this.isGameEnded = false;
        this.observers = [];
    }
    
    // 观察者模式 - 添加观察者
    addObserver(observer) {
        this.observers.push(observer);
    }
    
    // 通知所有观察者
    notifyObservers() {
        this.observers.forEach(observer => observer.update(this));
    }
    
    // 游戏状态操作方法
    placeStone(x, y) {
        if (this.isValidMove(x, y)) {
            this.board[y][x] = this.currentPlayer;
            const capturedStones = this.checkCaptures(x, y);
            this.switchPlayer();
            this.notifyObservers();
            return { success: true, capturedStones };
        }
        return { success: false };
    }
    
    isValidMove(x, y) {
        // 检查位置是否为空
        return this.board[y][x] === null;
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }
} 