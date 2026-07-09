export const sendResponse = (res, statusCode, data={}, message = null) => {
    return res.status(statusCode).json({
        status:statusCode,
        message,
        data: data
    });
};
