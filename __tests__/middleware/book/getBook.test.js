const getBookMW = require('../../../middleware/book/getBookMW');

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});
afterAll(() => {
    console.error = originalConsoleError;
});

describe('getBookMW', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let mockBookModel;
    let mockBook;

    beforeEach(() => {
        mockBook = {
            _id: '123456789012',
            title: 'Test Book',
            author: 'Test Author'
        };

        mockReq = {
            params: {
                bookid: '123456789012'
            }
        };

        mockRes = {
            locals: {},
            redirect: jest.fn()
        };

        mockNext = jest.fn();
    });

    test('should set res.locals.book and call next when book is found', async () => {
        const thenMock = jest.fn().mockImplementation(callback => {
            callback(mockBook);
            return {
                catch: jest.fn()
            };
        });

        mockBookModel = {
            findOne: jest.fn().mockReturnValue({ then: thenMock })
        };

        const middleware = getBookMW({
            BookModel: mockBookModel
        });

        middleware(mockReq, mockRes, mockNext);

        expect(mockBookModel.findOne).toHaveBeenCalledWith({
            _id: '123456789012'
        });
        expect(mockRes.locals.book).toBe(mockBook);
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.redirect).not.toHaveBeenCalled();
    });

    test('should redirect to /database when book is not found', async () => {
        const thenMock = jest.fn().mockImplementation(callback => {
            callback(null); // Nincs könyv
            return {
                catch: jest.fn()
            };
        });

        mockBookModel = {
            findOne: jest.fn().mockReturnValue({ then: thenMock })
        };

        const middleware = getBookMW({
            BookModel: mockBookModel
        });

        middleware(mockReq, mockRes, mockNext);

        expect(mockBookModel.findOne).toHaveBeenCalledWith({
            _id: '123456789012'
        });
        expect(mockRes.redirect).toHaveBeenCalledWith('/database');
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next with error when database query fails', async () => {
        const mockError = new Error('Database error');

        const thenMock = jest.fn().mockReturnValue({
            catch: jest.fn().mockImplementation(callback => {
                callback(mockError);
            })
        });

        mockBookModel = {
            findOne: jest.fn().mockReturnValue({ then: thenMock })
        };

        const middleware = getBookMW({
            BookModel: mockBookModel
        });

        middleware(mockReq, mockRes, mockNext);

        expect(mockBookModel.findOne).toHaveBeenCalledWith({
            _id: '123456789012'
        });
        expect(mockNext).toHaveBeenCalledWith(mockError);
    });
});