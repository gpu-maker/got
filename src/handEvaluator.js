/**
 * Poker hand evaluation.
 * Returns numeric rank + tiebreakers.
 */

const RANKS = {
  HIGH: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL: 7,
  FOUR: 8,
  STRAIGHT_FLUSH: 9,
  ROYAL: 10
};

const VALUES = {
  "2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,
  J:11,Q:12,K:13,A:14
};

function sortDesc(arr) {
  return [...arr].sort((a,b)=>b-a);
}

function getCounts(values) {
  const map = {};
  values.forEach(v => map[v]=(map[v]||0)+1);
  return map;
}

function isStraight(vals) {
  const uniq = [...new Set(vals)].sort((a,b)=>a-b);
  if (uniq.length < 5) return false;

  for (let i=0;i<=uniq.length-5;i++) {
    if (uniq[i+4]-uniq[i]===4) return uniq[i+4];
  }

  // wheel A-2-3-4-5
  if (uniq.includes(14) && uniq.slice(0,4).join()==="2,3,4,5") return 5;

  return false;
}

export default class HandEvaluator {
  static evaluate(cards) {
    const values = sortDesc(cards.map(c=>VALUES[c.value]));
    const suits = cards.map(c=>c.suit);
    const counts = getCounts(values);

    const isFlush = suits.every(s=>s===suits[0]);
    const straightHigh = isStraight(values);

    if (isFlush && straightHigh===14)
      return { rank:RANKS.ROYAL, values };

    if (isFlush && straightHigh)
      return { rank:RANKS.STRAIGHT_FLUSH, values:[straightHigh] };

    const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]||b[0]-a[0]);

    if (entries[0][1]===4)
      return { rank:RANKS.FOUR, values:[+entries[0][0]] };

    if (entries[0][1]===3 && entries[1]?.[1]===2)
      return { rank:RANKS.FULL, values:[+entries[0][0],+entries[1][0]] };

    if (isFlush) return { rank:RANKS.FLUSH, values };

    if (straightHigh)
      return { rank:RANKS.STRAIGHT, values:[straightHigh] };

    if (entries[0][1]===3)
      return { rank:RANKS.THREE, values:[+entries[0][0]] };

    if (entries[0][1]===2 && entries[1]?.[1]===2)
      return { rank:RANKS.TWO_PAIR, values:[+entries[0][0],+entries[1][0]] };

    if (entries[0][1]===2)
      return { rank:RANKS.PAIR, values:[+entries[0][0]] };

    return { rank:RANKS.HIGH, values };
  }

  /** deterministic comparison */
  static compare(a,b) {
    if (a.rank!==b.rank) return a.rank-b.rank;

    for (let i=0;i<Math.max(a.values.length,b.values.length);i++) {
      const diff=(a.values[i]||0)-(b.values[i]||0);
      if (diff!==0) return diff;
    }
    return 0;
  }
}
