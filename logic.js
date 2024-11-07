// Game logic code for CSE 3901, Project 1 Game Set Team 2

/**
 * Initialize the game when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Represents a card in the Set game.
   */
  class Card {
    constructor(number, shape, color, shading) {
      this.number = number;
      this.shape = shape;
      this.color = color;
      this.shading = shading;
    }
  }

  /**
   * Represents a player in the Set game.
   */
  class Player {
    constructor(name) {
      this.name = name;
      this.score = 0;
      this.timeRemaining = 60; // 60 seconds per turn
    }

    resetTime() {
      this.timeRemaining = 60;
    }
  }

  /**
   * Game state variables.
   */
  let deck = [];
  let dealtCards = [];
  let players = [new Player("Player 1"), new Player("Player 2")];
  let currentPlayerIndex = 0;
  let gameOver = false;
  let timerInterval;
  let isPaused = false;
  let isNewTurn = true;
  let savedTimeRemaining = 0;

  /**
   * Generate a full deck of 81 cards.
   * @return {Card[]} The generated deck of cards.
   */
  function generateDeck() {
    const numbers = [1, 2, 3];
    const shapes = ["diamond", "squiggle", "oval"];
    const colors = ["red", "green", "purple"];
    const shadings = ["solid", "striped", "open"];
    const deck = [];

    for (let number of numbers) {
      for (let shape of shapes) {
        for (let color of colors) {
          for (let shading of shadings) {
            deck.push(new Card(number, shape, color, shading));
          }
        }
      }
    }
    return deck;
  }

  /**
   * Shuffle the deck of cards.
   * @param {Card[]} deck - The deck to shuffle.
   * @return {Card[]} The shuffled deck.
   */
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Initialize the game.
   */
  function initGame() {
    deck = shuffleDeck(generateDeck());
    dealInitialCards();
    players.forEach((player) => (player.score = 0));
    currentPlayerIndex = 0;
    gameOver = false;
    startPlayerTurn();
  }

  /**
   * Deal the initial cards to the table.
   */
  function dealInitialCards() {

    dealtCards = deck.splice(0, 12);

    while(findSet() == null) {

      deck.push(dealtCards);
      deck = shuffleDeck(deck);
      dealtCards = deck.splice(0,11);
    }
    


  }

  /**
   * Check if three cards form a valid set.
   * @param {Card} card1 - The first card.
   * @param {Card} card2 - The second card.
   * @param {Card} card3 - The third card.
   * @return {boolean} True if the cards form a valid set, false otherwise.
   */
  function isValidSet(card1, card2, card3) {
    const properties = ["number", "shape", "color", "shading"];
    for (let prop of properties) {
      const allSame =
        card1[prop] === card2[prop] && card2[prop] === card3[prop];
      const allDifferent =
        card1[prop] !== card2[prop] &&
        card2[prop] !== card3[prop] &&
        card1[prop] !== card3[prop];
      if (!allSame && !allDifferent) {
        return false;
      }
    }
    return true;
  }

  /**
   * Replace cards after a set is found.
   * @param {number[]} indices - The indices of the cards to replace.
   */
  function replaceCards(indices) {
    for (let index of indices) {
      if (deck.length > 0) {
        dealtCards[index] = deck.pop();
      }
      while(findSet() == null) {

        deck.push(dealtCards);
        deck = shuffleDeck(deck)
        dealtCards = deck.splice(0,12)
        
      }


    }
  }

  /**
   * Find a set on the table.
   * @return {number[]|null} The indices of the cards forming a set, or null if no set is found.
   */
  function findSet() {
    for (let i = 0; i < dealtCards.length - 2; i++) {
      for (let j = i + 1; j < dealtCards.length - 1; j++) {
        for (let k = j + 1; k < dealtCards.length; k++) {
          if (isValidSet(dealtCards[i], dealtCards[j], dealtCards[k])) {
            return [i, j, k];
          }
        }
      }
    }
    return null;
  }

  /**
   * Add more cards to the table if no sets are present.
   * @return {boolean} True if cards were added, false otherwise.
   */
  function addMoreCards() {


    if (deck.length >= 3 && findSet() == null) {
      dealtCards.push(...deck.splice(0, 3));
      return true;
    }
    return false;
  }

  /**
   * Check if the game is over.
   * @return {boolean} True if the game is over, false otherwise.
   */
  function isGameOver() {
    return deck.length < 12 || findSet() === null;
  }

  /**
   * Evaluate a selected set of cards.
   * @param {number[]} indices - The indices of the selected cards.
   * @return {Object} An object containing whether the set is correct and a message.
   */
  function evaluateSet(indices) {
    const [index1, index2, index3] = indices;
    if (
      isValidSet(dealtCards[index1], dealtCards[index2], dealtCards[index3])
    ) {
      players[currentPlayerIndex].score++;
      replaceCards(indices);
      addMoreCards();
      updateScoreChart();
      showHint();
      return { correct: true, message: "Correct Set!" };
    } else {
      return { correct: false, message: "Not a Set. Try again!" };
    }
  }

  /**
   * Find hints for the player.
   * @return {Card[]} An array of three cards that form a set.
   */
  function findHints() {
    for (let i = 0; i < dealtCards.length - 2; i++) {
      for (let j = i + 1; j < dealtCards.length - 1; j++) {
        for (let k = j + 1; k < dealtCards.length; k++) {
          if (isValidSet(dealtCards[i], dealtCards[j], dealtCards[k])) {
            return [dealtCards[i], dealtCards[j], dealtCards[k]];
          }
        }
      }
    }
    return null;
  }

  /**
   * Get hints for the player.
   * @return {Card[]} An array of two cards that are part of a set.
   */
  function getHints() {
    const hint = findHints();
    return [hint[0], hint[1]];
  }

  /**
   * Start the current player's turn.
   */
  function startPlayerTurn() {
    const currentPlayer = players[currentPlayerIndex];
    
    if (isNewTurn) {
      currentPlayer.resetTime(); // Reset time if it's a new turn and not resuming
    } 
  
    updateTimerDisplay();
    updatePlayerDisplay();
  
    // Clear any existing interval to prevent multiple timers
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  
    // Start the interval to update the timer every second
    timerInterval = setInterval(() => {
      if (!isPaused) {
        currentPlayer.timeRemaining--;
        updateTimerDisplay();
  
        // End the player's turn if time runs out
        if (currentPlayer.timeRemaining <= 0) {
          endPlayerTurn();
        }
      }
    }, 1000);
  }

  /**
   * Pause the timer.
   */
  function pauseTimer() {
    if (!isPaused) {
      isPaused = true;
      clearInterval(timerInterval);
      savedTimeRemaining = players[currentPlayerIndex].timeRemaining;
      document.getElementById("pauseButton").style.display = "none"; // Hide pause button
      document.getElementById("resumeButton").style.display = "block"; // Show resume button
    }
  }

