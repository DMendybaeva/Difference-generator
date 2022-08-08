import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';

const EMPTY = '    ';
const PLUS = '  + ';
const MINUS = '  - ';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);

const createObjFromFile = (filepath, ext) => getParser(fs.readFileSync(getFilePath(filepath)), ext);

const genDiff = (filepath1, filepath2) => {
  const file1ext = path.extname(filepath1);
  const file1Obj = createObjFromFile(filepath1, file1ext);

  const file2ext = path.extname(filepath2);
  const file2Obj = createObjFromFile(filepath2, file2ext);

  const objKeys = Object.keys({ ...file1Obj, ...file2Obj }).sort();
  const result = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key of objKeys) {
    if (_.has(file1Obj, key) && _.has(file2Obj, key)) {
      if (file1Obj[key] === file2Obj[key]) {
        result.push([EMPTY, `${key}: `, `${file1Obj[key]}`].join(''));
      } else if (file1Obj[key] !== file2Obj[key]) {
        result.push([MINUS, `${key}: `, `${file1Obj[key]}`].join(''));
        result.push([PLUS, `${key}: `, `${file2Obj[key]}`].join(''));
      }
    } else if (!_.has(file1Obj, key)) {
      result.push([PLUS, `${key}: `, `${file2Obj[key]}`].join(''));
    } else if (!_.has(file2Obj, key)) {
      result.push([MINUS, `${key}: `, `${file1Obj[key]}`].join(''));
    }
  }
  const resultString = `{\n${result.join('\n')}\n}`;
  return resultString;
};

export default genDiff;
