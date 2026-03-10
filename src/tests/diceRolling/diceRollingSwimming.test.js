const diceRolling = require('../../controllers/diceRolling');

describe("swimmingRoll", () => {
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
        
        const result = diceRolling.swimmingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❗ Natural [1] — Although you're not drowning, you do get injured, resulting in an injury level of your choosing! Your cat is now on the shore you started at. If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockRoll20.mockReturnValue(20);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.swimmingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] — You successfully swim to your destination, and you’re able to give advantage to someone else’s swimming roll! This roll may be combo-ed!"
        });
    });

    test("returns terrible fail message", ()=>{
        mockRoll20.mockReturnValue(2);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.swimmingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "💦 [2] — You manage to tread water, but you struggle to move forward in any direction!"
        });
    });

    test("returns fail message", ()=>{
        mockRoll20.mockReturnValue(9);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.swimmingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌊 [9] You struggle to make it to your destination."
        });
    });

    test("returns mild success message", ()=>{
        mockRoll20.mockReturnValue(12);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.swimmingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌊 [12] You successfully swim to your destination! This roll may be combo-ed!"
        });
    });

    test("returns major success message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.swimmingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌊 [19] You not only swim to your destination, but you look epic doing it! This roll may be combo-ed!"
        });
    });
})