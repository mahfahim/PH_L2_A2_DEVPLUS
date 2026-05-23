import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import { config } from "dotenv";
import type { RegisterPayload, LoginPayload } from "../../types";


const registerUser = async (paylaod: RegisterPayload) => {
    const { name, email, password, role = "contributor"} = paylaod;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING * `,
         [name, email, hashedPassword, role],
    );

    delete result.rows[0].password;
    
    return result;
};

const loginUser = async (paylaod: LoginPayload ) => {
    const { email, password} = paylaod;

    const userRes = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]
    );
    if(userRes.rows.length === 0){
        throw new Error("Invalid credentials");
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        {id: user.id, name: user.name, role: user.role},
        process.env.jwt_secret as string,
        { expiresIn: "1d"}
    );

    delete user.password;
    return { token, user};

};

export const authService = {
    registerUser,
    loginUser,
};