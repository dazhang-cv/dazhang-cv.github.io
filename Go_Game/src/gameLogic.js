// 游戏逻辑
export class GameLogic {
    constructor(config) {
        this.boardSize = config.boardSize;
        this.gameState = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
    }

    placeStone(x, y, color) {
        this.gameState[y][x] = color;
    }

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
            if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize) {
                // 如果相邻点是对手的棋子，检查它是否被围住
                if (this.gameState[ny][nx] === opponent) {
                    const group = this.findGroup(nx, ny);
                    if (!this.hasLiberty(group)) {
                        capturedGroups.push(group);
                    }
                }
            }
        });
        
        return capturedGroups;
    }

    findGroup(x, y) {
        const color = this.gameState[y][x];
        const group = [];
        const visited = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        
        const dfs = (cx, cy) => {
            // 如果超出棋盘范围，或者已访问过，或者不是同色棋子，则返回
            if (cx < 0 || cx >= this.boardSize || cy < 0 || cy >= this.boardSize || 
                visited[cy][cx] || this.gameState[cy][cx] !== color) {
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
                
                // 如果相邻点在棋盘范围内且为空，则有气
                if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize && 
                    this.gameState[ny][nx] === null) {
                    return true;
                }
            }
        }
        
        return false;
    }

    isSuicideMove(x, y, color) {
        // 临时放置棋子
        this.gameState[y][x] = color;
        
        // 查找新放置的棋子所在的组
        const group = this.findGroup(x, y);
        
        // 检查这个组是否有气
        const hasLib = this.hasLiberty(group);
        
        // 恢复棋盘状态
        this.gameState[y][x] = null;
        
        // 如果没有气，检查是否能提子
        if (!hasLib) {
            // 检查四个方向
            const directions = [
                {dx: 1, dy: 0},
                {dx: -1, dy: 0},
                {dx: 0, dy: 1},
                {dx: 0, dy: -1}
            ];
            
            const opponent = color === 'black' ? 'white' : 'black';
            
            for (const dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;
                
                // 如果相邻点在棋盘范围内且是对手的棋子
                if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize && 
                    this.gameState[ny][nx] === opponent) {
                    // 查找对手的棋子组
                    const opponentGroup = this.findGroup(nx, ny);
                    
                    // 临时放置棋子
                    this.gameState[y][x] = color;
                    
                    // 检查对手的棋子组是否有气
                    const opponentHasLib = this.hasLiberty(opponentGroup);
                    
                    // 恢复棋盘状态
                    this.gameState[y][x] = null;
                    
                    // 如果对手的棋子组没有气，则可以提子，不是自杀步
                    if (!opponentHasLib) {
                        return false;
                    }
                }
            }
            
            // 如果没有可以提的子，则是自杀步
            return true;
        }
        
        // 如果有气，不是自杀步
        return false;
    }

    countScore() {
        // 创建一个临时的棋盘状态，用于标记领地
        const tempBoard = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        
        // 复制当前棋子状态
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                tempBoard[i][j] = this.gameState[i][j];
            }
        }
        
        // 标记空点的归属
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (tempBoard[i][j] === null) {
                    const territory = this.findTerritory(j, i, tempBoard);
                    const owner = this.determineOwner(territory, tempBoard);
                    
                    // 标记领地归属
                    territory.forEach(point => {
                        tempBoard[point.y][point.x] = owner ? owner + '-territory' : 'neutral';
                    });
                }
            }
        }
        
        // 计算分数
        let blackScore = 0;
        let whiteScore = 0;
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (tempBoard[i][j] === 'black' || tempBoard[i][j] === 'black-territory') {
                    blackScore++;
                } else if (tempBoard[i][j] === 'white' || tempBoard[i][j] === 'white-territory') {
                    whiteScore++;
                }
            }
        }
        
        return { blackScore, whiteScore };
    }

    findTerritory(x, y, board) {
        const territory = [];
        const visited = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        
        const dfs = (cx, cy) => {
            if (cx < 0 || cx >= this.boardSize || cy < 0 || cy >= this.boardSize || 
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
                
                if (nx >= 0 && nx < this.boardSize && ny >= 0 && ny < this.boardSize) {
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

    reset() {
        this.gameState = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
    }
} 