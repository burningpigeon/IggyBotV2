const diceRolling = require('../../controllers/diceRolling');

describe("sneakingRoll", () => {
    let mockRoll20;
    let mockGetModifier;

    beforeEach(() => {
        mockRoll20 = jest.spyOn(diceRolling, "roll20");
        mockGetModifier = jest.spyOn(diceRolling, "getModifier");
    });

    afterEach(() =>{
        jest.restoreAllMocks();
    });

    test("returns natural 1 injury message", ()=>{
        mockRoll20.mockReturnValue(1);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.sneakingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❗ Natural [1] — Uh-oh! You were so focused on being unseen, you stopped paying attention to your environment! You managed to get injured in a minor accident, resulting in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockRoll20.mockReturnValue(20);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.sneakingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] — You know what you are doing, and are quiet as a mouse! You successfully sneak, and can give a companion advantage on their sneaking. This roll may be combo-ed!"
        });
    });

    test("returns terrible fail message", ()=>{
        mockRoll20.mockReturnValue(2);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.sneakingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🍂 [2] — You think you are being sneaky, though it appears you have alerted your quarry! If you hurry, you might still pull this off, though."
        });
    });

    test("returns fail message", ()=>{
        mockRoll20.mockReturnValue(9);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.sneakingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🐾 [9] Who knew there were so many loud plants around here?! By the stars, it’s a struggle!"
        });
    });

    test("returns mild success message", ()=>{
        mockRoll20.mockReturnValue(12);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.sneakingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🐾 [12] You are sneaking effectively! Keep up the good work! This roll may be combo-ed!"
        });
    });

    test("returns major success message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.sneakingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🐾 [19] You are so sneaky, you’re virtually undetectable. If another cat detects you they must be a super cat! This roll may be combo-ed!"
        });
    });
})