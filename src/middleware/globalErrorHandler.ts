import type { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
   const errorMessage = err instanceof Error ? err.message : "Something went wrong";

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: errorMessage,
    });
};
