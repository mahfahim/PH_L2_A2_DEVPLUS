import type { Request, Response, NextFunction } from "express";
import jwt,{ type JwtPayload } from "jsonwebtoken";
import config from "../config";

export const authMiddleware = (allowedRoles: string[]) => {
     return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ success: false, message: "Unauthorized", errors: "Token missing" });
                return;
            }

            const decoded = jwt.verify(authHeader, config.jwt_secret as string) as JwtPayload;

            if (allowedRoles.length && decoded && !allowedRoles.includes(decoded.role)) {
                res.status(403).json({ success: false, message: "Forbidden", errors: "Insufficient permissions" });
                return;
            }
            req.user = decoded;
            next();
            } catch (error) {
                res.status(401).json({ success: false, message: "Unauthorized", errors: "Invalid token" });
            }
   };
};