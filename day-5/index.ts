const executeSteps = (
  allStacks: string[][],
  steps: number[][],
  retainMovingCratesOrder: boolean
): string[][] => {
  // If no steps left, return the resultant state of the stacks
  if (!steps.length) {
    return allStacks;
  }

  const [crateNumber, cratesToMoveStack, targetStack] = steps[0];

  const stepResult = allStacks.map((currentStack, index) => {
    const stackNumber = index + 1;
    if (stackNumber === cratesToMoveStack) {
      return currentStack.slice(crateNumber);
    }
    if (stackNumber === targetStack) {
      const movingCrates = allStacks[cratesToMoveStack - 1].slice(
        0,
        crateNumber
      );
      return [
        ...(retainMovingCratesOrder ? movingCrates : movingCrates.reverse()),
        ...currentStack,
      ];
    }
    return currentStack;
  });

  // If steps left, execute next step by providing the recursive function the steps array minus previous step
  return executeSteps(stepResult, steps.slice(1), retainMovingCratesOrder);
};

const getSteps = (input: string): number[][] =>
  input
    .split('\n')
    .filter(Boolean)
    .map(
      (stepString): number[] =>
        stepString
          .match(/move (\d+) from (\d+) to (\d+)/)
          ?.slice(1)
          .map(Number)!
    );

const transposeStacks = (arr: string[]): string[][] => {
  const [stacks, stackNumbers] = [
    arr.slice(0, arr.length - 1),
    arr[arr.length - 1],
  ];

  return stackNumbers
    .split(' ')
    .filter(Boolean)
    .map((stackNumber) =>
      stacks
        .map((row) => row[stackNumbers.indexOf(stackNumber)])
        .filter((str) => str !== ' ')
    );
};

const formatStackInput = (rawInput: string): string[][] => {
  const stackString = rawInput.split('\n').filter(Boolean);
  return transposeStacks(stackString);
};

const formatInput = (input: string): [string[][], number[][]] => {
  const [rawStackInput, rawStepInput] = input.split('\n\n');
  return [formatStackInput(rawStackInput), getSteps(rawStepInput)];
};

const produceStackTopMessage = (stacks: string[][]): string =>
  stacks.reduce((a, b) => `${a}${b[0]}`, '');

// Run with input!
const [stacks, steps] = formatInput(await Deno.readTextFile('./input.txt'));
const rearrangedStacks = executeSteps(stacks, steps, false);
const rearrangedStacksRetainedOrder = executeSteps(stacks, steps, true);

const stackTopMessage = produceStackTopMessage(rearrangedStacks);
const retainedOrderStackTopMessage = produceStackTopMessage(
  rearrangedStacksRetainedOrder
);

console.log('Task 1: ' + stackTopMessage);
console.log('Task 2: ' + retainedOrderStackTopMessage);
