// src/types/index.ts

import type { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  role?: string;
  id?: number;
  name?: string;
}