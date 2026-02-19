export default class UI {
  constructor(game) {
    this.game=game;

    this.playersEl=document.getElementById("players");
    this.communityEl=document.getElementById("community");
    this.potEl=document.getElementById("pot");
    this.logEl=document.getElementById("log");

    this.bindControls();
  }

  bindControls() {
    document.getElementById("foldBtn").onclick=()=>this.game.playerAction("fold");
    document.getElementById("callBtn").onclick=()=>this.game.playerAction("call");
    document.getElementById("checkBtn").onclick=()=>this.game.playerAction("check");
    document.getElementById("raiseBtn").onclick=()=>{
      const amt=+document.getElementById("raiseInput").value;
      this.game.playerAction("raise",amt);
    };
  }

  cardHTML(card){
    return `<div class="card">${card.value}${card.suit}</div>`;
  }

  render() {
    const g=this.game;

    this.potEl.textContent=`Pot: ${g.engine.pot}`;

    this.communityEl.innerHTML=g.engine.community.map(c=>this.cardHTML(c)).join("");

    this.playersEl.innerHTML=g.players.map((p,i)=>`
      <div class="player ${i===g.engine.turnIndex?"active":""}">
        <div>Player ${p.id}</div>
        <div>Chips: ${p.chips}</div>
        <div>${p.hand.map(c=>this.cardHTML(c)).join("")}</div>
        <div>${p.folded?"FOLDED":""}</div>
      </div>
    `).join("");
  }

  log(msg){
    this.logEl.innerHTML+=`<div>${msg}</div>`;
    this.logEl.scrollTop=this.logEl.scrollHeight;
  }
}
