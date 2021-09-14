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
const playerBut = document.querySelector('#player');
const start = document.querySelector('#start');
const msg = document.querySelector('#msg');

const axis = {
  main: 'y',
  second: 'x'
}

const playerShips = {
  coords: [],
  fourShip: {
    name: 'fourShip',
    rest: 1,
    size: 4
  },
  threeShip: {
    name: 'threeShip',
    rest: 2,
    size: 3
  },
  twoShip: {
    name: 'twoShip',
    rest: 3,
    size: 2
  },
  oneShip: {
    name: 'oneShip',
    rest: 4,
    size: 1
  },
}

const computerShips = {
  coords: [],
  fourShip: {
    name: 'fourShip',
    rest: 1,
    size: 4
  },
  threeShip: {
    name: 'threeShip',
    rest: 2,
    size: 3
  },
  twoShip: {
    name: 'twoShip',
    rest: 3,
    size: 2
  },
  oneShip: {
    name: 'oneShip',
    rest: 4,
    size: 1
  }
}

let allChunks = [];
let allCompChunks = [];
let closedChunks = [];
let closedCompChunks = [];
let unshootableChunks = [];

let isPlayerTurn;

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
  let mainArr;
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
    currShip = shipsObj.fourShip;
  }
  
  if (currShip.rest === 0) {
    return;
  }
  let randomCol = +(Math.random().toString().substr(2, 1));
  let randomRow = +(Math.random().toString().substr(2, 1));
  randomAxisFunc();

  if (!targetFld.querySelector(`div[data-row="${randomRow}"][data-col="${randomCol}"]`).classList.contains('white')) {
    randomHandler(turn);
    return;
  }

  if (spaceChecking(currShip.size, randomRow, randomCol, targetFld, turn)) {
    if (total > 0) {
      randomHandler(turn);
      return;
    }
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
}

function manualHandler(e) {
  if (selectedPlayerShip.rest === 0) return;
  if (!e.target.hasAttribute('data-col')) return;
  if (!e.target.classList.contains('white')) return;
  let currentCol = e.target.dataset.col;
  let currentRow = e.target.dataset.row;  

  if (spaceChecking(selectedPlayerShip.size, currentRow, currentCol, field, 'player')) return;

  placingShip(field, 'player', selectedPlayerShip, currentRow, currentCol)
}

function placingShip(fld, turn, selectedPlayerShip, row, col) {
  let tempObj = [];
  let obj = turn === 'player' ? playerShips : computerShips;
  let color = turn === 'player' ? 'blue' : 'green';
  let tempArr = turn === 'player' ? allChunks : allCompChunks;
  tempArr.forEach((item) => {
    if (item.row == row && item.col == col) {
      item.free = false;
    }
  })
  if (turn === 'player') {
    fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.add(color);
  }
  fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.remove('white');
  for (let i = 1; i < selectedPlayerShip.size; i++) {
    tempObj.push({row: +row, col: +col, crashed: false, shipIsDead: false})
    if (axis.main === 'y') {
      row = row - 1;
    } else {
      col = col - 1;
    }
    tempArr.forEach((item) => {
      if (item.row == row && item.col == col) {
        item.free = false;
      }
    })
    if (turn === 'player') {
      fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.add(color);
    }
    fld.querySelector(`div[data-row="${row}"][data-col="${col}"]`).classList.remove('white');
  }
  tempObj.push({row: +row, col: +col, crashed: false, shipIsDead: false})
  obj.coords.push(tempObj)
  selectedPlayerShip.rest = selectedPlayerShip.rest - 1;
  totalShipsRest = obj.fourShip.rest + obj.threeShip.rest + obj.twoShip.rest + obj.oneShip.rest;
  if (turn === 'player') {
    closingForPlace(allChunks, 'close')
  }
  if (turn === 'computer') {
    closingForPlace(allCompChunks, 'close')
  }
}

