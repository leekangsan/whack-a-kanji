import React, { Component } from "react";
import "../App.css";
import anime from "animejs";
import Score from "./Score.js";
import GameOver from "./GameOver.js";
import StartButton from "./StartButton.js";
import MoleHole from "./MoleHole.js";
import translations from "../utils/translations";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.moleTotal = 15;
    this.holes = Array.from(Array(9).keys());
    this.timePerMole = 1500;
    this.imagePool = 1000;

    this.state = {
      0: translations.down,
      1: translations.down,
      2: translations.down,
      3: translations.down,
      4: translations.down,
      5: translations.down,
      6: translations.down,
      7: translations.down,
      8: translations.down,
      shake: translations.zero,
      gameHasStarted: false,
      score: 0,
      lastHole: "",
      display: "none",
      buttonMessage: "Start Game",
      gameOver: "none",
      buttonDisplay: "inline-block",
      titleMargin: "15px"
    };
  }

  randTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  animate(el) {
    anime({
      targets: el,
      direction: "alternate",
      loop: true,
      easing: "easeInQuad",
      duration: 8000,
      scale: function(el, i, l) {
        return l - i + 0.08;
      }
    });
  }

  timeOut(num) {
    if (this.state.gameHasStarted) {
      return;
    }
    this.setState({
      buttonDisplay: "none",
      display: "block",
      gameOver: "none",
      titleMargin: 0,
      score: 0
    });
    this.shakeScreen();
    window.setTimeout(() => {
      this.startGame();
    }, 2000);
  }

  startGame() {
    if (this.state.gameHasStarted) {
      return;
    }

    this.setState({
      gameHasStarted: true
    });

    this.displayHole();
    window.setTimeout(() => {
      this.stopGame();
    }, this.moleTotal * this.timePerMole);
  }
  stopGame() {
    this.clearMoles();
    this.setState({ gameHasStarted: false });
    window.setTimeout(() => {
      this.setState({
        display: "none",
        gameOver: "block",
        buttonMessage: "Play again",
        buttonDisplay: "inline-block",
        titleMargin: "15px"
      });
      this.animate(this.refs.gameOver);
    }, 850);
  }

  clearMoles() {
    for (let value in this.state) {
      if (!isNaN(value)) {
        this.setState({
          [value]: translations.down
        });
      }
    }
  }

  randHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    if (this.state.lastHole[0] === idx) {
      return this.randHole(holes);
    }

    return idx;
  }

  displayHole() {
    const activeHole = this.randHole(this.holes);
    // const time = this.randTime(1000, 2000);
    this.setState({
      [activeHole]: translations.up,
      lastHole: [activeHole]
    });
    window.setTimeout(() => {
      this.setState({
        [activeHole]: translations.down
      });
      if (this.state.gameHasStarted === true) {
        this.displayHole();
      }
    }, this.timePerMole);
  }

  addToScore(num = 1) {
    this.setState((prevState, props) => ({
      score: prevState.score + num
    }));
  }
  randRealOrFake() {
    return Boolean(Math.round(Math.random() * 1));
  }
  randImgUrl() {
    return Math.floor(Math.random() * this.imagePool);
  }

  shakeScreen() {
    let posOrNeg = "+";
    let i = 0;
    let shake = () => {
      if (i === 15) {
        this.setState({ shake: translations.zero });
        return;
      }
      window.setTimeout(() => {
        posOrNeg = posOrNeg === "-" ? "+" : "-";
        this.setState({ shake: `translate(${posOrNeg}${i}px, 0)` });
        shake();
      }, 80);
      i++;
    };
    shake();
  }
  board() {
    this.holes = this.holes.map((k, index) => (
      <MoleHole
        key={index.toString()}
        context={this.state}
        holeNumber={index}
        addToScore={this.addToScore.bind(this)}
        imgUrl={this.randImgUrl.bind(this)}
        real={this.randRealOrFake.bind(this)}
      />
    ));
    return <div className="board">{this.holes}</div>;
  }

  render() {
    return (
      <div className="main-container">
        <div className="game" style={{ WebkitTransform: this.state.shake }}>
          <h1
            className="game__title"
            style={{ margin: this.state.titleMargin }}
          >
            WHACK-A-KANJI
          </h1>
          <GameOver context={this} moles={this.moleTotal} />
          <div ref={"gameOver"} className="game__button-container">
            <StartButton
              context={this.state}
              onClick={this.timeOut.bind(this)}
            />
          </div>
          {this.board()}
          <Score context={this.state} />
          <div style={{ margin: 20 }}>
            <p>
              Some of these kanji characters are real. Some of them are faked by
              a robot. <b>Only whack the fake ones.</b> <br /> <br />
              Special thanks to{" "}
              <a href="http://blog.otoro.net/2015/12/28/recurrent-net-dreams-up-fake-chinese-characters-in-vector-format-with-tensorflow/">
                David Ha{" "}
              </a>{" "}
              for his kanji-dreaming AI and to{" "}
              <a href="https://github.com/RhodesPeter/whack-a-mole-react">
                {" "}
                Peter Rhodes
              </a>{" "}
              for his fun whack-a-mole game. Check out my source code{" "}
              <a href="https://github.com/iantheparker/whack-a-kanji">here</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
