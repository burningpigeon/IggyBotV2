const appendMock = jest.fn();

jest.mock('../../../data/prey.json', () => ({
    prey: [
        {
            prey_name: "mouse",
            alternative_names: [],
            categories: ["land"]
        },
        {
            prey_name: "bats",
            alternative_names: ["bat"],
            categories: ["foliage", "cave"]
        }
    ]
}));

jest.mock('../../utils', () => ({
    isValidInt: jest.fn(),
    getFormattedTimestamp: jest.fn(),
    capitalizeFirstLetters: jest.fn((str) =>
        str.charAt(0).toUpperCase() + str.slice(1)
    )
}));

jest.mock('googleapis', () => {
    const mockAppend = jest.fn();
    return {
        google: {
            auth: {
                GoogleAuth: jest.fn().mockImplementation(() => ({})),
            },
            sheets: jest.fn().mockReturnValue({
                spreadsheets: {
                    values: {
                        append: mockAppend
                    }
                }
            })
        }
    }
});

const {
    submitPrey,
    isPreyValid,
    isPreyInCategory
} = require('../../controllers/processPreySubmission');

const { google } = require('googleapis');

describe("submitPrey", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns error if prey is invalid", async () => {
        const result = await submitPrey(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "dragon",
            "land",
            1
        );

        expect(result).toEqual({
            success: false,
            message: "dragon is not a valid prey type, please try again!"
        });

        expect(google.sheets).not.toHaveBeenCalled();
    });

    test("returns error if prey is not in category", async () => {
        const result = await submitPrey(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "mouse",
            "water",
            1
        );

        expect(result).toEqual({
            success: false,
            message: "Prey mouse is not in category water. Please try again! "
        });

        expect(google.sheets).not.toHaveBeenCalled();
    });

    test("successfully submits prey", async () => {
        const result = await submitPrey(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "mouse",
            "land",
            1
        );

        expect(result.success).toBe(true);
    });

    test("returns error if Google Sheets throws", async () => {
        const sheetsInstance = google.sheets();
        sheetsInstance.spreadsheets.values.append.mockRejectedValue(new Error("API error"));

        const result = await submitPrey(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "mouse",
            "land",
            1
        );

        expect(result).toEqual({
            success: false,
            message: "Issue connecting to Google Sheets - Please try agin later "
        });
    });

});
