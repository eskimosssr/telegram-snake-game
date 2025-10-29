// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем приложение на весь экран
tg.enableClosingConfirmation(); // Спросим при закрытии

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
if (user) {
    console.log("Привет, " + user.first_name + "! 👋");
}

// Игровые переменные
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;

// Функции для мобильного управления
function moveUp() { if (dy !== 1) { dx = 0; dy = -1; } }
function moveDown() { if (dy !== -1) { dx = 0; dy = 1; } }
function moveLeft() { if (dx !== 1) { dx = -1; dy = 0; } }
function moveRight() { if (dx !== -1) { dx = 1; dy = 0; } }

// Свайпы для мобильных
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

canvas.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Определяем направление свайпа
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Горизонтальный свайп
        if (diffX > 0 && dx !== -1) { dx = 1; dy = 0; }  // Вправо
        else if (diffX < 0 && dx !== 1) { dx = -1; dy = 0; } // Влево
    } else {
        // Вертикальный свайп
        if (diffY > 0 && dy !== -1) { dx = 0; dy = 1; }  // Вниз
        else if (diffY < 0 && dy !== 1) { dx = 0; dy = -1; } // Вверх
    }
});

// Создаем еду
function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// Основная игровая функция
function gameLoop() {
    // Двигаем змейку
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Проверяем съела ли еду
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        createFood();
    } else {
        snake.pop();
    }

    // Проверяем столкновения
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('Игра окончена! Ваш счёт: ' + score);
        restartGame();
        return;
    }

    // Отрисовываем игру
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    ctx.fillStyle = '#2481cc';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Рисуем еду
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
    }
});

// Перезапуск игры
function restartGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    createFood();
}

// Запускаем игру
createFood();
setInterval(gameLoop, 150);
