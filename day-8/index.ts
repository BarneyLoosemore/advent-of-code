const input = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(Boolean)
  .map((arr) => arr.split('').map(Number));

const columnLength = input.length;
const rowLength = input[0].length;
const exteriorTrees = columnLength * 2 + rowLength * 2 - 4;

const calcVisibleTrees = (treeGrid: number[][]) =>
  treeGrid.reduce(
    (visibleTreesSum: number, currentTreeRow: number[], rowIndex: number) => {
      // if row is at the top or bottom of the grid, it's visible, so just return the current sum
      if (rowIndex === 0 || rowIndex === columnLength - 1) {
        return visibleTreesSum;
      }

      const visibleRowTrees = currentTreeRow.reduce(
        (rowVisibleTreesSum, currentTree, treeIndex) => {
          // if tree is on the edge of the grid, it's visible, so just return the current sum
          if (treeIndex === 0 || treeIndex === rowLength - 1) {
            return rowVisibleTreesSum;
          }

          // ABOVE: check all trees in previous arrays with the same index, return true if no tree >= current tree
          const visibleAbove = treeGrid
            .slice(0, rowIndex)
            .every((row) => currentTree > row[treeIndex]);

          // LEFT: check all trees in the currentTreeRow(0, index) slice, return true if no tree >= current tree
          const visibleLeft = currentTreeRow
            .slice(0, treeIndex)
            .every((tree) => currentTree > tree);

          // RIGHT: check all trees in the currentTreeRow(0, index) slice, return true if no tree >= current tree
          const visibleRight = currentTreeRow
            .slice(treeIndex + 1, currentTreeRow.length)
            .every((tree) => currentTree > tree);

          // BELOW: check all trees in next arrays with the same index, return true if no tree >= current tree
          const visibleBelow = treeGrid
            .slice(rowIndex + 1, treeGrid.length)
            .every((row) => currentTree > row[treeIndex]);

          // If visible from some angle, return the current sum + 1
          if (visibleAbove || visibleLeft || visibleRight || visibleBelow) {
            return rowVisibleTreesSum + 1;
          }

          // If not visible from any angle, return the current sum
          return rowVisibleTreesSum;
        },
        0
      );
      return visibleTreesSum + visibleRowTrees;
    },
    0
  );

// Get a reducer that will return the number of trees visible in a particular direction for a given tree
const getScenicScoreReducer =
  (tree: number, treeIndex: number) =>
  (
    treesVisible: number,
    currentValue: number[] | number,
    index: number,
    arr: number[][] | number[]
  ) => {
    const comparisonTree = Array.isArray(currentValue)
      ? // if the current value is an array, that means it's a row of trees as we're reducing the entire tree grid, so get the tree at same index as current tree in the row
        currentValue[treeIndex]
      : // otherwise, we're reducing a row, so the current value is just a single tree
        currentValue;

    // if we're at the end of the array, return the current trees visible + 1. This is so we don't miss adding a visible tree if a comparisonTree >= tree was found
    if (index === arr.length - 1) return treesVisible + 1;

    // if the treesVisible accumulator hasn't kept pace with the item index, this means a comparisonTree >= tree was found and we returned treesVisible without incrementing
    if (treesVisible !== index) return treesVisible;

    // if a comparisonTree >= tree is found, return the current trees visible. This prevent incrementing the treesVisible accumulator for any trees < the current tree after this find
    if (comparisonTree >= tree) return treesVisible;

    // otherwise, no comparisonTree >= tree has been found, so increment the number of trees visible!
    return treesVisible + 1;
  };

const calcHighestScenicScore = (treeGrid: number[][]) =>
  treeGrid.reduce(
    (
      highestScenicScore: number,
      currentTreeRow: number[],
      rowIndex: number
    ) => {
      const highestScenicScoreForRow = currentTreeRow.reduce(
        (highestScenicScoreForTree, currentTree, treeIndex) => {
          const scenicScoreReducer = getScenicScoreReducer(
            currentTree,
            treeIndex
          );

          const treesVisibleAbove = treeGrid
            .slice(0, rowIndex)
            .reverse()
            .reduce(scenicScoreReducer, 0);

          const treesVisibleLeft = currentTreeRow
            .slice(0, treeIndex)
            .reverse()
            .reduce(scenicScoreReducer, 0);

          const treesVisibleRight = currentTreeRow
            .slice(treeIndex + 1, currentTreeRow.length)
            .reduce(scenicScoreReducer, 0);

          const treesVisibleBelow = treeGrid
            .slice(rowIndex + 1, treeGrid.length)
            .reduce(scenicScoreReducer, 0);

          const scenicScore =
            treesVisibleAbove *
            treesVisibleLeft *
            treesVisibleRight *
            treesVisibleBelow;

          if (scenicScore > highestScenicScoreForTree) {
            return scenicScore;
          }
          return highestScenicScoreForTree;
        },
        0
      );

      if (highestScenicScoreForRow > highestScenicScore) {
        return highestScenicScoreForRow;
      }
      return highestScenicScore;
    },
    0
  );

const visibleTrees = calcVisibleTrees(input) + exteriorTrees;
const highestScenicScore = calcHighestScenicScore(input);

console.log('Task 1 result: ' + visibleTrees);
console.log('Task 2 result: ' + highestScenicScore);
