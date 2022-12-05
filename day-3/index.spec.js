const solution = require('.');

const {
  partitionString,
  getDuplicateCharacter,
  getLetterPrioritySum,
  splitArrayEvery3rdItem,
  findCommonCharacter,
  getGroupBadgesSum,
} = solution;

describe('partitionString', () => {
  it('given a string, it should return an array with the first half and an array with the second half', () => {
    const result = partitionString('abcd');
    expect(result).toEqual(['ab', 'cd']);
  });
});

describe('getDuplicateCharacter', () => {
  it('given a string, it should return the only character that appears in both the first and second half', () => {
    const result = getDuplicateCharacter('abcb');
    expect(result).toEqual('b');
  });
});

const letterPriorityMap = { a: 1, b: 2 };

describe('getLetterPrioritySum', () => {
  it('given a set of strings, it should return the sum of duplicate character priorities in each string', () => {
    const result = getLetterPrioritySum(['abcb', 'AaBbac']);
    expect(result).toEqual(letterPriorityMap.b + letterPriorityMap.a);
  });
});

describe('splitArrayEvery3rdItem', () => {
  it('given an array, it should return an array of arrays, with each array containing 3 items', () => {
    const result = splitArrayEvery3rdItem([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });
});

describe('findCommonCharacter', () => {
  it('given an array of strings, it should return the character that appears in all 3 strings', () => {
    const result = findCommonCharacter(['abcd', 'eaf', 'hiadf']);
    expect(result).toEqual('a');
  });
});

describe('getGroupBadgesSum', () => {
  it('given a set of strings, it should return the sum of the priorities of the common character in each group of 3', () => {
    const result = getGroupBadgesSum([
      'abcd',
      'eaf',
      'hiadf',
      'abcb',
      'AaBbac',
      'bbb',
    ]);
    expect(result).toEqual(letterPriorityMap.a + letterPriorityMap.b);
  });
});
