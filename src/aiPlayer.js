/**
 * Simple AI decision logic.
 */
export default class AIPlayer {
  static decide(player, engine) {
    const strength = engine.evaluatePlayerStrength(player);
    const toCall = engine.currentBet - player.currentBet;

    if (strength > 0.8) return { type: "raise", amount: 50 };
    if (strength > 0.4) return toCall ? { type: "call" } : { type: "check" };

    if (Math.random() < 0.15) return { type: "raise", amount: 20 }; // bluff

    return toCall ? { type: "fold" } : { type: "check" };
  }
}
