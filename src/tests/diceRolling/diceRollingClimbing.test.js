const diceRolling = require('../../controllers/diceRolling');

describe("climbingRoll", () => {
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
        
        const result = diceRolling.climbingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❗ Natural [1] — Your footing wasn't as stable as you thought, and you slip, resulting in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockRoll20.mockReturnValue(20);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.climbingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] — You not only make it to your destination, but are able to give another cat an advantage on their climbing roll! This roll may be combo-ed!"
        });
    });

    test("returns terrible fail message", ()=>{
        mockRoll20.mockReturnValue(2);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.climbingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🍂 [2] — You attempt to climb, but you become stuck and are currently unable to move forward."
        });
    });

    test("returns fail message", ()=>{
        mockRoll20.mockReturnValue(9);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.climbingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌲 [9] You have trouble making it to your destination."
        });
    });

    test("returns mild success message", ()=>{
        mockRoll20.mockReturnValue(12);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.climbingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌲 [12] You successfully climb to your destination with little trouble. This roll may be combo-ed!"
        });
    });

    test("returns major success message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.climbingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌲 [19] You not only make it to your destination, you look epic doing it. This roll may be combo-ed!"
        });
    });
})