function spaceChecking(shipSize, currRow, currCol, fld, turn) {
  let axisVar = axis.main === 'y' ? (fld.querySelector(`div[data-row="${+currRow - (shipSize - 1)}"][data-col="${currCol}"]`) === null) :
  (fld.querySelector(`div[data-row="${currRow}"][data-col="${+currCol - (shipSize - 1)}"]`) === null);

  if (axisVar)
  return true;

  let tempRow = currRow;
  let tempCol = currCol;
  for (let i = 1; i <= shipSize; i++) {
    if (axis.main === 'y') {
      if (isClosed(tempRow, tempCol, turn)) {
        return true;
      }
      tempRow = tempRow - 1;
    }
    if (axis.main === 'x') {
      if (isClosed(tempRow, tempCol, turn)) {
        return true;
      }
      tempCol = tempCol - 1;
    }
  }
}

function isClosed(tempRow, tempCol, turn) {
  let targetArray = turn === 'player' ? closedChunks : closedCompChunks;
  let result;
  targetArray.forEach((item) => {
    if (item.row === +tempRow && item.col === +tempCol) {
      result = true
    }
  });
  return result;
}

let whiteComp = fieldComp.querySelectorAll('.white');
let nodeListComp = [...whiteComp];
nodeListComp.forEach((item) => {
  allCompChunks.push({row: +item.attributes[1].nodeValue, col: +item.attributes[2].nodeValue, free: true, closed: false, crashed: false, shipIsDead: false, unshootable: false, missed: false})
})

let white = field.querySelectorAll('.white');
let nodeList = [...white]
nodeList.forEach((item) => {
  allChunks.push({row: +item.attributes[1].nodeValue, col: +item.attributes[2].nodeValue, free: true, closed: false, crashed: false, shipIsDead: false, unshootable: false, missed: false})
})

function closingForPlace(allArr, kindOfClosing) {
  let fld = allArr === allChunks ? field : fieldComp
  let shipChunks = allArr.filter((item) => item.free === false);
  let deadChunks = allArr.filter((item) => item.shipIsDead === true);

  if (kindOfClosing === 'close') {
    shipChunks.forEach((chunk) => {
      let row = chunk.row;
      let col = chunk.col;
      let minusRow = chunk.row - 1;
      let minusCol = chunk.col - 1;
      let plusRow = chunk.row + 1;
      let plusCol = chunk.col + 1;
      allArr.forEach((item) => {
        if (
          +item.row === row && +item.col === minusCol && item.free === true ||
          +item.row === row && +item.col === plusCol && item.free === true ||
          +item.row === minusRow && +item.col === minusCol && item.free === true ||
          +item.row === minusRow && +item.col === plusCol && item.free === true ||
          +item.row === plusRow && +item.col === minusCol && item.free === true ||
          +item.row === plusRow && +item.col === plusCol && item.free === true ||
          +item.row === plusRow && +item.col === col && item.free === true ||
          +item.row === minusRow && +item.col === col && item.free === true
        ) {
          item.closed = true
        }
      })
    })
    if (allArr === allCompChunks) {
      closedCompChunks = allArr.filter((item) => (item.closed === true && item.free === true))
    }
    if (allArr === allChunks) {
      closedChunks = allArr.filter((item) => (item.closed === true && item.free === true))
      closedChunks.forEach((item) => {
      let closedRow = item.row;
      let closedCol = item.col; 
      if (allArr === allChunks) {
        field.querySelector(`div[data-row="${+(closedRow)}"][data-col="${+(closedCol)}"]`).classList.add('closed')
      }
    })
    }
  }
  if (kindOfClosing === 'dead') {
    deadChunks.forEach((chunk) => {
      let row = chunk.row;
      let col = chunk.col;
      let minusRow = chunk.row - 1;
      let minusCol = chunk.col - 1;
      let plusRow = chunk.row + 1;
      let plusCol = chunk.col + 1;
      allArr.forEach((item) => {
        if (
          +item.row === row && +item.col === minusCol && item.free === true ||
          +item.row === row && +item.col === plusCol && item.free === true ||
          +item.row === minusRow && +item.col === minusCol && item.free === true ||
          +item.row === minusRow && +item.col === plusCol && item.free === true ||
          +item.row === plusRow && +item.col === minusCol && item.free === true ||
          +item.row === plusRow && +item.col === plusCol && item.free === true ||
          +item.row === plusRow && +item.col === col && item.free === true ||
          +item.row === minusRow && +item.col === col && item.free === true
        ) {
          item.unshootable = true
        }
      })
    })
    unshootableChunks = allArr.filter((item) => (item.unshootable === true && item.free === true))
    unshootableChunks.forEach((item) => {
      let unshootRow = item.row;
      let unShootCol = item.col;
      fld.querySelector(`div[data-row="${+(unshootRow)}"][data-col="${+(unShootCol)}"]`).classList.remove('miss')
      fld.querySelector(`div[data-row="${+(unshootRow)}"][data-col="${+(unShootCol)}"]`).classList.add('unshootable')
    })
  }
}

