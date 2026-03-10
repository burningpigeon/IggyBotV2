const diceRolling = require('../../controllers/diceRolling');

describe("healingRoll", () => {
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
        
        const result = diceRolling.healingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "❗ Natural [1] - Wow, you really aren’t cut out for healing! The level of injury/illness increases by one."
        });
    });

    test("returns natural 20 message", ()=>{
        mockRoll20.mockReturnValue(20);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.healingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] - The remedy works wonders! Is this an act of StarClan? The level of injury is decreased by one! This does not count toward the overall successes, because it reduces the level instead."
        });
    });

    test("returns terrible fail message", ()=>{
        mockRoll20.mockReturnValue(2);
        mockGetModifier.mockReturnValue(-3);
        
        const result = diceRolling.healingRoll("beginner");
        expect(result).toEqual({
            success: true,
            message: "☠️ [-1] — Failure - The remedy doesn't seem to be working. Are you sure you know what you’re doing?"
        });
    });

    test("returns fail message", ()=>{
        mockRoll20.mockReturnValue(6);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.healingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "☠️ [6] — Failure - The remedy doesn't appear to be working at the moment. Perhaps your technique was wrong?"
        });
    });

    test("returns near fail message", ()=>{
        mockRoll20.mockReturnValue(9);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.healingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "🥀 [9] — Failure - Although this almost started to make the patient feel better, there wasn't much progress."
        });
    });

    test("returns one success message", ()=>{
        mockRoll20.mockReturnValue(12);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.healingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "💞 [12] — 1 Success - The remedy is working! The patient starts to feel a bit better."
        });
    });

    test("returns two successes message", ()=>{
        mockRoll20.mockReturnValue(17);
        mockGetModifier.mockReturnValue(0);
        
        const result = diceRolling.healingRoll("average");
        expect(result).toEqual({
            success: true,
            message: "💞 [17] — 2 Successes - The remedy is absolutely working! The patient is definitely starting to feel better."
        });
    });

    test("returns three successes message", ()=>{
        mockRoll20.mockReturnValue(19);
        mockGetModifier.mockReturnValue(3);
        
        const result = diceRolling.healingRoll("mastered");
        expect(result).toEqual({
            success: true,
            message: "💞 [22] — 3 Successes - The remedy works wonders! Your technique was perfect and the patient is doing much better."
        });
    });
})