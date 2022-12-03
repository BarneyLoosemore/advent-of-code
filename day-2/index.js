const fs = require('fs');

const shapeScoreMap = { X: 1, Y: 2, Z: 3 };

const outcomeMap = {
  wins: { X: 'C', Y: 'A', Z: 'B', score: 6 },
  draws: { X: 'A', Y: 'B', Z: 'C', score: 3 },
  losses: { X: 'B', Y: 'C', Z: 'A', score: 0 },
};

const strategyMap = {
  X: 'losses',
  Y: 'draws',
  Z: 'wins',
};

function getScore(opponentPick, playerPick) {
  const shapeScore = shapeScoreMap[playerPick];
  if (outcomeMap.wins[playerPick] === opponentPick) {
    return shapeScore + outcomeMap.wins.score;
  }
  if (outcomeMap.draws[playerPick] === opponentPick) {
    return shapeScore + outcomeMap.draws.score;
  }
  return shapeScore;
}

function getScoreWithStrategy(opponentPick, playerPick) {
  const strategy = strategyMap[playerPick];
  const shape = Object.keys(outcomeMap[strategy]).find(
    (s) => outcomeMap[strategy][s] === opponentPick
  );
  const shapeScore = shapeScoreMap[shape];
  return shapeScore + outcomeMap[strategy].score;
}

function calculateTotalScore(data, getScoreFn = getScore) {
  const strategyPicksArray = data
    .split('\n')
    .filter(Boolean)
    .map((i) => i.split(' '));
  const totalScore = strategyPicksArray
    .map(([opponentPick, playerPick]) => getScoreFn(opponentPick, playerPick))
    .reduce((a, b) => a + b);
  return totalScore;
}

fs.readFile('output.txt', 'utf-8', (_, data) => {
  console.log('Part 1 score total: ' + calculateTotalScore(data));
  console.log(
    'Part 2 score total: ' + calculateTotalScore(data, getScoreWithStrategy)
  );
});
