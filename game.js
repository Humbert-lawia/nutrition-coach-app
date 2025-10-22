// Configuration du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables du jeu
let score = 0;
let flowersCollected = 0;
let lives = 3;
let gameRunning = true;
let keys = {};

// Configuration du joueur (Lapin)
class Bunny {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 4;
        this.jumpPower = 12;
        this.gravity = 0.5;
        this.onGround = false;
        this.direction = 1; // 1 = droite, -1 = gauche
    }

    draw() {
        // Corps du lapin
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);

        // Tête
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 12, 0, Math.PI * 2);
        ctx.fill();

        // Oreilles
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(this.x + 8 * this.direction, this.y + 5, 4, 10, -0.3 * this.direction, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + this.width - 8 * this.direction, this.y + 5, 4, 10, 0.3 * this.direction, 0, Math.PI * 2);
        ctx.fill();

        // Yeux
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 4, this.y + 13, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 4, this.y + 13, 2, 0, Math.PI * 2);
        ctx.fill();

        // Nez
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 18, 2, 0, Math.PI * 2);
        ctx.fill();

        // Pattes
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x + 5, this.y + this.height - 8, 8, 8);
        ctx.fillRect(this.x + this.width - 13, this.y + this.height - 8, 8, 8);
    }

    update() {
        // Mouvement horizontal
        this.velocityX = 0;
        if (keys['ArrowLeft']) {
            this.velocityX = -this.speed;
            this.direction = -1;
        }
        if (keys['ArrowRight']) {
            this.velocityX = this.speed;
            this.direction = 1;
        }

        // Saut
        if (keys[' '] && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }

        // Appliquer la gravité
        this.velocityY += this.gravity;

        // Mise à jour de la position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Limites du canvas
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        // Sol
        if (this.y + this.height > canvas.height - 50) {
            this.y = canvas.height - 50 - this.height;
            this.velocityY = 0;
            this.onGround = true;
        }
    }
}

// Classe pour les fleurs (ennemis)
class Flower {
    constructor(x, y, isMoving = false) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 35;
        this.isMoving = isMoving;
        this.velocityX = isMoving ? 1.5 : 0;
        this.direction = 1;
        this.minX = x - 50;
        this.maxX = x + 50;
    }

    draw() {
        // Tige
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + 15, 4, 20);

        // Centre de la fleur
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 10, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pétales rouges
        ctx.fillStyle = '#FF1744';
        const petalCount = 6;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i * Math.PI * 2) / petalCount;
            const petalX = this.x + this.width / 2 + Math.cos(angle) * 10;
            const petalY = this.y + 10 + Math.sin(angle) * 10;
            ctx.beginPath();
            ctx.arc(petalX, petalY, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Yeux méchants
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 3, this.y + 9, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 3, this.y + 9, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        if (this.isMoving) {
            this.x += this.velocityX * this.direction;

            // Changer de direction aux limites
            if (this.x <= this.minX || this.x >= this.maxX) {
                this.direction *= -1;
            }
        }
    }
}

// Classe pour les plateformes/blocs
class Platform {
    constructor(x, y, width, height, type = 'ground') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'ground', 'brick', 'question'
    }

    draw() {
        if (this.type === 'ground') {
            // Bloc de sol vert
            ctx.fillStyle = '#88d888';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#2d5016';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'brick') {
            // Brique marron
            ctx.fillStyle = '#cd853f';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Lignes de briques
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 2;
            const brickWidth = 20;
            for (let i = 0; i < this.width; i += brickWidth) {
                ctx.strokeRect(this.x + i, this.y, brickWidth, this.height);
            }
        } else if (this.type === 'question') {
            // Bloc mystère
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            // Point d'interrogation
            ctx.fillStyle = '#FF8C00';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', this.x + this.width / 2, this.y + this.height / 2 + 7);
        } else if (this.type === 'pipe') {
            // Tuyau vert
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Bordure du tuyau
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            // Haut du tuyau
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(this.x - 5, this.y, this.width + 10, 10);
        }
    }
}

// Initialisation des objets du jeu
let bunny = new Bunny(50, 100);
let flowers = [];
let platforms = [];

// Créer le niveau (inspiré du monde 1-1)
function createLevel() {
    // Sol principal
    for (let i = 0; i < canvas.width; i += 40) {
        platforms.push(new Platform(i, canvas.height - 50, 40, 50, 'ground'));
    }

    // Plateformes en briques
    platforms.push(new Platform(150, 350, 120, 20, 'brick'));
    platforms.push(new Platform(350, 300, 80, 20, 'brick'));
    platforms.push(new Platform(500, 250, 100, 20, 'brick'));

    // Blocs mystères
    platforms.push(new Platform(200, 250, 30, 30, 'question'));
    platforms.push(new Platform(300, 200, 30, 30, 'question'));
    platforms.push(new Platform(450, 200, 30, 30, 'question'));

    // Tuyaux
    platforms.push(new Platform(600, canvas.height - 100, 50, 50, 'pipe'));
    platforms.push(new Platform(700, canvas.height - 120, 50, 70, 'pipe'));

    // Fleurs statiques
    flowers.push(new Flower(250, canvas.height - 85));
    flowers.push(new Flower(400, canvas.height - 85));
    flowers.push(new Flower(550, canvas.height - 85));

    // Fleurs qui bougent
    flowers.push(new Flower(180, 315, true));
    flowers.push(new Flower(520, 215, true));
}

