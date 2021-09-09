const field = document.querySelector('.field');
const buttonFour = document.querySelector('#b4');
const buttonThree = document.querySelector('#b3');
const buttonTwo = document.querySelector('#b2');
const buttonOne = document.querySelector('#b1');
const turnX = document.querySelector('#turn-x');
const turnY = document.querySelector('#turn-y');

const axis = {
  main: 'y',
  second: 'x'
}

turnX.addEventListener(('click'), () => {
  axis.main = 'x';
  axis.second = 'y';
  console.log(axis)
});

turnY.addEventListener(('click'), () => {
  axis.main = 'y';
  axis.second = 'x';
  console.log(axis)
});

let playerShips = {
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

field.addEventListener('click', (e) => {
  if (!e.target.hasAttribute('data-col')) return;
  if (currentShip.rest === 0) return;
  
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
  closing();
})

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
      (document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) - 1}"]`) !== null && document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) - 1}"]`).classList.contains('red')) ||
      (document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) + 1}"]`) !== null && document.querySelector(`div[data-row="${+(i.dataset.row)}"][data-col="${+(i.dataset.col) + 1}"]`).classList.contains('red')) ||
      (document.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col)}"]`) !== null && document.querySelector(`div[data-row="${+(i.dataset.row) - 1}"][data-col="${+(i.dataset.col)}"]`).classList.contains('red')) ||
      (document.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col)}"]`) !== null && document.querySelector(`div[data-row="${+(i.dataset.row) + 1}"][data-col="${+(i.dataset.col)}"]`).classList.contains('red'))
    ) {
      i.classList.add('closed')
    } 
  })

}