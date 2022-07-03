var canvas = document.getElementById("canvas1");
var cxt = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

let enemySpeed = 5;
let frame = 0; // USED WITH ENEMYFRAME TO DETERMINE WHEN TO SPAWN ENEMIES
let distance = 0;
let nextPhaseReady = false;

let gameOver = false;
let running = false;
let randomFrames = [100, 150, 200]; // used for spawning enemies, clouds, and determining cloud heights

class Floor {
  constructor() {
    this.y = canvas.height - 150;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height / 2;
  }
  draw() {
    cxt.fillStyle = "yellow";
    cxt.fillRect(this.x, this.y, this.width, this.height);
  }
}

let floor = new Floor();

const foregroundLayer1 = new Image();
foregroundLayer1.src = "src/images/trueForeground.png";
const foregroundLayer2 = new Image();
foregroundLayer2.src = "src/images/trueForeground2.png";

let gameMusic = new Audio();
gameMusic.src = "src/sounds/one_0.mp3";
let gameMusic2 = new Audio();
gameMusic2.src = "src/sounds/cold_silence.ogg"; // level number, level background, enemy array, music, win score to next level

let sins3 = [];
let level1 = [1, foregroundLayer1, sins3, gameMusic, 1000, "Level 2"];
//let level2 = [2, foregroundLayer2, sins4, gameMusic2, 1000, "To be continued"];

let currentLevel = level1;
//let currentLevel[2] = currentLevel[2];