// Détection de collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Vérifier les collisions avec les plateformes
function checkPlatformCollisions() {
    bunny.onGround = false;

    platforms.forEach(platform => {
        if (checkCollision(bunny, platform)) {
            // Collision par le haut (atterrissage)
            if (bunny.velocityY > 0 && bunny.y + bunny.height - bunny.velocityY <= platform.y) {
                bunny.y = platform.y - bunny.height;
                bunny.velocityY = 0;
                bunny.onGround = true;
            }
            // Collision par le bas (tête)
            else if (bunny.velocityY < 0 && bunny.y - bunny.velocityY >= platform.y + platform.height) {
                bunny.y = platform.y + platform.height;
                bunny.velocityY = 0;
            }
            // Collision latérale
            else if (bunny.velocityX > 0) {
                bunny.x = platform.x - bunny.width;
            } else if (bunny.velocityX < 0) {
                bunny.x = platform.x + platform.width;
            }
        }
    });
}

// Vérifier les collisions avec les fleurs
function checkFlowerCollisions() {
    flowers.forEach((flower, index) => {
        if (checkCollision(bunny, flower)) {
            // Si le lapin saute sur la fleur (la tue)
            if (bunny.velocityY > 0 && bunny.y + bunny.height - bunny.velocityY <= flower.y + 10) {
                flowers.splice(index, 1);
                score += 100;
                flowersCollected++;
                bunny.velocityY = -8; // Petit rebond
                updateScore();
            } else {
                // La fleur touche le lapin (perd une vie)
                lives--;
                updateScore();
                bunny.x = 50;
                bunny.y = 100;
                bunny.velocityX = 0;
                bunny.velocityY = 0;

                if (lives <= 0) {
                    gameOver();
                }
            }
        }
    });
}

// Vérifier si le lapin tombe
function checkFall() {
    if (bunny.y > canvas.height) {
        lives--;
        updateScore();
        bunny.x = 50;
        bunny.y = 100;
        bunny.velocityX = 0;
        bunny.velocityY = 0;

        if (lives <= 0) {
            gameOver();
        }
    }
}

// Vérifier la victoire
function checkVictory() {
    if (bunny.x >= canvas.width - bunny.width - 10) {
        victory();
    }
}

// Mise à jour du score
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('flowers').textContent = flowersCollected;
    document.getElementById('lives').textContent = lives;
}

// Dessiner l'arrière-plan
function drawBackground() {
    // Ciel
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#5c94fc');
    gradient.addColorStop(0.7, '#87ceeb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nuages
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(100, 50);
    drawCloud(300, 80);
    drawCloud(500, 60);
    drawCloud(700, 90);
}

// Dessiner un nuage
function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Boucle de jeu principale
function gameLoop() {
    if (!gameRunning) return;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'arrière-plan
    drawBackground();

    // Mettre à jour et dessiner les plateformes
    platforms.forEach(platform => platform.draw());

    // Mettre à jour et dessiner les fleurs
    flowers.forEach(flower => {
        flower.update();
        flower.draw();
    });

    // Mettre à jour et dessiner le lapin
    bunny.update();
    checkPlatformCollisions();
    checkFlowerCollisions();
    checkFall();
    checkVictory();
    bunny.draw();

    // Continuer la boucle
    requestAnimationFrame(gameLoop);
}

// Gestion des événements clavier
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'r' || e.key === 'R') {
        restartGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game Over
function gameOver() {
    gameRunning = false;
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
}

// Victoire
function victory() {
    gameRunning = false;
    document.getElementById('victory').classList.remove('hidden');
    document.getElementById('victoryScore').textContent = score;
}

// Recommencer le jeu
function restartGame() {
    // Réinitialiser les variables
    score = 0;
    flowersCollected = 0;
    lives = 3;
    gameRunning = true;
    keys = {};

    // Réinitialiser le lapin
    bunny = new Bunny(50, 100);

    // Réinitialiser les fleurs et plateformes
    flowers = [];
    platforms = [];
    createLevel();

    // Cacher les écrans de fin
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('victory').classList.add('hidden');

    // Mettre à jour l'affichage
    updateScore();

    // Relancer la boucle de jeu
    gameLoop();
}

// Initialisation du jeu
createLevel();
updateScore();
gameLoop();
