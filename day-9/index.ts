// Sample input
// const input = `R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`.split('\n');

// Random input
// const input = `R 3
// D 3
// L 3
// R 1
// U 3
// U 3
// L 2
// L 3
// R 3
// R 2
// D 2
// U 2
// D 3
// U 2
// L 1`.split('\n');

// Real input
const input = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(Boolean);

const parseInput = (input: string[]) =>
  input.map((command) =>
    command.match(/([RLUD]) (\d+)/)!.slice(1, 3)
  ) as unknown as ['R' | 'L' | 'U' | 'D', number][];

const getInitialPosition = (state: string[][]) => {
  const vIndex = state.findIndex((row) => row.includes('H'));
  const hIndex = state[vIndex].indexOf('H');
  return { vIndex, hIndex };
};

const visited = new Set<string>();
const currentHPos = { vIndex: 0, hIndex: 0 };
const currentTPos = { vIndex: 0, hIndex: 0 };

const positions = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

const move = (direction: 'R' | 'L' | 'U' | 'D') => {
  const isVerticallyInLineWithT = currentHPos.vIndex === currentTPos.vIndex;
  const isHorizontallyInLineWithT = currentHPos.hIndex === currentTPos.hIndex;

  const isRightOfT = currentHPos.hIndex > currentTPos.hIndex;
  const isLeftOfT = currentHPos.hIndex < currentTPos.hIndex;

  const isBelowT = currentHPos.vIndex > currentTPos.vIndex;
  const isAboveT = currentHPos.vIndex < currentTPos.vIndex;

  switch (direction) {
    case 'R': {
      if (isRightOfT) {
        currentHPos.hIndex += 1;
        currentTPos.hIndex += 1;
        if (!isVerticallyInLineWithT) {
          currentTPos.vIndex = currentHPos.vIndex;
        }
      }
      if (isLeftOfT || isHorizontallyInLineWithT) {
        currentHPos.hIndex += 1;
      }
      break;
    }

    case 'L': {
      if (isLeftOfT) {
        currentHPos.hIndex -= 1;
        currentTPos.hIndex -= 1;
        if (!isVerticallyInLineWithT) {
          currentTPos.vIndex = currentHPos.vIndex;
        }
      }
      if (isRightOfT || isHorizontallyInLineWithT) {
        currentHPos.hIndex -= 1;
      }
      break;
    }

    case 'D': {
      if (isBelowT) {
        currentHPos.vIndex += 1;
        currentTPos.vIndex += 1;
        if (!isHorizontallyInLineWithT) {
          currentTPos.hIndex = currentHPos.hIndex;
        }
      }
      if (isAboveT || isVerticallyInLineWithT) {
        currentHPos.vIndex += 1;
      }
      break;
    }

    case 'U': {
      if (isAboveT) {
        currentHPos.vIndex -= 1;
        currentTPos.vIndex -= 1;
        if (!isHorizontallyInLineWithT) {
          currentTPos.hIndex = currentHPos.hIndex;
        }
      }
      if (isBelowT || isVerticallyInLineWithT) {
        currentHPos.vIndex -= 1;
      }
    }
  }
  visited.add(`${currentTPos.vIndex},${currentTPos.hIndex}`);
};
const createGrid = () => {
  const grid = initialState.map((row, columnIndex) => {
    return row
      .join('')
      .replace(/H|T/g, '.')
      .split('')
      .map((char, index) => {
        return visited.has(`${columnIndex},${index}`) ? '#' : char;
      });
  });
  grid[currentHPos.vIndex][currentHPos.hIndex] = 'H';
  grid[currentTPos.vIndex][currentTPos.hIndex] = 'T';
  return grid;
};

for (const [direction, distance] of parseInput(input)) {
  for (let i = 0; i < Number(distance); i++) {
    move(direction);
  }
}

console.log('Visited: ' + visited.size);
