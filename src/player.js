/**
 * Player model.
 */
export default class Player {
  constructor(id, chips, isAI=false) {
    this.id = id;
    this.chips = chips;
    this.hand = [];
    this.currentBet = 0;
    this.folded = false;
    this.isAI = isAI;
  }

  resetForRound() {
    this.hand = [];
    this.currentBet = 0;
    this.folded = false;
  }

  bet(amount) {
    amount = Math.min(amount, this.chips);
    this.chips -= amount;
    this.currentBet += amount;
    return amount;
  }
}
