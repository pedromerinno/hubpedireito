// ============================================
// CHINELADA - PeDireito Game
// ============================================

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');
const overlay = document.getElementById('message-overlay');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const chinelosDisplay = document.getElementById('chinelos-display');

// ---- Constants ----
const GRAVITY = 0.4;
const BOUNCE_FACTOR = 0.5;
const FRICTION = 0.98;
const GROUND_Y_RATIO = 0.85;

// ---- Game State ----
const game = {
    state: 'menu', // menu, aiming, flying, result, levelSelect
    width: 800,
    height: 450,
    scale: 1,
    score: 0,
    currentLevel: 0,
    chinelos: [],
    chinelosLeft: 3,
    mom: null,
    son: null,
    obstacles: [],
    particles: [],
    dragStart: null,
    dragCurrent: null,
    activeChinelo: null,
    levels: [],
    trailPoints: [],

    init() {
        this.setupCanvas();
        this.setupLevels();
        this.setupInput();
        this.gameLoop();
        window.addEventListener('resize', () => this.setupCanvas());
    },

    setupCanvas() {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.width = rect.width;
        this.height = rect.width * (9 / 16);
        canvas.width = this.width * dpr;
        canvas.height = this.height * dpr;
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.groundY = this.height * GROUND_Y_RATIO;
    },

    // ---- Level Definitions ----
    setupLevels() {
        const w = () => this.width;
        const h = () => this.height;
        const gy = () => this.groundY;

        this.levels = [
            {
                name: 'Sala de Casa',
                description: 'O filho tá jogando videogame em vez de estudar!',
                bg: '#87CEEB',
                floorColor: '#8B4513',
                wallColor: '#DEB887',
                chinelos: 3,
                momX: () => w() * 0.1,
                son: () => ({
                    x: w() * 0.75,
                    y: gy() - 50,
                    w: 40,
                    h: 50,
                    hit: false
                }),
                obstacles: () => [
                    { x: w() * 0.5, y: gy() - 60, w: 80, h: 60, type: 'sofa', color: '#8B0000' },
                ]
            },
            {
                name: 'Cozinha',
                description: 'Ele tá comendo o bolo antes da hora!',
                bg: '#FFF8DC',
                floorColor: '#D2B48C',
                wallColor: '#FAEBD7',
                chinelos: 3,
                momX: () => w() * 0.08,
                son: () => ({
                    x: w() * 0.8,
                    y: gy() - 50,
                    w: 40,
                    h: 50,
                    hit: false
                }),
                obstacles: () => [
                    { x: w() * 0.45, y: gy() - 80, w: 20, h: 80, type: 'table_leg', color: '#8B4513' },
                    { x: w() * 0.55, y: gy() - 80, w: 20, h: 80, type: 'table_leg', color: '#8B4513' },
                    { x: w() * 0.4, y: gy() - 90, w: 180, h: 15, type: 'table', color: '#A0522D' },
                ]
            },
            {
                name: 'Quintal',
                description: 'Quebrou o vaso da avó!',
                bg: '#87CEEB',
                floorColor: '#228B22',
                wallColor: '#90EE90',
                chinelos: 3,
                momX: () => w() * 0.1,
                son: () => ({
                    x: w() * 0.85,
                    y: gy() - 50,
                    w: 40,
                    h: 50,
                    hit: false
                }),
                obstacles: () => [
                    { x: w() * 0.4, y: gy() - 100, w: 15, h: 100, type: 'tree', color: '#8B4513' },
                    { x: w() * 0.35, y: gy() - 140, w: 80, h: 50, type: 'leaves', color: '#228B22' },
                    { x: w() * 0.6, y: gy() - 40, w: 30, h: 40, type: 'vase', color: '#CD853F' },
                ]
            },
            {
                name: 'Rua',
                description: 'Empinando pipa no telhado do vizinho!',
                bg: '#87CEEB',
                floorColor: '#808080',
                wallColor: '#A9A9A9',
                chinelos: 4,
                momX: () => w() * 0.08,
                son: () => ({
                    x: w() * 0.78,
                    y: gy() - 150,
                    w: 40,
                    h: 50,
                    hit: false
                }),
                obstacles: () => [
                    { x: w() * 0.65, y: gy() - 120, w: 120, h: 120, type: 'house', color: '#CD853F' },
                    { x: w() * 0.67, y: gy() - 150, w: 116, h: 40, type: 'roof', color: '#8B0000' },
                    { x: w() * 0.35, y: gy() - 50, w: 60, h: 50, type: 'car', color: '#4169E1' },
                ]
            },
            {
                name: 'Festa Junina',
                description: 'Soltando bombinha escondido!',
                bg: '#1a1a4e',
                floorColor: '#DEB887',
                wallColor: '#8B4513',
                chinelos: 3,
                momX: () => w() * 0.1,
                son: () => ({
                    x: w() * 0.7,
                    y: gy() - 50,
                    w: 40,
                    h: 50,
                    hit: false
                }),
                obstacles: () => [
                    { x: w() * 0.35, y: gy() - 90, w: 60, h: 90, type: 'barraca', color: '#FF4500' },
                    { x: w() * 0.55, y: gy() - 60, w: 40, h: 60, type: 'barril', color: '#8B4513' },
                ]
            },
        ];
    },

    // ---- Input Handling ----
    setupInput() {
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (this.width / rect.width),
                y: (clientY - rect.top) * (this.height / rect.height)
            };
        };

        const onStart = (e) => {
            e.preventDefault();
            if (this.state !== 'aiming') return;
            const pos = getPos(e);
            // Only start drag near the mom
            const momX = this.mom.x;
            const momY = this.mom.y;
            const dist = Math.hypot(pos.x - momX, pos.y - momY);
            if (dist < 120) {
                this.dragStart = pos;
                this.dragCurrent = pos;
            }
        };

        const onMove = (e) => {
            e.preventDefault();
            if (!this.dragStart) return;
            const pos = e.touches
                ? { x: 0, y: 0 }
                : getPos(e);
            if (e.touches) {
                const rect = canvas.getBoundingClientRect();
                pos.x = (e.touches[0].clientX - rect.left) * (this.width / rect.width);
                pos.y = (e.touches[0].clientY - rect.top) * (this.height / rect.height);
            }
            this.dragCurrent = pos;
        };

        const onEnd = (e) => {
            e.preventDefault();
            if (!this.dragStart || !this.dragCurrent) return;
            if (this.state !== 'aiming') {
                this.dragStart = null;
                this.dragCurrent = null;
                return;
            }

            const dx = this.dragStart.x - this.dragCurrent.x;
            const dy = this.dragStart.y - this.dragCurrent.y;
            const power = Math.min(Math.hypot(dx, dy), 150);

            if (power > 15) {
                const angle = Math.atan2(dy, dx);
                this.launchChinelo(angle, power * 0.12);
            }

            this.dragStart = null;
            this.dragCurrent = null;
        };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart, { passive: false });
        canvas.addEventListener('touchmove', onMove, { passive: false });
        canvas.addEventListener('touchend', onEnd, { passive: false });
    },

    // ---- Game Actions ----
    handleOverlayClick() {
        if (this.state === 'menu') {
            this.startLevel(0);
        } else if (this.state === 'result') {
            if (this.son && this.son.hit) {
                // Next level
                const next = this.currentLevel + 1;
                if (next < this.levels.length) {
                    this.startLevel(next);
                } else {
                    this.showVictory();
                }
            } else {
                // Retry
                this.startLevel(this.currentLevel);
            }
        } else if (this.state === 'victory') {
            this.state = 'menu';
            this.score = 0;
            overlay.classList.remove('hidden');
            overlay.innerHTML = `
                <h1>🩴 Chinelada!</h1>
                <h2>by PeDireito</h2>
                <p>Toque para jogar</p>
            `;
        }
    },

    startLevel(index) {
        const level = this.levels[index];
        this.currentLevel = index;
        this.state = 'aiming';
        this.chinelosLeft = level.chinelos;
        this.activeChinelo = null;
        this.particles = [];
        this.trailPoints = [];

        // Setup mom
        this.mom = {
            x: level.momX(),
            y: this.groundY - 70,
            armAngle: 0,
            throwing: false,
            throwTimer: 0
        };

        // Setup son
        this.son = level.son();

        // Setup obstacles
        this.obstacles = level.obstacles();

        // UI
        overlay.classList.add('hidden');
        levelDisplay.textContent = `Fase ${index + 1} - ${level.name}`;
        scoreDisplay.textContent = `${this.score} pts`;
        this.updateChinelosUI();
    },

    updateChinelosUI() {
        let html = '';
        for (let i = 0; i < this.chinelosLeft; i++) {
            html += '🩴 ';
        }
        chinelosDisplay.textContent = html;
    },

    launchChinelo(angle, power) {
        if (this.chinelosLeft <= 0) return;
        this.chinelosLeft--;
        this.updateChinelosUI();

        // Mom throw animation
        this.mom.throwing = true;
        this.mom.throwTimer = 15;
        this.mom.armAngle = angle;

        this.activeChinelo = {
            x: this.mom.x + 30,
            y: this.mom.y - 20,
            vx: Math.cos(angle) * power,
            vy: Math.sin(angle) * power,
            rotation: 0,
            rotSpeed: 0.3,
            active: true,
            bounces: 0
        };

        this.trailPoints = [];
        this.state = 'flying';
    },

    // ---- Physics Update ----
    update() {
        if (this.state !== 'flying') return;
        if (!this.activeChinelo || !this.activeChinelo.active) return;

        const c = this.activeChinelo;

        // Gravity
        c.vy += GRAVITY;

        // Movement
        c.x += c.vx;
        c.y += c.vy;

        // Rotation
        c.rotation += c.rotSpeed;

        // Trail
        this.trailPoints.push({ x: c.x, y: c.y, life: 20 });
        if (this.trailPoints.length > 30) this.trailPoints.shift();

        // Bounce off ground
        if (c.y > this.groundY - 10) {
            c.y = this.groundY - 10;
            c.vy *= -BOUNCE_FACTOR;
            c.vx *= FRICTION;
            c.bounces++;
            this.spawnDustParticles(c.x, this.groundY);
        }

        // Bounce off walls
        if (c.x > this.width - 10) {
            c.x = this.width - 10;
            c.vx *= -BOUNCE_FACTOR;
            c.bounces++;
        }
        if (c.x < 10) {
            c.x = 10;
            c.vx *= -BOUNCE_FACTOR;
            c.bounces++;
        }

        // Bounce off ceiling
        if (c.y < 10) {
            c.y = 10;
            c.vy *= -BOUNCE_FACTOR;
        }

        // Check collision with obstacles
        for (const obs of this.obstacles) {
            if (this.checkBoxCollision(c.x, c.y, 15, 10, obs.x, obs.y, obs.w, obs.h)) {
                // Simple bounce off obstacle
                const cx = obs.x + obs.w / 2;
                const cy = obs.y + obs.h / 2;
                if (Math.abs(c.x - cx) / obs.w > Math.abs(c.y - cy) / obs.h) {
                    c.vx *= -BOUNCE_FACTOR;
                } else {
                    c.vy *= -BOUNCE_FACTOR;
                }
                c.bounces++;
                c.x += c.vx * 2;
                c.y += c.vy * 2;
                break;
            }
        }

        // Check hit son
        if (!this.son.hit && this.checkBoxCollision(c.x, c.y, 15, 10, this.son.x, this.son.y, this.son.w, this.son.h)) {
            this.son.hit = true;
            c.active = false;
            this.onHitSon();
            return;
        }

        // Stop if too slow
        if (c.bounces > 5 || (Math.abs(c.vx) < 0.3 && Math.abs(c.vy) < 0.3 && c.y >= this.groundY - 15)) {
            c.active = false;
            this.onChineloStopped();
        }

        // Out of bounds
        if (c.y > this.height + 50 || c.x > this.width + 50) {
            c.active = false;
            this.onChineloStopped();
        }

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life--;
            return p.life > 0;
        });

        // Decay trail
        this.trailPoints = this.trailPoints.filter(t => {
            t.life--;
            return t.life > 0;
        });
    },

    checkBoxCollision(cx, cy, cw, ch, bx, by, bw, bh) {
        return cx + cw / 2 > bx && cx - cw / 2 < bx + bw &&
               cy + ch / 2 > by && cy - ch / 2 < by + bh;
    },

    onHitSon() {
        // Celebration!
        const pts = (this.chinelosLeft + 1) * 100;
        this.score += pts;
        scoreDisplay.textContent = `${this.score} pts`;

        // Explosion particles
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.son.x + this.son.w / 2,
                y: this.son.y + this.son.h / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 40 + Math.random() * 20,
                color: ['#FFD700', '#FF6347', '#00CED1', '#FF69B4'][Math.floor(Math.random() * 4)],
                size: 3 + Math.random() * 4
            });
        }

        setTimeout(() => this.showResult(true, pts), 1000);
    },

    onChineloStopped() {
        if (this.chinelosLeft > 0) {
            // Give another chance
            setTimeout(() => {
                this.state = 'aiming';
                this.activeChinelo = null;
            }, 500);
        } else {
            // Failed
            setTimeout(() => this.showResult(false, 0), 800);
        }
    },

    showResult(won, pts) {
        this.state = 'result';
        const stars = won ? this.chinelosLeft + 1 : 0;
        const maxStars = 3;

        let starsHtml = '';
        for (let i = 0; i < maxStars; i++) {
            starsHtml += i < stars ? '⭐' : '<span class="star-empty">⭐</span>';
        }

        overlay.classList.remove('hidden');
        overlay.innerHTML = won
            ? `<h1>${this.levels[this.currentLevel].name}</h1>
               <h2>CHINELADA! +${pts} pts</h2>
               <div class="stars">${starsHtml}</div>
               <p>${this.currentLevel < this.levels.length - 1 ? 'Toque para próxima fase' : 'Toque para continuar'}</p>`
            : `<h1>Escapou!</h1>
               <h2>O moleque se safou...</h2>
               <p>Toque para tentar de novo</p>`;
    },

    showVictory() {
        this.state = 'victory';
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
            <h1>🏆 PARABÉNS!</h1>
            <h2>Pontuação: ${this.score} pts</h2>
            <p style="font-size:14px; margin-top:12px; opacity:0.7">PeDireito - Brasilidade no pé e na mão 🩴</p>
            <p style="margin-top:20px">Toque para jogar novamente</p>
        `;
    },

    spawnDustParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 2,
                life: 15 + Math.random() * 10,
                color: '#D2B48C',
                size: 2 + Math.random() * 3
            });
        }
    },

    // ---- Rendering ----
    render() {
        ctx.clearRect(0, 0, this.width, this.height);

        if (this.state === 'menu' || this.state === 'victory') {
            this.drawMenuBg();
            return;
        }

        const level = this.levels[this.currentLevel];

        // Sky / Background
        ctx.fillStyle = level.bg;
        ctx.fillRect(0, 0, this.width, this.height);

        // Wall (back)
        if (level.wallColor) {
            ctx.fillStyle = level.wallColor;
            ctx.fillRect(0, this.height * 0.2, this.width, this.groundY - this.height * 0.2);
        }

        // Floor
        ctx.fillStyle = level.floorColor;
        ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

        // Floor line
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.groundY);
        ctx.lineTo(this.width, this.groundY);
        ctx.stroke();

        // Obstacles
        for (const obs of this.obstacles) {
            this.drawObstacle(obs);
        }

        // Son
        this.drawSon();

        // Mom
        this.drawMom();

        // Aiming line
        if (this.state === 'aiming' && this.dragStart && this.dragCurrent) {
            this.drawAimLine();
        }

        // Trail
        for (const t of this.trailPoints) {
            ctx.globalAlpha = t.life / 20;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Active chinelo
        if (this.activeChinelo && this.activeChinelo.active) {
            this.drawChinelo(this.activeChinelo);
        }

        // Stopped chinelo on ground
        if (this.activeChinelo && !this.activeChinelo.active && this.state !== 'result') {
            this.drawChinelo(this.activeChinelo);
        }

        // Particles
        for (const p of this.particles) {
            ctx.globalAlpha = p.life / 40;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    drawMenuBg() {
        // Simple gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#ff6b35');
        grad.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);
    },

    drawMom(/* placeholder */) {
        const m = this.mom;
        if (!m) return;

        ctx.save();
        ctx.translate(m.x, m.y);

        // Body (dress)
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(-15, -10, 30, 45);

        // Head
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(0, -25, 16, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#4a2c0a';
        ctx.beginPath();
        ctx.arc(0, -30, 16, Math.PI, Math.PI * 2);
        ctx.fill();
        // Bun
        ctx.beginPath();
        ctx.arc(0, -42, 8, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -25, 2, 0, Math.PI * 2);
        ctx.arc(5, -25, 2, 0, Math.PI * 2);
        ctx.fill();

        // Angry eyebrows
        ctx.strokeStyle = '#4a2c0a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-9, -32);
        ctx.lineTo(-3, -30);
        ctx.moveTo(9, -32);
        ctx.lineTo(3, -30);
        ctx.stroke();

        // Arm with chinelo
        ctx.save();
        if (m.throwing && m.throwTimer > 0) {
            // Throw animation
            const progress = 1 - (m.throwTimer / 15);
            const armAngle = -Math.PI * 0.8 + progress * Math.PI * 1.2;
            ctx.translate(12, -5);
            ctx.rotate(armAngle);
        } else {
            // Resting with chinelo raised
            ctx.translate(12, -5);
            ctx.rotate(-Math.PI * 0.6);
        }
        // Arm
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(0, -4, 30, 8);

        // Chinelo in hand (if not thrown yet or aiming)
        if (this.state === 'aiming') {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(28, -6, 14, 10);
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(33, -4, 4, 2);
        }
        ctx.restore();

        // Legs
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(-10, 35, 8, 20);
        ctx.fillRect(2, 35, 8, 20);

        // Feet
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(-12, 52, 12, 5);
        ctx.fillRect(0, 52, 12, 5);

        ctx.restore();

        // Update throw animation
        if (m.throwing && m.throwTimer > 0) {
            m.throwTimer--;
            if (m.throwTimer <= 0) m.throwing = false;
        }
    },

    drawSon() {
        const s = this.son;
        if (!s) return;

        ctx.save();
        ctx.translate(s.x + s.w / 2, s.y + s.h / 2);

        if (s.hit) {
            // Hit reaction - spinning
            ctx.rotate(Math.sin(Date.now() / 100) * 0.5);
        }

        // Body (t-shirt)
        ctx.fillStyle = s.hit ? '#FF0000' : '#4169E1';
        ctx.fillRect(-12, -5, 24, 30);

        // Head
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(0, -16, 13, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#2c1810';
        ctx.beginPath();
        ctx.arc(0, -20, 13, Math.PI, Math.PI * 2);
        ctx.fill();

        // Expression
        if (s.hit) {
            // Ouch face
            ctx.fillStyle = '#000';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('X  X', 0, -14);
            ctx.beginPath();
            ctx.arc(0, -8, 4, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Mischievous face
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-4, -17, 2, 0, Math.PI * 2);
            ctx.arc(4, -17, 2, 0, Math.PI * 2);
            ctx.fill();
            // Smirk
            ctx.beginPath();
            ctx.arc(0, -12, 5, 0.1, Math.PI - 0.1);
            ctx.stroke();
        }

        // Shorts
        ctx.fillStyle = '#228B22';
        ctx.fillRect(-12, 25, 24, 12);

        // Legs
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(-9, 37, 7, 14);
        ctx.fillRect(2, 37, 7, 14);

        ctx.restore();
    },

    drawChinelo(c) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);

        // Sole
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Strap (V shape)
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-5, 4);
        ctx.lineTo(0, -4);
        ctx.lineTo(5, 4);
        ctx.stroke();

        ctx.restore();
    },

    drawObstacle(obs) {
        ctx.fillStyle = obs.color;

        if (obs.type === 'leaves') {
            // Draw as ellipse
            ctx.beginPath();
            ctx.ellipse(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, obs.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (obs.type === 'barril') {
            ctx.beginPath();
            ctx.ellipse(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, obs.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (obs.type === 'roof') {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + obs.h);
            ctx.lineTo(obs.x + obs.w / 2, obs.y);
            ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
            ctx.closePath();
            ctx.fill();
        } else if (obs.type === 'car') {
            // Car body
            ctx.fillRect(obs.x, obs.y + 15, obs.w, obs.h - 15);
            // Car top
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x + 10, obs.y, obs.w - 20, 20);
            // Wheels
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(obs.x + 12, obs.y + obs.h, 7, 0, Math.PI * 2);
            ctx.arc(obs.x + obs.w - 12, obs.y + obs.h, 7, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Default box
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

            // Add some detail
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        }
    },

    drawAimLine() {
        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        const power = Math.min(Math.hypot(dx, dy), 150);
        const angle = Math.atan2(dy, dx);

        // Trajectory preview (dotted)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();

        let px = this.mom.x + 30;
        let py = this.mom.y - 20;
        let pvx = Math.cos(angle) * power * 0.12;
        let pvy = Math.sin(angle) * power * 0.12;

        ctx.moveTo(px, py);
        for (let i = 0; i < 25; i++) {
            pvy += GRAVITY;
            px += pvx;
            py += pvy;
            if (py > this.groundY) break;
            ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Power indicator
        const powerRatio = power / 150;
        ctx.fillStyle = `hsl(${120 - powerRatio * 120}, 80%, 50%)`;
        ctx.fillRect(this.mom.x - 20, this.mom.y + 65, 40 * powerRatio, 6);
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(this.mom.x - 20, this.mom.y + 65, 40, 6);
    },

    // ---- Game Loop ----
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
};

// Start!
game.init();