// used to make the repeating ground image
class Layer {
  constructor(image, speedModifier, yStart, stretch) {
    this.x = 0;
    this.y = yStart;
    this.width = 910 + stretch;
    this.height = 700;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = enemySpeed;
  }
  update() {
    this.speed = enemySpeed;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x = this.x - this.speed;
  }
  draw() {
    cxt.drawImage(this.image, this.x, this.y, this.width, this.height);
    cxt.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

const layer1 = new Layer(currentLevel[1], 1.5, -195, 100); // BACKGROUND SHIT HERE
function handleLayer() {
  layer1.image = currentLevel[1];
  layer1.draw();

  if (running && !gameOver) {
    layer1.update();
  }
}

const cloud1 = new Image();
cloud1.src = "src/images/cloud1.png";
const cloud2 = new Image();
cloud2.src = "src/images/cloud2.png";
const cloud3 = new Image();
cloud3.src = "src/images/cloud3.png";
const blimp1 = new Image();
blimp1.src = "src/images/blimp2.png";
const blimpSign1 = new Image();
blimpSign1.src = "src/images/blimpSignFrames3.png";

let cloudTypes = [cloud1, cloud2, cloud3];
let cloudQueue = [];
class Cloud {
  constructor() {
    this.image = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
    this.width = 150;
    this.height = 50;
    this.x = canvas.width + 100;
    this.y = randomFrames[Math.floor(Math.random() * randomFrames.length)];
    this.delete = false;
    this.speed = enemySpeed * 0.5;
  }
  draw() {
    cxt.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  update() {
    //this.x -= enemySpeed * Math.random(); //gives cool creepy effect to clouds
    this.x -= this.speed;
    //this.x = canvas.width * 0.5;
  }
}

function handleCloud() {
  for (let i = 0; i < cloudQueue.length; i++) {
    let current = cloudQueue[i];

    if (!current.delete && current.x >= -150) {
      current.draw();
      if (!gameOver) {
        current.update();
      }
    }
  }
  if (
    frame % randomFrames[Math.floor(Math.random() * randomFrames.length)] ===
      0 &&
    !nextPhaseReady &&
    cloudQueue <= 0
  ) {
    setTimeout(() => {
      cloudQueue.push(new Cloud());
    }, 1000000000);
  }
}

//"vestigia nulla retrorsum" not a step backwards
//let randomFrames = [100, 150, 200];
let dropFrames = [10, 20, 30]; // RATE at which drops spawn
const rainDrop = new Image();
rainDrop.src = "src/images/warrenEye2.png";
let dropQueue0 = [];

class Raindrop extends Cloud {
  constructor() {
    super();
    this.image = rainDrop;
    this.x =
      canvas.width - 100 - [10, 40, 50, 80, 100][Math.floor(Math.random() * 7)];
    this.y = 0;

    this.height *= 0.5;
    this.width *= 0.5;

    this.randBoom = boomTypes[Math.floor(Math.random() * boomTypes.length)];
    this.randBoom2 = boomTypes[Math.floor(Math.random() * boomTypes.length)];
    this.randCannon =
      cannonTypes[Math.floor(Math.random() * cannonTypes.length)];
  }
  update() {
    this.y += 1;
    //this.x -= 1;
  }
}

const madCloud1 = new Image();
madCloud1.src = "src/images/darkcloud1.png";
const madCloud2 = new Image();
madCloud2.src = "src/images/darkcloud2.png";
const madCloud3 = new Image();
madCloud3.src = "src/images/darkcloud3.png";

let madCloudTypes = [madCloud1, madCloud2, madCloud3];
let madcloudQueue = [];

class Madcloud extends Cloud {
  constructor() {
    super();
    //this.y = canvas.height * 1.5;
    //this.x = canvas.width * 0.5;
    this.height *= 1.5;

    this.y *= 0.3;

    this.image =
      madCloudTypes[Math.floor(Math.random() * madCloudTypes.length)];
  }
}

function handleMadcloud3() {
  for (let i = 0; i < madcloudQueue.length; i++) {
    let current = madcloudQueue[i];

    if (current.x >= -current.width) {
      current.draw();
      if (!gameOver) {
        current.update();
      }
    } else madcloudQueue.splice(0, 1);
    for (let i = 0; i < dropQueue0.length; i++) {
      let currentDrop = dropQueue0[i];
      if (currentDrop.y <= 500) {
        currentDrop.update();
        if (currentDrop.y >= current.y + 50) currentDrop.draw();

        currentDrop.x = current.x;
      } else {
        currentDrop.randCannon.play();
        currentDrop.randCannon.play();
      }
    }
  }
  if (
    (frame % randomFrames[Math.floor(Math.random() * randomFrames.length)]) *
      10 ===
      0 &&
    !nextPhaseReady
  ) {
    madcloudQueue.push(new Madcloud());
  }

  if (
    (frame % dropFrames[Math.floor(Math.random() * dropFrames.length)]) * 10 ===
      0 &&
    !nextPhaseReady
  ) {
    dropQueue0.push(new Raindrop());
  }
}

let boom1 = new Audio(),
  boom2 = new Audio(),
  boom3 = new Audio(),
  boom4 = new Audio(),
  boom5 = new Audio(),
  boom6 = new Audio(),
  boom7 = new Audio(),
  boom8 = new Audio(),
  cannon1 = new Audio(),
  cannon2 = new Audio(),
  cannon3 = new Audio(),
  cannon4 = new Audio();

boom1.src = "src/sounds/bang_01.ogg";
boom2.src = "src/sounds/bang_02.ogg";
boom3.src = "src/sounds/bang_03.ogg";
boom4.src = "src/sounds/bang_04.ogg";
boom5.src = "src/sounds/bang_05.ogg";
boom6.src = "src/sounds/bang_06.ogg";
boom7.src = "src/sounds/bang_07.ogg";
boom8.src = "src/sounds/bang_08.ogg";

cannon1.src = "src/sounds/cannon_01.ogg";
cannon2.src = "src/sounds/cannon_02.ogg";
cannon3.src = "src/sounds/cannon_03.ogg";
cannon4.src = "src/sounds/cannon_04.ogg";

// boom3 is megaboom
//let boomTypes = [boom1, boom2, boom3, boom4, boom5, boom6, boom7];
let boomTypes = [boom1, boom2, boom4, boom5, boom6, boom7, boom8];
let cannonTypes = [cannon1, cannon2, cannon3, cannon4, cannon2];

let dropQueue2 = [];
let dropQueue = [];
function handleMadcloud2() {
  for (let i = 0; i < madcloudQueue.length; i++) {
    let current = madcloudQueue[i];

    if (!current.delete && current.x >= -150) {
      current.draw();
      if (!gameOver) {
        current.update();
      }
    }
    for (let i = 0; i < dropQueue.length; i++) {
      let currentDrop = dropQueue[i];
      currentDrop.update();
      currentDrop.draw();

      currentDrop.x -= 10;
      currentDrop.y += 5;
    }

    for (let i = 0; i < dropQueue.length; i++) {
      let currentDrop2 = dropQueue2[i];
      currentDrop2.update();
      currentDrop2.draw();

      //currentDrop2.y = currentDrop2.x -= 10; cool shit found on accident
      currentDrop2.y = currentDrop2.x -= 10;
      currentDrop2.x -= 10;
      currentDrop2.y += 10;

      if (currentDrop2.x <= 0) {
        currentDrop2.randBoom.play();
        currentDrop2.randBoom2.play();
      }
    }
  }
  if (
    frame % randomFrames[Math.floor(Math.random() * randomFrames.length)] ===
      0 &&
    !nextPhaseReady &&
    madcloudQueue <= 0
  ) {
    madcloudQueue.push(new Madcloud());
  }

  if (
    (frame % dropFrames[Math.floor(Math.random() * dropFrames.length)]) * 10 ===
      0 &&
    !nextPhaseReady
  ) {
    dropQueue.push(new Raindrop());
    dropQueue2.push(new Raindrop());
  }
}

function loop() {
  cxt.clearRect(0, 0, canvas.width, canvas.height); // clears screen
  handleLayer();
  //handleCloud();
  //handleMadcloud();
  handleMadcloud3();
  handleMadcloud2();

  frame++;
  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
