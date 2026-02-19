import Game from "./game.js";

const game = new Game({
  playerCount: 4,
  startingChips: 1000
});

game.start();
