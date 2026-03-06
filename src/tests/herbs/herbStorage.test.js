jest.mock('googleapis', () => {
    const mockGet = jest.fn();
    return {
        google: {
            auth: {
                GoogleAuth: jest.fn().mockImplementation(() => ({}))
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

const { herbStorage } = require('../../controllers/herbStorage');
const { google } = require('googleapis');

describe("herbStorage", ()=> {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns herb storage list for tc", async()=> {
        const mockGet = jest.fn().mockResolvedValue({
            data: {
                values: [
                    ["Alder Bark", "1"],
                    ["Borage", "2"],
                    ["Burdock Root", "3"],
                    ["Burnet", "4"],
                    ["Catmint", "5"],
                    ["Cobwebs", "6"],
                    ["Comfrey", "7"],
                    ["Curly Dock", "8"],
                    ["Eyebright", "9"],
                    ["Feverfew", "10"],
                    ["Geranium", "11"],
                    ["Lavender", "12"],
                    ["Marigold", "13"],
                    ["Poppy Seeds", "14"],
                    ["Sea Buckthorn", "15"],
                    ["Tansy", "16"],
                    ["Wild Garlic", "17"],
                    ["Willow Bark", "18"],
                    ["Yarrow", "19"]                    
                ]
            }
        });
        
        google.sheets.mockReturnValue({
            spreadsheets: {
                values: {
                    get: mockGet
                }
            }
        });
        
        const result = await herbStorage("thunderclan");
        expect(result.success).toBe(true);
        expect(result.message).toContain("Alder Bark");
        expect(result.message).toContain("Yarrow");
    });

    test("returns error if Google sheets throws error", async()=> {
        const mockGet = jest.fn().mockRejectedValue(new Error("API error"));
        
        google.sheets.mockReturnValue({
            spreadsheets: {
                values: {
                    get: mockGet
                }
            }
        });

        const result = await herbStorage("thunderclan");

        expect(result).toEqual({
            success: false,
            message: "Issue connecting to Google Sheets - Please try again later"
        });
    });
});