function displayMessage(message) {
  msg.innerHTML = message;
  setTimeout(() => {
    msg.innerHTML = '';
  }, 2000)
}

function startGame() {
  let totalShipsRest = playerShips.fourShip.rest + playerShips.threeShip.rest + playerShips.twoShip.rest + playerShips.oneShip.rest;
  if (totalShipsRest > 0) {
    displayMessage('Ошибка: Не все корабли были расставлены.')
    return;
  }
  randomHandler('computer');
  let randomFirst = Math.random();
  if (randomFirst <= 0.5) {
    isPlayerTurn = true;
  } else {
    isPlayerTurn = false
  }
  if (isPlayerTurn) {
    displayMessage('Первый ход - ваш')
    startFunc();
  } else {
    displayMessage('Первый ходит противник')
    startFunc();
    computerTurn();
  }
}

let isGameStarted = false;
let isGameEnded = false;

fieldComp.addEventListener('click', playerTurn)
start.addEventListener('click', startGame)

function startFunc() {
  if (isGameStarted === true || isGameEnded === true) return;
  isGameStarted = true;
}

async function playerTurn(e) {
    if (isGameStarted === false || isGameEnded === true) return;
    if (isPlayerTurn === false) return;
    if (!e.target.hasAttribute('data-col') || e.target.classList.contains('unshootable') || e.target.classList.contains('dead') || 
    e.target.classList.contains('miss') || e.target.classList.contains('red')
    ) {
      return;
    }

    let targetCol = +e.target.dataset.col;
    let targetRow = +e.target.dataset.row;
    allCompChunks.forEach((item) => {
      if (item.row === targetRow && item.col === targetCol) {
        if (item.free === false && item.crashed === false) {
          item.crashed = true;
          computerShips.coords.forEach((subArray) => {
            subArray.forEach((coord) => {
              if (coord.row === targetRow && coord.col === targetCol) {
                coord.crashed = true;
              }
            })
          });
          fieldComp.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.add('red')
          fieldComp.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.remove('green')
          endGame(allCompChunks)
          return;
        }
        if (item.free === true) {
          fieldComp.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.add('miss')
          item.missed = true;
          isPlayerTurn = false;
          computerTurn()
          return;
        }
      }
    })
    await checkIsAlive(computerShips, fieldComp, allCompChunks)
  }

let lastCrashedTargetCol;
let lastCrashedTargetRow;
let currentDirection;

function chooseDirection() {
let nextChunk = Math.floor(Math.random() * 4)
  if (nextChunk === 0) {
    currentDirection = 'above'
  }
  if (nextChunk === 1) {
    currentDirection = 'below'
  }
  if (nextChunk === 2) {
    currentDirection = 'left'
  }
  if(nextChunk === 3) {
    currentDirection = 'right'
  }
  goNext()
  return;
}

function goNext() {
  if (currentDirection === undefined) {
    chooseDirection();
    return;
  }
  if (currentDirection === 'above') {
    lastCrashedTargetRow = lastCrashedTargetRow - 1;
  }
  if (currentDirection === 'below') {
    lastCrashedTargetRow = lastCrashedTargetRow + 1;
  }
  if (currentDirection === 'left') {
    lastCrashedTargetCol = lastCrashedTargetCol - 1;
  }
  if (currentDirection === 'right') {
    lastCrashedTargetCol = lastCrashedTargetCol + 1;
  }
  return;
}

