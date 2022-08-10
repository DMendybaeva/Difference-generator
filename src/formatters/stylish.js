const EMPTY = '    ';
const PLUS = '  + ';
const MINUS = '  - ';

const makeString = (arr) => `{\n${arr.join('\n')}\n}`;

const getFormattedData = (nodes) => {
  const iter = (node) => {
    const { type } = node;
    switch (type) {
      case 'added': {
        const { key, value } = node;
        return [PLUS, `${key}: `, `${value}`].join('');
      }
      case 'remove': {
        const { key, value } = node;
        return [MINUS, `${key}: `, `${value}`].join('');
      }
      case 'changed': {
        const { key, valuesObj: { oldValue, newValue } } = node;
        const oldValueString = [MINUS, `${key}: `, `${oldValue}`].join('');
        const newValueString = [PLUS, `${key}: `, `${newValue}`].join('');
        return [oldValueString, newValueString].join('\n');
      }
      case 'unchanged': {
        const { key, value } = node;
        return [EMPTY, `${key}: `, `${value}`].join('');
      }
      default:
        throw new Error(`Unknown state ${type}`);
    }
  };
  const outputArr = nodes.map((node) => iter(node));
  return makeString(outputArr);
};
export default getFormattedData;
