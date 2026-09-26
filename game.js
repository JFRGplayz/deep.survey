let depth = 0;
let battery = 100;
let oxygen = 100;
let hull = 100;

const maxDepth = 5000;

const depthDisplay = document.getElementById("depth");
const batteryDisplay = document.getElementById("battery");
const oxygenDisplay = document.getElementById("oxygen");
const hullDisplay = document.getElementById("hull");

const sonar = document.getElementById("sonar");
const log = document.getElementById("log");

const descendButton = document.getElementById("descend");
const ascendButton = document.getElementById("ascend");
const scanButton = document.getElementById("scan");

function updateDisplay() {
    depthDisplay.textContent = depth + " m";
    batteryDisplay.textContent = Math.round(battery) + "%";
    oxygenDisplay.textContent = Math.round(oxygen) + "%";
    hullDisplay.textContent = Math.round(hull) + "%";
}

function addLog(message) {
    const entry = document.createElement("p");

    entry.textContent = "> " + message;

    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

descendButton.addEventListener("click", function() {

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

    if (depth > 2000) {
        hull -= 0.5;
    }

    updateDisplay();

    addLog("Descending to " + depth + " m.");

});

ascendButton.addEventListener("click", function() {

    if (depth <= 0) {
        addLog("Submersible is already at the surface.");
        return;
    }

    depth -= 100;

    if (depth < 0) {
        depth = 0;
    }

    battery -= 1;
    oxygen -= 0.5;

    updateDisplay();

    addLog("Ascending to " + depth + " m.");

});

scanButton.addEventListener("click", function() {

    if (battery <= 0) {
        addLog("WARNING: Insufficient battery power.");
        return;
    }

    if (depth === 0) {
        addLog("Cannot perform deep survey at the surface.");
        return;
    }

    battery -= 3;

    sonar.innerHTML = `
        <p>SONAR ACTIVE</p>
        <p>Scanning at ${depth} m...</p>
    `;

    addLog("Sonar scan initiated at " + depth + " m.");

    setTimeout(function() {

        sonar.innerHTML = `
            <p>SONAR COMPLETE</p>
            <p>No significant formations detected.</p>
        `;

        addLog("Scan complete. No significant formations detected.");

    }, 1500);

    updateDisplay();
});

updateDisplay();
