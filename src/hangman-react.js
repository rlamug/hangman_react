/**
 * @file hangman-react.js     Implementation of Hangman
 *
 *
 * @brief
 *    Implementation of Hangman game in React
 *
 * @author Rodolfo Lamug
 * @date 2019
 */
import React from "react";
import hang1 from "./hang1.PNG"
import hang2 from "./hang2.PNG"
import hang3 from "./hang3.PNG"
import hang4 from "./hang4.PNG"
import hang5 from "./hang5.PNG"
import hang6 from "./hang6.PNG"
import hang7 from "./hang7.PNG"

/*
 * HangmanDisplay class
 * @description Displays hangman image depending on the number of lives
 */
class HangmanDisplay extends React.Component {
  render() {
    let picture = hang1
    // 1 incorrect guesses
    if (this.props.lives === 5) {
      picture = hang2
    }
    // 2 incorrect guesses
    if (this.props.lives === 4) {
      picture = hang3
    }
    // 3 incorrect guesses
    if (this.props.lives === 3) {
      picture = hang4
    }
    // 4 incorrect guesses
    if (this.props.lives === 2) {
      picture = hang5
    }
    // 5 incorrect guesses
    if (this.props.lives === 1) {
      picture = hang6
    }
    // 6 incorrect guesses
    if (this.props.lives === 0) {
      picture = hang7
    }
    return (
      <div>
        <img src={picture} alt="" />
      </div>
    );
  }
}
/*
 * WordDisplay class
 * @description Displays current progress of the hangman word. 
 * Initially starts with underscores and
 * populates with letters as the player guesses them correctly
 */
class WordDisplay extends React.Component {
  render() {
    const wordArray = this.props.word.split("") // word into array of letters
    const progress = wordArray.map(letter => {
      let blank = "_ " // holds what to display
      // if the letter is a hyphen set blank to hyphen
      if (letter === "-") {
        blank = "-"
      }
      // if player guessed letter correctly update underscore to letter
      if (this.props.guessedLetters.includes(letter)) {
        blank = letter
      }
      return blank
    })
    return (
      <div>
        <p>{progress}</p>
      </div>
    );
  }
}

/*
 * GuessedLettersDisplay class
 * @description Displays incorrectly guessed letters
 */
class GuessedLettersDisplay extends React.Component {
  incorrectLetters() {
    const letters = this.props.guessedLetters.filter(letter => {
      return this.props.word.split("").includes(letter) === false
    })
    return letters.join(", ")
  }

  render() {
    return (
      <div>
        <p>Guessed Letters: {this.incorrectLetters()}</p>
      </div>
    );
  }
}

/*
 * WinOrLoseDisplay class
 * @description Displays whether player won or lost
 */
class WinOrLoseDisplay extends React.Component {
  render() {
    let phrase = ""
    // Player loses
    if (this.props.lives === 0) {
      phrase = "You have run out of lives. You Lose..."
    }
    if (this.props.lives > 0 && this.props.gameOver === 1) {
      phrase = "Congratulations! You Win!!!"
    }
    return (
      <p>{phrase}</p>
    );
  }
}

/*
 * HangmanGame class
 * @description The Hangman Game
 */
class HangmanGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      guessedLetters: [],
      lives: 6,
      score: 0,
      gameOver: 2,
      correctLetters: [],
    };
  }

  /*
   * newWord function
   * @description Handles when "New Game" button is pressed.
   * Fetchs a new word and resets most of the state.
   */
  newWord() {
    fetch("https://api.datamuse.com/words?ml=deadly")
      .then(res => res.json())
      .then(data =>
        this.setState({
          word: data[Math.floor(Math.random() * data.length)].word
        })
      )
    this.setState({
      guessedLetters: [], lives: 6, gameOver: 0,
      correctLetters: [],
    })
  }

  /*
   * guessedLetter function
   * @description Handles when keyboard keys are pressed and guessed letters
   */
  guessedLetter(event) {
    if (this.state.lives !== 0 && this.state.gameOver !== 1) {
      let letter = event.key// guessed letter
      if (!this.state.guessedLetters.includes(letter)) {
        let guessedLettersCopy = [...this.state.guessedLetters]
        guessedLettersCopy.push(letter)
        this.setState({ guessedLetters: guessedLettersCopy })
        // Incorrect guess
        if (this.state.word.split("").includes(letter) === false) {
          // Decrement lives
          this.setState({ lives: this.state.lives - 1 })
          // Game Over if no more lives left
          if (this.state.lives === 0) {
            this.setState({ gameOver: 1 })
          }
        }
        // Correct guess
        else {
          // Update state of correctLetters array
          let correctLettersCopy = [...this.state.correctLetters]
          correctLettersCopy.push(letter)
          this.setState({ correctLetters: correctLettersCopy })
          let wordArray = [...this.state.word.split("")]
          let uniqueLetters = Array.from(new Set(wordArray)).length
          if (uniqueLetters === (this.state.correctLetters.length + 1)) {
            this.setState({ score: this.state.score + 1, gameOver: 1 })
          }
        }
      }
    }
  }

  /*
   * guessWord function
   * @description Handles the "Guess Word button" and when user wants to guess
   * the hangman word.
   */
  guessWord = (event) => {
    if (this.state.lives !== 0 && this.state.gameOver !== 1) {
      const wordGuess = prompt("Enter your word guess")
      // Correct guess
      if (wordGuess === this.state.word) {
        this.setState({ gameOver: 1, score: this.state.score + 1 })
      }
      // Incorrect Guess
      else {
        this.setState({ lives: this.state.lives - 1 })
      }
    }
  }

  render() {
    console.log(this.state.word)
    return (
      <div onKeyPress={this.guessedLetter.bind(this)}>
        <h2>Hangman</h2>

        <HangmanDisplay lives={this.state.lives} />

        <br />
        <button onClick={() => this.newWord()}>New Game</button>
        <br />

        <WordDisplay
          word={this.state.word}
          guessedLetters={this.state.guessedLetters}
        />
        <br />

        <p>Just enter letters to guess!</p>
        <br />

        <input
          type="button"
          value="Guess Word"
          onClick={this.guessWord}
        />
        <br />
        <br />

        <WinOrLoseDisplay
          lives={this.state.lives}
          gameOver={this.state.gameOver}
        />
        <br />

        <p>Score: {this.state.score}</p>

        <p>Lives: {this.state.lives}</p>

        <GuessedLettersDisplay
          word={this.state.word}
          guessedLetters={this.state.guessedLetters}
        />
      </div>
    );
  }
}

// ========================================

export default HangmanGame;