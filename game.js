// ========================================
// DEEP SURVEY
// GAME LOGIC
// ========================================


// ========================================
// SUBMARINE SYSTEMS
// ========================================

let depth = 0;
let heading = 0;
let speed = 0;

let battery = 100;
let oxygen = 100;
let hull = 100;

const maxDepth = 5000;


// ========================================
// HTML ELEMENTS
// ========================================

const depthDisplay = document.getElementById("depth");
const headingDisplay = document.getElementById("heading");
const speedDisplay = document.getElementById("speed");

const oxygenDisplay = document.getElementById("oxygen");
const batteryDisplay = document.getElementById("battery");
const hullDisplay = document.getElementById("hull");

const navDepthDisplay = document.getElementById("nav-depth");
const positionDisplay = document.getElementById("position");

const sonar = document.getElementById("sonar");
const contactsDisplay = document.getElementById("contacts");

const log = document.getElementById("log");


// ========================================
// DISPLAY
// ========================================

function updateDisplay() {

    depthDisplay.textContent = Math.round(depth) + " m";

    headingDisplay.textContent =
        String(Math.round(heading)).padStart(3, "0") + "°";

    speedDisplay.textContent =
        speed.toFixed(1) + " kn";

    oxygenDisplay.textContent =
        Math.max(0, Math.round(oxygen)) + "%";

    batteryDisplay.textContent =
        Math.max(0, Math.round(battery)) + "%";

    hullDisplay.textContent =
        Math.max(0, Math.round(hull)) + "%";

    navDepthDisplay.textContent =
        Math.round(depth) + " m";

    positionDisplay.textContent =
        heading + "° / " + depth + " m";
}


// ========================================
// LOG
// ========================================

function addLog(message) {

    const entry = document.createElement("p");

    entry.textContent = "> " + message;

    log.appendChild(entry);

    log.scrollTop = log.scrollHeight;
}


// ========================================
// DESCEND
// ========================================

function descend() {

    if (depth >= maxDepth) {

        addLog("Maximum operating depth reached.");

        return;
    }

    if (battery <= 0 || oxygen <= 0) {

        addLog("WARNING: Submersible systems cannot continue.");

        return;
    }

    depth += 100;

    battery -= 2;
    oxygen -= 1;

    speed = 2.0;

    if (depth > 2000) {
        hull -= 0.5;
    }

    if (depth > 4000) {
        hull -= 1;
    }

    updateDisplay();

    addLog("Descending to " + depth + " m.");
}


// ========================================
// ASCEND
// ========================================

function ascend() {

    if (depth <= 0) {

        depth = 0;
        speed = 0;

        addLog("Submersible is already at the surface.");

        return;
    }

    depth -= 100;

    if (depth < 0) {
        depth = 0;
    }

    battery -= 1;
    oxygen -= 0.5;

    speed = 1.5;

    if (depth === 0) {
        speed = 0;
        addLog("SURFACE REACHED.");
    } else {
        addLog("Ascending to " + depth + " m.");
    }

    updateDisplay();
}


// ========================================
// TURN LEFT
// ========================================

function turnLeft() {

    heading -= 10;

    if (heading < 0) {
        heading += 360;
    }

    updateDisplay();
}


// ========================================
// TURN RIGHT
// ========================================

function turnRight() {

    heading += 10;

    if (heading >= 360) {
        heading -= 360;
    }

    updateDisplay();
}


// ========================================
// SONAR SCAN
// ========================================

function scan() {

    if (battery <= 0) {

        addLog("WARNING: Insufficient battery power.");

        return;
    }

    if (depth === 0) {

        addLog("Cannot perform deep survey at the surface.");

        return;
    }

    battery -= 3;

    contactsDisplay.textContent = "SCANNING...";

    addLog("Sonar scan initiated at " + depth + " m.");

    setTimeout(function() {

        const contactCount =
            Math.floor(Math.random() * 4);

        contactsDisplay.textContent =
            "CONTACTS: " + contactCount;

        if (contactCount === 0) {

            addLog(
                "Scan complete. No significant contacts detected."
            );

        } else {

            addLog(
                "Scan complete. " +
                contactCount +
                " contact(s) detected."
            );
        }

        updateDisplay();

    }, 1500);

    updateDisplay();
}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", function(event) {

    // W = descend
    if (event.key.toLowerCase() === "w") {

        descend();
    }


    // S = ascend
    if (event.key.toLowerCase() === "s") {

        ascend();
    }


    // A = turn left
    if (event.key.toLowerCase() === "a") {

        turnLeft();
    }


    // D = turn right
    if (event.key.toLowerCase() === "d") {

        turnRight();
    }


    // SPACE = scan
    if (event.code === "Space") {

        event.preventDefault();

        scan();
    }

});


// ========================================
// INITIAL STATE
// ========================================

updateDisplay();

addLog("KEYBOARD CONTROLS ONLINE.");
addLog("W / S : DEPTH CONTROL");
addLog("A / D : HEADING CONTROL");
addLog("SPACE : SONAR SCAN");
