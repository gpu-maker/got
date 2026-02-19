import Player from "./player.js";
import PokerEngine from "./pokerEngine.js";
import UI from "./ui.js";
import AIPlayer from "./aiPlayer.js";

export default class Game {
  constructor(config) {
    this.players=[];

    for(let i=0;i<config.playerCount;i++){
      this.players.push(new Player(i+1,config.startingChips,i!==0));
    }

    this.engine=new PokerEngine(this.players);
    this.ui=new UI(this);
  }

  start(){
    this.newRound();
  }

  newRound(){
    this.engine.startRound();
    this.ui.log("New round started");
    this.update();
    this.processTurn();
  }

  update(){
    this.ui.render();
  }

  currentPlayer(){
    return this.players[this.engine.turnIndex];
  }

  processTurn(){
    const p=this.currentPlayer();

    if(p.isAI){
      setTimeout(()=>{
        const decision=AIPlayer.decide(p,this.engine);
        this.applyAction(decision.type,decision.amount);
      },700);
    }
  }

  playerAction(type,amount){
    const p=this.currentPlayer();
    if(p.isAI) return;
    this.applyAction(type,amount);
  }

  applyAction(type,amount=0){
    const p=this.currentPlayer();
    const toCall=this.engine.currentBet-p.currentBet;

    if(type==="fold") p.folded=true;

    if(type==="call") this.engine.pot+=p.bet(toCall);

    if(type==="check"&&toCall>0) return;

    if(type==="raise"){
      this.engine.currentBet+=amount;
      this.engine.pot+=p.bet(toCall+amount);
    }

    this.engine.nextTurn();
    this.update();

    // naive round progression
    if(this.engine.turnIndex===0){
      if(this.engine.phase==="river"){
        const winners=this.engine.determineWinner();
        this.ui.log("Winner: "+winners.map(w=>w.id).join(", "));
        setTimeout(()=>this.newRound(),2000);
        return;
      }

      this.engine.nextPhase();
      this.ui.log("Phase: "+this.engine.phase);
    }

    this.processTurn();
  }
}
