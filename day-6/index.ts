const input = (await Deno.readTextFile('input.txt')).split('');

const findMarker = (input: string[], windowSize: number) =>
  input.reduce((acc, _, index) => {
    const characterSet = new Set([...input.slice(index - windowSize, index)]);
    if (characterSet.size === windowSize && !(acc > 0)) return index;
    return acc;
  }, 0);

console.log('Task 1 result: ' + findMarker(input, 4));
console.log('Task 2 result: ' + findMarker(input, 14));
