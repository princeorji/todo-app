const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500;

    res.status(status).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err?.stack
    })
}

module.exports = errorHandler;