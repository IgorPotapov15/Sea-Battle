const field = document.querySelector('.field');
const fieldComp = document.querySelector('.field-2');
const buttonFour = document.querySelector('#b4');
const buttonThree = document.querySelector('#b3');
const buttonTwo = document.querySelector('#b2');
const buttonOne = document.querySelector('#b1');
const turnX = document.querySelector('#turn-x');
const turnY = document.querySelector('#turn-y');
const randomBut = document.querySelector('#random');
const compBut = document.querySelector('#comp');

const axis = {
  main: 'y',
  second: 'x'
}

const playerShips = {
  shipsArr : [],
  fourShip: {
    rest: 1,
    size: 4
  },
  threeShip: {
    rest: 2,
    size: 3
  },
  twoShip: {
    rest: 3,
    size: 2
  },
  oneShip: {
    rest: 4,
    size: 1
  },
}

const computerShips = {
  fourShip: {
    rest: 1,
    size: 4
  },
  threeShip: {
    rest: 2,
    size: 3
  },
  twoShip: {
    rest: 3,
    size: 2
  },
  oneShip: {
    rest: 4,
    size: 1
  }
}

let closedChunks = [];

let currentShip = playerShips.fourShip;
let currentCompShp = computerShips.fourShip;
let totalPlayerShips;
let totalComputerShips;

field.addEventListener('click', placingShip);
randomBut.addEventListener('click', () => placingRandom('player'));
compBut.addEventListener('click', () => placingRandom('computer'));

buttonFour.addEventListener('click', () => {
  currentShip = playerShips.fourShip;
})
buttonThree.addEventListener('click', () => {
  currentShip = playerShips.threeShip;
})
buttonTwo.addEventListener('click', () => {
  currentShip = playerShips.twoShip;
})
buttonOne.addEventListener('click', () => {
  currentShip = playerShips.oneShip;
})

turnX.addEventListener(('click'), () => {
  axis.main = 'x';
  axis.second = 'y';
});

turnY.addEventListener(('click'), () => {
  axis.main = 'y';
  axis.second = 'x';
});

function nextShips(current, player) {
  if (player === 'player') {
    if (current.size === 4) {
      currentShip = playerShips.threeShip;
      placingRandom(player)
    }
    if (current.size === 3) {
      currentShip = playerShips.twoShip;
      placingRandom(player)
    }
    if (current.size === 2) {
      currentShip = playerShips.oneShip;
      placingRandom(player)
    }
    if (current.size === 1) {
      return;
    }
  }
  if (player === 'computer') {
    if (current.size === 4) {
      currentCompShp = computerShips.threeShip;
      placingRandom(player)
    }
    if (current.size === 3) {
      currentCompShp = computerShips.twoShip;
      placingRandom(player)
    }
    if (current.size === 2) {
      currentCompShp = computerShips.oneShip;
      placingRandom(player)
    }
    if (current.size === 1) {
      return;
    }
  }
  return;
}

function randomAxisFunc() {
  let randomAxis = Math.random();
    if (randomAxis <= 0.5) {
      axis.main = 'y';
      axis.second = 'x';
    } else {
      axis.main = 'x';
      axis.second = 'y';
    }
    return;
}
// 123

function computerPlacing() {
   if (computerShips.fourShip.rest > 0) {
    currentCompShp = computerShips.fourShip;
   }
   if (computerShipsRest <= 0) return;
   randomAxisFunc();
   if (currentCompShp.rest === 0) {
    nextShips(currentCompShp, 'computer');
    console.log('Закончились корабли');
    computerPlacing();
    return;
   }
  let randomCol = +(Math.random().toString().substr(2, 1)) + 1;
  let randomRow = +(Math.random().toString().substr(2, 1)) + 1;
  if (!fieldComp.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.contains('white')) {
    console.log('Попало по красному')
    computerPlacing();
    return;
  }
  if (spaceChecking(currentCompShp.size, randomRow, randomCol, fieldComp)) {
    if (computerShipsRest > 0) {
      computerPlacing();
    }
    console.log('Не прошло проверку')
    computerPlacing();
    return;
  }
  fieldComp.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.add('green');
  fieldComp.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.remove('white');

  for (let i = 1; i < currentCompShp.size; i++) {
    if (axis.main === 'y') {
      randomRow = randomRow - 1;
    } else {
      randomCol = randomCol - 1;
    }
    fieldComp.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.add('green');
    fieldComp.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.remove('white');    
  }
  currentCompShp.rest = currentCompShp.rest - 1;
  computerShipsRest = computerShips.fourShip.rest + computerShips.threeShip.rest + computerShips.twoShip.rest + computerShips.oneShip.rest;
  closing(fieldComp);
  computerPlacing();
  console.log(computerShipsRest)
}

