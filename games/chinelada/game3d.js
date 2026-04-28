// ============================================
// CHINELADA 3D - PeDireito Game
// Three.js powered
// ============================================

// ---- DOM refs ----
const container = document.getElementById('game-container');
const overlayEl = document.getElementById('overlay');
const levelNumEl = document.getElementById('level-num');
const scoreValEl = document.getElementById('score-val');
const chinelosLeftEl = document.getElementById('chinelos-left');
const powerBarContainer = document.getElementById('power-bar-container');
const powerBar = document.getElementById('power-bar');
const aimHint = document.getElementById('aim-hint');

// ---- Three.js Setup ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.insertBefore(renderer.domElement, container.firstChild);

// ---- Materials Library ----
const MAT = {
    skin: new THREE.MeshStandardMaterial({ color: 0xD2A679, roughness: 0.7 }),
    skinDark: new THREE.MeshStandardMaterial({ color: 0xC49566, roughness: 0.7 }),
    hairDark: new THREE.MeshStandardMaterial({ color: 0x2c1810, roughness: 0.9 }),
    hairMom: new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.8 }),
    dressPink: new THREE.MeshStandardMaterial({ color: 0xE84393, roughness: 0.5 }),
    shirtBlue: new THREE.MeshStandardMaterial({ color: 0x2980B9, roughness: 0.5 }),
    shortsGreen: new THREE.MeshStandardMaterial({ color: 0x27AE60, roughness: 0.6 }),
    chinelo: new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.3, metalness: 0.1 }),
    chineloStrap: new THREE.MeshStandardMaterial({ color: 0xFF4500, roughness: 0.4 }),
    eyeWhite: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 }),
    eyeBlack: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }),
    red: new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.5 }),
};

// ---- Geometry Library ----
const GEO = {
    box: new THREE.BoxGeometry(1, 1, 1),
    sphere: new THREE.SphereGeometry(1, 16, 12),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, 16),
    cone: new THREE.ConeGeometry(1, 1, 16),
};

// ---- Scene Groups ----
let envGroup = new THREE.Group();
let momGroup = new THREE.Group();
let sonGroup = new THREE.Group();
let chineloMesh = null;
let obstacleGroup = new THREE.Group();
let particlesGroup = new THREE.Group();
scene.add(envGroup, momGroup, sonGroup, obstacleGroup, particlesGroup);

// ---- Camera Position ----
camera.position.set(0, 6, 16);
camera.lookAt(3, 2, 0);

// ---- Lights ----
const ambientLight = new THREE.AmbientLight(0x8899bb, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
dirLight.position.set(8, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -5;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 40;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x6688cc, 0.3);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffa500, 0.4);
rimLight.position.set(-3, 2, 8);
scene.add(rimLight);

// ---- Fog ----
scene.fog = new THREE.FogExp2(0x87CEEB, 0.012);

