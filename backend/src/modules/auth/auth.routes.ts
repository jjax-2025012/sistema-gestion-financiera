import { Router } from "express";
import { loginHandler } from "./auth.controller";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", loginHandler);
