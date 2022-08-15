import _ from 'lodash';

const stringifyValue = (val) => {
  if (_.isPlainObject(val)) {
    return '[complex value]';
  }
  if (_.isString(val)) {
    return `'${val}'`;
  }
  return val;
};

const getPlainFormat = (nodes) => {
  const iter = ({
    type, key, value, valuesObj, children,
  }, keysChain = []) => {
    const keysChainCopy = [...keysChain, key];
    const keyProp = keysChainCopy.join('.');
    switch (type) {
      case 'added':
        return `Property '${keyProp}' was added with value: ${stringifyValue(value)}`;
      case 'removed':
        return `Property '${keyProp}' was removed`;
      case 'nested':
        return children.flatMap((child) => iter(child, keysChainCopy));
      case 'changed': {
        const { oldValue, newValue } = valuesObj;
        return `Property '${keyProp}' was updated. From ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`;
      }
      case 'unchanged': {
        return null;
      }
      default:
        throw new Error(`Unknown state: ${type}`);
    }
  };

  return nodes.flatMap((node) => iter(node)).filter((line) => line !== null).join('\n');
};
export default getPlainFormat;
