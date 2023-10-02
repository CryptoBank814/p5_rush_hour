let challengeFile;
let solutionFile;
let problem_num = 0;
let grassImage;
let board = [];
let vehicleInfo = {};
const TYPES = 'ABCDEFGHIJKXOPQR';
const SIZES = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3];
const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // L R U D
let step = -2;
let moves = [];

// fixed size
const spriteSize = 50;

function preload() {

  challengeFile = loadStrings('http://95.217.51.146:5000/rh-1.txt');
  solutionFile = loadStrings('http://95.217.51.146:5000/rh_sol-1.txt');

  grassImage = loadImage('http://95.217.51.146:5000/grass.png'); // grass

  // load vehicle info
  for (let i = 0; i < TYPES.length; i++) {
    vehicleInfo[TYPES[i]] = {
      used: 0,
      vehicle: TYPES[i],
      image: loadImage('http://95.217.51.146:5000/' + TYPES[i] + '.png'),
      sprite: null,
      direction: [0, 0],
      row: 0,
      col: 0,
      flip: 0,
      size: SIZES[i]
    };
  }
}

function setup() {
  createCanvas(400, 300);

  // reset image size
  grassImage.resize(spriteSize, spriteSize);
  for (var i = 0; i < TYPES.length; i++) {
    vehicleInfo[TYPES[i]].image.resize(spriteSize * vehicleInfo[TYPES[i]].size, spriteSize);
  }

  problem_num = Math.floor(Math.random() * 40);
  showProblem(problem_num);

  // load image
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      let spr = createSprite(col * spriteSize + spriteSize / 2, row * spriteSize + spriteSize / 2, spriteSize, spriteSize);
      spr.immovable = true;
      spr.addImage(grassImage);
    }
  }

  for (let i = 0; i < TYPES.length; i++) {
    if (vehicleInfo[TYPES[i]].used == 1) {

      var maxSize = spriteSize * vehicleInfo[TYPES[i]].size;

      if (vehicleInfo[TYPES[i]].direction[0] == 0) {
        let spr = createSprite(
          vehicleInfo[TYPES[i]].col * spriteSize + maxSize / 2,
          vehicleInfo[TYPES[i]].row * spriteSize + spriteSize / 2,
          maxSize, spriteSize
        );
        spr.rotation = (vehicleInfo[TYPES[i]].flip == 1) ? 180 : 0;
        spr.addImage(vehicleInfo[TYPES[i]].image);
        vehicleInfo[TYPES[i]].sprite = spr;
      } else {
        let spr = createSprite(
          vehicleInfo[TYPES[i]].col * spriteSize + spriteSize / 2,
          vehicleInfo[TYPES[i]].row * spriteSize + maxSize / 2,
          maxSize, spriteSize
        );
        spr.rotation = (vehicleInfo[TYPES[i]].flip == 1) ? 270 : 90;
        spr.addImage(vehicleInfo[TYPES[i]].image);
        vehicleInfo[TYPES[i]].sprite = spr;
      }
    }
  }
}

function showProblem(problem_num) {
  console.log(challengeFile[problem_num]);

  document.getElementById('problem').innerHTML = 'Problem No: ' + (problem_num + 1);
  document.getElementById('solution-title').innerHTML = 'Solution:';
  document.getElementById('solution').innerHTML = solutionFile[problem_num];

  // load board
  for (let i = 0; i < 6; i++) {
    board[i] = [];
  }
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      board[i][j] = challengeFile[problem_num][i * 6 + j];
    }
  }
  console.log('XXX', board);

  // set vehicle info
  var flag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let ch = 0; ch < 16; ch++) {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (flag[ch] == 0 && board[row][col] == TYPES[ch]) {

          flag[ch] = 1;
          vehicleInfo[TYPES[ch]].used = 1;

          for (let i = 1; i < 4; i += 2) {
            if (row + directions[i][0] >= 6 || col + directions[i][1] >= 6) {
              continue;
            }

            if (board[row + directions[i][0]][col + directions[i][1]] == board[row][col]) {
              carType = board[row][col];
              vehicleInfo[carType].row = row;
              vehicleInfo[carType].col = col;
              vehicleInfo[carType].direction = directions[i];
              vehicleInfo[carType].flip = Math.floor(Math.random() * 9) % 2;
            }
          }
        }
      }
    }
  }

  // log vehicle info
  console.log(vehicleInfo);
}

function showSolution(problem_num) {
  moves = solutionFile[problem_num].split(' ');

  if (step < 0) {
    step ++;
    return
  }

  if (moves[step] == '.') {
    return
  }

  if (vehicleInfo[moves[step][0]].sprite != null) {
    if (moves[step][1] == 'L') {
      vehicleInfo[moves[step][0]].sprite.position.x -= spriteSize * parseInt(moves[step][2]);
    }
    else if (moves[step][1] == 'R') {
      vehicleInfo[moves[step][0]].sprite.position.x += spriteSize * parseInt(moves[step][2]);
    }
    else if (moves[step][1] == 'U') {
      vehicleInfo[moves[step][0]].sprite.position.y -= spriteSize * parseInt(moves[step][2]);
    }
    else if (moves[step][1] == 'D') {
      vehicleInfo[moves[step][0]].sprite.position.y += spriteSize * parseInt(moves[step][2]);
    }
  }

  solutionFile[problem_num]
  console.log(moves[step])
  step++;
}

function draw() {
  background(220);

  frameRate(1)

  showSolution(problem_num);

  drawSprites();
}