async function placingRandom(whoRandom) {
  let turn = whoRandom;
  let shipsObj;
  let currShip;
  let targetFld;
  let color;
  if (turn === 'player') {
    total = totalPlayerShips;
    shipsObj = playerShips;
    currShip = currentShip;
    targetFld = field;
    color = 'blue';
  }
  if (turn === 'computer') {
    total = totalComputerShips;
    shipsObj = computerShips;
    currShip = currentCompShp;
    targetFld = fieldComp;
    color = 'green';
  }
  if (total === 0) return;
  if (shipsObj.fourShip.rest > 0) {
    currShip = shipsObj.fourShip;
  }
  
  if (currShip.rest === 0) {
    await nextShips(currShip, turn);
    console.log('Закончились корабли');
    return;
  }
  let randomCol = +(Math.random().toString().substr(2, 1)) + 1;
  let randomRow = +(Math.random().toString().substr(2, 1)) + 1;
  await randomAxisFunc();
  if (!targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.contains('white')) {
    console.log('Попало по синему')
    placingRandom(turn);
    return;
  }
  if (spaceChecking(currShip.size, randomRow, randomCol, targetFld)) {
    if (total > 0) {
      placingRandom(turn);
      return;
    }
    console.log('Не прошло проверку')
    placingRandom(turn);
    return;
  }
  targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.add(color);
  targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.remove('white');

  for (let i = 1; i < currShip.size; i++) {
    if (axis.main === 'y') {
      randomRow = randomRow - 1;
    } else {
      randomCol = randomCol - 1;
    }
    targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.add(color);
    targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.remove('white');    
  }
    currShip.rest = --currShip.rest;
    total = shipsObj.fourShip.rest + shipsObj.threeShip.rest + shipsObj.twoShip.rest + shipsObj.oneShip.rest;    
    closing(targetFld);
    placingRandom(turn);
    return;
}

function placingShip(e) {
  if (currentShip.rest === 0) return;
  if (!e.target.hasAttribute('data-col')) return;
  if (!e.target.classList.contains('white')) return;
  
  let currentCol = e.target.dataset.col;
  let currentRow = e.target.dataset.row;
  playerShips.shipsArr.push({currentCol, currentRow})
  console.log(playerShips.shipsArr)

  if (spaceChecking(currentShip.size, currentRow, currentCol, field)) return;

  e.target.classList.add('blue');
  e.target.classList.remove('white');

  for (let i = 1; i < currentShip.size; i++) {
    if (axis.main === 'y') {
      currentRow = currentRow - 1;
    } else {
      currentCol = currentCol - 1;
    }
    document.querySelector(`div[data-row="${currentRow}"][data-col="${currentCol}"]`).classList.add('blue');
    document.querySelector(`div[data-row="${currentRow}"][data-col="${currentCol}"]`).classList.remove('white');

  }
  currentShip.rest = currentShip.rest - 1;
  totalShipsRest = playerShips.fourShip.rest + playerShips.threeShip.rest + playerShips.twoShip.rest + playerShips.oneShip.rest;
  closing(field);
  console.log(totalShipsRest)
}

function spaceChecking(shipSize, row, col, fld) {
  let axisVar = axis.main === 'y' ? (fld.querySelector(`div[data-row="${+row - (shipSize - 1)}"][data-col="${col}"]`) === null) :
  (fld.querySelector(`div[data-row="${row}"][data-col="${+col - (shipSize - 1)}"]`) === null);

  if (axisVar)
  return true;

  let tempRow = row;
  let tempCol = col;
  for (let i = 1; i <= shipSize; i++) {
    if (axis.main === 'y') {
      if (fld.querySelector(`div[data-row="${tempRow}"][data-col="${col}"]`) !== null && fld.querySelector(`div[data-row="${tempRow}"][data-col="${col}"]`).classList.contains('closed')) {
        return true;
      }
      tempRow = tempRow - 1;
    }
    if (axis.main === 'x') {
      if (fld.querySelector(`div[data-row="${row}"][data-col="${tempCol}"]`) !== null && fld.querySelector(`div[data-row="${row}"][data-col="${tempCol}"]`).classList.contains('closed')) {
        return true;
      }
      tempCol = tempCol - 1;
    }
  }
}

function closing(fld) {
  let color = (fld === field) ? 'blue' : 'green';
  let white = fld.querySelectorAll('.white');
  white.forEach(i => {
    if (
      (fld.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) - 1}"]`) !== null && 
      fld.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) - 1}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) + 1}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) + 1}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col)}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col)}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col)}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col)}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col) + 1}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col) + 1}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col) - 1}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col) - 1}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row - 1)}"][data-col="${+(i.dataset.col) + 1}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row - 1)}"][data-col="${+(i.dataset.col) + 1}"]`).classList.contains(color)) ||
      (fld.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col - 1)}"]`) !== null &&
      fld.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col - 1)}"]`).classList.contains(color))
    ) {
      i.classList.add('closed')
    }
  })

}