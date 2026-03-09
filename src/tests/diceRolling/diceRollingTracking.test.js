const diceRolling = require('../../controllers/diceRolling');

describe("trackingRoll", () => {
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
        
        const result = diceRolling.trackingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❗ Natural [1] — You are so focused on the sights and smells that it seems you've missed what was right in front of you. You managed to get injured in a minor accident, resulting in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockRoll20.mockReturnValue(20);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.trackingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] — Not only do you seek out your objective with commendable prowess, you're also able to help someone else notice the trail as well! This roll may be combo-ed!"
        });
    });

    test("returns terrible fail message", ()=>{
        mockRoll20.mockReturnValue(2);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.trackingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❓ [2] — You could have sworn you had it! It seems you've managed to lose the trail you'd been following."
        });
    });

    test("returns fail message", ()=>{
        mockRoll20.mockReturnValue(9);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.trackingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🔍 [9] You have trouble finding your target."
        });
    });

    test("returns mild success message", ()=>{
        mockRoll20.mockReturnValue(12);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.trackingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🔍 [12] You follow the trail expertly! You easily navigate to its source. This roll may be combo-ed!"
        });
    });

    test("returns major success message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.trackingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🔍 [19] Your eyes are as keen as a hawk's and your nose as great as a bloodhound's as you seek out your target! This roll may be combo-ed!"
        });
    });
})