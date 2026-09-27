import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";


// ========================================
// CAMERA VIEW
// ========================================

const cameraView = document.getElementById("camera-view");


// ========================================
// THREE.JS SCENE
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x79b9d1);

scene.fog = new THREE.FogExp2(
    0x153e4c,
    0.008
);


// ========================================
// CAMERA
// ========================================

const camera = new THREE.PerspectiveCamera(
    75,
    cameraView.clientWidth / cameraView.clientHeight,
    0.1,
    2000
);

camera.position.set(0, 2, 20);


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

renderer.outputColorSpace = THREE.SRGBColorSpace;

cameraView.appendChild(renderer.domElement);


// ========================================
// LIGHTING
// ========================================

const skyLight = new THREE.HemisphereLight(
    0xbfe8f5,
    0x102329,
    2
);

scene.add(skyLight);


const sunlight = new THREE.DirectionalLight(
    0xffffff,
    2
);

sunlight.position.set(
    100,
    200,
    100
);

scene.add(sunlight);


// ========================================
// SUBMARINE LIGHT
// ========================================

const submarineLight = new THREE.PointLight(
    0xc9f6ff,
    15,
    70
);

camera.add(submarineLight);

scene.add(camera);


// ========================================
// OCEAN SURFACE
// ========================================

const oceanGeometry = new THREE.PlaneGeometry(
    2000,
    2000
);

const oceanMaterial = new THREE.MeshStandardMaterial({
    color: 0x24758b,
    transparent: true,
    opacity: 0.75,
    roughness: 0.2,
    metalness: 0
});

const ocean = new THREE.Mesh(
    oceanGeometry,
    oceanMaterial
);

ocean.rotation.x = -Math.PI / 2;

ocean.position.y = 0;

scene.add(ocean);


// ========================================
// SEAFLOOR
// ========================================

const floorGeometry = new THREE.PlaneGeometry(
    1000,
    1000,
    80,
    80
);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x293c3d,
    roughness: 1
});

const seafloor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

seafloor.rotation.x = -Math.PI / 2;

// Initial shallows floor
seafloor.position.y = -95;

scene.add(seafloor);


// ========================================
// DEEP OCEAN TERRAIN
// ========================================

const deepFloorGeometry = new THREE.PlaneGeometry(
    1000,
    1000,
    80,
    80
);

const deepFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x172629,
    roughness: 1
});

const deepFloor = new THREE.Mesh(
    deepFloorGeometry,
    deepFloorMaterial
);

deepFloor.rotation.x = -Math.PI / 2;

deepFloor.position.y = -1000;

scene.add(deepFloor);


// ========================================
// ROCKS
// ========================================

const surveyObjects = [];


function createRock(
    x,
    y,
    z,
    scale
) {

    const geometry =
        new THREE.DodecahedronGeometry(
            scale,
            1
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x304345,
            roughness: 1
        });

    const rock =
        new THREE.Mesh(
            geometry,
            material
        );

    rock.position.set(
        x,
        y,
        z
    );

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    scene.add(rock);

    surveyObjects.push({
        mesh: rock,
        type: "ROCK FORMATION"
    });
}


// Create shallow rocks

for (let i = 0; i < 35; i++) {

    const x =
        (Math.random() - 0.5) * 500;

    const z =
        (Math.random() - 0.5) * 500;

    const size =
        Math.random() * 5 + 2;

    createRock(
        x,
        -92,
        z,
        size
    );
}


// ========================================
// DEEP OBJECTS
// ========================================

function createDeepObject(
    x,
    y,
    z,
    type
) {

    const geometry =
        new THREE.DodecahedronGeometry(
            10,
            1
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x1c292b,
            roughness: 1
        });

    const object =
        new THREE.Mesh(
            geometry,
            material
        );

    object.position.set(
        x,
        y,
        z
    );

    scene.add(object);

    surveyObjects.push({
        mesh: object,
        type: type
    });
}


createDeepObject(
    80,
    -250,
    -150,
    "LARGE ROCK FORMATION"
);

createDeepObject(
    -130,
    -450,
    -200,
    "UNKNOWN OBJECT"
);

createDeepObject(
    200,
    -700,
    100,
    "HYDROTHERMAL VENT"
);

createDeepObject(
    -250,
    -900,
    250,
    "UNKNOWN STRUCTURE"
);


