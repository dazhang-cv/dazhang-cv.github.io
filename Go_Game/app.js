import { GameConfig } from './src/config.js';
import { GameController } from './src/controllers/GameController.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new GameController(GameConfig);
    } catch (error) {
        console.error('初始化游戏失败:', error);
    }
}); 