
jest.mock('../../utils', () => ({
    isValidInt: jest.fn(),
    getFormattedTimestamp: jest.fn()
}));

jest.mock('googleapis', ()=> {
    const appendMock = jest.fn();
    return{
        google:{
            auth:{
                GoogleAuth: jest.fn().mockImplementation(() => ({})),
            },
            sheets: jest.fn().mockReturnValue({
                spreadsheets:{
                    values:{
                        append: appendMock
                    }
                }
            })
        }
    }
});

const { isValidInt } = require('../../utils');
const { google} = require('googleapis');
const { herbRemoval } = require('../../controllers/processHerbRemoval');

describe('herbRemoval', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns error if the amount is not a valid integer', async () => {
        isValidInt.mockReturnValue(false);
        const result = await herbRemoval(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "catmint",
            "not a number"
        );

        expect(result).toEqual({
            success: false,
            message: "The amount of herbs submitted must be a valid integer."
        });
        expect(google.sheets).not.toHaveBeenCalled();
    });

    test('successfully submits herb', async() => {
        isValidInt.mockReturnValue(true);
        const result = await herbRemoval(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "catmint",
            5
        );
        expect(result.success).toBe(true)
        expect(result.message).toContain("Successfully removed");

        const sheetsInstance = google.sheets.mock.results[0].value;
        const appendMock = sheetsInstance.spreadsheets.values.append;

        expect(appendMock).toHaveBeenCalledWith(
            expect.objectContaining({
                range: 'Backend!A:E',
                valueInputOption: 'USER_ENTERED',
                insertDataOption: `INSERT_ROWS`,
                requestBody: {
                    values: [["2026-02-28", "Firestar", "Removing", "catmint", 5]]
                }
            })
        );
    });

    test('returns error if Google Sheets throws one', async ()=>{
        isValidInt.mockReturnValue(true);
        const sheetsInstance = google.sheets();
        sheetsInstance.spreadsheets.values.append.mockRejectedValue(new Error("API error"));
        const result = await herbRemoval(
            "2026-02-28",
            "Firestar",
            "thunderclan",
            "catmint",
            5
        );

        expect(result).toEqual({
            success: false,
            message: "Issue connecting to Google Sheets - Please try agin later "
        });
    });
});