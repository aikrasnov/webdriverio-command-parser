const {expect} = require('chai');
const {isDirectory, parseCmds} = require('../index');

describe('isDirectory', () => {
    it('should be directory', () => {
        const path = '/test/path/';
        expect(isDirectory(path)).to.be.true;
    });

    it('should not be directory', () => {
        const path = 'test/file';
        expect(isDirectory(path)).to.be.false;
    });

    describe('invalid path', () => {
        const INVALID = ['', 123, [], {}];

        for (const value of INVALID) {
            it('should throw exception', () => {
                expect(isDirectory.bind(isDirectory, value)).to.throw();
            });
        }
    });

});

describe('parseCmnds', () => {
    describe('arrow function', () => {
        const EXAMPLE = [
            ' .addCommand("testCustomCommand", async (selector,condition,count) => {',
            ' .addCommand("anotherone", async (selector,attributeType, condition, count) => {',
            ' .addCommand("addtwo", async (link, condition, num) => {',
            ' .addCommand("testetsttest", async (link, condition, num= 123) => {',
            ' .addCommand("thrmspsjhisjpgs", async selector => {',
            ' .addCommand("withoutbracket2", async selector => {',
            ' .addCommand("test", async (selector, attribute=false, condition =true, specified = "123") => {'
        ];

        for (const cmd of EXAMPLE) {
            it('should return undefined', () => {
                expect(parseCmds([cmd])).to.be.a('undefined');
            });
        }
    });

    describe('input data', () => {
        const EXAMPLE = ['', 123];

        for (const value of EXAMPLE) {
            it('should throw error', () => {
                expect(parseCmds.bind(parseCmds, value)).to.throw();
            });
        }
    });
});
