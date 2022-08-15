import isObject from 'lodash/isObject.js';
import getParser from './parsers.js';
import getFormattedData from './formatters/index.js';

const checkChildren = (val1, val2) => (
  (isObject(val1) && !Array.isArray(val1)) && (isObject(val2) && !Array.isArray(val2))
);

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const fileObj1 = getParser(filepath1);
  const fileObj2 = getParser(filepath2);

  const iter = (obj1, obj2) => {
    const keys = Object.keys({ ...obj1, ...obj2 }).sort();
    return keys.map((key) => {
      if (!Object.hasOwn(obj1, key)) {
        return { key, type: 'added', value: obj2[key] };
      }
      if (!Object.hasOwn(obj2, key)) {
        return { key, type: 'removed', value: obj1[key] };
      }
      const isChildren = checkChildren(obj1[key], obj2[key]);
      if (isChildren) {
        return { key, type: 'nested', children: iter(obj1[key], obj2[key]) };
      }
      return obj1[key] === obj2[key]
        ? { key, type: 'unchanged', value: obj1[key] }
        : { key, type: 'changed', valuesObj: { oldValue: obj1[key], newValue: obj2[key] } };
    });
  };
  const nodes = iter(fileObj1, fileObj2);
  return getFormattedData(nodes, format);
};

export default genDiff;
