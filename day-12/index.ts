const input = (await Deno.readTextFile('./input.txt')).split('\n');
const parsedInput = input.map((line) => line.split(''));

const getCharCode = (char: string) => {
  if (char === 'S') return 'a'.charCodeAt(0);
  if (char === 'E') return 'z'.charCodeAt(0);
  return char?.charCodeAt(0);
};

const isPossibleMove = (char: string, adjacentChar: string) => {
  const charCode = getCharCode(char);
  const adjacentCharCode = getCharCode(adjacentChar);

  if (!adjacentCharCode) return false;
  return charCode >= adjacentCharCode - 1;
};

const calculateIndex = (x: number, y: number) => x + y * parsedInput[0].length;

const possibleMovesGraph = parsedInput.reduce((graph, row, y) => {
  return {
    ...graph,
    ...row.reduce((acc, char, x) => {
      const possibleMoves = [];

      const [up, down, left, right] = [
        parsedInput[y - 1]?.[x],
        parsedInput[y + 1]?.[x],
        parsedInput[y][x - 1],
        parsedInput[y][x + 1],
      ];

      if (isPossibleMove(char, up)) {
        possibleMoves.push(calculateIndex(x, y - 1));
      }
      if (isPossibleMove(char, down)) {
        possibleMoves.push(calculateIndex(x, y + 1));
      }
      if (isPossibleMove(char, left)) {
        possibleMoves.push(calculateIndex(x - 1, y));
      }
      if (isPossibleMove(char, right)) {
        possibleMoves.push(calculateIndex(x + 1, y));
      }

      return { ...acc, [calculateIndex(x, y)]: possibleMoves };
    }, {}),
  };
}, {}) as { [key: string]: [] | number[] };

const startPosition = input.join('').indexOf('S');
const goalPosition = input.join('').indexOf('E');

const solve = (startNode: number) => {
  const queue = [startNode];
  const visited = [];
  visited[startNode] = true;

  const prev = [startNode];

  while (queue.length) {
    const currentNode = queue.shift()!;
    const neighbors = possibleMovesGraph[currentNode];

    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        queue.push(neighbor);
        visited[neighbor] = true;
        prev[neighbor] = currentNode;
      }
    }
  }
  return prev;
};

const reconstructPath = (
  startNode: number,
  endNode: number,
  prev: number[]
) => {
  const path = [];
  let currentNode = endNode;

  while (prev.length > path.length) {
    path.push(currentNode);
    currentNode = prev[currentNode];
    if (currentNode === startNode) break;
  }
  path.push(startNode);
  path.reverse();
  path.pop(); // don't want to include the end node as part of the route move count
  if (path[0] === startNode) return path;
  return [];
};

const breadthFirstSearch = (startNode: number, endNode: number) => {
  if (possibleMovesGraph[startNode].length === 0) return []; // no possible moves from start node, so return an empty array and use this in filter later
  const prev = solve(startNode);
  return reconstructPath(startNode, endNode, prev);
};

// Part 1
const optimalRouteLength = breadthFirstSearch(
  startPosition,
  goalPosition
).length;

console.log('Part 1: ' + optimalRouteLength);

// Part 2
const getAllLowPoints = (input: string[]) => {
  // get all 'a' characters in the input string, as well as their corresponding indexes
  const lowPoints = [];
  const inputString = input.join('');
  const regex = /a/g;
  let match;
  while ((match = regex.exec(inputString))) {
    lowPoints.push(match.index);
  }
  return lowPoints;
};

const lowPoints = getAllLowPoints(input);

const getLowPointRouteDistances = (lowPoints: number[]) =>
  lowPoints
    .map((lowPoint) => breadthFirstSearch(lowPoint, goalPosition).length)
    .filter(Boolean);

const shortestLowPointRouteLength = Math.min(
  ...getLowPointRouteDistances(lowPoints)
);

console.log('Part 2: ' + shortestLowPointRouteLength);
