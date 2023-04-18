// Global variables
let testGlobeRadiusInner = 200;
let testGlobeRadiusOuter = 600;
let testGlobe;
var earthImage;

let isRotating = true;
let rotationAngle = 200;

let locationsTable;
let locationVectors = [];
let locationRefVectors = [];
let locationHeights = [];
let rotationAngles = [];
let locationDepartmentNames = [];
let locationDepartmentHues = [];
let rotationAxis = [];
let locationsCount;

// let ucsbLat = 34.4140;
// let ucsbLon = -119.8489;
let ucsbLat = 34.4140;
let ucsbLon = -119.8489;
let ucsbVector;
let ucsbRefVector;

let departmentNames = [
    "Applied Mathematics",
    "Asian Studies",
    "Biomolecular Science and Engineering",
    "Chemical Engineering",
    "Chemistry",
    "Chemistry and Biochemistry",
    "Chicana and Chicano Studies",
    "Classics",
    "Communication",
    "Comparative Literature",
    "Computer Science",
    "Counseling, Clinical and School Psychology",
    "Earth Science",
    "Ecology, Evolution and Marine Biology",
    "Economics",
    "Education",
    "Education - Gevirtz Graduate School",
    "Education, Joint Program Cal Poly SLO",
    "Electrical and Computer Engineering",
    "English",
    "Environmental Science and Management",
    "Feminist Studies",
    "Film and Media Studies",
    "French",
    "French and Italian",
    "Geography",
    "Geography, Joint Program SDSU",
    "Geological Sciences",
    "Global and International Studies",
    "Hispanic Languages and Literatures",
    "History",
    "History of Art and Architecture",
    "Latin American and Iberian Studies",
    "Linguistics",
    "Marine Science",
    "Materials",
    "Mathematics",
    "Mechanical Engineering",
    "Molecular, Cellular and Developmental Biology",
    "Music",
    "Philosophy",
    "Physics",
    "Political Science",
    "Psychological and Brain Sciences",
    "Religious Studies",
    "Sociology",
    "Spanish",
    "Spanish and Portuguese",
    "Theater and Dance",
    "Theater Studies"
];
let departmentsCount = departmentNames.length;
let departmentColors = [];
let indexOfDepartmentSelected = -1;

function getDepartmentColor(name) {
    for (let i = 0; i < departmentsCount; i++) {
        if (name === departmentNames[i]) {
            return (i * 800 / departmentsCount);
        }
    }
    return 0;
}

function drawReferenceKeys() {
    fill(0);
    strokeWeight(2);
    textSize(10);
    textAlign(LEFT);

    let linesStartPosX = -630;
    let linesStartPosY = -440;
    let linesLength = -600;
    let linesGapSpace = 20;
    let textStartPosX = -590;
    let textStartPosY = -440;

    for (let i = 0; i < departmentsCount; i++) {
        stroke(departmentColors[i], 450, 450, 900);
        line(
            linesStartPosX,
            linesStartPosY + linesGapSpace * i,
            linesLength,
            linesStartPosY + linesGapSpace * i
        );
        if (indexOfDepartmentSelected == i || indexOfDepartmentSelected == -1) {
            fill(800);
        } else { fill(400); }
        textFont(fontRegular);
        text(departmentNames[i], textStartPosX, textStartPosY + linesGapSpace * i);
    }

}

function mouseMoved() {
    let linesStartPosY = -630;
    let linesGapSpace = 20;
    let keySelectXBoundary = 100;

    if (mouseX < keySelectXBoundary) {
        indexOfDepartmentSelected = Math.floor((mouseY - linesGapSpace / 2) / linesGapSpace);
    } else {
        indexOfDepartmentSelected = -1;
    }
}

function keyPressed() {
    isRotating = !isRotating;
}


function doRotation(rotationSpeed) {
    rotateY(rotationAngle);
    if (isRotating) {
        rotationAngle += rotationSpeed;
    }
}