function goBack() {
  if (currentDirection === 'above') {
    chooseDirection()
    lastCrashedTargetRow = lastCrashedTargetRow + 1;
  }
  if (currentDirection === 'below') {
    chooseDirection()
    lastCrashedTargetRow = lastCrashedTargetRow - 1;
  }
  if (currentDirection === 'left') {
    chooseDirection()
    lastCrashedTargetCol = lastCrashedTargetCol + 1;
  }
  if (currentDirection === 'right') {
    chooseDirection()
    lastCrashedTargetCol = lastCrashedTargetCol - 1;
  }
  if (isPlayerTurn === false) {
    computerTurn();
  }
  return;
}

function endGame(array) {
  restAliveShip = array.find((item) => item.free === false && item.crashed === false);
  if (restAliveShip === undefined && array == allChunks) {
    isGameEnded = true;
    msg.innerHTML = "Игра окончена. Вы проиграли"
  } else if (restAliveShip === undefined && array == allCompChunks) {
    isGameEnded = true;
    msg.innerHTML = "Игра окончена. Вы победили"
  } else {
    return;
  }
}

function computerTurn() {
  if (isGameEnded === true) return;
  if (isPlayerTurn) return;
  let targetCol = lastCrashedTargetCol === undefined ? +(Math.random().toString().substr(2, 1)) : lastCrashedTargetCol;
  let targetRow = lastCrashedTargetRow === undefined ? +(Math.random().toString().substr(2, 1)) : lastCrashedTargetRow;
  let supposedChunk = allChunks.find((item) => item.col ===  targetCol && item.row === targetRow);
  if (supposedChunk === undefined && currentDirection !== undefined) {
    goBack()
    return;
  }
  allChunks.forEach((item) => {
    if (item.row === targetRow && item.col === targetCol) {
      if (item.free) {
        if (item.missed || item.unshootable) {
          goBack();
          return;
        } else {
          field.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.remove('closed')
          field.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.add('miss')
          item.missed = true;
          isPlayerTurn = true;
          goBack();
          return;
        }
      } else if (item.free === false) {
        if (item.shipIsDead === true){
          lastCrashedTargetCol = undefined;
          lastCrashedTargetRow = undefined;
          currentDirection = undefined;
          computerTurn();
          return;
        } 
        if (item.crashed === true && item.shipIsDead === false) {
          goNext();
          computerTurn();
          return;
        } else {
          field.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.remove('blue')
          field.querySelector(`div[data-row="${+(targetRow)}"][data-col="${+(targetCol)}"]`).classList.add('red')
          item.crashed = true;
          playerShips.coords.forEach((item) => {
            let target = item.find(({col, row}) => col === targetCol && row === targetRow)
            if (target !== undefined) {
              target.crashed = true;
            }        
          })
          endGame(allChunks)
          lastCrashedTargetRow = targetRow;
          lastCrashedTargetCol = targetCol;
          checkIsAlive(playerShips, field, allChunks)
          isPlayerTurn = true;
          return;
        }
      }
    }
  })
}

async function checkIsAlive(obj, fld, chunksArray) {
  await obj.coords.forEach((item) => {
      let result = item.some((el) => el.crashed === false);
      if (fld === fieldComp) {
        console.log(item)
      }
      if (result === false) {
         item.forEach((crashedCoords) => {
            crashedCoords.shipIsDead = true;
            fld.querySelector(`div[data-row="${(crashedCoords.row)}"][data-col="${(crashedCoords.col)}"]`).classList.remove('red');
            fld.querySelector(`div[data-row="${(crashedCoords.row)}"][data-col="${(crashedCoords.col)}"]`).classList.add('dead');
            chunksArray.forEach((coord) => {
              if (crashedCoords.col === coord.col && crashedCoords.row === coord.row) {
                coord.shipIsDead = true
              }
            })
        })
      }
      result = '';
  })
  closingForPlace(chunksArray, 'dead')
}

// Переписать closing под объект корабля, а не массив allchunks