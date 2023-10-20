const input = (await Deno.readTextFile('./input.txt')).split('\n\n');
// const input = (await Deno.readTextFile('./sample.txt')).split('\n\n');

const divisors = input.map((line) => {
  const testStr = line.split('\n')[3];
  return Number(testStr.match(/\d+/)?.[0]);
});

const parseMonkeyInput = (input: string) => {
  const lines = input.split('\n');
  const [
    monkeyNumberStr,
    startingItemsStr,
    operationStr,
    testStr,
    trueCaseStr,
    falseCaseStr,
  ] = lines;
  const startingItems = startingItemsStr.match(/\d+/g)?.map(Number);

  const monkeyNumber = Number(monkeyNumberStr.match(/\d+/)?.[0]);

  const operationExpression = operationStr.match(
    /old (\+|-|\*|\/) (\d+|\w+)/
  )?.[0];
  const operationFn = eval(`(old) => ${operationExpression}`);

  const testNumber = divisors[monkeyNumber];
  const trueCase = Number(trueCaseStr.match(/\d+/)?.[0]);
  const falseCase = Number(falseCaseStr.match(/\d+/)?.[0]);

  const testFunction = (remainders: number[]) => {
    const newRemainders = remainders.map(
      (remainder, index) => remainder % divisors[index]
    );

    const remainderForCurrentMonkey = newRemainders[monkeyNumber];
    if (remainderForCurrentMonkey !== 0) {
      return [falseCase, newRemainders];
    }
    return [trueCase, newRemainders];
  };
  return [startingItems, operationFn, testFunction, testNumber];
};

const monkeys = input.map(parseMonkeyInput);

const initialState = monkeys.map(([startingItems]) => ({
  items: startingItems.map((item: number) => Array(divisors.length).fill(item)),
  inspections: 0,
}));

type MonkeysState = typeof initialState;

const calculateNewMonkeysState = (
  currMonkeysState: MonkeysState,
  thrownItems: [number, number][]
) => {
  const newMonkeysState = currMonkeysState.map(
    ({ items, inspections }, index) => {
      const newItems = thrownItems
        .filter(([recipient]) => recipient === index)
        .map(([_, item]) => item);
      return { inspections, items: [...items, ...newItems] };
    }
  );

  return newMonkeysState;
};

const inspectItem = (
  remainders: number[],
  operationFn: (old: number) => number,
  testFunction: (remainders: number[]) => [number, number[]],
  divideWorryLevel?: boolean
) => {
  const newWorryLevels = remainders.map((remainder) =>
    divideWorryLevel
      ? Math.floor(operationFn(remainder) / 3)
      : operationFn(remainder)
  );

  const [newMonkey, remainder] = testFunction(newWorryLevels);

  return [newMonkey, remainder];
};

const getMonkeysStateAfterXRounds = (
  rounds: number,
  divideWorryLevel?: boolean
): MonkeysState =>
  Array(rounds)
    .fill(0)
    .reduce((roundState, _round) => {
      return monkeys.reduce((monkeysState, curr, index) => {
        const [_, operationFn, testFunction] = curr;
        const thrownItems = monkeysState[index].items.map((item: number[]) =>
          inspectItem(item, operationFn, testFunction, divideWorryLevel)
        );

        const currentInspections = monkeysState[index].inspections;
        const newInspections = monkeysState[index].items.length;

        const newMonkeyState = {
          items: [],
          inspections: currentInspections + newInspections,
        };

        const newMonkeysState = calculateNewMonkeysState(
          monkeysState,
          thrownItems
        );

        return newMonkeysState.map((monkeyState, monkeyIndex) => {
          if (monkeyIndex === index) {
            return newMonkeyState;
          }
          return monkeyState;
        });
      }, roundState);
    }, initialState);

const calculateMonkeyBusinessLevel = (monkeysState: MonkeysState) => {
  const inspections = monkeysState.map(({ inspections }) => inspections);
  const [mostInspections, secondMostInspections] = [...inspections].sort(
    (a, b) => b - a
  );
  return mostInspections * secondMostInspections;
};

const twentyRoundMonkeysState = getMonkeysStateAfterXRounds(20, true);
const tenThousandRoundMonkeysState = getMonkeysStateAfterXRounds(10000);

console.log('Task 1: ' + calculateMonkeyBusinessLevel(twentyRoundMonkeysState));
console.log(
  'Task 2: ' + calculateMonkeyBusinessLevel(tenThousandRoundMonkeysState)
);
