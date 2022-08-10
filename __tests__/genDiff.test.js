import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import {
  test,
  expect,
  describe,
  beforeAll,
} from '@jest/globals';

import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let expectedResult;
let emptyResult;

beforeAll(() => {
  expectedResult = String(fs.readFileSync(getFixturePath('expected.txt')));
  emptyResult = '{\n\n}';
});

describe('test gendiff', () => {
  test('.json', () => {
    const file1path = getFixturePath('file1.json');
    const file2path = getFixturePath('file2.json');

    expect(genDiff(file1path, file2path)).toEqual(expectedResult);
  });
  test('empty .json', () => {
    const emptyFile1Path = getFixturePath('empty1.json');
    const emptyFile2Path = getFixturePath('empty2.json');

    expect(genDiff(emptyFile1Path, emptyFile2Path)).toEqual(emptyResult);
  });
  test('.yaml', () => {
    const file1path = getFixturePath('file1.yaml');
    const file2path = getFixturePath('file2.yaml');

    expect(genDiff(file1path, file2path)).toEqual(expectedResult);
  });
  test('empty .yaml', () => {
    const file1path = getFixturePath('empty1.yaml');
    const file2path = getFixturePath('empty2.yaml');

    expect(genDiff(file1path, file2path)).toEqual(emptyResult);
  });
  test('.yml', () => {
    const file1path = getFixturePath('file1.yml');
    const file2path = getFixturePath('file2.yml');

    expect(genDiff(file1path, file2path)).toEqual(expectedResult);
  });
  test('empty .yml', () => {
    const file1path = getFixturePath('empty1.yml');
    const file2path = getFixturePath('empty2.yml');

    expect(genDiff(file1path, file2path)).toEqual(emptyResult);
  });
});
