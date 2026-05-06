const express = require('express');
const getBookByParamMW = require('../../../middleware/book/getBookByParamMW');

const originalConsoleError = console.error;
beforeAll(() => { console.error = jest.fn(); });
afterAll(() => { console.error = originalConsoleError; });

// Creates a real Express request object so that Express prototype methods
// like req.param() are available. In Express 4 this works; in Express 5
// the prototype no longer has .param(), causing a TypeError.
function makeExpressReq(params = {}, body = {}, query = {}) {
    const app = express();
    const req = Object.create(app.request);
    req.app = app;
    req.params = params;
    req.body = body;
    req.query = query;
    return req;
}

describe('getBookByParamMW', () => {
    let mockBookModel;
    let mockBook;

    beforeEach(() => {
        mockBook = { _id: '123456789012', title: 'Test Book', author: 'Test Author' };
        mockBookModel = { findOne: jest.fn().mockResolvedValue(mockBook) };
    });

    test('should resolve bookid via req.param() and set res.locals.book when book is found', async () => {
        const req = makeExpressReq({ bookid: '123456789012' });
        const res = { locals: {}, redirect: jest.fn() };
        const next = jest.fn();
        const middleware = getBookByParamMW({ BookModel: mockBookModel });

        await new Promise((resolve, reject) => {
            next.mockImplementation((err) => (err ? reject(err) : resolve()));
            middleware(req, res, next);
        });

        expect(mockBookModel.findOne).toHaveBeenCalledWith({ _id: '123456789012' });
        expect(res.locals.book).toBe(mockBook);
        expect(next).toHaveBeenCalledWith();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test('should redirect to /database when book is not found', async () => {
        mockBookModel.findOne = jest.fn().mockResolvedValue(null);
        const req = makeExpressReq({ bookid: '123456789012' });
        const res = { locals: {}, redirect: jest.fn() };
        const next = jest.fn();
        const middleware = getBookByParamMW({ BookModel: mockBookModel });

        await new Promise((resolve) => {
            res.redirect.mockImplementation(() => resolve());
            middleware(req, res, next);
        });

        expect(mockBookModel.findOne).toHaveBeenCalledWith({ _id: '123456789012' });
        expect(res.redirect).toHaveBeenCalledWith('/database');
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next with error when database query fails', async () => {
        const mockError = new Error('Database error');
        mockBookModel.findOne = jest.fn().mockRejectedValue(mockError);
        const req = makeExpressReq({ bookid: '123456789012' });
        const res = { locals: {}, redirect: jest.fn() };
        const next = jest.fn();
        const middleware = getBookByParamMW({ BookModel: mockBookModel });

        await new Promise((resolve) => {
            next.mockImplementation(() => resolve());
            middleware(req, res, next);
        });

        expect(mockBookModel.findOne).toHaveBeenCalledWith({ _id: '123456789012' });
        expect(next).toHaveBeenCalledWith(mockError);
        expect(res.redirect).not.toHaveBeenCalled();
    });
});
