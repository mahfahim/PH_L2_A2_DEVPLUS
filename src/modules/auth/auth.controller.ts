import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import type { ResponseData } from "../../types";
import { error } from "node:console";

const signup = async (req: Request, res: Response) => {
    try{
        const user = await authService.registerUser(req.body);
        sendResponse(res,201, {success: true, message: "User registered successfully", data: user});
    }catch(error: any) {
        sendResponse(res,400,{ success: false, message: "Registration failed", errors: error.message});
    }

};

const login = async (req: Request, res: Response) => {
    try {
        const data = await authService.loginUser(req.body);
        sendResponse(res, 200, {success: true, message: "Login successfully", data})
    }catch(error: any){
        sendResponse(res, 401, {success: false, message: "Login failed", errors: error.message})
    }
}

export const authController = {
    signup,
    login,
};