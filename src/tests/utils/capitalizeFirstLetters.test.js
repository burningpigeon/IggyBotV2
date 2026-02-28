const { capitalizeFirstLetters} = require('../../utils')

describe('capitalizeFirstLetters', () =>  {
    test('capitializes a single word', () =>{
        expect(capitalizeFirstLetters("hello"))
            .toBe("Hello");
    });

    test('capitalize multiple words', () => {
        expect(capitalizeFirstLetters("hello world what is up"))
            .toBe("Hello World What Is Up")
    });

    test('Throws TypeError if input is not a string', ()=>{
        expect(() => capitalizeFirstLetters(123))
            .toThrow(TypeError);
    });

    test('handles empty string', () =>{
        expect(capitalizeFirstLetters(''))
            .toBe('');
    });

    test('random capitalization', () => {
        expect(capitalizeFirstLetters("HeLLO wORld WHAT is uP"))
            .toBe("Hello World What Is Up");
    });
});