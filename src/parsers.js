import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';

const getParser = (file, ext) => {
  switch (ext) {
    case '.json':
      return JSON.parse(file);
    case '.yaml':
      return yaml.load(file);
    case '.yml':
      return yaml.load(file);
    default:
      throw new Error(`Unknown file format: ${ext}`);
  }
};
export default getParser;
