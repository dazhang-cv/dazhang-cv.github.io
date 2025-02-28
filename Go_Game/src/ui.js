// 用户界面
export class UI {
    constructor() {
        this.gameInfoElement = null;
        this.scoreDisplayElement = null;
    }

    createGameInfo() {
        this.gameInfoElement = document.createElement('div');
        this.gameInfoElement.id = 'game-info';
        this.gameInfoElement.textContent = '黑方先行';
        document.body.insertBefore(this.gameInfoElement, document.getElementById('board').nextSibling);
    }

    createScoreDisplay() {
        this.scoreDisplayElement = document.createElement('div');
        this.scoreDisplayElement.id = 'score-display';
        this.scoreDisplayElement.style.margin = '10px auto';
        this.scoreDisplayElement.style.fontSize = '16px';
        this.scoreDisplayElement.style.display = 'none';
        document.body.insertBefore(this.scoreDisplayElement, document.getElementById('controls'));
    }

    updateGameInfo(player) {
        const playerText = player === 'black' ? '黑方' : '白方';
        this.gameInfoElement.textContent = `${playerText}回合`;
    }

    showWinner(winner) {
        if (winner === 'tie') {
            this.gameInfoElement.textContent = '平局!';
        } else {
            const winnerText = winner === 'black' ? '黑方' : '白方';
            this.gameInfoElement.textContent = `${winnerText}获胜!`;
        }
    }

    showScore(blackScore, whiteScore) {
        this.scoreDisplayElement.style.display = 'block';
        this.scoreDisplayElement.innerHTML = `
            <div>黑方: ${blackScore} 点</div>
            <div>白方: ${whiteScore} 点</div>
            <div>${blackScore > whiteScore ? '黑方获胜!' : blackScore < whiteScore ? '白方获胜!' : '平局!'}</div>
        `;
    }

    disableBoard() {
        document.getElementById('board').style.pointerEvents = 'none';
    }

    enableBoard() {
        document.getElementById('board').style.pointerEvents = 'auto';
    }
} 