/**
 * Resume the timer.
 */
function resumeTimer() {
  if (isPaused) {
    isPaused = false;
    isNewTurn = false;
    startPlayerTurn();
    document.getElementById("resumeButton").style.display = "none"; // Hide resume button
    document.getElementById("pauseButton").style.display = "block"; // Show pause button
  }
}

// Attach event listeners to buttons
document.getElementById("pauseButton").addEventListener("click", pauseTimer);
document.getElementById("resumeButton").addEventListener("click", resumeTimer);

  /**
   * End the current player's turn and switch to the next player.
   */
  function endPlayerTurn() {
    isNewTurn = true;
    clearInterval(timerInterval);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

    if (isGameOver()) {
      endGame();
    } else {
      startPlayerTurn();
    }
  }

  const gameContainer = document.getElementById("game-container");
  let selectedCardIndices = [];

  /**
   * Render the cards on the game board.
   */
  function renderCards() {
    const gameContainer = document.getElementById('game-container'); // Get the container where cards will be rendered
    gameContainer.innerHTML = ''; // Clear previous cards

    dealtCards.forEach((card, index) => {
      const cardElement = createCardElement(card, index); // Create a card element
      gameContainer.appendChild(cardElement); // Append the card to the game container
    });

    updateCardSelection(); // Ensure selection is updated
  }


  /**
   * Create a card element for the DOM and displays on screen.
   * @param {Card} card - The card to create an element for.
   * @param {number} index - The index of the card.
   * @return {HTMLElement} The created card element.
   */
  function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index;

    const cardWidth = 100;
    const cardHeight = 150;
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", cardWidth);
    svgElement.setAttribute("height", cardHeight);
    svgElement.setAttribute("viewBox", "0 0 100 150");
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Striped pattern for the fill when needed
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", `striped-pattern-${index}`);
    pattern.setAttribute("width", "10");
    pattern.setAttribute("height", "10");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");

    // Put stripes inside the pattern
    const stripe = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    stripe.setAttribute("width", "2");
    stripe.setAttribute("height", "10");
    stripe.setAttribute("fill", card.color);
    pattern.appendChild(stripe);

    defs.appendChild(pattern);
    svgElement.appendChild(defs);

    // Create the shapes inside the SVG based on the card's properties
    for (let i = 0; i < card.number; i++) {
      let shapeElement;
      const yOffset = i * (cardHeight / card.number) + (cardHeight / card.number) / 2;

      // Grouping each shape and applying transformations
      const shapeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      shapeGroup.setAttribute("transform", `translate(50, ${yOffset}) scale(0.6)`); // Scale and center each shape

      if (card.shape === "diamond") {
        shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shapeElement.setAttribute("points", "0,-20 40,0 0,20 -40,0");
      } else if (card.shape === "squiggle") {
        shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shapeElement.setAttribute("d", "M -30,0 C -20,-20 0,-20 10,0 S 30,20 40,0 Z");;
      } else if (card.shape === "oval") {
        shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shapeElement.setAttribute("d", "M -30,0 Q -30,20 0,20 Q 30,20 30,0 Q 30,-20 0,-20 Q -30,-20 -30,0 Z");
      }

      // Set fill properties
      if (card.shading === "solid") {
        shapeElement.setAttribute("fill", card.color);
      } else if (card.shading === "striped") {
        shapeElement.setAttribute("fill", `url(#striped-pattern-${index})`);
      } else {
        shapeElement.setAttribute("fill", "none");
      }
      shapeElement.setAttribute("stroke", card.color);
      shapeGroup.appendChild(shapeElement);
      svgElement.appendChild(shapeGroup);
    }
    cardElement.appendChild(svgElement);
    cardElement.addEventListener('click', () => handleCardClick(index));

    return cardElement;
  }

  /**
   * Handle a card click event.
   * @param {number} index - The index of the clicked card.
   */
  function handleCardClick(index) {
    if (gameOver) return;

    const clickedIndex = selectedCardIndices.indexOf(index);
    if (clickedIndex > -1) {
      selectedCardIndices.splice(clickedIndex, 1);
    } else {
      if (selectedCardIndices.length < 3) {
        selectedCardIndices.push(index);
      }
    }

    updateCardSelection();

    if (selectedCardIndices.length === 3) {
      checkSet();
    }
  }

  /**
   * Update the visual selection of cards.
   */
  function updateCardSelection() {
    document.querySelectorAll(".card").forEach((card) => {
      if (selectedCardIndices.includes(parseInt(card.dataset.index))) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
    });
  }

  /**
   * Check if the selected cards form a valid set.
   */
  function checkSet() {
    const result = evaluateSet(selectedCardIndices);
    
    if (result.correct) {
      alert(result.message);
      updateScoreChart();

      renderCards();
      endPlayerTurn();
    } else {
      alert(result.message);
    }
    selectedCardIndices = [];
    updateCardSelection();
  }

  /**
   * Update the score display.
   */
  function updateScoreChart() {
    const scoreChartElement = document.getElementById("chart");
    if (scoreChartElement) {
      scoreChartElement.innerHTML = `
              <table style="width: 100%; border-collapse: collapse; text-align: center;">
                  <thead>
                      <tr style="background-color: #009879; color: white;">
                          <th style="padding: 10px;">${players[0].name}</th>
                          <th style="padding: 10px;">${players[1].name}</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td style="padding: 10px; border: 1px solid #dddddd;">${players[0].score}</td>
                          <td style="padding: 10px; border: 1px solid #dddddd;">${players[1].score}</td>
                      </tr>
                  </tbody>
              </table>
          `;
    }
  }

  /**
   * Updates the player's turn.
   */
  function updatePlayerDisplay() {
    const playerElement = document.getElementById("userinfo");
    if (playerElement) {
      playerElement.textContent = `${players[currentPlayerIndex].name}'s Turn`;
    }
  }

  /**
   * Updates the timer.
   */
  function updateTimerDisplay() {
    const timerElement = document.getElementById("playerinfo");
    if (timerElement) {
      const minutes = Math.floor(
        players[currentPlayerIndex].timeRemaining / 60
      );
      const seconds = players[currentPlayerIndex].timeRemaining % 60;
      timerElement.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  /**
   * Add control buttons to the game.
   */
  function addControlButtons() {
    const newGameButton = document.getElementById('new-game-button'); // Get the New Game button
    newGameButton.addEventListener('click', startNewGame);

    const hintButton = document.getElementById('hint-button'); // Get the Hint button
    hintButton.addEventListener('click', showHint);
  }

  /**
   * Start a new game.
   */
  function startNewGame() {
    initGame();
    selectedCardIndices = [];
    renderCards();
    updatePlayerDisplay();
    updateScoreChart();
  }

  /**
   * Show a hint to the player.
   */
  function showHint() {

    const hintCards = getHints();
    let custom_button =
    document.getElementById("hint-button");
    custom_button.addEventListener
    ('click', function () {
        Swal.fire({
            title: 'Hint!',
            html:`Try these two cards:<br>
            ${hintCards[0].number} ${hintCards[0].color} ${hintCards[0].shading} ${hintCards[0].shape}<br>
            ${hintCards[1].number} ${hintCards[1].color} ${hintCards[1].shading} ${hintCards[1].shape}`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    });
  }

  /**
   * End the game.
   */
  function endGame() {
    gameOver = true;
    updateScoreChart;
    clearInterval(timerInterval);
    const winner =
      players[0].score > players[1].score ? players[0] : players[1];
    alert(`Game Over! ${winner.name} wins with a score of ${winner.score}!`);
  }

  // Initialize the game
  addControlButtons();
  startNewGame();

  // Event listener for hint button
  document.getElementById("hint-button").addEventListener("click", showHint);
});
