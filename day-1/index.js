const fs = require('fs');

function sumStringArray(array) {
  return array.reduce((a, b) => Number(a) + Number(b));
}

function calculateHighestCalorieCount(rawCalorieData) {
  const elfCaloriesArray = rawCalorieData.split('\n');
  const elfCaloriesArraySplitIndexes = elfCaloriesArray
    .map((string, index) => string === '' && index)
    .filter(Boolean);

  const elfCalorieTotals = elfCaloriesArraySplitIndexes.map(
    (splitIndex, index) => {
      const previousSplitIndex = elfCaloriesArraySplitIndexes[index - 1] ?? 0;
      return sumStringArray(
        elfCaloriesArray.slice(previousSplitIndex, splitIndex)
      );
    }
  );

  return Math.max(...elfCalorieTotals);
}

fs.readFile('input.json', 'utf-8', (_, data) =>
  console.log(calculateHighestCalorieCount(data))
);
