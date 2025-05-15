const saveBookMW = require('../../../middleware/book/saveBookMW');

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});
afterAll(() => {
    console.error = originalConsoleError;
});

describe('saveBookMW', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let mockBookModel;
    let mockBook;

    beforeEach(() => {
        mockBook = {
            save: jest.fn().mockReturnValue(Promise.resolve()),
            title: '',
            author: '',
            genre: '',
            description: ''
        };

        mockBookModel = jest.fn().mockReturnValue(mockBook);

        mockReq = {
            body: {
                title: 'Test Book',
                author: 'Test Author',
                genre: 'Test Genre',
                description: 'Test Description'
            }
        };

        mockRes = {
            locals: {},
            redirect: jest.fn()
        };

        mockNext = jest.fn();
    });

    test('should call next if required fields are missing', async () => {
        mockReq.body = {
            // Hiányzó címmező
            author: 'Test Author',
            genre: 'Test Genre',
            description: 'Test Description'
        };

        const middleware = saveBookMW({
            BookModel: mockBookModel
        });

        await middleware(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockBookModel).not.toHaveBeenCalled();
        expect(mockBook.save).not.toHaveBeenCalled();
        expect(mockRes.redirect).not.toHaveBeenCalled();
    });

    test('should create new book if book does not exist in locals', async () => {
        const middleware = saveBookMW({
            BookModel: mockBookModel
        });

        await middleware(mockReq, mockRes, mockNext);

        expect(mockBookModel).toHaveBeenCalled();
        expect(mockBook.title).toBe('Test Book');
        expect(mockBook.author).toBe('Test Author');
        expect(mockBook.genre).toBe('Test Genre');
        expect(mockBook.description).toBe('Test Description');
        expect(mockBook.save).toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalledWith('/database');
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('should update existing book if book exists in locals', async () => {
        mockRes.locals.book = {
            title: 'Old Title',
            author: 'Old Author',
            genre: 'Old Genre',
            description: 'Old Description',
            save: jest.fn().mockReturnValue(Promise.resolve())
        };

        const middleware = saveBookMW({
            BookModel: mockBookModel
        });

        await middleware(mockReq, mockRes, mockNext);

        expect(mockRes.locals.book.title).toBe('Test Book');
        expect(mockRes.locals.book.author).toBe('Test Author');
        expect(mockRes.locals.book.genre).toBe('Test Genre');
        expect(mockRes.locals.book.description).toBe('Test Description');
        expect(mockRes.locals.book.save).toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalledWith('/database');
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle save error and call next with error', async () => {
        const mockError = new Error('Save error');
        mockBook.save = jest.fn().mockRejectedValue(mockError);

        const middleware = saveBookMW({
            BookModel: mockBookModel
        });

        await middleware(mockReq, mockRes, mockNext);

        expect(mockBookModel).toHaveBeenCalled();
        expect(mockBook.save).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(mockError);
        expect(mockRes.redirect).not.toHaveBeenCalled();
    });
});