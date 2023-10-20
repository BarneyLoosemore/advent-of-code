import BigNumber from 'https://unpkg.com/bignumber.js@latest/bignumber.mjs';

// const input = (await Deno.readTextFile('./input.txt')).split('\n\n');
const input = (await Deno.readTextFile('./sample.txt')).split('\n\n');

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
  const startingItems = startingItemsStr.match(/\d+/g);

  const [_, operationType, operationValue] = operationStr.match(
    /(\+|-|\*|\/) (\d+|\w+)/
  )!;

  // const operationFn = eval(
  //   `(old) => BigInt(old) ${operationType} BigInt(${operationValue})`
  // );

  // Need to coerce to `bigint` here so it's compatible with items with bigint sized worry levels
  const testNumber = testStr.match(/\d+/)?.[0];
  const trueCase = Number(trueCaseStr.match(/\d+/)?.[0]);
  const falseCase = Number(falseCaseStr.match(/\d+/)?.[0]);

  const operationFn = (old: string) => {
    const value = operationValue === 'old' ? old : operationValue;

    switch (operationType) {
      case '+':
        return new BigNumber(old).plus(new BigNumber(value)).toString();
      case '*':
        return new BigNumber(old).multipliedBy(value).toString();
    }
  };

  const testFunction = (item: string) => {
    if (!new BigNumber(item).modulo(testNumber).eq(0)) {
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

// type MonkeysState = typeof initialState;

const calculateNewMonkeysState = (
  currMonkeysState: {
    items: string[] | [];
    inspections: number;
  }[],
  thrownItems: [number, string][]
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
  item: string,
  operationFn: (old: string) => string,
  testFunction: (item: string) => number,
  divideWorryLevel?: boolean
) => {
  const newWorryLevel = operationFn(item);

  // / (divideWorryLevel ? 3n : 1n);

  const newMonkey = testFunction(newWorryLevel);

  // console.log('newWorryLevel', newWorryLevel);
  // console.log('newMonkey', newMonkey);
  return [newMonkey, newWorryLevel];
};

const getMonkeysStateAfterXRounds = (
  rounds: number,
  divideWorryLevel?: boolean
): {
  items: string[] | [];
  inspections: number;
}[] =>
  Array(rounds)
    .fill(0)
    .reduce((roundState, _round, index) => {
      console.log(index);
      return monkeys.reduce((monkeysState, curr, index) => {
        const [_, operationFn, testFunction] = curr;
        const thrownItems = monkeysState[index].items.map((item: string) =>
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

const calculateMonkeyBusinessLevel = (monkeysState) => {
  const inspections = monkeysState.map(({ inspections }) => inspections);
  const [mostInspections, secondMostInspections] = [...inspections].sort(
    (a, b) => b - a
  );
  return mostInspections * secondMostInspections;
};

// const twentyRoundMonkeysState = getMonkeysStateAfterXRounds(20, true);
// console.log('Task 1: ' + calculateMonkeyBusinessLevel(twentyRoundMonkeysState));

const tenThousandRoundMonkeysState = getMonkeysStateAfterXRounds(1000);
console.log(tenThousandRoundMonkeysState);
// const inspections = tenThousandRoundmonkeysState.map(
//   ({ inspections }) => inspections
// );
// console.log(
//   'Task 2: ' + calculateMonkeyBusinessLevel(tenThousandRoundMonkeysState)
// );
