const TC_PREY_BACKEND = "1f49kKw0KPJzNbBgZE9ss0YhOv2ouI9cG8hkMkGw300I"
const getMock = jest.fn();
jest.mock('googleapis', () => {
    const mockGet = jest.fn();
    const mockAppend = jest.fn();
    return {
        google: {
            auth: {
                GoogleAuth: jest.fn().mockImplementation(() => ({})),
            },
            sheets: jest.fn().mockReturnValue({
                spreadsheets: {
                    values: {
                        get: mockGet,
                        append: mockAppend
                    }
                }
            })
        }
    }
});

const { preyCount, getPreyCount} = require('../../controllers/preyCount');
const { google } = require('googleapis');

describe("get prey count", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns hunting message when prey count is below goal", async () => {
        // FIX 1: Call google.sheets() to get the instance rather than
        // reading from mock.results, which is empty until sheets() is called
        const sheetsInstance = google.sheets();
        sheetsInstance.spreadsheets.values.get.mockResolvedValue({
            data: {
                values: [["10","25"]]
            }
        });

        const result = await getPreyCount(sheetsInstance, "ThunderClan", TC_PREY_BACKEND);

        expect(result).toEqual({
            success: true,
            message: "ThunderClan currently has 10/25 pieces. You need 15 more pieces of prey to meet prey requirements. Time to get hunting!"
        });
    });

    test("returns succes message when prey goal is met", async() => {
        // FIX 2: getMock is not connected to the factory's internal mockGet.
        // Get the instance and mock on it directly instead.
        const sheets = google.sheets();
        sheets.spreadsheets.values.get.mockResolvedValue({
            data:{
                values: [["30","25"]]  // FIX 2b: use strings to match real API data format
            }
        });

        const result = await getPreyCount(sheets, "ThunderClan", TC_PREY_BACKEND)

        expect(result).toEqual({
            success: true,
            message: "Woo hoo! ThunderClan currently has 30/25 pieces. Prey requirements have been met! Great work!"
        });
    })

    test("returns error if prey count is not an number", async() => {
        const sheets = google.sheets();
        sheets.spreadsheets.values.get.mockResolvedValue({
            data: {
                values: [["not-a-number", "20"]]
            }
        });

        const result = await getPreyCount(sheets, "ThunderClan", TC_PREY_BACKEND);
        expect(result).toEqual({
            success: false,
            message: "Prey count and prey goal couldn't be compared. Please inform staff and try again later."
        })
    })
});

describe("preyCount", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns error if Google Sheets throws an error", async () => {
        const mockGet = jest.fn().mockRejectedValue(new Error("API error"));
        google.sheets.mockReturnValue({
            spreadsheets: {
                values: {
                    get: mockGet
                }
            }
        });
        
        const result = await preyCount("thunderclan");

        expect(result).toEqual({
            success: false,
            message: "Issue connecting to Google Sheets - Please try agin later "
        });
    });

});