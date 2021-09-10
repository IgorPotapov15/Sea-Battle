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
  coords: [],
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
  coords: [],
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

let selectedPlayerShip = playerShips.fourShip;
let selectedCompShip;
let totalPlayerShips;
let totalComputerShips;

field.addEventListener('click', manualHandler);
randomBut.addEventListener('click', () => randomHandler('player'));
compBut.addEventListener('click', () => randomHandler('computer'));

buttonFour.addEventListener('click', () => {
  selectedPlayerShip = playerShips.fourShip;
})
buttonThree.addEventListener('click', () => {
  selectedPlayerShip = playerShips.threeShip;
})
buttonTwo.addEventListener('click', () => {
  selectedPlayerShip = playerShips.twoShip;
})
buttonOne.addEventListener('click', () => {
  selectedPlayerShip = playerShips.oneShip;
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
  console.log('1')
  if (player === 'player') {
    if (current.size === 4) {
      selectedPlayerShip = playerShips.threeShip;
      randomHandler(player)
    }
    if (current.size === 3) {
      selectedPlayerShip = playerShips.twoShip;
      randomHandler(player)
    }
    if (current.size === 2) {
      selectedPlayerShip = playerShips.oneShip;
      randomHandler(player)
    }
    if (current.size === 1) {
      return;
    }
  }
  if (player === 'computer') {
    if (current.size === 4) {
      selectedCompShip = computerShips.threeShip;
      randomHandler(player)
    }
    if (current.size === 3) {
      selectedCompShip = computerShips.twoShip;
      randomHandler(player)
    }
    if (current.size === 2) {
      selectedCompShip = computerShips.oneShip;
      randomHandler(player)
    }
    if (current.size === 1) {
      return;
    }
  }
  return;
}


function checkShips(player) {
  if (player === 'player') {
    selectedPlayerShip = playerShips.fourShip.rest ? playerShips.fourShip :
    playerShips.threeShip.rest ? playerShips.threeShip :
    playerShips.twoShip.rest ? playerShips.twoShip :
    playerShips.oneShip;
  }
  if (player === 'computer') {
    selectedCompShip = computerShips.fourShip.rest ? computerShips.fourShip :
    computerShips.threeShip.rest ? computerShips.threeShip :
    computerShips.twoShip.rest ? computerShips.twoShip :
    computerShips.oneShip;
  }
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

async function randomHandler(whoRandom) {
  checkShips(whoRandom)

  let turn = whoRandom;
  let shipsObj;
  let currShip;
  let targetFld;
  if (turn === 'player') {
    total = totalPlayerShips;
    shipsObj = playerShips;
    currShip = selectedPlayerShip;
    targetFld = field;
  }
  if (turn === 'computer') {
    total = totalComputerShips;
    shipsObj = computerShips;
    currShip = selectedCompShip;
    targetFld = fieldComp;
  }
  if (total === 0) return;
  if (shipsObj.fourShip.rest > 0) {
    console.log('2')
    currShip = shipsObj.fourShip;
  }
  
  if (currShip.rest === 0) {
    console.log('Закончились корабли');
    return;
  }
  let randomCol = +(Math.random().toString().substr(2, 1)) + 1;
  let randomRow = +(Math.random().toString().substr(2, 1)) + 1;
  await randomAxisFunc();
  if (!targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.contains('white')) {
    console.log('Попало по синему')
    randomHandler(turn);
    return;
  }
  if (spaceChecking(currShip.size, randomRow, randomCol, targetFld)) {
    if (total > 0) {
      randomHandler(turn);
      return;
    }
    console.log('Не прошло проверку')
    randomHandler(turn);
    return;
  }
    placingShip(targetFld, turn, currShip, randomRow, randomCol)
    randomHandler(turn);
    return;
}

function pushingCoords(targetObj, row, col) {
  let newCoord = {
    row: +row,
    col: +col
  }
  targetObj.coords.push(newCoord);
  console.log(targetObj)
}

function manualHandler(e) {
  if (selectedPlayerShip.rest === 0) return;
  if (!e.target.hasAttribute('data-col')) return;
  if (!e.target.classList.contains('white')) return;
  
  let currentCol = e.target.dataset.col;
  let currentRow = e.target.dataset.row;
  console.log(playerShips.shipsArr)

  if (spaceChecking(selectedPlayerShip.size, currentRow, currentCol, field)) return;

  placingShip(field, 'player', selectedPlayerShip, currentRow, currentCol)
}

function placingShip(fld, turn, selectedPlayerShip, row, col) {
  let obj = turn === 'player' ? playerShips : computerShips;
  let color = turn === 'player' ? 'blue' : 'green';
  fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.add(color);
  fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.remove('white');
  for (let i = 1; i < selectedPlayerShip.size; i++) {
    pushingCoords(obj, row, col);
    if (axis.main === 'y') {
      row = row - 1;
    } else {
      col = col - 1;
    }
    fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.add(color);
    fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.remove('white');
  }
  pushingCoords(obj, row, col);
  selectedPlayerShip.rest = selectedPlayerShip.rest - 1;
  totalShipsRest = obj.fourShip.rest + obj.threeShip.rest + obj.twoShip.rest + obj.oneShip.rest;
  closing(fld);
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

function newClosing() {
  
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