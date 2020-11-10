const mdLinks = require('../lib/index.js');
const searchLinks = require('../lib/index.js');
const axios = require ('axios');
const path = require('path');
const mockFilePath = path.resolve('./prueba.md');

jest.mock('axios');

describe('mdLinks', () => {

  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
    console.log('OK, this is a function');
  });


it('Array with md files', () => {
  return mdLinks(mockFilePath, {validate:false, stats:false}).then((res) =>{
    expect(res).toStrictEqual(searchLinks);
  });
});
});
