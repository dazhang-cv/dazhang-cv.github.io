// 棋盘相关功能
export class Board {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.boardSize = config.boardSize;
        this.cellSize = config.cellSize;
        this.margin = config.margin;
    }

    create() {
        this.container.innerHTML = '';
        this.createGridLines();
        this.createBorderLines();
        this.createStarPoints();
        this.adjustBoardSize();
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
        stone.classList.add('stone', `${color}-stone`);
        stone.style.left = `${this.margin + x * this.cellSize}px`;
        stone.style.top = `${this.margin + y * this.cellSize}px`;
        this.container.appendChild(stone);
        
        console.log(`${color} 棋子放置在 (${x}, ${y})`);
    }

    removeStoneElement(x, y) {
        const stoneElements = document.querySelectorAll('.stone');
        stoneElements.forEach(element => {
            const stoneX = (parseInt(element.style.left) - this.margin) / this.cellSize;
            const stoneY = (parseInt(element.style.top) - this.margin) / this.cellSize;
            
            if (Math.abs(stoneX - x) < 0.1 && Math.abs(stoneY - y) < 0.1) {
                element.remove();
            }
        });
    }
} 