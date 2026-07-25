jest.mock('../../controllers/herbStorage', () => ({
    herbStorage: jest.fn(),
}));

jest.mock('../../utils', () => ({
    capitalizeFirstLetters: jest.fn((value) => value.charAt(0).toUpperCase() + value.slice(1)),
}));

const { herbStorage } = require('../../controllers/herbStorage');
const herbStorageCommand = require('../../slash-commands/herbStorageCommand');

describe('herbStorageCommand', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('edits the deferred reply with the herb list', async () => {
        herbStorage.mockResolvedValue({
            success: true,
            message: 'Alder Bark: 1',
        });

        const interaction = {
            deferReply: jest.fn().mockResolvedValue(),
            editReply: jest.fn().mockResolvedValue(),
            options: {
                getString: jest.fn().mockReturnValue('thunderclan'),
            },
            user: {
                id: '12345',
            },
        };

        await herbStorageCommand.run({ interaction });

        expect(interaction.deferReply).toHaveBeenCalledTimes(1);
        expect(herbStorage).toHaveBeenCalledWith('thunderclan');
        expect(interaction.editReply).toHaveBeenCalledWith(expect.stringContaining('Alder Bark: 1'));
    });

    test('does not crash when deferReply fails', async () => {
        const interaction = {
            deferReply: jest.fn().mockRejectedValue(new Error('Unknown interaction')),
            editReply: jest.fn().mockResolvedValue(),
            options: {
                getString: jest.fn(),
            },
            user: {
                id: '12345',
            },
        };

        await expect(herbStorageCommand.run({ interaction })).resolves.toBeUndefined();

        expect(herbStorage).not.toHaveBeenCalled();
        expect(interaction.editReply).not.toHaveBeenCalled();
    });
});