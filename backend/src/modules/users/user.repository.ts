import { pool } from "../../db/pool";
import { UserRecord } from "./user.model";

/**
 * Busca un usuario por su correo electrónico.
 * Devuelve null si no existe, en vez de lanzar un error: no existir
 * es una situación normal (usuario aún no registrado o correo mal escrito).
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await pool.query<UserRecord>(
    `SELECT id, username, email, password_hash, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
}
