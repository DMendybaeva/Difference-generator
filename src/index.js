import _ from 'lodash';
import getParser from './parsers.js';
import getFormattedData from './formatters/stylish.js';

const createObjFromFile = (filepath) => getParser(filepath);

const isNested = (obj) => _.isPlainObject(obj);

const genDiff = (filepath1, filepath2) => {
  const file1Obj = createObjFromFile(filepath1);

  const file2Obj = createObjFromFile(filepath2);

  const iter = (obj1, obj2) => {
    const objKeys = Object.keys({ ...file1Obj, ...file2Obj }).sort();
    return objKeys.map((key) => {
      if (!_.has(file1Obj, key)) {
        return { key, type: 'added', value: file2Obj[key] };
      }
      if (!_.has(file2Obj, key)) {
        return { key, type: 'remove', value: file1Obj[key] };
      }
      if (isNested(obj1[key], obj2[key])) {
        return { key, type: 'nested', children: iter(obj1[key], obj2[key]) };
      }
      return file1Obj[key] === file2Obj[key]
        ? { key, type: 'unchanged', value: file1Obj[key] }
        : { key, type: 'changed', valuesObj: { oldValue: obj1[key], newValue: obj2[key] } };
    });
  };
  const nodes = iter(file1Obj, file2Obj);
  return getFormattedData(nodes);
};

export default genDiff;
