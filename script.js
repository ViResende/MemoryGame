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
  moves = sessionStorage.getItem('moves') ? parseInt(sessionStorage.getItem('moves')) : 0;
  time = sessionStorage.getItem('time') ? parseInt(sessionStorage.getItem('time')) : 0;
  clearInterval(timerInterval);

  document.getElementById('moves').textContent = `Moves: ${moves}`;
  document.getElementById('timer').textContent = `Time: ${time} sec`;

  // CHANGE → always take current dropdown + color picker, then save it
  let difficulty = document.getElementById('difficulty').value;
  sessionStorage.setItem('difficulty', difficulty);
  document.getElementById('difficulty').value = difficulty;

  let backColor = document.getElementById('backColor').value;
  sessionStorage.setItem('backColor', backColor);
  document.getElementById('backColor').value = backColor;

  let cardValues = [];

  if (difficulty === 'easy') {
    cardValues = ['A', 'A', 'B', 'B'];
    gameBoard.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else if (difficulty === 'medium') {
    cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if (difficulty === 'hard') {
    cardValues = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L','M','M','N','N','O','O','P','P','Q','Q','R','R','S','S'];
    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
  }

  let shuffledCards;
  if (sessionStorage.getItem('flippedCards')) {
    shuffledCards = cardValues;
  } else {
    shuffledCards = shuffle(cardValues);
  }

  shuffledCards.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.style.backgroundColor = backColor;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });

  const savedFlippedCards = sessionStorage.getItem('flippedCards');
  if (savedFlippedCards) {
    const flippedArray = JSON.parse(savedFlippedCards);
    [...gameBoard.children].forEach((card, index) => {
      if (flippedArray[index]) {
        card.classList.add('flipped');
        card.textContent = card.dataset.value;
      }
    });
  }

  updateTotalMovesDisplay();

  timerInterval = setInterval(() => {
    time++;
    sessionStorage.setItem('time', time);
    document.getElementById('timer').textContent = `Time: ${time} sec`;
  }, 1000);
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  clickSound.play();
  this.classList.add('flipped');
  this.textContent = this.dataset.value;

  const flippedCards = [...document.querySelectorAll('.card')].map(card =>
    card.classList.contains('flipped') ? card.dataset.value : ''
  );
  sessionStorage.setItem('flippedCards', JSON.stringify(flippedCards));

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  sessionStorage.setItem('moves', moves);
  document.getElementById('moves').textContent = `Moves: ${moves}`;

  let totalMoves = parseInt(localStorage.getItem('totalMoves')) || 0;
  totalMoves++;
  localStorage.setItem('totalMoves', totalMoves);

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.value === secondCard.dataset.value;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchSound.play();
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
      winSound.play();
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

function updateTotalMovesDisplay() {
  const totalMoves = localStorage.getItem('totalMoves') || 0;
  document.getElementById('totalMoves').textContent = `Total Moves (all tabs): ${totalMoves}`;
}

window.addEventListener('storage', (event) => {
  if (event.key === 'totalMoves') {
    updateTotalMovesDisplay();
  }
});

window.addEventListener('load', () => {
  if (sessionStorage.getItem('moves')) {
    let savedDifficulty = sessionStorage.getItem('difficulty');
    let savedBackColor = sessionStorage.getItem('backColor');
    if (savedDifficulty) document.getElementById('difficulty').value = savedDifficulty;
    if (savedBackColor) document.getElementById('backColor').value = savedBackColor;
    startGame();
  } else {
    createEmptyGrid();
  }
});






