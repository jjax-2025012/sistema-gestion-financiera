/**
 * Representa la fila tal como existe en la tabla "users" de PostgreSQL.
 * Incluye el hash de la contraseña porque así se lee de la base de datos;
 * nunca se debe enviar este objeto completo al frontend.
 */
export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

/**
 * Versión "segura" del usuario, sin el hash de la contraseña.
 * Es la que se puede incluir en respuestas HTTP o en el token.
 */
export interface PublicUser {
  id: number;
  username: string;
  email: string;
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}
