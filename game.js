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

let sonarObjects = [];

function generateSonarObjects() {

    sonarObjects = [];

    const objectCount = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < objectCount; i++) {

        const distance = Math.floor(Math.random() * 900) + 100;

        let type;

        if (depth < 500) {
            type = "Rock Formation";
        } else if (depth < 1500) {
            type = Math.random() < 0.5 ? "Rock Formation" : "Unknown Object";
        } else if (depth < 2500) {
            type = Math.random() < 0.5 ? "Deep Trench" : "Unknown Object";
        } else {
            const objects = [
                "Deep Trench",
                "Hydrothermal Vent",
                "Unknown Structure",
                "Large Formation"
            ];

            type = objects[Math.floor(Math.random() * objects.length)];
        }

        sonarObjects.push({
            type: type,
            distance: distance
        });
    }
}

function displaySonar() {

    sonar.innerHTML = `
        <div class="sonar-screen">

            <div class="sonar-grid"></div>

            <div class="sonar-sweep"></div>

            <div class="submarine-marker"></div>

            ${sonarObjects.map(function(object) {

                const angle = Math.random() * 360;
                const distance = Math.min(object.distance / 10, 45);

                return `
                    <div
                        class="sonar-object"
                        style="
                            transform:
                            rotate(${angle}deg)
                            translateY(-${distance}%);
                        ">
                    </div>
                `;

            }).join("")}

        </div>

        <div class="sonar-info">
            <p>DEPTH: ${depth} m</p>
            <p>CONTACTS: ${sonarObjects.length}</p>
        </div>
    `;
}

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

    addLog("Sonar scan initiated at " + depth + " m.");

    sonar.innerHTML = `
        <div class="sonar-screen scanning">
            <div class="sonar-grid"></div>
            <div class="sonar-sweep"></div>
        </div>

        <div class="sonar-info">
            <p>SCANNING...</p>
        </div>
    `;

    setTimeout(function() {

        generateSonarObjects();
        displaySonar();

        addLog(
            "Scan complete. " +
            sonarObjects.length +
            " contact(s) detected."
        );

        updateDisplay();

    }, 1500);

    updateDisplay();
});

updateDisplay();
