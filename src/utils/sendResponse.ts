import type { Response } from "express";

type ResponseData<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

export const sendResponse = <T> (res: Response, statusCode: number, paylaod: ResponseData<T>) => {
    res.status(statusCode).json(paylaod);
}