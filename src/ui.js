export default class UI {
  constructor(game) {
    this.game = game;

    this.playersEl = document.getElementById("players");
    this.communityEl = document.getElementById("community");
    this.potEl = document.getElementById("pot");
    this.logEl = document.getElementById("log");

    this.bindControls();
  }

  bindControls() {
    document.getElementById("foldBtn").onclick = () => this.game.playerAction("fold");
    document.getElementById("callBtn").onclick = () => this.game.playerAction("call");
    document.getElementById("checkBtn").onclick = () => this.game.playerAction("check");
    document.getElementById("raiseBtn").onclick = () => {
      const amt = +document.getElementById("raiseInput").value;
      this.game.playerAction("raise", amt);
    };
  }

  /** Visible card */
  cardHTML(card) {
    return `<div class="card">${card.value}${card.suit}</div>`;
  }

  /** Face-down card */
  hiddenCardHTML() {
    return `<div class="card" style="background:#222;color:#222;">🂠</div>`;
  }

  render() {
    const g = this.game;

    this.potEl.textContent = `Pot: ${g.engine.pot}`;

    // Community cards always visible
    this.communityEl.innerHTML =
      g.engine.community.map(c => this.cardHTML(c)).join("");

    this.playersEl.innerHTML = g.players.map((p, i) => {

      const isHuman = i === 0;
      const revealAll = g.engine.phase === "showdown";
      const revealBecauseFolded = p.folded;

      let cardsHTML;

      // Show cards if:
      // - human player
      // - player folded
      // - showdown
      if (isHuman || revealAll || revealBecauseFolded) {
        cardsHTML = p.hand.map(c => this.cardHTML(c)).join("");
      } else {
        cardsHTML = p.hand.map(() => this.hiddenCardHTML()).join("");
      }

      return `
        <div class="player ${i === g.engine.turnIndex ? "active" : ""}">
          <div>Player ${p.id} ${isHuman ? "(You)" : ""}</div>
          <div>Chips: ${p.chips}</div>
          <div>${cardsHTML}</div>
          <div>${p.folded ? "FOLDED" : ""}</div>
        </div>
      `;
    }).join("");
  }

  log(msg) {
    this.logEl.innerHTML += `<div>${msg}</div>`;
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }
}
