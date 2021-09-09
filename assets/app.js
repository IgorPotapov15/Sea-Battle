const field = document.querySelector('.field');
const buttonFour = document.querySelector('#b4');
const buttonThree = document.querySelector('#b3');
const buttonTwo = document.querySelector('#b2');
const buttonOne = document.querySelector('#b1');


let fourShip = {
  rest: 1,
  size: 4
};

let threeShips = {
  rest: 2,
  size: 3
};

let twoShips = {
  rest: 3,
  size: 2
};
let oneShips = {
  rest: 4,
  size: 1
};

let currentShip = fourShip;

field.addEventListener('click', (e) => {
  if (!e.target.hasAttribute('data-col')) return;
  if (currentShip.rest === 0) return;
  
  let currentCol = e.target.dataset.col;
  let currentRow = e.target.dataset.row;

  if (document.querySelector(`div[data-row="${+currentRow - (currentShip.size - 1)}"][data-col="${currentCol}"]`) === null)
  return;

  e.target.classList.add('red')
  for (let i = 1; i < currentShip.size; i++) { 
    currentRow = currentRow - 1;
    document.querySelector(`div[data-row="${currentRow}"][data-col="${currentCol}"]`).classList.add('red');
  }
  currentShip.rest = currentShip.rest - 1;
})

buttonFour.addEventListener('click', () => {
  currentShip = fourShip;
})

buttonThree.addEventListener('click', () => {
  currentShip = threeShips;
})

buttonTwo.addEventListener('click', () => {
  currentShip = twoShips;
})

buttonOne.addEventListener('click', () => {
  currentShip = oneShips;
})