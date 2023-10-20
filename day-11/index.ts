const input = (await Deno.readTextFile('./input.txt')).split('\n\n');
// const input = (await Deno.readTextFile('./sample.txt')).split('\n\n');

const parseMonkeyInput = (input: string) => {
  const lines = input.split('\n');
  const [
    _monkeyNumber,
    startingItemsStr,
    operationStr,
    testStr,
    trueCaseStr,
    falseCaseStr,
  ] = lines;
  const startingItems = startingItemsStr.match(/\d+/g)?.map(Number);

  const operationExpression = operationStr.match(
    /old (\+|-|\*|\/) (\d+|\w+)/
  )?.[0];
  const operationFn = eval(`(old) => ${operationExpression}`);

  const testNumber = Number(testStr.match(/\d+/)?.[0]);
  const trueCase = Number(trueCaseStr.match(/\d+/)?.[0]);
  const falseCase = Number(falseCaseStr.match(/\d+/)?.[0]);

  const testFunction = (item: number) => {
    if (item % testNumber !== 0) {
      return falseCase;
    }
    return trueCase;
  };
  return [startingItems, operationFn, testFunction];
};

const monkeys = input.map(parseMonkeyInput);

const initialState = monkeys.map(([startingItems]) => ({
  items: startingItems,
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
  item: number,
  operationFn: (old: number) => number,
  testFunction: (item: number) => number
) => {
  const newWorryLevel = Math.floor(operationFn(item) / 3);
  const newMonkey = testFunction(newWorryLevel);

  return [newMonkey, newWorryLevel];
};

const getMonkeysStateAfterXRounds = (rounds: number): MonkeysState =>
  Array(rounds)
    .fill(0)
    .reduce((roundState, _round) => {
      return monkeys.reduce((monkeysState, curr, index) => {
        const [_, operationFn, testFunction] = curr;
        const thrownItems = monkeysState[index].items.map((item: number) =>
          inspectItem(item, operationFn, testFunction)
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

const twentyRoundMonkeysState = getMonkeysStateAfterXRounds(20);

console.log('Task 1: ' + calculateMonkeyBusinessLevel(twentyRoundMonkeysState));
