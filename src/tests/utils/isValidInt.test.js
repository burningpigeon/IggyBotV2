const { isValidInt} = require('../../utils')

describe('isValidInt', () =>  {
    test('accepts valid int', () =>{
        expect(isValidInt(123))
            .toBe(true);
    });

    test('accepts valid int as a string', () =>{
        expect(isValidInt("123"))
            .toBe(true);
    });

    test('rejects non- valid int string', () =>{
        expect(isValidInt("abc"))
            .toBe(false);
    });
    
    test('rejects float', () =>{
        expect(isValidInt(123.45))
            .toBe(false);
    });
});
