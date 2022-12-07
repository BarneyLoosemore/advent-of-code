const input = (await Deno.readTextFile('./input.txt')).split('\n');
const ROOT_DIR = '/';

/** Find the sum of all files and directories within a parent directory */
const findTotal = (directory: any): number =>
  Object.entries(directory).reduce((acc, [key, val]: [string, any]) => {
    if (key === 'size') return acc + val;
    return typeof val === 'object' ? acc + findTotal(val) : acc;
  }, 0);

/** 
  Recursive function to find the sum of all directories less than 100k
  Is called with all child directories down the tree 
*/
const calculateDirSizes = (directory: any, spaceNeeded: number): void => {
  const directoryTotal = findTotal(directory);
  if (directoryTotal < 100000) lt100kDirSum += directoryTotal;

  if (directoryTotal > spaceNeeded && directoryTotal < smallestDirToDeleteSum) {
    smallestDirToDeleteSum = directoryTotal;
  }

  Object.entries(directory)
    .filter(([key]) => key !== 'size')
    .forEach(([_, val]) => {
      calculateDirSizes(val, spaceNeeded);
    });
};

const calculateSpaceNeeded = (): number => {
  const rootTotal = findTotal(directoryStructure);
  const freeSpace = 70000000 - rootTotal;
  return 30000000 - freeSpace;
};

const getNestedValueByPath = (obj: any, path: string[]) =>
  path.reduce((nestedObj, key) => nestedObj?.[key] ?? null, obj);

const setNestedObject = (object: any, path: string[], value: any) =>
  path.reduce(
    (nestedObj, key, i) =>
      (nestedObj[key] = path.length - 1 === i ? value : nestedObj[key] || {}),
    object
  );

const getOutput = (input: string) => {
  const [_, targetDirectory] = input.match(/cd\s(\w+)/) ?? [];
  const [fileSize] = input.match(/(\d+)/) ?? [];
  const moveUpOne = input.match(/cd (\..*)/);
  return [targetDirectory, fileSize, moveUpOne];
};

const determineDirectoryStructure = () => {
  for (const line of input) {
    const [targetDirectory, fileSize, moveUpOne] = getOutput(line);
    const isRootDirectory = cwd === ROOT_DIR;

    // if terminal input/output is `cd ..`, move up one directory in `cwd`
    if (moveUpOne) {
      cwd = cwd.split('/').slice(0, -2).join('/') + '/';
      continue;
    }

    // if terminal input/output is not `cd` or a file, skip
    if (!targetDirectory && !fileSize) {
      continue;
    }

    // if `cwd` is root and input/output is a file, add to root size
    if (isRootDirectory && fileSize) {
      directoryStructure.size += Number(fileSize ?? 0);
      continue;
    }

    // if input/output is to change directory, and this directory is not root, update `cwd`
    if (targetDirectory && targetDirectory !== ROOT_DIR) {
      cwd += `${targetDirectory}/`;
      continue;
    }

    const path = cwd.split('/').filter(Boolean);
    const nestedDirectory = getNestedValueByPath(directoryStructure, path);

    // if directory does not exist in `directoryStructure` object, create it
    if (!nestedDirectory) {
      setNestedObject(directoryStructure, path, {});
    }

    // if input/output is a file, add to `cwd` directory size in `directoryStructure`
    if (fileSize) {
      setNestedObject(directoryStructure, path, {
        ...nestedDirectory,
        size: (nestedDirectory?.size ?? 0) + Number(fileSize),
      });
      continue;
    }
  }
};

/** Yucky mutative state 🤮 */
const directoryStructure = { size: 0 };
let cwd = ROOT_DIR;
let lt100kDirSum = 0;

determineDirectoryStructure();

let smallestDirToDeleteSum = findTotal(directoryStructure);
const spaceNeeded = calculateSpaceNeeded();

calculateDirSizes(directoryStructure, spaceNeeded);

console.log('Task 1: ' + lt100kDirSum);
console.log('Task 2: ' + smallestDirToDeleteSum);
