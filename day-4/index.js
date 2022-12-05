const fs = require('fs');

function checkPairsForFullContainment([firstElf, secondElf]) {
  const [firstElfStartId, firstElfEndId] = firstElf;
  const [secondElfStartId, secondElfEndId] = secondElf;

  const firstElfContainsSecondElf =
    firstElfStartId <= secondElfStartId && firstElfEndId >= secondElfEndId;
  const secondElfContainsFirstElf =
    secondElfStartId <= firstElfStartId && secondElfEndId >= firstElfEndId;

  if (firstElfContainsSecondElf || secondElfContainsFirstElf) {
    return true;
  }
  return false;
}

function checkPairsForPartialOverlap([firstElf, secondElf]) {
  const [firstElfStartId, firstElfEndId] = firstElf;
  const [secondElfStartId, secondElfEndId] = secondElf;

  const partialOverlap =
    (firstElfStartId <= secondElfEndId && firstElfEndId >= secondElfStartId) ||
    (secondElfStartId <= firstElfEndId && secondElfEndId >= firstElfStartId);

  if (partialOverlap) {
    return true;
  }
  return false;
}

function checkFullContainmentTotal(elfPairs) {
  return elfPairs.filter(checkPairsForFullContainment).length;
}

function checkPartialOverlapTotal(elfPairs) {
  return elfPairs.filter(checkPairsForPartialOverlap).length;
}

function formatElfData(data) {
  const elfPairs = data
    .split('\n')
    .filter(Boolean)
    .map((elfPair) => {
      const [firstElf, secondElf] = elfPair.split(',');
      return [
        firstElf.split('-').map(Number),
        secondElf.split('-').map(Number),
      ];
    });
  return elfPairs;
}

fs.readFile('input.txt', 'utf8', (_, data) => {
  const elfPairs = formatElfData(data);
  console.log('Task 1 result: ' + checkFullContainmentTotal(elfPairs));
  console.log('Task 2 result: ' + checkPartialOverlapTotal(elfPairs));
});
