const diceRolling = require('../../controllers/diceRolling')

describe("huntingRoll", ()=>{
    let mockHuntingFailCheck;
    let mockRoll20;
    let mockGetRandomPrey;

    beforeEach(() => {
        mockHuntingFailCheck = jest.spyOn(diceRolling, "huntingFailCheck");
        mockRoll20 = jest.spyOn(diceRolling, "roll20");
        mockGetRandomPrey = jest.spyOn(diceRolling, "getRandomPrey");
    });

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("returns failure message when huntingFailCheck is true", () =>{
        mockHuntingFailCheck.mockReturnValue(true);
        mockRoll20.mockReturnValue(10);
        
        const result = diceRolling.huntingRoll("great","land")
        expect(result).toEqual({
            success: true,
            message: "Unfortunately, you don't find any prey."
        });
    });

    test("returns natural 1 injury message", ()=> {
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(1)
        
        const result = diceRolling.huntingRoll("great","land")
        expect(result).toEqual({
            success: true,
            message: " Natural [1] - Ouch! You lose the prey, and somehow hurt yourself in the process. This results in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        });
    });

    test("returns natural 20 message", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(20)
        mockGetRandomPrey.mockReturnValue({ prey_name: "rat", emoji: "🐀"});

        const result = diceRolling.huntingRoll("great","land")
        expect(result).toEqual({
            success: true,
            message: "🍖 You caught sight of a 🐀 rat! 🌟 Natural [20] - You catch the prey excellently - and it's absolutely massive! This prey counts as two pieces. Please submit it to your Clan's Freshkill pile before Monday!"
        });
    });

    test("returns terribe hunt result", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(2)

        const result = diceRolling.huntingRoll("beginner","land")
        expect(result).toEqual({
            success: true,
            message: "🐾 [-1] Terrible Hunt: You stumble over your own paws. Luckily, you are unhurt, but the prey is long gone."
        });
    });

    test("returns lousy hunt result", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(2)

        const result = diceRolling.huntingRoll("average","land")
        expect(result).toEqual({
            success: true,
            message: "🐾 [2] Lousy Hunt: You miss the kill sloppily. Might get wet if fishing, or covered in dirt if on the ground."
        });
    });

    test("returns almost got it hunt result", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(6)

        const result = diceRolling.huntingRoll("average","land")
        expect(result).toEqual({
            success: true,
            message: "🐾 [6] Almost Got It: You almost caught it! You miss by a whisker length!"
        });
    });

    test("returns mediocore hunt result", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(12);
        mockGetRandomPrey.mockReturnValue({ prey_name: "rat", emoji: "🐀"});

        const result = diceRolling.huntingRoll("average","land")
        expect(result).toEqual({
            success: true,
            message: "🍖 You caught sight of a 🐀 rat! 🐾 [12] Mediocre Hunt: You catch your prey, but not very well. It’s a bit mangled. Please submit it to your Clan's Freshkill pile before Monday!"
        });
    });

    test("returns good hunt result", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(16);
        mockGetRandomPrey.mockReturnValue({ prey_name: "rat", emoji: "🐀"});

        const result = diceRolling.huntingRoll("average","land")
        expect(result).toEqual({
            success: true,
            message: "🍖 You caught sight of a 🐀 rat! 🐾 [16] Good Hunt: Decently executed hunt! Still some minor room for improvements. Please submit it to your Clan's Freshkill pile before Monday!"
        });
    });

    test("returns excellent hunt result", ()=>{
        mockHuntingFailCheck.mockReturnValue(false);
        mockRoll20.mockReturnValue(19);
        mockGetRandomPrey.mockReturnValue({ prey_name: "rat", emoji: "🐀"});

        const result = diceRolling.huntingRoll("mastered","land")
        expect(result).toEqual({
            success: true,
            message: "🍖 You caught sight of a 🐀 rat! 🐾 [22] Excellent Hunt: Perfectly executed hunt, couldn't have gone better. Please submit it to your Clan's Freshkill pile before Monday!"
        });
    });
});