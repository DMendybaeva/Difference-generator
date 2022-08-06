import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { test, expect, describe } from '@jest/globals';

import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('test gendiff', () => {
  test('common case', () => {
    const file1path = getFixturePath('file1.json');
    const file2path = getFixturePath('file2.json');
    const expectedResult = String(fs.readFileSync(getFixturePath('expected.txt')));

    expect(genDiff(file1path, file2path)).toEqual(expectedResult);
  });
  test('empty', () => {
    const emptyFile1Path = getFixturePath('empty1.json');
    const emptyFile2Path = getFixturePath('empty2.json');
    expect(genDiff(emptyFile1Path, emptyFile2Path)).toEqual([]);
  });
});
