import Deck from "./deck.js";
import HandEvaluator from "./handEvaluator.js";

export default class PokerEngine {
  constructor(players) {
    this.players = players;
    this.dealer = 0;
    this.smallBlind = 10;
    this.bigBlind = 20;
  }

  startRound() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.community = [];
    this.pot = 0;
    this.currentBet = 0;
    this.turnIndex = (this.dealer+1)%this.players.length;
    this.phase = "preflop";

    this.players.forEach(p=>p.resetForRound());

    this.dealHoleCards();
    this.postBlinds();
  }

  dealHoleCards() {
    for (let i=0;i<2;i++) {
      this.players.forEach(p=>p.hand.push(this.deck.deal()));
    }
  }

  postBlinds() {
    const sb=this.players[(this.dealer+1)%this.players.length];
    const bb=this.players[(this.dealer+2)%this.players.length];

    this.pot+=sb.bet(this.smallBlind);
    this.pot+=bb.bet(this.bigBlind);
    this.currentBet=this.bigBlind;
  }

  nextPhase() {
    if (this.phase==="preflop") {
      this.community.push(this.deck.deal(),this.deck.deal(),this.deck.deal());
      this.phase="flop";
    }
    else if (this.phase==="flop") {
      this.community.push(this.deck.deal());
      this.phase="turn";
    }
    else if (this.phase==="turn") {
      this.community.push(this.deck.deal());
      this.phase="river";
    }
    else this.phase="showdown";

    this.players.forEach(p=>p.currentBet=0);
    this.currentBet=0;
  }

  evaluatePlayerStrength(player) {
    // simple heuristic for AI
    const cards=[...player.hand,...this.community].slice(0,5);
    return HandEvaluator.evaluate(cards).rank/10;
  }

  determineWinner() {
    const active=this.players.filter(p=>!p.folded);

    let best=null;
    let winners=[];

    active.forEach(p=>{
      const result=HandEvaluator.evaluate([...p.hand,...this.community].slice(0,5));
      if(!best||HandEvaluator.compare(result,best)>0){
        best=result;
        winners=[p];
      }else if(HandEvaluator.compare(result,best)===0){
        winners.push(p);
      }
    });

    const split=Math.floor(this.pot/winners.length);
    winners.forEach(w=>w.chips+=split);

    return winners;
  }

  nextTurn() {
    do{
      this.turnIndex=(this.turnIndex+1)%this.players.length;
    }while(this.players[this.turnIndex].folded);
  }
}
