const fs = require('fs');

function sumStringArray(array) {
  return array.reduce((a, b) => Number(a) + Number(b));
}

function calculateCalorieTotals(rawCalorieData) {
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

  return elfCalorieTotals;
}

function calculateMax(calorieTotals) {
  return Math.max(...calorieTotals);
}

function calculateTopCaloriesTotalSum(calorieTotals) {
  return calorieTotals
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b);
}

fs.readFile('input.json', 'utf-8', (_, data) => {
  const calorieTotals = calculateCalorieTotals(data);
  const topElfCalories = calculateMax(calorieTotals);
  console.log('Calorie sum held by Elf with most calories: ' + topElfCalories);

  const top3ElfCaloriesSum = calculateTopCaloriesTotalSum(calorieTotals);
  console.log(
    'Calorie sum held by top 3 Elves with most calories: ' + top3ElfCaloriesSum
  );
});
