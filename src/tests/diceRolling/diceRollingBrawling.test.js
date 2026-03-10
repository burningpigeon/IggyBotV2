const diceRolling = require('../../controllers/diceRolling');

describe("brawlingRoll", () => {
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
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❗ Natural [1] - That’s gonna sting! You miss your strike and receive an injury level of your choosing. If you are currently injured in a spar, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockRoll20.mockReturnValue(20);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] - Wow! You pulled off that move perfectly! You can get one extra strike for free, or you can choose to back away!"
        });
    });

    test("returns terrible miss message", ()=>{
        mockRoll20.mockReturnValue(2);
        mockGetModifier.mockReturnValue(-3);
        
        const result = diceRolling.brawlingRoll("beginner");
        expect(result).toEqual({
            success: true,
            message: "🎲 [-1] — Terrible Miss - Yikes! That really didn’t go according to plan did it? Your intended attack goes completely wrong. Perhaps you slip, or the cat countering is one step ahead of you!"
        });
    });

    test("returns lousy miss message", ()=>{
        mockRoll20.mockReturnValue(6);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: " 🎲 [6] — Lousy Miss - You miss your target! Maybe your move was too sloppy? At least you tried."
        });
    });

    test("returns near miss message", ()=>{
        mockRoll20.mockReturnValue(9);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🎲 [9] — Near Miss - Oh! So close! You just barely miss your target, they must have dodged, or your strike was just barely off the mark."
        });
    });

    test("returns mediocre hit message", ()=>{
        mockRoll20.mockReturnValue(12);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🎲 [12] — Mediocre Hit - Landed a hit! You meant to aim for one spot, but because of the movement of your opponent, your attack landed in a way you didn’t intend!"
        });
    });

    test("returns good hit message", ()=>{
        mockRoll20.mockReturnValue(17);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🎲 [17] — Good Hit - Nice hit! Your attack lands how you intend it to, but with less or more impact than planned!"
        });
    });

    test("returns excellent hit message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.brawlingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🎲 [19] — Excellent Hit - Stars above, that was stunning! Your attack is executed perfectly, and your ancestors are proud to be related to you."
        });
    });

    test("returns excellent hit message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(3);
        
        const result = diceRolling.brawlingRoll("mastered");
        expect(result).toEqual({
            success: true,
            message: "🎲 [22] — 20+ - Attacker hits, landing the attack exactly as intended!"
        });
    });
})