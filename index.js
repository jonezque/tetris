// Import stylesheets
import './style.css';

// Write Javascript code!
const canvas = document.getElementById('app');
const ctx = canvas.getContext('2d');
canvas.height = 800;
canvas.width = 400;

const width = 10;
const height = 20;
let lastFigure = null;
let lastFigureType = null;
const staticFigure = [];
const cellWidth = 40;
let prevSecond = 0;
let offset = 0;
let moving = false;
const figures = [ 'line', ];

requestAnimationFrame(draw);

window.addEventListener('keypress', (evt) => {
  if(lastFigure) {
    if (evt.code === "KeyA" && canMoveLeft()) {
      lastFigure.forEach(c => --c.x);
    }
    if (evt.code === "KeyD" && canMoveRight()) {
      lastFigure.forEach(c => ++c.x);
    }
    if (evt.code === "KeyS" && !checkHit()) {
      lastFigure.forEach(c => ++c.y);
    }
    if (evt.code === "KeyE" && !canRoateRight()) {
      rotateRight();
    }
    if (evt.code === "KeyQ" && !canRoateLeft()) {
      rotateLeft();
    }
  }
})

function rotateLeft() {
  if (lastFigureType == 'cube'){
    return;
  }
  const startY = Math.min(...lastFigure.map(f => f.y));
  const startX = Math.min(...lastFigure.map(f => f.x));
  const arr = [];
  if (lastFigureType == 'line'){
    for(let c of lastFigure.filter(f => f.v)) {
      c.v = false;
      if (c.x  == startX  && c.y == startY + 1) {
        arr.push(
              lastFigure.find(f => f.x == startX + 1 && f.y == startY),
              lastFigure.find(f => f.x == startX + 1 && f.y == startY + 1),
              lastFigure.find(f => f.x == startX + 1 && f.y == startY + 2),
              lastFigure.find(f => f.x == startX + 1 && f.y == startY + 3));
      } else if (c.x  == startX + 1  && c.y == startY) {
        arr.push(
              lastFigure.find(f => f.x == startX  && f.y == startY + 1),
              lastFigure.find(f => f.x == startX + 1 && f.y == startY+ 1 ),
              lastFigure.find(f => f.x == startX + 2 && f.y == startY + 1),
              lastFigure.find(f => f.x == startX + 3 && f.y == startY+ 1 ));
      }
    }    
  } else {
    for(let c of lastFigure.filter(f => f.v)) {
      c.v = false;
      const cx = c.x - startX;
      const cy = c.y - startY;
      if (cx == 0 && cy == 0) {
        cx = 2;
      } else if (cx == 1 && cy == 0) {
        cx = 2;
        cy = 1;
      } else if (cx == 2 && cy == 0) {
        cy = 2;
      } else if (cx == 0 && cy == 1) {
        cx = 1;
        cy = 0;
      } else if (cx == 2 && cy == 1) {
        cx = 1;
        cy = 2;
      } else if (cx == 0 && cy == 2) {
        cy = 0;
      } else if (cx == 1 && cy == 2) {
        cx = 0;
        cy = 1;
      } else if (cx == 2 && cy == 2) {
        cx = 0;
      } 
      arr.push(lastFigure.find(f => f.x == cx + startX && f.y == cy + startY));
    }
  }
  arr.forEach(f => f.v = true)
}

function canRoateLeft() {
  if (lastFigureType == 'cube'){
    return;
  }
}

function rotateRight() {

}

function canRoateRight() {

}

function canMoveLeft() {
  for(let c of lastFigure.filter(f => f.v)) {
    if (c.x === 0) {
      return false;
    }

    for (let s of staticFigure) {
      if (s.x === c.x - 1 && s.y == c.y + offset) {
        return false;
      }
    }
  }
  return true;
}

function canMoveRight() {
  for(let c of lastFigure.filter(f => f.v)) {
    if (c.x === width - 1) {
      return false;
    }
    for (let s of staticFigure) {
      if (s.x === c.x + 1 && s.y == c.y + offset) {
        return false;
      }
    }
  }
  return true;
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawLines();
  requestAnimationFrame(draw);
  if (!lastFigure) {
    generateFigure();
  } else {    
    processFigure();
  }
  drawStatic();
}

function drawLines() {
  ctx.strokeStyle="#AAAAAA";
  for(let i = 0; i <= width; i++) {
    ctx.moveTo(canvas.width / width * i, 0);
    ctx.lineTo(canvas.width / width * i, canvas.height);
  }
  for(let i = 0; i <= height; i++) {
    ctx.moveTo(0, canvas.height / height * i);
    ctx.lineTo(canvas.width,  canvas.height / height * i);
  }
  ctx.stroke();
}

