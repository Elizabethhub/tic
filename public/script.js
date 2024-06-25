document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const turnDisplay = document.getElementById("turn");
  const rollDiceButton = document.getElementById("roll-dice");
  const letsPlayButton = document.getElementById("lets-play");
  const resetButton = document.getElementById("reset");
  const playAgainContainer = document.getElementById("play-again");
  const yesButton = document.getElementById("yes");
  const noButton = document.getElementById("no");
  const videoElement = document.getElementById("videoElement");

  const cells = Array(9).fill(null);
  let currentPlayer = "";
  let gameActive = false;
  let selectedCellIndex = 0;
  let adsManager;

  function initializeBoard() {
    board.innerHTML = "";
    cells.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.addEventListener("click", () => makeMove(index));
      board.appendChild(cellElement);
    });
  }

  function rollDice() {
    if (gameActive) return;
    initializeBoard();

    currentPlayer = Math.random() < 0.5 ? "X" : "O";
    turnDisplay.classList.remove("hidden");
    turnDisplay.textContent = `Player ${currentPlayer} goes first!`;
    rollDiceButton.classList.add("hidden");
    board.classList.remove("hidden");
    gameActive = true;
    if (currentPlayer === "O") {
      setTimeout(computerMove, 1000);
    }
  }

  function makeMove(index) {
    if (!gameActive || cells[index] || currentPlayer === "O") return;
    cells[index] = currentPlayer;
    renderBoard();
    turnDisplay.classList.remove("hidden");
    resetButton.classList.remove("hidden");
    if (checkWinner()) {
      turnDisplay.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      askPlayAgain();
      resetButton.classList.add("hidden");
    } else if (cells.every((cell) => cell)) {
      turnDisplay.textContent = "It's a draw!";
      gameActive = false;
      askPlayAgain();
      resetButton.classList.add("hidden");
    } else {
      currentPlayer = "O";
      turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
      setTimeout(computerMove, 1000);
    }
  }

  function computerMove() {
    if (!gameActive) return;
    let availableCells = cells.map((cell, index) => (cell === null ? index : null)).filter((index) => index !== null);
    if (availableCells.length > 0) {
      Array.from(board.children).forEach((cell) => {
        cell.classList.remove("selected");
      });
      resetButton.classList.remove("hidden");
      let move = availableCells[Math.floor(Math.random() * availableCells.length)];
      cells[move] = "O";
      renderBoard();
      if (checkWinner()) {
        turnDisplay.textContent = `Player O wins!`;
        gameActive = false;
        askPlayAgain();
        resetButton.classList.add("hidden");
      } else if (cells.every((cell) => cell)) {
        turnDisplay.textContent = "It's a draw!";
        gameActive = false;
        askPlayAgain();
        resetButton.classList.add("hidden");
      } else {
        currentPlayer = "X";
        turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
      }
    }
  }

  function renderBoard() {
    cells.forEach((cell, index) => {
      board.children[index].textContent = cell;
      //   board.children[index].classList.toggle("selected", index === selectedCellIndex); .. note - to highlight cells from the beginning
    });
  }

  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
    });
  }

  function askPlayAgain() {
    playAgainContainer.classList.remove("hidden");
  }

  function resetGame() {
    cells.fill(null);
    currentPlayer = "";
    gameActive = false;
    turnDisplay.textContent = "Roll the dice to see who goes first!";
    rollDiceButton.classList.add("hidden");
    letsPlayButton.classList.remove("hidden");
    resetButton.classList.add("hidden");
    board.classList.add("hidden");
    playAgainContainer.classList.add("hidden");
    selectedCellIndex = 0;
    renderBoard();
    turnDisplay.classList.add("hidden");
    Array.from(board.children).forEach((cell) => {
      cell.classList.remove("selected");
    });
  }

  function highlightSelectedCell() {
    Array.from(board.children).forEach((cell, index) => {
      cell.classList.toggle("selected", index === selectedCellIndex);
    });
  }

  function handleKeyDown(event) {
    if (!gameActive || currentPlayer === "O") return;
    switch (event.key) {
      case "ArrowUp":
        if (selectedCellIndex >= 3) selectedCellIndex -= 3;
        break;
      case "ArrowDown":
        if (selectedCellIndex <= 5) selectedCellIndex += 3;
        break;
      case "ArrowLeft":
        if (selectedCellIndex % 3 !== 0) selectedCellIndex -= 1;
        break;
      case "ArrowRight":
        if (selectedCellIndex % 3 !== 2) selectedCellIndex += 1;
        break;
      case "Enter":
        makeMove(selectedCellIndex);
        break;
      case "Backspace":
        resetGame();
        break;
    }
    highlightSelectedCell();
  }

  function init() {
    letsPlayButton.addEventListener("click", () => {
      requestAds();
      videoElement.src = "https://storage.googleapis.com/gvabox/media/samples/stock.mp4";
      videoElement.autoplay = true;
      videoElement.classList.remove("hidden");
      letsPlayButton.classList.add("hidden");
    });

    rollDiceButton.addEventListener("click", rollDice);
    resetButton.addEventListener("click", resetGame);
    yesButton.addEventListener("click", resetGame);
    noButton.addEventListener("click", () => {
      playAgainContainer.classList.add("hidden");
      rollDiceButton.classList.add("hidden");
      resetButton.classList.remove("hidden");
    });
    videoElement.addEventListener("ended", function () {
      videoElement.classList.add("hidden");
      videoElement.src = "";
      activateGame();
    });
    document.addEventListener("keydown", handleKeyDown);
  }

  init();
});
