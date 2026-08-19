import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { ValidationError } from "../../utils/errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginBody(body: unknown): { email: string; password: string } {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Solicitud inválida.");
  }

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== "string" || email.trim() === "") {
    throw new ValidationError("El correo electrónico es obligatorio.");
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    throw new ValidationError("El correo electrónico no tiene un formato válido.");
  }

  if (typeof password !== "string" || password === "") {
    throw new ValidationError("La contraseña es obligatoria.");
  }

  return { email: email.trim(), password };
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = validateLoginBody(req.body);
    const result = await authService.login(email, password);

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export function getMeHandler(req: Request, res: Response) {
  const { sub, email, username } = req.authUser;

  res.status(200).json({
    user: {
      id: sub,
      email,
      username,
    },
  });
}