// ========================================
// SUBMARINE SYSTEMS
// ========================================

let depth = 0;

let heading = 0;

let speed = 0;

let battery = 100;

let oxygen = 100;

let hull = 100;


// ========================================
// MOVEMENT
// ========================================

const keys = {};

document.addEventListener(
    "keydown",
    function(event) {

        keys[event.code] = true;

        if (
            event.code === "Space"
        ) {
            event.preventDefault();
        }

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


renderer.domElement.addEventListener(
    "click",
    function() {

        renderer.domElement.requestPointerLock();

    }
);


document.addEventListener(
    "mousemove",
    function(event) {

        if (
            document.pointerLockElement !==
            renderer.domElement
        ) {
            return;
        }

        yaw -= event.movementX * 0.002;

        pitch -= event.movementY * 0.002;

        pitch = Math.max(
            -Math.PI / 2,
            Math.min(
                Math.PI / 2,
                pitch
            )
        );

    }
);


// ========================================
// MOVEMENT SETTINGS
// ========================================

const forwardSpeed = 0.35;

const turnSpeed = 0.025;

const verticalSpeed = 0.4;


// ========================================
// DISPLAY ELEMENTS
// ========================================

const depthDisplay =
    document.getElementById("depth");

const headingDisplay =
    document.getElementById("heading");

const speedDisplay =
    document.getElementById("speed");

const oxygenDisplay =
    document.getElementById("oxygen");

const batteryDisplay =
    document.getElementById("battery");

const hullDisplay =
    document.getElementById("hull");

const navDepthDisplay =
    document.getElementById("nav-depth");

const positionDisplay =
    document.getElementById("position");

const contactsDisplay =
    document.getElementById("contacts");

const log =
    document.getElementById("log");


// ========================================
// DISPLAY
// ========================================

function updateDisplay() {

    depthDisplay.textContent =
        Math.round(depth) + " m";

    headingDisplay.textContent =
        String(
            Math.round(heading)
        ).padStart(3, "0") + "°";

    speedDisplay.textContent =
        speed.toFixed(1) + " kn";

    oxygenDisplay.textContent =
        Math.max(
            0,
            Math.round(oxygen)
        ) + "%";

    batteryDisplay.textContent =
        Math.max(
            0,
            Math.round(battery)
        ) + "%";

    hullDisplay.textContent =
        Math.max(
            0,
            Math.round(hull)
        ) + "%";

    navDepthDisplay.textContent =
        Math.round(depth) + " m";

    positionDisplay.textContent =
        Math.round(camera.position.x) +
        " / " +
        Math.round(camera.position.z);
}


// ========================================
// LOG
// ========================================

function addLog(message) {

    const entry =
        document.createElement("p");

    entry.textContent =
        "> " + message;

    log.appendChild(entry);

    log.scrollTop =
        log.scrollHeight;
}


// ========================================
// DEPTH
// ========================================

function updateDepth() {

    depth =
        Math.max(
            0,
            -camera.position.y
        );

    updateEnvironment();

}


// ========================================
// ENVIRONMENT DEPTH
// ========================================

function updateEnvironment() {

    const depthFactor =
        Math.min(
            depth / 1000,
            1
        );


    // Darken sky/water as we descend

    const surfaceColor =
        new THREE.Color(
            0x79b9d1
        );

    const deepColor =
        new THREE.Color(
            0x02090d
        );

    scene.background.copy(
        surfaceColor.clone().lerp(
            deepColor,
            depthFactor
        )
    );


    // Increase fog with depth

    scene.fog.density =
        0.008 +
        depthFactor * 0.025;


    // Reduce natural light

    skyLight.intensity =
        Math.max(
            0.2,
            2 - depthFactor * 1.8
        );

    sunlight.intensity =
        Math.max(
            0,
            2 - depthFactor * 2
        );


    // Submarine lights become more important

    submarineLight.intensity =
        10 +
        depthFactor * 20;
}


// ========================================
// SONAR
// ========================================

function scan() {

    if (battery <= 0) {

        addLog(
            "WARNING: BATTERY DEPLETED."
        );

        return;
    }

    battery -= 3;

    contactsDisplay.textContent =
        "SCANNING...";

    addLog(
        "Sonar scan initiated."
    );


    setTimeout(
        function() {

            let contacts = [];


            for (
                const object of surveyObjects
            ) {

                const distance =
                    camera.position.distanceTo(
                        object.mesh.position
                    );


                if (distance < 250) {

                    contacts.push({
                        object: object,
                        distance: distance
                    });

                }

            }


            contactsDisplay.textContent =
                "CONTACTS: " +
                contacts.length;


            if (
                contacts.length === 0
            ) {

                addLog(
                    "Scan complete. " +
                    "No contacts detected."
                );

            } else {

                const nearest =
                    contacts.sort(
                        (a, b) =>
                            a.distance -
                            b.distance
                    )[0];


                addLog(
                    "CONTACT: " +
                    nearest.object.type +
                    " / " +
                    Math.round(
                        nearest.distance
                    ) +
                    " m"
                );

            }

            updateDisplay();

        },
        1200
    );

    updateDisplay();
}


// ========================================
// MAIN MOVEMENT
// ========================================

function updateMovement() {

    let moving = false;


    // ------------------------------------
    // FORWARD
    // ------------------------------------

    if (keys["KeyW"]) {

        const direction =
            new THREE.Vector3(
                0,
                0,
                -1
            );

        direction.applyQuaternion(
            camera.quaternion
        );

        camera.position.addScaledVector(
            direction,
            forwardSpeed
        );

        moving = true;
    }


    // ------------------------------------
    // BACKWARD
    // ------------------------------------

    if (keys["KeyS"]) {

        const direction =
            new THREE.Vector3(
                0,
                0,
                1
            );

        direction.applyQuaternion(
            camera.quaternion
        );

        camera.position.addScaledVector(
            direction,
            forwardSpeed
        );

        moving = true;
    }


    // ------------------------------------
    // TURN LEFT
    // ------------------------------------

    if (keys["KeyA"]) {

        yaw += turnSpeed;

        moving = true;
    }


    // ------------------------------------
    // TURN RIGHT
    // ------------------------------------

    if (keys["KeyD"]) {

        yaw -= turnSpeed;

        moving = true;
    }


    // ------------------------------------
    // SUBMERGE
    // SHIFT
    // ------------------------------------

    if (keys["ShiftLeft"] ||
        keys["ShiftRight"]) {

        if (depth < 5000) {

            camera.position.y -=
                verticalSpeed;

            battery -= 0.01;

            oxygen -= 0.005;

        }

        moving = true;
    }


    // ------------------------------------
    // ASCEND
    // CTRL
    // ------------------------------------

    if (keys["ControlLeft"] ||
        keys["ControlRight"]) {

        if (depth > 0) {

            camera.position.y +=
                verticalSpeed;

            battery -= 0.01;

            oxygen -= 0.005;

        }

        moving = true;
    }


    // ------------------------------------
    // PREVENT GOING ABOVE SURFACE
    // ------------------------------------

    if (camera.position.y > 2) {

        camera.position.y = 2;

    }


    // ------------------------------------
    // SPEED
    // ------------------------------------

    if (moving) {

        speed = 1.5;

    } else {

        speed *= 0.95;

    }


    // ------------------------------------
    // HEADING
    // ------------------------------------

    let degrees =
        THREE.MathUtils.radToDeg(
            -yaw
        );

    degrees =
        (degrees + 360) % 360;

    heading = degrees;


    // ------------------------------------
    // CAMERA ROTATION
    // ------------------------------------

    camera.rotation.order =
        "YXZ";

    camera.rotation.y =
        yaw;

    camera.rotation.x =
        pitch;


    updateDepth();
    updateDisplay();
}


// ========================================
// SPACE = SCAN
// ========================================

let scanPressed = false;


function handleScan() {

    if (
        keys["Space"] &&
        !scanPressed
    ) {

        scan();

        scanPressed = true;

    }

    if (!keys["Space"]) {

        scanPressed = false;

    }
}


// ========================================
// ANIMATION
// ========================================

function animate() {

    requestAnimationFrame(
        animate
    );

    updateMovement();

    handleScan();

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


// ========================================
// STARTUP
// ========================================

updateDisplay();

addLog(
    "SUBMERSIBLE SYSTEMS ONLINE."
);

addLog(
    "CURRENT DEPTH: 0 m."
);

addLog(
    "SHIFT: SUBMERGE / CTRL: ASCEND."
);

addLog(
    "WASD: NAVIGATION / SPACE: SONAR."
);
