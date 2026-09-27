import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";


// ========================================
// THREE.JS SCENE
// ========================================

const cameraView = document.getElementById("camera-view");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x061820);

scene.fog = new THREE.FogExp2(
    0x061820,
    0.018
);


// ========================================
// CAMERA
// ========================================

const camera = new THREE.PerspectiveCamera(
    75,
    cameraView.clientWidth / cameraView.clientHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 10);


// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    cameraView.clientWidth,
    cameraView.clientHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

cameraView.appendChild(renderer.domElement);


// ========================================
// LIGHTING
// ========================================

const ambientLight = new THREE.HemisphereLight(
    0x6fa9bd,
    0x02080b,
    1.5
);

scene.add(ambientLight);


const submarineLight = new THREE.PointLight(
    0xbdefff,
    10,
    60
);

submarineLight.position.set(
    0,
    0,
    0
);

scene.add(submarineLight);


// ========================================
// SEAFLOOR
// ========================================

const floorGeometry = new THREE.PlaneGeometry(
    500,
    500,
    50,
    50
);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x172327,
    roughness: 1
});

const seafloor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

seafloor.rotation.x = -Math.PI / 2;

seafloor.position.y = -20;

scene.add(seafloor);


// ========================================
// ROCKS
// ========================================

function createRock(x, y, z, scale) {

    const geometry = new THREE.DodecahedronGeometry(
        scale,
        1
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x27383b,
        roughness: 1
    });

    const rock = new THREE.Mesh(
        geometry,
        material
    );

    rock.position.set(x, y, z);

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    scene.add(rock);
}


// Create some rocks
for (let i = 0; i < 50; i++) {

    const x = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;

    const scale =
        Math.random() * 3 + 1;

    createRock(
        x,
        -17,
        z,
        scale
    );
}


// ========================================
// MOVEMENT
// ========================================

const keys = {};

document.addEventListener(
    "keydown",
    function(event) {

        keys[event.code] = true;

    }
);

document.addEventListener(
    "keyup",
    function(event) {

        keys[event.code] = false;

    }
);


// ========================================
// MOUSE LOOK
// ========================================

let yaw = 0;
let pitch = 0;

document.addEventListener(
    "mousemove",
    function(event) {

        if (document.pointerLockElement !== renderer.domElement) {
            return;
        }

        yaw -= event.movementX * 0.002;

        pitch -= event.movementY * 0.002;

        pitch = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, pitch)
        );

    }
);


// Click camera to activate mouse look

renderer.domElement.addEventListener(
    "click",
    function() {

        renderer.domElement.requestPointerLock();

    }
);


// ========================================
// MOVEMENT SETTINGS
// ========================================

const moveSpeed = 0.15;


// ========================================
// GAME LOOP
// ========================================

function animate() {

    requestAnimationFrame(animate);


    // ------------------------------------
    // CAMERA ROTATION
    // ------------------------------------

    camera.rotation.order = "YXZ";

    camera.rotation.y = yaw;

    camera.rotation.x = pitch;


    // ------------------------------------
    // MOVEMENT
    // ------------------------------------

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);


    // Forward
    if (keys["KeyW"]) {

        camera.position.addScaledVector(
            direction,
            moveSpeed
        );

    }


    // Backward
    if (keys["KeyS"]) {

        camera.position.addScaledVector(
            direction,
            -moveSpeed
        );

    }


    // Left
    if (keys["KeyA"]) {

        camera.position.x -=
            Math.cos(yaw) * moveSpeed;

        camera.position.z +=
            Math.sin(yaw) * moveSpeed;

    }


    // Right
    if (keys["KeyD"]) {

        camera.position.x +=
            Math.cos(yaw) * moveSpeed;

        camera.position.z -=
            Math.sin(yaw) * moveSpeed;

    }


    renderer.render(
        scene,
        camera
    );
}

animate();


// ========================================
// RESIZE
// ========================================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            cameraView.clientWidth /
            cameraView.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            cameraView.clientWidth,
            cameraView.clientHeight
        );

    }
);
