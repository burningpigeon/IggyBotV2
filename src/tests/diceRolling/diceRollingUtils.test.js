const {
    roll20,
    getModifier,
    getModifierLvl,
    gatheringFailCheck,
    huntingFailCheck,
    getRandomPrey
} = require('../../controllers/diceRolling');

const preyData = require('../../../data/prey.json')

describe("roll20", () => {
    test("returns a number betwee  1 and 20", () => {
        for(let i=0; i < 100; i++){
            const roll = roll20();
            expect(roll).toBeGreaterThanOrEqual(1);
            expect(roll).toBeLessThanOrEqual(20)
        }
    });
});

describe("getModifier", ()=>{
    test("returns correct modifier for text input", ()=>{
        expect(getModifier("beginner")).toBe(-3);
        expect(getModifier("rookie")).toBe(-2);
        expect(getModifier("decent")).toBe(-1);
        expect(getModifier("average")).toBe(0);
        expect(getModifier("great")).toBe(1);
        expect(getModifier("excellent")).toBe(2);
        expect(getModifier("mastered")).toBe(3);
        expect(getModifier("blessed")).toBe(5);
    });

    test("returns correct modifier for numeric input", ()=>{
        expect(getModifier("1")).toBe(-3);
        expect(getModifier("2")).toBe(-2);
        expect(getModifier("3")).toBe(-1);
        expect(getModifier("4")).toBe(0);
        expect(getModifier("5")).toBe(1);
        expect(getModifier("6")).toBe(2);
        expect(getModifier("7")).toBe(3);
        expect(getModifier("8")).toBe(5);
    });

    test("returns error for invalid modifier", () =>{
        const result = getModifier("invalid");
        expect(result).toEqual({
            success: false,
            message: "Incorrect level, please try again"
        });
    });
});

describe("getModifierLvl", () =>{
    test("returns correct level name", ()=>{
        expect(getModifierLvl(-3)).toBe("Beginner")
        expect(getModifierLvl(-2)).toBe("Rookie")
        expect(getModifierLvl(-1)).toBe("Decent")
        expect(getModifierLvl(0)).toBe("Average")
        expect(getModifierLvl(1)).toBe("Great")
        expect(getModifierLvl(2)).toBe("Excellent")
        expect(getModifierLvl(3)).toBe("Mastered")
        expect(getModifierLvl(5)).toBe("Blessed")
    });

    test("returns error for invalid modifier level", ()=>{
        const result = getModifierLvl(10);
        expect(result).toEqual({
            success: false,
            message: "Incorrect level, please try again"
        });
    });
});

describe("gatheringFailCheck", () => {
    afterEach(() => {
        jest.restoreAllMocks()
    });

    test("returns true when roll fail", ()=>{
        jest.spyOn(Math, "random").mockReturnValue(0);
        const result = gatheringFailCheck("beginner", "Common");
        expect(result).toBe(true)
    })

    test("returns false when roll succeeds", ()=>{
        jest.spyOn(Math, "random").mockReturnValue(0.999);
        const result = gatheringFailCheck("beginner", "Common");
        expect(result).toBe(false)
    })
});