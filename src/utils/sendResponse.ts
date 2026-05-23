import type { Response } from "express";
import type { ResponseData } from "../types";

export const sendResponse = <T> (res: Response, statusCode: number, paylaod: ResponseData<T>) => {
    res.status(statusCode).json(paylaod);
}