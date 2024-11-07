---

## Introduction

Welcome to the **Set Game**, a digital adaptation of the classic card game that challenges your pattern recognition and strategic thinking skills. Compete with a friend, immerse yourself in a fun and engaging experience that sharpens your mind and offers endless entertainment.

---

## Team Members

**Au 24 Team 2**

- **Project Manager:** Pranav
- **UI Designer:** Tony
- **Backend Developer 1:** Adam
- **Backend Developer 2:** Darin
- **View Developer 1:** Abdi
- **View Developer 2:** Rakshit

*All team members contributed beyond their assigned roles to ensure the success of the project.*

---

## Installation

To install and play the Set Game, follow these steps:

1. **Clone the Repository:**
   - Download the project by cloning the repository using Git:
     ```bash
     git clone 
     ```

2. **Extract Files:**
   - Download the zip file at this link: 
     Extract the files contained in the zip
     Run the "index.html" file in your browser of choice

3. **Run the Game:**
   - Open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Edge).
   - *If you encounter issues loading the game, ensure that JavaScript is enabled in your browser settings.*

---

## How to Play

### Game Mode

**Two-Player Game:** Compete against another player by taking turns to identify matching sets. The player with the most points at the end wins.

### Rules

1. **Selecting Cards:**
   - Click on three cards to form a set.

2. **Valid Set:**
   - If the selected cards form a valid set, they are removed from the board, and the player earns a point.

3. **Turn Switching:**
   - Player 1 starts the game. If the timer runs out or if Player 1 correctly identifies a set, the turn switches to Player 2.

4. **Game Continuation:**
   - Continue selecting sets until no valid sets remain on the board. The player with the highest score wins.

### Understanding a Valid Set

Each card has four attributes:
- **Color**
- **Shape**
- **Shade**
- **Number**

A valid set consists of three cards where, for each attribute, the values are **all the same** or **all different** across the three cards.

### Examples of Sets

#### **Matching Set**

<img width="823" alt="Screenshot 2024-09-29 at 10 11 27 PM" src="https://github.com/user-attachments/assets/b17c630a-7cb2-4847-af2a-da99241b9c10">

*Explanation:* All attributes are either all the same or all different.

#### **Non-Matching Set**

<img width="408" alt="Screenshot 2024-09-29 at 10 12 29 PM" src="https://github.com/user-attachments/assets/bfa3ce17-d0fe-41c0-bf27-bfa21a04c7b1">

*Explanation:* The color attribute is not all the same or all different.

---

## Additional Features

- **Timer:** Each player has 60 seconds per turn. Use the pause/resume button to control the timer.
- **Pause/Resume:** Click the "Pause" button to halt the timer and changes it to "Resume." Click "Resume" to continue the game.
- **Hint:** If stuck, click the "Hint" button to reveal two cards in a matching set.
- **New Game:** Reset the game at any time by clicking the "New Game" button, which resets scores, shuffles the deck and restarts the timer.

---

## In-Code Documentation

The codebase includes comprehensive documentation explaining the mathematical models and abstractions used:

- **Card Class:** Represents each card with attributes for number, shape, color, and shading.
- **Player Class:** Manages player information, including name, score, and timer.
- **Game Logic:** Functions to generate and shuffle the deck, validate sets, handle player turns, and manage the game state.
- **Event Handling:** Manages user interactions such as selecting cards, pausing/resuming the game, and requesting hints.
