const mockGet = jest.fn();

jest.mock('googleapis', () => {

    return {
        google: {
            auth: {
                GoogleAuth: jest.fn().mockImplementation(() => ({})),
            },
            sheets: jest.fn().mockReturnValue({
                spreadsheets: {
                    values: {
                        get: mockGet
                    }
                }
            })
        }
    }
});

jest.mock('../../../data/herbs.json', () => ({
    herbs: [
        {
            Name: "Catmint",
            Usage: "Respiratory Symptoms",
            Description: "Test description",
            Application: "Test application",
            Toxicity: "N/A",
            Rarity: {
                Newleaf: "Uncommon",
                Greenleaf: "Common",
                Leafall: "Common",
                Leafbare: "Rare"
            },
            Locations: {
                tc: "#tallpines",
                sc: "#shadowclan_location",
                rc: "#riverclan_location",
                wc: "#windclan_location"
            }
        }
    ]
}));

const { getHerbData, herbSearch } = require('../../controllers/herbSearch');
const { google } = require('googleapis');

describe("getHerbData", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGet.mockReset();
        mockGet.mockResolvedValue({
            data: {
                values: []
            }
        });
    });

    test("returns error if herb isn't found", async () => {
        mockGet.mockResolvedValue({
            data: {
                values: []
            }
        });
        
        const sheets = google.sheets();

        const result = await getHerbData(
            sheets,
            "UnknownHerb",
            "tc",
            "sheetId",
            "thunderclan"
        );

        expect(result).toEqual({
            success: false,
            message: "Herb: UnknownHerb not found"
        });
    });

    test("returns full herb data when valid for thunderclan", async () => {

        mockGet.mockResolvedValue({
            data: {
                values: [["Catmint", "12"]]
            }
        });

        const sheets = google.sheets();

        const result = await getHerbData(
            sheets,
            "Catmint",
            "tc",
            "sheetId",
            "thunderclan"
        );

        expect(result.success).toBe(true);
        expect(result.message).toContain("Name: Catmint");

        expect(mockGet).toHaveBeenCalledWith({
            spreadsheetId: "sheetId",
            range: "Front End!A3:B21"
        });
    });

    test("returns full herb data when valid for other clans", async () => {

        mockGet.mockResolvedValue({
            data: {
                values: [["Catmint", "12"]]
            }
        });

        const sheets = google.sheets();

        const result = await getHerbData(
            sheets,
            "Catmint",
            "sc",
            "sheetId",
            "shadowclan"
        );

        expect(result.success).toBe(true);
        expect(result.message).toContain("Name: Catmint");

        expect(mockGet).toHaveBeenCalledWith({
            spreadsheetId: "sheetId",
            range: "Frontend!A3:B21"
        });
    });
});

describe("herbSearch", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("calls getHerbData for thunderclan", async () => {

        mockGet.mockResolvedValue({
            data: {
                values: [["Catmint", "8"]]
            }
        });

        const result = await herbSearch("thunderclan", "Catmint");

        expect(result.success).toBe(true);
        expect(result.message).toContain("Amount: 8");
    });

    test("returns error if Google Sheets throws", async () => {

        mockGet.mockRejectedValueOnce(new Error("API error"));

        const result = await herbSearch("thunderclan", "Catmint");

        expect(result).toEqual({
            success: false,
            message: "Issue connecting to Google Sheets - Please try again later"
        });
    });
});