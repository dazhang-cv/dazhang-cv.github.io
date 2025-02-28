/**
 * 棋盘视图 - 负责棋盘的渲染和用户交互
 */
export class BoardView {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.boardSize = config.boardSize;
        this.cellSize = config.cellSize;
        this.margin = config.margin;
        this.eventHandlers = {};
        
        // 设置事件监听
        this.container.addEventListener('click', this.handleClick.bind(this));
    }
    
    render() {
        this.container.innerHTML = '';
        this.createGridLines();
        this.createBorderLines();
        this.createStarPoints();
        this.adjustBoardSize();
        
        // 添加淡入动画
        this.container.classList.add('fade-in');
    }
    
    createGridLines() {
        // 创建水平线
        for (let i = 0; i < this.boardSize; i++) {
            const horizontalLine = document.createElement('div');
            horizontalLine.classList.add('grid-line', 'horizontal');
            horizontalLine.style.top = `${this.margin + i * this.cellSize}px`;
            this.container.appendChild(horizontalLine);
        }
        
        // 创建垂直线
        for (let i = 0; i < this.boardSize; i++) {
            const verticalLine = document.createElement('div');
            verticalLine.classList.add('grid-line', 'vertical');
            verticalLine.style.left = `${this.margin + i * this.cellSize}px`;
            this.container.appendChild(verticalLine);
        }
    }
    
    createBorderLines() {
        const borderTop = document.createElement('div');
        borderTop.classList.add('border-line', 'border-top');
        this.container.appendChild(borderTop);
        
        const borderBottom = document.createElement('div');
        borderBottom.classList.add('border-line', 'border-bottom');
        this.container.appendChild(borderBottom);
        
        const borderLeft = document.createElement('div');
        borderLeft.classList.add('border-line', 'border-left');
        this.container.appendChild(borderLeft);
        
        const borderRight = document.createElement('div');
        borderRight.classList.add('border-line', 'border-right');
        this.container.appendChild(borderRight);
    }
    
    createStarPoints() {
        const starPoints = [
            {x: 3, y: 3}, {x: 9, y: 3}, {x: 15, y: 3},
            {x: 3, y: 9}, {x: 9, y: 9}, {x: 15, y: 9},
            {x: 3, y: 15}, {x: 9, y: 15}, {x: 15, y: 15}
        ];
        
        starPoints.forEach(point => {
            const starPoint = document.createElement('div');
            starPoint.classList.add('star-point');
            starPoint.style.left = `${this.margin + point.x * this.cellSize}px`;
            starPoint.style.top = `${this.margin + point.y * this.cellSize}px`;
            this.container.appendChild(starPoint);
        });
    }
    
    adjustBoardSize() {
        const boardWidth = (this.boardSize - 1) * this.cellSize + 2 * this.margin;
        const boardHeight = (this.boardSize - 1) * this.cellSize + 2 * this.margin;
        this.container.style.width = `${boardWidth}px`;
        this.container.style.height = `${boardHeight}px`;
    }
    
    placeStone(x, y, color) {
        const stone = document.createElement('div');
        stone.classList.add('stone', `${color}-stone`, 'fade-in');
        stone.style.left = `${this.margin + x * this.cellSize}px`;
        stone.style.top = `${this.margin + y * this.cellSize}px`;
        this.container.appendChild(stone);
        
        // 添加放置音效
        this.playStoneSound();
    }
    
    playStoneSound() {
        // 可以添加棋子放置的音效
        // const audio = new Audio('sounds/stone-place.mp3');
        // audio.play();
    }
    
    removeStoneElement(x, y) {
        const stoneElements = document.querySelectorAll('.stone');
        stoneElements.forEach(element => {
            const stoneX = (parseInt(element.style.left) - this.margin) / this.cellSize;
            const stoneY = (parseInt(element.style.top) - this.margin) / this.cellSize;
            
            if (Math.abs(stoneX - x) < 0.1 && Math.abs(stoneY - y) < 0.1) {
                // 添加淡出动画
                element.style.opacity = '0';
                element.style.transform = 'translate(-50%, -50%) scale(0.5)';
                
                // 动画结束后移除元素
                setTimeout(() => {
                    element.remove();
                }, 300);
            }
        });
    }
    
    on(eventName, handler) {
        this.eventHandlers[eventName] = handler;
    }
    
    handleClick(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算最近的交叉点
        const gridX = Math.round((x - this.margin) / this.cellSize);
        const gridY = Math.round((y - this.margin) / this.cellSize);
        
        // 确保点击在棋盘范围内
        if (gridX >= 0 && gridX < this.boardSize && gridY >= 0 && gridY < this.boardSize) {
            if (this.eventHandlers.click) {
                this.eventHandlers.click(gridX, gridY);
            }
        }
    }
    
    update(gameState) {
        // 根据游戏状态更新视图
        // 这里可以添加更多的视觉反馈
    }
    
    highlightLastMove(x, y) {
        // 高亮最后一手棋
        const stones = document.querySelectorAll('.stone');
        stones.forEach(stone => stone.classList.remove('last-move'));
        
        const stoneElements = document.querySelectorAll('.stone');
        stoneElements.forEach(element => {
            const stoneX = (parseInt(element.style.left) - this.margin) / this.cellSize;
            const stoneY = (parseInt(element.style.top) - this.margin) / this.cellSize;
            
            if (Math.abs(stoneX - x) < 0.1 && Math.abs(stoneY - y) < 0.1) {
                element.classList.add('last-move');
            }
        });
    }
} 