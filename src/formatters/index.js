import getPlainFormat from './plain.js';
import getStylishFormat from './stylish.js';
import getJSONFormat from './json.js';

const getFormattedData = (data, format = 'stylish') => {
  switch (format) {
    case 'stylish':
      return getStylishFormat(data);
    case 'plain':
      return getPlainFormat(data);
    case 'json': {
      return getJSONFormat(data);
    }
    default:
      return null;
  }
};
export default getFormattedData;
