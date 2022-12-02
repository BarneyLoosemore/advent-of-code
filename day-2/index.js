const fs = require('fs');

const shapeScoreMap = { X: 1, Y: 2, Z: 3 };
const outcomeMap = {
  wins: { X: 'C', Y: 'A', Z: 'B' },
  draws: { X: 'A', Y: 'B', Z: 'C' },
};

function getScore(opponentPick, playerPick) {
  const shapeScore = shapeScoreMap[playerPick];
  if (outcomeMap.wins[playerPick] === opponentPick) {
    return shapeScore + 6;
  }
  if (outcomeMap.draws[playerPick] === opponentPick) {
    return shapeScore + 3;
  }
  return shapeScore;
}

function calculateTotalScore(data) {
  const strategyPicksArray = data
    .split('\n')
    .filter(Boolean)
    .map((i) => i.split(' '));
  const totalScore = strategyPicksArray
    .map(([opponentPick, playerPick]) => getScore(opponentPick, playerPick))
    .reduce((a, b) => a + b);
  return totalScore;
}

fs.readFile('output.txt', 'utf-8', (_, data) =>
  console.log(calculateTotalScore(data))
);