// ---- Game State ----
const game = {
    state: 'menu',
    score: 0,
    currentLevel: 0,
    chinelosLeft: 3,
    maxChinelos: 3,

    // Physics (in game units)
    chinelo: null, // { pos, vel, rot, active, bounces }
    sonPos: { x: 0, y: 0, z: 0 },
    sonHit: false,
    sonSize: { w: 1.2, h: 2.2 },
    momPos: { x: -7, y: 0, z: 0 },

    // Drag state
    dragStart: null,
    dragCurrent: null,
    isDragging: false,

    // Animation
    momArmAngle: -0.8,
    momTargetArm: -0.8,
    momThrowPhase: 0, // 0 = idle, 1 = winding, 2 = thrown
    sonBob: 0,
    hitReactionTimer: 0,
    cameraShake: 0,

    // Trail & particles
    trail: [],
    particles3d: [],

    // Levels
    levels: [
        {
            name: 'Sala de Casa',
            desc: 'Jogando videogame em vez de estudar!',
            sky: 0x87CEEB,
            floorColor: 0x8B6F47,
            wallColor: 0xF5DEB3,
            chinelos: 3,
            sonX: 6,
            sonY: 0,
            obstacles: [
                { type: 'sofa', x: 2, y: 0, z: 0 },
                { type: 'tv', x: 7, y: 0, z: -2 },
                { type: 'lamp', x: -3, y: 0, z: -2 },
            ]
        },
        {
            name: 'Cozinha',
            desc: 'Comendo o bolo antes da hora!',
            sky: 0xFFF8DC,
            floorColor: 0xD2B48C,
            wallColor: 0xFAEBD7,
            chinelos: 3,
            sonX: 7,
            sonY: 0,
            obstacles: [
                { type: 'table', x: 3, y: 0, z: 0 },
                { type: 'fridge', x: -2, y: 0, z: -2.5 },
                { type: 'cake', x: 6.5, y: 1.05, z: 0 },
            ]
        },
        {
            name: 'Quintal',
            desc: 'Quebrou o vaso da avó!',
            sky: 0x87CEEB,
            floorColor: 0x4A7C3F,
            wallColor: 0x6B8E23,
            chinelos: 3,
            sonX: 7.5,
            sonY: 0,
            obstacles: [
                { type: 'tree', x: 2.5, y: 0, z: -1 },
                { type: 'vase', x: 5, y: 0, z: 0.5 },
                { type: 'fence', x: 0, y: 0, z: -3 },
            ]
        },
        {
            name: 'Rua',
            desc: 'Empinando pipa no telhado!',
            sky: 0x87CEEB,
            floorColor: 0x707070,
            wallColor: 0xA9A9A9,
            chinelos: 4,
            sonX: 6,
            sonY: 3.8,
            obstacles: [
                { type: 'house', x: 5, y: 0, z: -1 },
                { type: 'car', x: 1, y: 0, z: 1 },
            ]
        },
        {
            name: 'Festa Junina',
            desc: 'Soltando bombinha escondido!',
            sky: 0x1B1B3A,
            floorColor: 0xC19A6B,
            wallColor: 0x2D2D5E,
            chinelos: 3,
            sonX: 6,
            sonY: 0,
            obstacles: [
                { type: 'barraca', x: 2.5, y: 0, z: 0 },
                { type: 'barrel', x: 5, y: 0, z: 1 },
                { type: 'flags', x: 0, y: 4, z: 0 },
            ]
        },
    ],

    // ---- Init ----
    init() {
        this.setupInput();
        this.animate();
        window.addEventListener('resize', () => this.onResize());
    },

    onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },

    // ---- Input ----
    setupInput() {
        const getPos = (e) => {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            return { x, y };
        };

        const onStart = (e) => {
            if (this.state !== 'aiming') return;
            e.preventDefault();
            this.dragStart = getPos(e);
            this.dragCurrent = this.dragStart;
            this.isDragging = true;
            powerBarContainer.classList.add('visible');
        };

        const onMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const pos = e.touches
                ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                : getPos(e);
            this.dragCurrent = pos;

            // Update power bar
            const dx = this.dragStart.x - this.dragCurrent.x;
            const dy = this.dragStart.y - this.dragCurrent.y;
            const power = Math.min(Math.hypot(dx, dy) / 300, 1);
            powerBar.style.width = (power * 100) + '%';
            const hue = 120 - power * 120;
            powerBar.style.background = `linear-gradient(90deg, hsl(${hue},80%,50%), hsl(${hue - 20},90%,45%))`;

            // Update mom aim
            const angle = Math.atan2(dy, dx);
            this.momTargetArm = -1.5 + power * 0.8;
        };

        const onEnd = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            this.isDragging = false;
            powerBarContainer.classList.remove('visible');

            if (this.state !== 'aiming') return;

            const dx = this.dragStart.x - this.dragCurrent.x;
            const dy = this.dragStart.y - this.dragCurrent.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 30) {
                const power = Math.min(dist / 300, 1);
                const screenAngle = Math.atan2(dy, dx);
                this.launchChinelo(screenAngle, power);
            }

            this.dragStart = null;
            this.dragCurrent = null;
        };

        renderer.domElement.addEventListener('mousedown', onStart);
        renderer.domElement.addEventListener('mousemove', onMove);
        renderer.domElement.addEventListener('mouseup', onEnd);
        renderer.domElement.addEventListener('touchstart', onStart, { passive: false });
        renderer.domElement.addEventListener('touchmove', onMove, { passive: false });
        renderer.domElement.addEventListener('touchend', onEnd, { passive: false });
    },

    // ---- Level Setup ----
    startLevel(idx) {
        const lvl = this.levels[idx];
        this.currentLevel = idx;
        this.state = 'aiming';
        this.chinelosLeft = lvl.chinelos;
        this.maxChinelos = lvl.chinelos;
        this.sonHit = false;
        this.chinelo = null;
        this.trail = [];
        this.particles3d = [];
        this.hitReactionTimer = 0;
        this.momThrowPhase = 0;
        this.momArmAngle = -0.8;
        this.momTargetArm = -0.8;
        this.cameraShake = 0;

        // Clear previous
        this.clearGroup(envGroup);
        this.clearGroup(momGroup);
        this.clearGroup(sonGroup);
        this.clearGroup(obstacleGroup);
        this.clearGroup(particlesGroup);
        if (chineloMesh) { scene.remove(chineloMesh); chineloMesh = null; }

        // Sky
        scene.background = new THREE.Color(lvl.sky);
        scene.fog = new THREE.FogExp2(lvl.sky, 0.012);

        // Adjust lights for night levels
        if (lvl.sky === 0x1B1B3A) {
            ambientLight.intensity = 0.3;
            dirLight.intensity = 0.6;
            dirLight.color.set(0xFFAA55);
        } else {
            ambientLight.intensity = 0.6;
            dirLight.intensity = 1.2;
            dirLight.color.set(0xffeedd);
        }

        // Build environment
        this.buildFloor(lvl.floorColor);
        this.buildWalls(lvl.wallColor);
        this.buildObstacles(lvl.obstacles);

        // Mom
        this.momPos = { x: -7, y: 0, z: 0 };
        this.buildMom();

        // Son
        this.sonPos = { x: lvl.sonX, y: lvl.sonY, z: 0 };
        this.buildSon();

        // Create chinelo mesh (reused)
        chineloMesh = this.createChineloMesh();
        chineloMesh.visible = false;
        scene.add(chineloMesh);

        // UI
        overlayEl.classList.add('hidden');
        levelNumEl.textContent = idx + 1;
        scoreValEl.textContent = this.score;
        this.updateChinelosUI();
        aimHint.classList.remove('hidden');

        // Camera for this level
        if (lvl.sonY > 2) {
            camera.position.set(0, 7, 18);
            camera.lookAt(2, 3, 0);
        } else {
            camera.position.set(0, 6, 16);
            camera.lookAt(3, 2, 0);
        }
    },

    clearGroup(g) {
        while (g.children.length) {
            const c = g.children[0];
            g.remove(c);
            if (c.geometry) c.geometry.dispose();
        }
    },

    updateChinelosUI() {
        let html = '';
        for (let i = 0; i < this.maxChinelos; i++) {
            const used = i >= this.chinelosLeft;
            html += `<span class="chinelo-icon ${used ? 'chinelo-used' : ''}">🩴</span>`;
        }
        chinelosLeftEl.innerHTML = html;
    },

    // ---- Build Environment ----
    buildFloor(color) {
        const floorGeo = new THREE.PlaneGeometry(40, 20);
        const floorMat = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.85,
            metalness: 0.05
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        envGroup.add(floor);

        // Subtle grid / texture lines
        const lineGeo = new THREE.PlaneGeometry(40, 0.02);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08 });
        for (let i = -10; i <= 10; i += 2) {
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.rotation.x = -Math.PI / 2;
            line.position.set(0, 0.01, i);
            envGroup.add(line);
        }
    },

    buildWalls(color) {
        // Back wall
        const wallGeo = new THREE.PlaneGeometry(40, 12);
        const wallMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, side: THREE.DoubleSide });
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(0, 6, -4);
        wall.receiveShadow = true;
        envGroup.add(wall);

        // Baseboard
        const baseGeo = new THREE.BoxGeometry(40, 0.4, 0.15);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.7 });
        const baseboard = new THREE.Mesh(baseGeo, baseMat);
        baseboard.position.set(0, 0.2, -3.9);
        envGroup.add(baseboard);
    },

    // ---- Build Characters ----
    buildMom() {
        this.clearGroup(momGroup);
        const m = momGroup;
        m.position.set(this.momPos.x, 0, this.momPos.z);

        // Legs
        const legL = this.makeBox(0.3, 1, 0.3, MAT.skin);
        legL.position.set(-0.2, 0.5, 0);
        m.add(legL);
        const legR = this.makeBox(0.3, 1, 0.3, MAT.skin);
        legR.position.set(0.2, 0.5, 0);
        m.add(legR);

        // Dress / body
        const dress = this.makeBox(1, 1.6, 0.7, MAT.dressPink);
        dress.position.set(0, 1.8, 0);
        m.add(dress);

        // Dress bottom flare
        const skirt = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.75, 0.6, 8),
            MAT.dressPink
        );
        skirt.position.set(0, 1.1, 0);
        skirt.castShadow = true;
        m.add(skirt);

        // Head
        const head = this.makeSphere(0.45, MAT.skin);
        head.position.set(0, 3.1, 0);
        m.add(head);

        // Hair bun
        const hair = this.makeSphere(0.48, MAT.hairMom);
        hair.position.set(0, 3.3, -0.05);
        hair.scale.set(1, 0.7, 1);
        m.add(hair);
        const bun = this.makeSphere(0.22, MAT.hairMom);
        bun.position.set(0, 3.7, -0.1);
        m.add(bun);

        // Eyes
        const eyeL = this.makeSphere(0.06, MAT.eyeBlack);
        eyeL.position.set(-0.15, 3.15, 0.4);
        m.add(eyeL);
        const eyeR = this.makeSphere(0.06, MAT.eyeBlack);
        eyeR.position.set(0.15, 3.15, 0.4);
        m.add(eyeR);

        // Angry eyebrows (small rotated boxes)
        const browL = this.makeBox(0.18, 0.04, 0.04, MAT.hairMom);
        browL.position.set(-0.15, 3.3, 0.42);
        browL.rotation.z = 0.3;
        m.add(browL);
        const browR = this.makeBox(0.18, 0.04, 0.04, MAT.hairMom);
        browR.position.set(0.15, 3.3, 0.42);
        browR.rotation.z = -0.3;
        m.add(browR);

        // Mouth (frown)
        const mouth = this.makeBox(0.2, 0.04, 0.04, MAT.red);
        mouth.position.set(0, 2.9, 0.42);
        m.add(mouth);

        // Arm (right - throwing arm) - this will be animated
        const armPivot = new THREE.Group();
        armPivot.position.set(0.5, 2.5, 0);
        armPivot.name = 'armPivot';

        const upperArm = this.makeBox(0.25, 0.9, 0.25, MAT.skin);
        upperArm.position.set(0, -0.45, 0);
        armPivot.add(upperArm);

        // Chinelo in hand
        const handChinelo = this.createChineloMesh();
        handChinelo.scale.set(0.8, 0.8, 0.8);
        handChinelo.position.set(0, -0.9, 0.1);
        handChinelo.name = 'handChinelo';
        armPivot.add(handChinelo);

        m.add(armPivot);

        // Left arm (static)
        const armL = this.makeBox(0.25, 0.8, 0.25, MAT.skin);
        armL.position.set(-0.5, 2.1, 0);
        armL.rotation.z = 0.2;
        m.add(armL);

        // Feet (chinelos on feet!)
        const footL = this.createChineloMesh();
        footL.scale.set(0.5, 0.5, 0.5);
        footL.position.set(-0.2, 0.05, 0.15);
        m.add(footL);
        const footR = this.createChineloMesh();
        footR.scale.set(0.5, 0.5, 0.5);
        footR.position.set(0.2, 0.05, 0.15);
        m.add(footR);

        // Shadows
        m.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    },

    buildSon() {
        this.clearGroup(sonGroup);
        const s = sonGroup;
        s.position.set(this.sonPos.x, this.sonPos.y, this.sonPos.z);

        // Legs
        const legL = this.makeBox(0.25, 0.8, 0.25, MAT.skin);
        legL.position.set(-0.18, 0.4, 0);
        s.add(legL);
        const legR = this.makeBox(0.25, 0.8, 0.25, MAT.skin);
        legR.position.set(0.18, 0.4, 0);
        s.add(legR);

        // Shorts
        const shorts = this.makeBox(0.8, 0.5, 0.55, MAT.shortsGreen);
        shorts.position.set(0, 1, 0);
        s.add(shorts);

        // Shirt
        const shirt = this.makeBox(0.75, 0.9, 0.5, MAT.shirtBlue);
        shirt.position.set(0, 1.7, 0);
        s.add(shirt);

        // Head
        const head = this.makeSphere(0.38, MAT.skin);
        head.position.set(0, 2.6, 0);
        head.name = 'sonHead';
        s.add(head);

        // Hair
        const hair = this.makeSphere(0.4, MAT.hairDark);
        hair.position.set(0, 2.75, -0.05);
        hair.scale.set(1, 0.65, 1);
        s.add(hair);

        // Mischievous eyes
        const eyeL = this.makeSphere(0.07, MAT.eyeWhite);
        eyeL.position.set(-0.12, 2.65, 0.33);
        s.add(eyeL);
        const pupilL = this.makeSphere(0.04, MAT.eyeBlack);
        pupilL.position.set(-0.12, 2.65, 0.38);
        s.add(pupilL);
        const eyeR = this.makeSphere(0.07, MAT.eyeWhite);
        eyeR.position.set(0.12, 2.65, 0.33);
        s.add(eyeR);
        const pupilR = this.makeSphere(0.04, MAT.eyeBlack);
        pupilR.position.set(0.12, 2.65, 0.38);
        s.add(pupilR);

        // Smirk
        const smirk = this.makeBox(0.18, 0.04, 0.04, MAT.eyeBlack);
        smirk.position.set(0.05, 2.45, 0.36);
        smirk.rotation.z = -0.2;
        smirk.name = 'sonSmirk';
        s.add(smirk);

        // Arms
        const armL = this.makeBox(0.22, 0.7, 0.22, MAT.skin);
        armL.position.set(-0.5, 1.7, 0);
        armL.rotation.z = 0.15;
        s.add(armL);
        const armR = this.makeBox(0.22, 0.7, 0.22, MAT.skin);
        armR.position.set(0.5, 1.7, 0);
        armR.rotation.z = -0.15;
        s.add(armR);

        // Shadows
        s.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    },

    // ---- Build Obstacles ----
    buildObstacles(list) {
        this.clearGroup(obstacleGroup);
        for (const def of list) {
            const obj = this.createObstacle(def);
            if (obj) {
                obj.position.set(def.x, def.y || 0, def.z || 0);
                obj.userData = { type: def.type, def };
                obstacleGroup.add(obj);
            }
        }
        obstacleGroup.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    },

    createObstacle(def) {
        const g = new THREE.Group();
        switch (def.type) {
            case 'sofa': {
                const base = this.makeBox(2.5, 0.8, 1.2, new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: 0.6 }));
                base.position.y = 0.4;
                g.add(base);
                const back = this.makeBox(2.5, 0.7, 0.3, new THREE.MeshStandardMaterial({ color: 0x700000, roughness: 0.6 }));
                back.position.set(0, 1.1, -0.45);
                g.add(back);
                // Cushions
                const cush1 = this.makeBox(1.1, 0.2, 0.8, new THREE.MeshStandardMaterial({ color: 0xA52A2A, roughness: 0.5 }));
                cush1.position.set(-0.5, 0.9, 0.1);
                g.add(cush1);
                const cush2 = cush1.clone();
                cush2.position.x = 0.5;
                g.add(cush2);
                break;
            }
            case 'tv': {
                // TV stand
                const stand = this.makeBox(1.5, 0.6, 0.5, new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.7 }));
                stand.position.y = 0.3;
                g.add(stand);
                // Screen
                const screen = this.makeBox(1.8, 1.2, 0.1, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 }));
                screen.position.set(0, 1.3, 0);
                g.add(screen);
                // Screen glow
                const glow = this.makeBox(1.6, 1, 0.05, new THREE.MeshBasicMaterial({ color: 0x4488FF }));
                glow.position.set(0, 1.3, 0.06);
                g.add(glow);
                break;
            }
            case 'lamp': {
                const pole = this.makeCylinder(0.05, 2.5, new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.7 }));
                pole.position.y = 1.25;
                g.add(pole);
                const shade = new THREE.Mesh(
                    new THREE.ConeGeometry(0.4, 0.5, 8, 1, true),
                    new THREE.MeshStandardMaterial({ color: 0xFFE4B5, side: THREE.DoubleSide, roughness: 0.5 })
                );
                shade.position.y = 2.6;
                shade.rotation.x = Math.PI;
                g.add(shade);
                break;
            }
            case 'table': {
                const top = this.makeBox(2.5, 0.12, 1.2, new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.5 }));
                top.position.y = 1.05;
                g.add(top);
                const legs = [[-1, 0, -0.4], [1, 0, -0.4], [-1, 0, 0.4], [1, 0, 0.4]];
                legs.forEach(([lx, , lz]) => {
                    const leg = this.makeCylinder(0.06, 1, new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 }));
                    leg.position.set(lx, 0.5, lz);
                    g.add(leg);
                });
                break;
            }
            case 'fridge': {
                const body = this.makeBox(1.2, 2.8, 1, new THREE.MeshStandardMaterial({ color: 0xE8E8E8, roughness: 0.3, metalness: 0.3 }));
                body.position.y = 1.4;
                g.add(body);
                const handle = this.makeBox(0.06, 0.6, 0.06, new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.8 }));
                handle.position.set(0.55, 1.8, 0.5);
                g.add(handle);
                // Line between doors
                const line = this.makeBox(1.15, 0.02, 0.06, new THREE.MeshStandardMaterial({ color: 0xCCCCCC }));
                line.position.set(0, 1.3, 0.5);
                g.add(line);
                break;
            }
            case 'cake': {
                const base = this.makeCylinder(0.35, 0.3, new THREE.MeshStandardMaterial({ color: 0xFFF0DB, roughness: 0.4 }));
                base.position.y = 0.15;
                g.add(base);
                const frost = this.makeCylinder(0.37, 0.08, new THREE.MeshStandardMaterial({ color: 0xFF69B4, roughness: 0.3 }));
                frost.position.y = 0.32;
                g.add(frost);
                // Cherry
                const cherry = this.makeSphere(0.06, MAT.red);
                cherry.position.set(0, 0.4, 0);
                g.add(cherry);
                break;
            }
            case 'tree': {
                const trunk = this.makeCylinder(0.2, 3, new THREE.MeshStandardMaterial({ color: 0x5C3A1E, roughness: 0.9 }));
                trunk.position.y = 1.5;
                g.add(trunk);
                const leaves = this.makeSphere(1.2, new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 }));
                leaves.position.y = 3.5;
                leaves.scale.set(1, 0.8, 1);
                g.add(leaves);
                const leaves2 = this.makeSphere(0.9, new THREE.MeshStandardMaterial({ color: 0x2E8B2E, roughness: 0.8 }));
                leaves2.position.set(0.4, 4, 0.2);
                g.add(leaves2);
                break;
            }
            case 'vase': {
                const body = this.makeCylinder(0.3, 0.7, new THREE.MeshStandardMaterial({ color: 0xCD853F, roughness: 0.4 }));
                body.position.y = 0.35;
                g.add(body);
                const rim = this.makeCylinder(0.35, 0.1, new THREE.MeshStandardMaterial({ color: 0xD2691E, roughness: 0.4 }));
                rim.position.y = 0.72;
                g.add(rim);
                // Flower
                const stem = this.makeCylinder(0.03, 0.6, new THREE.MeshStandardMaterial({ color: 0x228B22 }));
                stem.position.y = 1;
                g.add(stem);
                const flower = this.makeSphere(0.15, new THREE.MeshStandardMaterial({ color: 0xFF69B4 }));
                flower.position.y = 1.35;
                g.add(flower);
                break;
            }
            case 'fence': {
                for (let i = -4; i <= 4; i += 0.8) {
                    const post = this.makeBox(0.1, 1.2, 0.1, new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.7 }));
                    post.position.set(i, 0.6, 0);
                    g.add(post);
                }
                const rail1 = this.makeBox(8, 0.08, 0.08, new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.7 }));
                rail1.position.y = 0.4;
                g.add(rail1);
                const rail2 = rail1.clone();
                rail2.position.y = 0.9;
                g.add(rail2);
                break;
            }
            case 'house': {
                const walls = this.makeBox(3, 3.5, 3, new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.7 }));
                walls.position.y = 1.75;
                g.add(walls);
                // Roof
                const roof = new THREE.Mesh(
                    new THREE.ConeGeometry(2.6, 1.5, 4),
                    new THREE.MeshStandardMaterial({ color: 0xB22222, roughness: 0.6 })
                );
                roof.position.y = 4.2;
                roof.rotation.y = Math.PI / 4;
                g.add(roof);
                // Door
                const door = this.makeBox(0.7, 1.4, 0.1, new THREE.MeshStandardMaterial({ color: 0x5C3A1E, roughness: 0.7 }));
                door.position.set(0, 0.7, 1.51);
                g.add(door);
                // Window
                const win = this.makeBox(0.6, 0.5, 0.1, new THREE.MeshStandardMaterial({ color: 0x88CCFF, roughness: 0.2, metalness: 0.3 }));
                win.position.set(-0.8, 2.2, 1.51);
                g.add(win);
                break;
            }
            case 'car': {
                const body = this.makeBox(2.2, 0.8, 1.2, new THREE.MeshStandardMaterial({ color: 0x2980B9, roughness: 0.3, metalness: 0.4 }));
                body.position.y = 0.6;
                g.add(body);
                const cabin = this.makeBox(1.2, 0.6, 1.1, new THREE.MeshStandardMaterial({ color: 0x3498DB, roughness: 0.2, metalness: 0.5 }));
                cabin.position.set(0, 1.2, 0);
                g.add(cabin);
                // Windows
                const windshield = this.makeBox(0.02, 0.45, 0.9, new THREE.MeshStandardMaterial({ color: 0x88CCFF, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.6 }));
                windshield.position.set(0.6, 1.15, 0);
                g.add(windshield);
                // Wheels
                const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
                [[-0.7, 0.2, 0.65], [0.7, 0.2, 0.65], [-0.7, 0.2, -0.65], [0.7, 0.2, -0.65]].forEach(([wx, wy, wz]) => {
                    const wheel = this.makeCylinder(0.22, 0.15, wheelMat);
                    wheel.rotation.x = Math.PI / 2;
                    wheel.position.set(wx, wy, wz);
                    g.add(wheel);
                });
                break;
            }
            case 'barraca': {
                // Tent/stall
                const posts = [[-1, 0, -0.6], [1, 0, -0.6], [-1, 0, 0.6], [1, 0, 0.6]];
                posts.forEach(([px, , pz]) => {
                    const post = this.makeCylinder(0.06, 2.5, new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
                    post.position.set(px, 1.25, pz);
                    g.add(post);
                });
                // Striped roof
                const roofMat = new THREE.MeshStandardMaterial({ color: 0xFF4500, roughness: 0.5 });
                const roofMesh = this.makeBox(2.4, 0.1, 1.6, roofMat);
                roofMesh.position.y = 2.6;
                g.add(roofMesh);
                // White stripes
                for (let i = -0.9; i <= 0.9; i += 0.6) {
                    const stripe = this.makeBox(0.2, 0.12, 1.55, new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
                    stripe.position.set(i, 2.61, 0);
                    g.add(stripe);
                }
                // Counter
                const counter = this.makeBox(2.2, 0.8, 0.3, new THREE.MeshStandardMaterial({ color: 0xA0522D }));
                counter.position.set(0, 0.4, 0.5);
                g.add(counter);
                break;
            }
            case 'barrel': {
                const body = this.makeCylinder(0.4, 0.9, new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 }));
                body.position.y = 0.45;
                g.add(body);
                // Metal rings
                const ringMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
                [0.15, 0.45, 0.75].forEach(ry => {
                    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.02, 8, 16), ringMat);
                    ring.position.y = ry;
                    ring.rotation.x = Math.PI / 2;
                    g.add(ring);
                });
                break;
            }
            case 'flags': {
                // Bandeirinhas de festa junina
                const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8B8B00 });
                const rope = this.makeBox(16, 0.03, 0.03, ropeMat);
                rope.position.y = 0;
                g.add(rope);
                const flagColors = [0xFF4500, 0x00CED1, 0xFFD700, 0xFF69B4, 0x32CD32, 0x9370DB];
                for (let i = -7; i <= 7; i += 0.7) {
                    const color = flagColors[Math.abs(Math.round(i * 10)) % flagColors.length];
                    const flag = new THREE.Mesh(
                        new THREE.ConeGeometry(0.18, 0.35, 3),
                        new THREE.MeshStandardMaterial({ color, roughness: 0.5, side: THREE.DoubleSide })
                    );
                    flag.position.set(i, -0.2, 0);
                    flag.rotation.x = Math.PI;
                    g.add(flag);
                }
                break;
            }
        }
        return g;
    },

    // ---- Chinelo Mesh ----
    createChineloMesh() {
        const g = new THREE.Group();
        // Sole
        const soleShape = new THREE.Shape();
        soleShape.ellipse(0, 0, 0.45, 0.25, 0, Math.PI * 2, false, 0);
        const soleGeo = new THREE.ExtrudeGeometry(soleShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
        const sole = new THREE.Mesh(soleGeo, MAT.chinelo);
        sole.rotation.x = -Math.PI / 2;
        sole.position.y = 0.04;
        g.add(sole);

        // Strap
        const strapGeo = new THREE.TorusGeometry(0.15, 0.03, 6, 12, Math.PI);
        const strap = new THREE.Mesh(strapGeo, MAT.chineloStrap);
        strap.position.set(0, 0.12, -0.05);
        strap.rotation.y = Math.PI / 2;
        strap.rotation.x = -0.3;
        g.add(strap);

        return g;
    },

    // ---- Launch ----
    launchChinelo(screenAngle, power) {
        if (this.chinelosLeft <= 0) return;
        this.chinelosLeft--;
        this.updateChinelosUI();
        aimHint.classList.add('hidden');

        // Convert screen angle to 3D velocity
        const speed = 0.25 + power * 0.35;
        const vx = Math.cos(screenAngle) * speed * 1.2;
        const vy = -Math.sin(screenAngle) * speed * 0.9;

        this.chinelo = {
            pos: { x: this.momPos.x + 1, y: 2.8, z: 0 },
            vel: { x: vx, y: vy, z: (Math.random() - 0.5) * 0.02 },
            rot: { x: 0, y: 0, z: 0 },
            active: true,
            bounces: 0,
            time: 0
        };

        chineloMesh.visible = true;
        this.trail = [];
        this.state = 'flying';

        // Mom throw animation
        this.momThrowPhase = 1;
        setTimeout(() => { this.momThrowPhase = 2; }, 150);

        // Hide hand chinelo
        const handC = momGroup.getObjectByName('handChinelo');
        if (handC) handC.visible = false;
    },

    // ---- Physics ----
    updatePhysics() {
        if (this.state !== 'flying' || !this.chinelo || !this.chinelo.active) return;

        const c = this.chinelo;
        const GRAV = 0.012;
        const BOUNCE = 0.45;
        const FRIC = 0.97;

        c.vel.y -= GRAV;
        c.pos.x += c.vel.x;
        c.pos.y += c.vel.y;
        c.pos.z += c.vel.z;
        c.time++;

        // Rotation (spinning chinelo)
        c.rot.x += 0.15;
        c.rot.z += 0.08;

        // Trail
        if (c.time % 2 === 0) {
            this.trail.push({ ...c.pos, life: 1 });
            if (this.trail.length > 40) this.trail.shift();
        }

        // Ground bounce
        if (c.pos.y < 0.15) {
            c.pos.y = 0.15;
            c.vel.y *= -BOUNCE;
            c.vel.x *= FRIC;
            c.vel.z *= FRIC;
            c.bounces++;
            this.spawnImpactParticles(c.pos.x, 0, c.pos.z, 0xD2B48C, 8);
        }

        // Wall bounces (left/right limits)
        if (c.pos.x > 12) { c.pos.x = 12; c.vel.x *= -BOUNCE; c.bounces++; }
        if (c.pos.x < -10) { c.pos.x = -10; c.vel.x *= -BOUNCE; c.bounces++; }
        // Back wall
        if (c.pos.z < -3.5) { c.pos.z = -3.5; c.vel.z *= -BOUNCE; c.bounces++; }
        if (c.pos.z > 5) { c.pos.z = 5; c.vel.z *= -BOUNCE; c.bounces++; }
        // Ceiling
        if (c.pos.y > 10) { c.pos.y = 10; c.vel.y *= -BOUNCE; }

        // Obstacle collision (simple AABB)
        for (const obj of obstacleGroup.children) {
            const box = new THREE.Box3().setFromObject(obj);
            const cp = new THREE.Vector3(c.pos.x, c.pos.y, c.pos.z);
            if (box.containsPoint(cp)) {
                // Bounce off
                const center = new THREE.Vector3();
                box.getCenter(center);
                const diff = cp.clone().sub(center).normalize();
                c.vel.x += diff.x * 0.1;
                c.vel.y += diff.y * 0.1;
                c.vel.z += diff.z * 0.1;
                c.vel.x *= -BOUNCE;
                c.pos.x += diff.x * 0.3;
                c.pos.y += diff.y * 0.3;
                c.bounces++;
                this.spawnImpactParticles(c.pos.x, c.pos.y, c.pos.z, 0xFFFFFF, 5);
                break;
            }
        }

        // Hit son check
        if (!this.sonHit) {
            const sx = this.sonPos.x, sy = this.sonPos.y, sz = this.sonPos.z;
            const dist = Math.hypot(c.pos.x - sx, c.pos.y - (sy + 1.5), c.pos.z - sz);
            if (dist < 1.2) {
                this.sonHit = true;
                c.active = false;
                this.onHitSon();
                return;
            }
        }

        // Stop conditions
        const speed = Math.hypot(c.vel.x, c.vel.y, c.vel.z);
        if (c.bounces > 6 || (speed < 0.01 && c.pos.y < 0.3)) {
            c.active = false;
            this.onChineloStopped();
        }

        // Update mesh
        chineloMesh.position.set(c.pos.x, c.pos.y, c.pos.z);
        chineloMesh.rotation.set(c.rot.x, c.rot.y, c.rot.z);
    },

    // ---- Hit / Miss ----
    onHitSon() {
        const pts = (this.chinelosLeft + 1) * 150;
        this.score += pts;
        scoreValEl.textContent = this.score;
        this.hitReactionTimer = 120;
        this.cameraShake = 15;

        // Explosion particles
        const sx = this.sonPos.x, sy = this.sonPos.y + 2;
        this.spawnImpactParticles(sx, sy, 0, 0xFFD700, 25);
        this.spawnImpactParticles(sx, sy, 0, 0xFF6347, 15);
        this.spawnImpactParticles(sx, sy, 0, 0x00CED1, 10);

        chineloMesh.visible = false;

        setTimeout(() => this.showResult(true, pts), 1200);
    },

    onChineloStopped() {
        if (this.chinelosLeft > 0) {
            setTimeout(() => {
                this.state = 'aiming';
                this.chinelo = null;
                chineloMesh.visible = false;
                // Show hand chinelo again
                const handC = momGroup.getObjectByName('handChinelo');
                if (handC) handC.visible = true;
                this.momThrowPhase = 0;
            }, 600);
        } else {
            setTimeout(() => this.showResult(false, 0), 1000);
        }
    },

    // ---- Results ----
    showResult(won, pts) {
        this.state = 'result';
        const stars = won ? Math.min(this.chinelosLeft + 1, 3) : 0;
        let starsHtml = '';
        for (let i = 0; i < 3; i++) {
            starsHtml += i < stars ? '⭐' : '<span class="star-off">⭐</span>';
        }

        const lvl = this.levels[this.currentLevel];
        if (won) {
            overlayEl.innerHTML = `
                <div class="overlay-title">${lvl.name}</div>
                <div class="level-desc">CHINELADA! +${pts} pts</div>
                <div class="stars-row">${starsHtml}</div>
                <button class="overlay-action" onclick="game.onOverlayClick()">${this.currentLevel < this.levels.length - 1 ? 'PRÓXIMA FASE' : 'VER RESULTADO'}</button>
            `;
        } else {
            overlayEl.innerHTML = `
                <div class="overlay-title">ESCAPOU!</div>
                <div class="level-desc">O moleque se safou... 😏</div>
                <button class="overlay-action" onclick="game.onOverlayClick()">TENTAR DE NOVO</button>
            `;
        }
        overlayEl.classList.remove('hidden');
    },

    showVictory() {
        this.state = 'victory';
        overlayEl.innerHTML = `
            <div class="overlay-title">🏆 PARABÉNS!</div>
            <div class="level-desc">Pontuação final: ${this.score}</div>
            <div class="stars-row">🩴🩴🩴</div>
            <button class="overlay-action" onclick="game.onOverlayClick()">JOGAR DE NOVO</button>
            <div class="overlay-brand">PeDireito - Brasilidade no pé e na mão 🩴</div>
        `;
        overlayEl.classList.remove('hidden');
    },

    onOverlayClick() {
        if (this.state === 'menu') {
            this.startLevel(0);
        } else if (this.state === 'result') {
            if (this.sonHit) {
                const next = this.currentLevel + 1;
                if (next < this.levels.length) {
                    this.startLevel(next);
                } else {
                    this.showVictory();
                }
            } else {
                this.startLevel(this.currentLevel);
            }
        } else if (this.state === 'victory') {
            this.score = 0;
            this.state = 'menu';
            overlayEl.innerHTML = `
                <div class="overlay-title">CHINELADA!</div>
                <div class="overlay-subtitle">🩴 by PeDireito</div>
                <button class="overlay-action" onclick="game.onOverlayClick()">JOGAR</button>
                <div class="overlay-brand">Brasilidade no pé e na mão</div>
            `;
            overlayEl.classList.remove('hidden');
        }
    },

    // ---- Particles ----
    spawnImpactParticles(x, y, z, color, count) {
        for (let i = 0; i < count; i++) {
            const size = 0.05 + Math.random() * 0.12;
            const geo = new THREE.SphereGeometry(size, 6, 4);
            const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.castShadow = false;
            particlesGroup.add(mesh);
            this.particles3d.push({
                mesh,
                vel: {
                    x: (Math.random() - 0.5) * 0.3,
                    y: Math.random() * 0.25,
                    z: (Math.random() - 0.5) * 0.3
                },
                life: 40 + Math.random() * 30
            });
        }
    },

    updateParticles() {
        for (let i = this.particles3d.length - 1; i >= 0; i--) {
            const p = this.particles3d[i];
            p.vel.y -= 0.005;
            p.mesh.position.x += p.vel.x;
            p.mesh.position.y += p.vel.y;
            p.mesh.position.z += p.vel.z;
            p.life--;
            p.mesh.material.opacity = p.life / 50;
            p.mesh.material.transparent = true;

            if (p.mesh.position.y < 0) {
                p.mesh.position.y = 0;
                p.vel.y *= -0.3;
            }

            if (p.life <= 0) {
                particlesGroup.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles3d.splice(i, 1);
            }
        }

        // Trail
        this.trail = this.trail.filter(t => {
            t.life -= 0.03;
            return t.life > 0;
        });
    },

    // ---- Animations ----
    updateAnimations(time) {
        // Mom arm
        const armPivot = momGroup.getObjectByName('armPivot');
        if (armPivot) {
            let targetAngle;
            if (this.momThrowPhase === 0) {
                targetAngle = -0.8 + Math.sin(time * 2) * 0.05; // Idle sway
            } else if (this.momThrowPhase === 1) {
                targetAngle = -2.5; // Wind up
            } else {
                targetAngle = 0.8; // Follow through
            }
            this.momArmAngle += (targetAngle - this.momArmAngle) * 0.2;
            armPivot.rotation.z = this.momArmAngle;
        }

        // Son idle bob
        if (!this.sonHit) {
            this.sonBob += 0.03;
            sonGroup.position.y = this.sonPos.y + Math.sin(this.sonBob) * 0.08;
            // Mischievous sway
            sonGroup.rotation.y = Math.sin(time * 1.5) * 0.1;
        } else {
            // Hit reaction
            if (this.hitReactionTimer > 0) {
                this.hitReactionTimer--;
                sonGroup.rotation.z = Math.sin(this.hitReactionTimer * 0.5) * 0.3;
                sonGroup.position.y = this.sonPos.y + Math.abs(Math.sin(this.hitReactionTimer * 0.3)) * 0.2;

                // Change son color to red on hit
                sonGroup.traverse(c => {
                    if (c.isMesh && c.material === MAT.shirtBlue) {
                        c.material = MAT.red;
                    }
                });
            }
        }

        // Camera shake
        if (this.cameraShake > 0) {
            this.cameraShake--;
            const intensity = this.cameraShake * 0.01;
            camera.position.x = (Math.random() - 0.5) * intensity;
            camera.position.y = 6 + (Math.random() - 0.5) * intensity;
        } else {
            // Subtle camera breathing
            camera.position.y = 6 + Math.sin(time * 0.5) * 0.05;
        }

        // Mom body sway
        momGroup.rotation.y = Math.sin(time * 0.8) * 0.02;
    },

    // ---- Trail Rendering ----
    renderTrail() {
        // Remove old trail meshes
        const toRemove = particlesGroup.children.filter(c => c.userData.isTrail);
        toRemove.forEach(c => {
            particlesGroup.remove(c);
            c.geometry.dispose();
            c.material.dispose();
        });

        for (const t of this.trail) {
            const geo = new THREE.SphereGeometry(0.06 * t.life, 4, 3);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: t.life * 0.6
            });
            const m = new THREE.Mesh(geo, mat);
            m.position.set(t.x, t.y, t.z);
            m.userData.isTrail = true;
            particlesGroup.add(m);
        }
    },

    // ---- Aim Trajectory Preview ----
    renderAimPreview() {
        // Remove old preview
        const toRemove = scene.children.filter(c => c.userData && c.userData.isPreview);
        toRemove.forEach(c => {
            scene.remove(c);
            if (c.geometry) c.geometry.dispose();
            if (c.material) c.material.dispose();
        });

        if (this.state !== 'aiming' || !this.isDragging || !this.dragStart || !this.dragCurrent) return;

        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 30) return;

        const power = Math.min(dist / 300, 1);
        const screenAngle = Math.atan2(dy, dx);
        const speed = 0.25 + power * 0.35;
        const vx = Math.cos(screenAngle) * speed * 1.2;
        const vy = -Math.sin(screenAngle) * speed * 0.9;

        let px = this.momPos.x + 1, py = 2.8, pz = 0;
        let pvx = vx, pvy = vy;

        const points = [];
        for (let i = 0; i < 40; i++) {
            pvy -= 0.012;
            px += pvx;
            py += pvy;
            if (py < 0) break;
            points.push(new THREE.Vector3(px, py, pz));
        }

        if (points.length > 1) {
            const curve = new THREE.CatmullRomCurve3(points);
            const geo = new THREE.TubeGeometry(curve, points.length * 2, 0.04, 6, false);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.35
            });
            const tube = new THREE.Mesh(geo, mat);
            tube.userData.isPreview = true;
            scene.add(tube);

            // Dots along path
            for (let i = 0; i < points.length; i += 3) {
                const dot = new THREE.Mesh(
                    new THREE.SphereGeometry(0.06, 4, 4),
                    new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.5 })
                );
                dot.position.copy(points[i]);
                dot.userData.isPreview = true;
                scene.add(dot);
            }
        }
    },

    // ---- Helpers ----
    makeBox(w, h, d, mat) {
        const m = new THREE.Mesh(GEO.box, mat);
        m.scale.set(w, h, d);
        return m;
    },
    makeSphere(r, mat) {
        const m = new THREE.Mesh(GEO.sphere, mat);
        m.scale.set(r, r, r);
        return m;
    },
    makeCylinder(r, h, mat) {
        const m = new THREE.Mesh(GEO.cylinder, mat);
        m.scale.set(r, h, r);
        return m;
    },

    // ---- Main Loop ----
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now() / 1000;

        this.updatePhysics();
        this.updateParticles();
        this.updateAnimations(time);
        this.renderTrail();
        this.renderAimPreview();

        renderer.render(scene, camera);
    }
};

// ---- Start ----
game.init();
