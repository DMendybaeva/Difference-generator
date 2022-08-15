import isObject from 'lodash/isObject.js';

const SPACER = ' ';
const INDENT = 4;

const generateSpace = (size) => SPACER.repeat(size);

const makeFlatString = (key, value, spaceSize, sign = '') => {
  const dataString = sign ? `${sign} ${key}: ${value}` : `${key}: ${value}`;
  return [generateSpace(spaceSize), dataString].join('');
};
const makeNestedString = (flatStringsArr, spaceSize = 0) => [
  '{',
  flatStringsArr.join('\n'),
  `${generateSpace(spaceSize)}}`,
].join('\n');

const stringifyValue = (value, spaceSize) => {
  if (isObject(value) && !Array.isArray(value)) {
    const arr = Object.entries(value)
      .map(([key, val]) => {
        const nestedVal = stringifyValue(val, spaceSize + INDENT);
        return makeFlatString(key, nestedVal, spaceSize);
      });
    return makeNestedString(arr, spaceSize - INDENT);
  }
  return value;
};

const getFormattedData = (nodes) => {
  const iter = ({
    type, key, value, valuesObj, children,
  }, spaceSize = 4) => {
    switch (type) {
      case 'added': {
        return makeFlatString(key, stringifyValue(value, spaceSize + INDENT), spaceSize - INDENT / 2, '+');
      }
      case 'removed': {
        return makeFlatString(key, stringifyValue(value, spaceSize + INDENT), spaceSize - INDENT / 2, '-');
      }
      case 'nested': {
        const childrenArr = children.map((child) => iter(child, spaceSize + INDENT));
        const nestedValue = makeNestedString(childrenArr, spaceSize);
        return makeFlatString(key, nestedValue, spaceSize);
      }
      case 'unchanged': {
        return makeFlatString(key, stringifyValue(value, spaceSize + INDENT), spaceSize);
      }
      case 'changed': {
        const { oldValue, newValue } = valuesObj;
        return [
          makeFlatString(key, stringifyValue(oldValue, spaceSize + INDENT), spaceSize - INDENT / 2, '-'),
          makeFlatString(key, stringifyValue(newValue, spaceSize + INDENT), spaceSize - INDENT / 2, '+'),
        ].join('\n');
      }
      default:
        return null;
    }
  };

  const outputArr = nodes.map((node) => iter(node));
  return makeNestedString(outputArr);
};
export default getFormattedData;
