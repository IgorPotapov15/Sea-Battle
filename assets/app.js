const field = document.querySelector('.field');
const buttonFour = document.querySelector('#b4');
const buttonThree = document.querySelector('#b3');
const buttonTwo = document.querySelector('#b2');
const buttonOne = document.querySelector('#b1');
const turnX = document.querySelector('#turn-x');
const turnY = document.querySelector('#turn-y');
const randomBut = document.querySelector('#random');

const axis = {
  main: 'y',
  second: 'x'
}

const playerShips = {
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

let totalShipsRest = 10;

let closedChunks = [];

let currentShip = playerShips.fourShip;

field.addEventListener('click', placingShip);
randomBut.addEventListener('click', placingRandom);

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

function nextShips(current) {
  if (current.size === 4) {
    currentShip = playerShips.threeShip;
  }
  if (current.size === 3) {
    currentShip = playerShips.twoShip;
  }
  if (current.size === 2) {
    currentShip = playerShips.oneShip;
  }
  if (current.size === 1) {
    return false;
  }
  return true;
}

function placingRandom() {
  // do {
    for (let i = 1; i < 1000; i++) {
    let randomAxis = Math.random();
    if (randomAxis <= 0.5) {
      axis.main = 'y';
      axis.second = 'x';
    } else {
      axis.main = 'x';
      axis.second = 'y';
    }
    if (currentShip.rest === 0) {
      nextShips(currentShip)
      if (nextShips(currentShip) === false) {
        return;
      } else {
        placingRandom()
      console.log('Закончились корабли')
      }
    }
    let randomCol = +(Math.random().toString().substr(2, 1)) + 1;
    let randomRow = +(Math.random().toString().substr(2, 1)) + 1;
    if (!document.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.contains('white')) {
      placingRandom();
      console.log('Попало по красному')
    }
    if (spaceChecking(currentShip.size, randomRow, randomCol)) {
      if (totalShipsRest > 0) {
        placingRandom();
      }
      console.log('Не прошло проверку')
      return;
    }

    document.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.add('red');
    document.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.remove('white');

    for (let i = 1; i < currentShip.size; i++) {
      if (axis.main === 'y') {
        randomRow = randomRow - 1;
      } else {
        randomCol = randomCol - 1;
      }
      document.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.add('red');
      document.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.remove('white');
      
    }
    currentShip.rest = currentShip.rest - 1;
    totalShipsRest = playerShips.fourShip.rest + playerShips.threeShip.rest + playerShips.twoShip.rest + playerShips.oneShip.rest;
    closing();
    console.log(totalShipsRest)
    }
    if (totalShipsRest > 0) {
      placingRandom();
    }
  // } while (totalShipsRest === 0);
}

function placingShip(e) {
  if (currentShip.rest === 0) return;
  if (!e.target.hasAttribute('data-col')) return;
  if (!e.target.classList.contains('white')) return;
  
  let currentCol = e.target.dataset.col;
  let currentRow = e.target.dataset.row;

  if (spaceChecking(currentShip.size, currentRow, currentCol)) return;

  e.target.classList.add('red');
  e.target.classList.remove('white');

  for (let i = 1; i < currentShip.size; i++) {
    if (axis.main === 'y') {
      currentRow = currentRow - 1;
    } else {
      currentCol = currentCol - 1;
    }
    document.querySelector(`div[data-row="${currentRow}"][data-col="${currentCol}"]`).classList.add('red');
    document.querySelector(`div[data-row="${currentRow}"][data-col="${currentCol}"]`).classList.remove('white');

  }
  currentShip.rest = currentShip.rest - 1;
  totalShipsRest = playerShips.fourShip.rest + playerShips.threeShip.rest + playerShips.twoShip.rest + playerShips.oneShip.rest;
  closing();
  console.log(totalShipsRest)
}

function spaceChecking(shipSize, row, col) {
  let axisVar = axis.main === 'y' ? (document.querySelector(`div[data-row="${+row - (shipSize - 1)}"][data-col="${col}"]`) === null) :
  (document.querySelector(`div[data-row="${row}"][data-col="${+col - (shipSize - 1)}"]`) === null);

  if (axisVar)
  return true;

  let tempRow = row;
  let tempCol = col;
  for (let i = 1; i <= shipSize; i++) {
    if (axis.main === 'y') {
      if (document.querySelector(`div[data-row="${tempRow}"][data-col="${col}"]`) !== null && document.querySelector(`div[data-row="${tempRow}"][data-col="${col}"]`).classList.contains('closed')) {
        return true;
      }
      tempRow = tempRow - 1;
    }
    if (axis.main === 'x') {
      if (document.querySelector(`div[data-row="${row}"][data-col="${tempCol}"]`) !== null && document.querySelector(`div[data-row="${row}"][data-col="${tempCol}"]`).classList.contains('closed')) {
        return true;
      }
      tempCol = tempCol - 1;
    }
  }
}

function closing() {
  let white = document.querySelectorAll('.white');
  white.forEach(i => {
    if (
      (document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) - 1}"]`) !== null && 
      document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) - 1}"]`).classList.contains('red')) ||
      (document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) + 1}"]`) !== null &&
       document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) + 1}"]`).classList.contains('red')) ||
      (document.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col)}"]`) !== null &&
       document.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col)}"]`).classList.contains('red')) ||
      (document.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col)}"]`) !== null &&
       document.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col)}"]`).classList.contains('red'))
    ) {
      i.classList.add('closed')
    } 
  })

}