function generateFigure() {
  const figure = figures[Math.floor(Math.random() * figures.length)];
  switch(figure) {
    case 'cube': {
      lastFigure = [
        { x: 4, y: 0, v: true},
        { x: 5, y: 0, v: true},
        { x: 4, y: 1, v: true},
        { x: 5, y: 1, v: true}
      ];
      lastFigureType = 'cube';
      return;
    };
    case 'line': {
      lastFigure = [
          { x: 3, y: 0},
          { x: 4, y: 0},
          { x: 5, y: 0,},
          { x: 6, y: 0},
          { x: 3, y: 1, v: true},
          { x: 4, y: 1, v: true},
          { x: 5, y: 1, v: true},
          { x: 6, y: 1, v: true},
          { x: 3, y: 2},
          { x: 4, y: 2},
          { x: 5, y: 2},
          { x: 6, y: 2},
          { x: 3, y: 3},
          { x: 4, y: 3},
          { x: 5, y: 3},
          { x: 6, y: 3},
        ]
      lastFigureType = 'line';
      return;
    };
    case 'gl': {
      lastFigure = [
          { x: 4, y: 0, v: true},
          { x: 5, y: 0},
          { x: 6, y: 0},
          { x: 4, y: 1, v: true},
          { x: 5, y: 1, v: true},
          { x: 6, y: 1, v: true},
          { x: 4, y: 2},
          { x: 5, y: 2},
          { x: 6, y: 2},
        ]
      lastFigureType = 'gl';
      return;
    };
    case 'gr': {
      lastFigure = [
          { x: 4, y: 0},
          { x: 5, y: 0},
          { x: 6, y: 0, v: true},
          { x: 4, y: 1, v: true},
          { x: 5, y: 1, v: true},
          { x: 6, y: 1, v: true},
          { x: 4, y: 2},
          { x: 5, y: 2},
          { x: 6, y: 2},
        ]
      lastFigureType = 'gr';
      return;
    };
    case 'gm': {
      lastFigure = [
          { x: 4, y: 0},
          { x: 5, y: 0, v: true},
          { x: 6, y: 0},
          { x: 4, y: 1, v: true},
          { x: 5, y: 1, v: true},
          { x: 6, y: 1, v: true},
          { x: 4, y: 2},
          { x: 5, y: 2},
          { x: 6, y: 2},
        ]
      lastFigureType = 'gm';
      return;
    };
  }
}

function processFigure(){
  var d = new Date();
  if (!moving) {
    for(let coords of lastFigure.filter(f => f.v)) {    
      ctx.fillRect(coords.x * cellWidth, coords.y * cellWidth, cellWidth,cellWidth);
    }
    prevSecond = d.getSeconds();
    moving = true;
  } else {
    for(let coords of lastFigure.filter(f => f.v)) {
      if (prevSecond !== d.getSeconds()) {
        offset++;
        prevSecond = d.getSeconds();
      }
      if (!checkHit()) { 
        ctx.fillRect(coords.x * cellWidth, (coords.y + offset)* cellWidth, cellWidth,cellWidth);
      } else {
        addToStatic();
      }
    }
  }
}

function checkHit() {
  if (lastFigure) {
    for(let c of lastFigure.filter(f => f.v)) {
      if (c.y + offset >= height) {
        return true;
      }

      for (let s of staticFigure) {
        if (s.x === c.x && s.y === c.y + offset) {
          return true;
        }
      }
    }
  }
  return false;
}

function drawStatic() {
  for(let coords of staticFigure) {    
      ctx.fillRect(coords.x * cellWidth, coords.y * cellWidth, cellWidth, cellWidth);
    }
}

function addToStatic() {
  --offset;
  lastFigure.forEach(c => c.y += offset);
  staticFigure = [...staticFigure, ...lastFigure.filter(f => f.v)];
  checkCompleteRow();
  lastFigure = null;
  offset = 0;
  moving = false; 
}

function checkCompleteRow() {
  for(let y = height - 1; y != 0;) {
    const filtered = staticFigure.filter(f => f.y === y);
    if (filtered.length == 0) {
      return;
    }
    if (filtered.length == width) {
      console.log(filtered);
      staticFigure = staticFigure.filter(f => f.y !== y);
      staticFigure.filter(f => f.y < y).forEach(f => f.y++);
    } else {
       y--;
    }
  }
}