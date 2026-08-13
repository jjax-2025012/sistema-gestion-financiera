import { findUserByEmail } from "../users/user.repository";
import { toPublicUser } from "../users/user.model";
import { verifyPassword } from "../../utils/password";
import { signAuthToken } from "../../utils/jwt";
import { InvalidCredentialsError, DatabaseUnavailableError } from "../../utils/errors";

export interface LoginResult {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

/**
 * Flujo completo de inicio de sesión:
 * 1) Busca el usuario en PostgreSQL por correo.
 * 2) Compara la contraseña recibida contra el hash almacenado.
 * 3) Si todo es correcto, firma y devuelve un JWT.
 *
 * Nunca compara credenciales quemadas en el código: el usuario
 * siempre se consulta en la base de datos.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  let userRecord;

  try {
    userRecord = await findUserByEmail(email.toLowerCase().trim());
  } catch (error) {
    // Si la consulta falla (por ejemplo, PostgreSQL no está disponible),
    // se distingue claramente de "credenciales incorrectas".
    throw new DatabaseUnavailableError();
  }

  if (!userRecord) {
    throw new InvalidCredentialsError();
  }

  const passwordMatches = await verifyPassword(password, userRecord.password_hash);
  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const publicUser = toPublicUser(userRecord);
  const token = signAuthToken(publicUser);

  return { token, user: publicUser };
}
