const input = (await Deno.readTextFile('./input.txt')).split('\n');

const cycles = input.reduce((acc: number[], curr: string) => {
  if (curr.includes('addx')) {
    const [_, increment] = curr.split(' ');
    return [...acc, 0, Number(increment)];
  }
  return [...acc, 0];
}, []);

const getValueAtCycle = (cycleNum: number) =>
  cycles.slice(0, cycleNum - 1).reduce((acc, curr) => acc + curr, 1);

const cycleSum = [20, 60, 100, 140, 180, 220].reduce(
  (acc, curr) => acc + getValueAtCycle(curr) * curr,
  0
);

console.log('Task 1: ' + cycleSum);

const getPixelsForCycle = (
  cycleStart: number,
  cycleEnd: number,
  prevSpritePos: number
) =>
  cycles.slice(cycleStart, cycleEnd).reduce(
    ({ pixelNum, spritePos, imageSection }, curr) => {
      const doesSpriteIntersect =
        spritePos <= pixelNum && pixelNum <= spritePos + 2; // does the 3 pixel wide sprite intersect with the pixel currently being drawn?

      return {
        pixelNum: pixelNum + 1,
        spritePos: spritePos + curr,
        imageSection: imageSection + (doesSpriteIntersect ? '#' : '.'),
      };
    },
    { pixelNum: 0, spritePos: prevSpritePos, imageSection: '' }
  );

const { image } = [0, 40, 80, 120, 160, 200].reduce(
  (acc: { image: string[]; prevSpritePos: number }, cycleStart: number) => {
    const { spritePos, imageSection } = getPixelsForCycle(
      cycleStart,
      cycleStart + 40,
      acc.prevSpritePos
    );
    return {
      prevSpritePos: spritePos,
      image: [...acc.image, imageSection],
    };
  },
  { prevSpritePos: 0, image: [] }
);

console.log('\n');
console.log('Task 2: ');
console.log('\n');
console.log(image.join('\n'));
console.log('\n');
