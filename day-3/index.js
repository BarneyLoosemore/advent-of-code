const fs = require('fs');

function generateLetterPriories(startingLetterCode, startingLetterPriority) {
  return Array(26)
    .fill()
    .map((_, i) => [
      String.fromCharCode(startingLetterCode + i),
      startingLetterPriority + i,
    ]);
}

const letterPriorityMap = Object.fromEntries([
  ...generateLetterPriories('a'.charCodeAt(0), 1),
  ...generateLetterPriories('A'.charCodeAt(0), 27),
]);

function partitionString(string) {
  const [firstHalf, secondHalf] = [
    string.slice(0, string.length / 2),
    string.slice(string.length / 2),
  ];
  return [firstHalf, secondHalf];
}

function getDuplicateCharacter(string) {
  const [firstHalf, secondHalf] = partitionString(string);
  const duplicateCharacter = firstHalf
    .split('')
    .find((letter) => secondHalf.includes(letter));
  return duplicateCharacter;
}

function getLetterPrioritySum(stringArray) {
  const stringPriorityScores = stringArray.map((string) => {
    const duplicateCharacter = getDuplicateCharacter(string);
    return letterPriorityMap[duplicateCharacter];
  });
  const letterPrioritySum = stringPriorityScores.reduce(
    (sum, score) => sum + score
  );
  return letterPrioritySum;
}

function splitArrayEvery3rdItem(array) {
  return array
    .map((_, index) => {
      if (index % 3 === 0) {
        return array.slice(index, index + 3);
      }
    })
    .filter(Boolean);
}

function findCommonCharacter(stringArray) {
  const [firstHalf, secondHalf, thirdHalf] = stringArray;
  const commonCharacter = firstHalf.split('').find((letter) => {
    return secondHalf.includes(letter) && thirdHalf.includes(letter);
  });
  return commonCharacter;
}

function getGroupBadgesSum(stringArray) {
  const groupsArray = splitArrayEvery3rdItem(stringArray);
  const groupBadgePriorityScores = groupsArray.map((group) => {
    const commonCharacter = findCommonCharacter(group);
    return letterPriorityMap[commonCharacter];
  });
  return groupBadgePriorityScores.reduce((sum, score) => sum + score);
}

fs.readFile('output.txt', 'utf8', (_, data) => {
  const input = data.split('\n').filter(Boolean);
  console.log('Task 1 result: ' + getLetterPrioritySum(input));
  console.log('Task 2 result: ' + getGroupBadgesSum(input));
});

module.exports = {
  partitionString,
  getDuplicateCharacter,
  getLetterPrioritySum,
  splitArrayEvery3rdItem,
  findCommonCharacter,
  getGroupBadgesSum,
};
