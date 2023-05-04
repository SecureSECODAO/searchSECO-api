import { NextFunction, Request, Response } from "express";
import createError from 'http-errors'

declare type WebError = Error & { status?: number }
export const errorHandler = (
    err: WebError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    res.status(err.status || 500).json({
        error: err.name,
        message: err.message
    })
}

export const errorNotFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    next(createError(404));
};