function drawLocations() {
    for (let i = 0; i < locationsCount; i++) {
        push();
        fill(800);
        stroke(800);
        let vector = locationVectors[i];
        let rotationAxes = rotationAxis[i];
        translate(vector.x, vector.y, vector.z);
        rotate(rotationAngles[i], rotationAxes.x, rotationAxes.y, rotationAxes.z);
        box(5, 100, 5);
        pop();
    }
}

function getCartesianVector(lat, lon, radius) {
    let radLat = radians(lat);
    let radLon = radians(lon) + PI;
    let x = radius * cos(radLat) * cos(radLon);
    let y = radius * cos(radLat) * sin(radLon);
    let z = radius * sin(radLat);

    return createVector(x, -z, -y);
}

function preload() {
    // earthImage = loadImage("earth.jpg");
    fontRegular = loadFont('assets/Roboto-Black.ttf');
    locationsTable = loadTable("fullListGeocoded.csv", "header");
    earthImage = loadImage('assets/earth.jpg');

}

function setup() {
    colorMode(HSB, 800);
    // testGlobe = createShape(SPHERE, testGlobeRadiusInner);
    textFont('Helvetica');
    createCanvas(1280, 900, WEBGL);
    ucsbVector = getCartesianVector(ucsbLat, ucsbLon, testGlobeRadiusInner);
    ucsbRefVector = getCartesianVector(ucsbLat, ucsbLon, testGlobeRadiusOuter);
    locationsCount = locationsTable.getRowCount();
    let xAxis = createVector(0, 1, 0);
    for (let i = 0; i < locationsCount; i++) {
        let row = locationsTable.getRow(i);
        let lat = row.getNum("lat");
        let lon = row.getNum("lon");
        locationVectors[i] = getCartesianVector(lat, lon, testGlobeRadiusInner);

        locationRefVectors[i] = getCartesianVector(lat, lon, testGlobeRadiusOuter);

        locationDepartmentNames[i] = row.getString("department");
        locationDepartmentHues[i] = getDepartmentColor(locationDepartmentNames[i]);
        let numberOfItems = row.getNum("Frequency");
        let maxHeight = Math.pow(10, 10);
        locationHeights[i] = map(Math.pow(1.6, numberOfItems), 0, maxHeight, 10, 50);
        rotationAngles[i] = xAxis.angleBetween(locationVectors[i]);
        rotationAxis[i] = xAxis.cross(locationVectors[i]);
    }

    for (let i = 0; i < departmentsCount; i++) {
        departmentColors[i] = getDepartmentColor(departmentNames[i]);
    }
}

function drawUCSB() {
    push();
    translate(ucsbVector.x, ucsbVector.y, ucsbVector.z);
    fill(204, 133, 0); // random red colour
    pop();
}

function draw() {
    background(51);
    drawUCSB();
    drawReferenceKeys();
    noStroke();

    push();
    // translate(width * 0.5, height * 0.5);

    //pass image as texture
    texture(earthImage);
    doRotation(0.005);
    sphere(testGlobeRadiusInner);
    stroke(255);
    noFill();
    for (let i = 0; i < locationsCount; i++) {
        let shouldRenderBezier = true;
        if (indexOfDepartmentSelected != -1) {
            shouldRenderBezier = departmentNames[indexOfDepartmentSelected] === locationDepartmentNames[indexOfDepartmentSelected];
        }
        if (shouldRenderBezier) {
            let vector = locationVectors[i];
            let refVector = locationRefVectors[i];
            noStroke();
            texture(earthImage);
            sphere(testGlobeRadiusInner);
            noFill();

            stroke(locationDepartmentHues[i], 450, 450, 900);
            beginShape();
            vertex(vector.x, vector.y, vector.z);
            bezierVertex(
                refVector.x, refVector.y, refVector.z,
                ucsbRefVector.x, ucsbRefVector.y, ucsbRefVector.z,
                ucsbVector.x, ucsbVector.y, ucsbVector.z
            );
            endShape();
        }
    }
    pop();

}