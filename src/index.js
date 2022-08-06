import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);

const createObjFromFile = (filepath) => JSON.parse(fs.readFileSync(getFilePath(filepath)));

const genDiff = (filepath1, filepath2) => {
  const file1Obj = createObjFromFile(filepath1);
  const file2Obj = createObjFromFile(filepath2);
  const objKeys = Object.keys({ ...file1Obj, ...file2Obj }).sort();
  const result = [];

  const isObjEmpty = (obj) => Object.keys(obj).length === 0;

  if (isObjEmpty(file1Obj) && isObjEmpty(file2Obj)) {
    return [];
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of objKeys) {
    if (_.has(file1Obj, key) && _.has(file2Obj, key)) {
      if (file1Obj[key] === file2Obj[key]) {
        result.push(['  ', '  ', `${key}: `, `${file1Obj[key]}`].join(''));
      } else if (file1Obj[key] !== file2Obj[key]) {
        result.push(['  ', '- ', `${key}: `, `${file1Obj[key]}`].join(''));
        result.push(['  ', '+ ', `${key}: `, `${file2Obj[key]}`].join(''));
      }
    } else if (!_.has(file1Obj, key)) {
      result.push(['  ', '+ ', `${key}: `, `${file2Obj[key]}`].join(''));
    } else if (!_.has(file2Obj, key)) {
      result.push(['  ', '- ', `${key}: `, `${file1Obj[key]}`].join(''));
    }
  }
  const resultString = `{\n${result.join('\n')}\n}`;
  return resultString;
};

export default genDiff;
