const field = document.querySelector('.field');
const buttonFour = document.querySelector('#b4');
const buttonThree = document.querySelector('#b3');
const buttonTwo = document.querySelector('#b2');
const buttonOne = document.querySelector('#b1');

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
  // if (closingChunks(currentShip.size, currentRow, currentCol)) return;
  // closingChunks(currentShip.size, currentRow, currentCol)
  // for (let i = 1; i < closedChunks.length; i++) {
  //   console.log(closedChunks[i].dataset.row)
  // }

  e.target.classList.add('red');
  e.target.classList.remove('white');

  for (let i = 1; i < currentShip.size; i++) { 
    currentRow = currentRow - 1;
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
  if (document.querySelector(`div[data-row="${+row - (shipSize - 1)}"][data-col="${col}"]`) === null) 
  return true;

  // if (document.querySelector(`div[data-row="${+row - (shipSize - 1)}"][data-col="${col}"]`) !== null && document.querySelector(`div[data-row="${+row - (shipSize - 1)}"][data-col="${col}"]`).classList.contains('closed'))
  // return true;
  let tempRow = row;
  for (let i = 1; i <= shipSize; i++) {
    if(document.querySelector(`div[data-row="${tempRow}"][data-col="${col}"]`) !== null && document.querySelector(`div[data-row="${tempRow}"][data-col="${col}"]`).classList.contains('closed')) {
      return true;
    }
    tempRow = tempRow - 1;
  }
}

// function closingChunks(shipSize, row, col) {
//   for (let i = 1; i < shipSize; i++) {
//     if (
//       document.querySelector(`div[data-row="${row}"][data-col="${+col - 1}"]`).classList.contains('red') ||
//       document.querySelector(`div[data-row="${row}"][data-col="${+col + 1}"]`).classList.contains('red') ||
//       document.querySelector(`div[data-row="${+row + 1}"][data-col="${col}"]`).classList.contains('red') ||
//       document.querySelector(`div[data-row="${+row - 1}"][data-col="${col}"]`).classList.contains('red')
//       ) {
//         console.log('1')
//       }
      
//   }
// }

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

closing()