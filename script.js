const clickSound = new Audio('click.wav');
const matchSound = new Audio('match.mp3');
const winSound = new Audio('winning.wav');


let time = 0;
let timerInterval = null;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

const gameBoard = document.getElementById('gameBoard');

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  gameBoard.innerHTML = '';
  moves = 0;
  time = 0;
  clearInterval(timerInterval);
  document.getElementById('moves').textContent = 'Moves: 0';
  document.getElementById('timer').textContent = 'Time: 0 sec';

  const difficulty = document.getElementById('difficulty').value;
  const backColor = document.getElementById('backColor').value;
  let cardValues = [];

  if (difficulty === 'easy') {
    cardValues = ['A', 'A', 'B', 'B'];
    gameBoard.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else if (difficulty === 'medium') {
    cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
                  'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if (difficulty === 'hard') {
    cardValues = ['A','A','B','B','C','C','D','D','E','E',
                  'F','F','G','G','H','H','I','I','J','J',
                  'K','K','L','L','M','M','N','N','O','O',
                  'P','P','Q','Q','R','R','S','S'];
    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
  }

  const shuffledCards = shuffle(cardValues);

  shuffledCards.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.style.backgroundColor = backColor;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });

  timerInterval = setInterval(() => {
    time++;
    document.getElementById('timer').textContent = `Time: ${time} sec`;
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  clickSound.play(); // 🔊 flip sound

  this.classList.add('flipped');
  this.textContent = this.dataset.value;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  document.getElementById('moves').textContent = `Moves: ${moves}`;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    matchSound.play(); // 🔊 match sound
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.textContent = '';
    secondCard.textContent = '';
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];

  const allCards = document.querySelectorAll('.card');
  const allFlipped = [...allCards].every(card => card.classList.contains('flipped'));

  if (allFlipped) {
    setTimeout(() => {
      clearInterval(timerInterval);
      winSound.play(); // 🔊 winning sound
      alert(`Game Over! You finished in ${moves} moves and ${time} seconds.`);
    }, 500);
  }
}

function createEmptyGrid() {
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
  for (let i = 0; i < 16; i++) {
    const emptyCard = document.createElement('div');
    emptyCard.classList.add('card');
    gameBoard.appendChild(emptyCard);
  }
}

createEmptyGrid();






