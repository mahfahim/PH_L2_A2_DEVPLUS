import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import type { CustomJwtPayload } from "../types";

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if ( !authHeader  || !authHeader.startsWith("Bearer ") ){
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "Token missing",
        });
        return;
      }

      const token = authHeader.split(" ")[1];
      
      if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
            errors: "Token missing or malformed",
        });
        return;
      }

      const secret = config.jwt_secret;

      if (!secret) {
        res.status(500).json({
          success: false,
          message: "Server error",
          errors: "JWT secret missing",
        });
        return;
      }

      const decoded = jwt.verify(token, secret) as CustomJwtPayload;

      if (
        allowedRoles.length &&
        decoded.role &&
        !allowedRoles.includes(decoded.role)
      ) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
          errors: "Insufficient permissions",
        });
        return;
      }

      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: "Invalid token",
      });
    }
  };
};