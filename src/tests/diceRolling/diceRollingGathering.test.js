const diceRolling = require('../../controllers/diceRolling')

describe("gatheringRoll", ()=>{
    let mockGatheringFailCheck;
    let mockRoll20;

    beforeEach(() => {
        mockGatheringFailCheck = jest.spyOn(diceRolling, "gatheringFailCheck");
        mockRoll20 = jest.spyOn(diceRolling, "roll20");
    });

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("return failure message when gatheringFailCheck is true", ()=>{
        mockGatheringFailCheck.mockReturnValue(true);
        mockRoll20.mockReturnValue(1);

        const result = diceRolling.gatheringRoll("beginner","Rare")
        expect(result).toEqual({
            success: true,
            message: "Unfortunately, you don't find any herbs."
        });
    });

    test("returns natural 1 injury message", ()=> {
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(1)

        
        const result = diceRolling.gatheringRoll("average","Common")
        expect(result).toEqual({
            success: true,
            message: "☠️ Natural [1] - You found no herbs and received an injury level of your choosing. If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(20)

        const result = diceRolling.gatheringRoll("average","Common")
        expect(result).toEqual({
            success: true,
            message: "🌟 Natural [20] You found 3 uses of the herb you’re looking for and can give advantage to a companion’s next gathering roll. Please log your find on your Clan's Herb Storage page when possible."
        });
    });

    test("returns terrible fail message", ()=> {
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(2)

        const result = diceRolling.gatheringRoll("beginner","Common")
        expect(result).toEqual({
            success: true,
            message: "🥀 [-1] — Failure - You found a plant, but it’s not of any use to you or your healer. Better luck next time!"
        });
    });
    test("returns fail message", ()=> {
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(2)

        const result = diceRolling.gatheringRoll("average","Common")
        expect(result).toEqual({
            success: true,
            message: "🥀 [2] — Failure - You found no uses on this plant. They’re out there somewhere!"
        });
    });
    test("returns 1 use message", ()=> {
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(6)

        const result = diceRolling.gatheringRoll("average","Common")
        expect(result).toEqual({
            success: true,
            message: "🌿 [6] — 1 Use - You found 1 use of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible."
        });
    });
    test("returns 2 uses message", ()=> {
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(12)

        const result = diceRolling.gatheringRoll("average","Common")
        expect(result).toEqual({
            success: true,
            message: "🌿 [12] — 2 Uses - You found 2 uses of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible."
        });
    });
    test("returns 3 uses message", ()=> {
        mockGatheringFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(16)

        const result = diceRolling.gatheringRoll("average","Common")
        expect(result).toEqual({
            success: true,
            message: "🌿 [16] — 3 Uses - You found 3 uses of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible."
        });
    });
});