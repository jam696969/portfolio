// =========================
// 3D ARCADE BACKGROUND
// =========================

(function () {
    "use strict";

    let scene, camera, renderer;
    let shapes = [];
    let mouseX = 0, mouseY = 0;
    let animationId = null;
    let isDark = true;

    const container = document.getElementById("bg-3d-container");
    if (!container) return;

    // ---- INIT ----
    function init() {
        scene = new THREE.Scene();

        const w = window.innerWidth;
        const h = window.innerHeight;

        camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        camera.position.z = 30;

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Floating geometric shapes
        createShapes();

        // Mouse movement for parallax
        document.addEventListener("mousemove", (e) => {
            mouseX = (e.clientX / w) * 2 - 1;
            mouseY = -(e.clientY / h) * 2 + 1;
        });

        window.addEventListener("resize", onResize);

        // Check initial theme
        isDark = !document.body.classList.contains("light-mode");
        updateColors();

        // Start animation
        animate();
    }

    // ---- SHAPES ----
    function createShapes() {
        const geometries = [
            new THREE.BoxGeometry(1.2, 1.2, 1.2),
            new THREE.OctahedronGeometry(0.9),
            new THREE.TorusGeometry(0.7, 0.25, 8, 12),
            new THREE.IcosahedronGeometry(0.8),
            new THREE.TetrahedronGeometry(1.0),
        ];

        const count = 45;

        for (let i = 0; i < count; i++) {
            const geo = geometries[i % geometries.length];
            const isWireframe = Math.random() > 0.5;

            const material = new THREE.MeshBasicMaterial({
                color: getRandomNeonColor(),
                wireframe: isWireframe,
                transparent: true,
                opacity: 0.15 + Math.random() * 0.25,
            });

            const mesh = new THREE.Mesh(geo, material);

            // Scatter in 3D space
            const radius = 15 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
            mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
            mesh.position.z = radius * Math.cos(phi) - 5;

            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;

            // Store per-shape animation params
            mesh.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.02,
                rotSpeedY: (Math.random() - 0.5) * 0.02,
                rotSpeedZ: (Math.random() - 0.5) * 0.02,
                floatSpeed: 0.003 + Math.random() * 0.007,
                floatAmp: 0.3 + Math.random() * 0.6,
                baseY: mesh.position.y,
                phase: Math.random() * Math.PI * 2,
            };

            shapes.push(mesh);
            scene.add(mesh);
        }

        // A few larger shapes nearby
        for (let i = 0; i < 8; i++) {
            const geo = new THREE.TorusKnotGeometry(0.6, 0.2, 32, 8);
            const material = new THREE.MeshBasicMaterial({
                color: getRandomNeonColor(),
                wireframe: true,
                transparent: true,
                opacity: 0.08,
            });
            const mesh = new THREE.Mesh(geo, material);
            const angle = (i / 8) * Math.PI * 2;
            mesh.position.x = Math.cos(angle) * 12;
            mesh.position.y = Math.sin(angle) * 12;
            mesh.position.z = -12;
            mesh.scale.set(1.5, 1.5, 1.5);
            mesh.userData = {
                rotSpeedX: 0.005,
                rotSpeedY: 0.008,
                rotSpeedZ: 0.003,
                floatSpeed: 0.002,
                floatAmp: 0.5,
                baseY: mesh.position.y,
                phase: i,
            };
            shapes.push(mesh);
            scene.add(mesh);
        }
    }

    // ---- COLORS ----
    const neonPalette = [
        "#00ffff", "#ff00ff", "#ffff00", "#00ff41",
        "#ff6b35", "#ff1493", "#b44dff",
    ];

    const lightPalette = [
        "#0099cc", "#cc33cc", "#ccaa00", "#00aa33",
        "#cc5522", "#cc1166", "#8833cc",
    ];

    function getRandomNeonColor() {
        const p = isDark ? neonPalette : lightPalette;
        return p[Math.floor(Math.random() * p.length)];
    }

    function updateColors() {
        shapes.forEach((mesh) => {
            if (mesh.material) {
                const p = isDark ? neonPalette : lightPalette;
                mesh.material.color.set(p[Math.floor(Math.random() * p.length)]);
            }
        });
    }

    // ---- ANIMATION ----
    function animate() {
        animationId = requestAnimationFrame(animate);

        // Parallax
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Rotate and float shapes
        const t = Date.now() * 0.001;
        shapes.forEach((mesh) => {
            const ud = mesh.userData;
            mesh.rotation.x += ud.rotSpeedX;
            mesh.rotation.y += ud.rotSpeedY;
            mesh.rotation.z += ud.rotSpeedZ;
            mesh.position.y = ud.baseY + Math.sin(t * ud.floatSpeed + ud.phase) * ud.floatAmp;
        });

        renderer.render(scene, camera);
    }

    // ---- RESIZE ----
    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    // ---- THEME CHANGE LISTENER ----
    function onThemeChange() {
        isDark = !document.body.classList.contains("light-mode");
        updateColors();
    }

    // Observe class changes on body for theme toggle
    const observer = new MutationObserver(() => onThemeChange());
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // ---- START ----
    // Wait for DOM + Three.js to be ready
    function tryInit() {
        if (typeof THREE !== "undefined") {
            init();
        } else {
            setTimeout(tryInit, 100);
        }
    }
    tryInit();

})();
