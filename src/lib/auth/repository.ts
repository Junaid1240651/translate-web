import type { OtpChallenge, OtpPurpose, User } from "./types";
import { type OtpChallengeRow, type UserRow, withDb } from "./db";
import { deleteSubscriptionsForUser } from "@/lib/payments/subscription-repository";

const USER_COLUMNS = "id, name, email, password_hash, image_url, created_at";

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    imageUrl: row.image_url,
    createdAt: row.created_at.toISOString(),
  };
}

function rowToChallenge(row: OtpChallengeRow): OtpChallenge {
  return {
    id: row.id,
    email: row.email,
    purpose: row.purpose as OtpPurpose,
    codeHash: row.code_hash,
    expiresAt: row.expires_at.toISOString(),
    attempts: row.attempts,
    pendingName: row.pending_name,
    pendingPasswordHash: row.pending_password_hash,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return withDb(async (client) => {
    const { rows } = await client.query<UserRow>(
      `SELECT ${USER_COLUMNS} FROM vt_users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email],
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  });
}

export async function findUserById(id: string): Promise<User | null> {
  return withDb(async (client) => {
    const { rows } = await client.query<UserRow>(
      `SELECT ${USER_COLUMNS} FROM vt_users WHERE id = $1 LIMIT 1`,
      [id],
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  });
}

export async function insertUser(user: User): Promise<User> {
  return withDb(async (client) => {
    const { rows } = await client.query<UserRow>(
      `INSERT INTO vt_users (id, name, email, password_hash, image_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${USER_COLUMNS}`,
      [user.id, user.name, user.email, user.passwordHash, user.imageUrl, user.createdAt],
    );
    return rowToUser(rows[0]);
  });
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  await withDb(async (client) => {
    await client.query(`UPDATE vt_users SET password_hash = $2 WHERE id = $1`, [
      userId,
      passwordHash,
    ]);
  });
}

export async function deleteUserById(userId: string, email: string): Promise<void> {
  await deleteSubscriptionsForUser(userId, email);
  await withDb(async (client) => {
    await client.query(`DELETE FROM vt_otp_challenges WHERE LOWER(email) = LOWER($1)`, [email]);
    await client.query(`DELETE FROM vt_users WHERE id = $1`, [userId]);
  });
}

export async function findOtpChallenge(
  email: string,
  purpose: OtpPurpose,
): Promise<OtpChallenge | null> {
  return withDb(async (client) => {
    const { rows } = await client.query<OtpChallengeRow>(
      `SELECT id, email, purpose, code_hash, expires_at, attempts,
              pending_name, pending_password_hash, created_at, updated_at
       FROM vt_otp_challenges
       WHERE LOWER(email) = LOWER($1) AND purpose = $2
       LIMIT 1`,
      [email, purpose],
    );
    return rows[0] ? rowToChallenge(rows[0]) : null;
  });
}

export async function replaceOtpChallenge(challenge: OtpChallenge): Promise<void> {
  await withDb(async (client) => {
    await client.query(`DELETE FROM vt_otp_challenges WHERE LOWER(email) = LOWER($1) AND purpose = $2`, [
      challenge.email,
      challenge.purpose,
    ]);
    await client.query(
      `INSERT INTO vt_otp_challenges (
         id, email, purpose, code_hash, expires_at, attempts,
         pending_name, pending_password_hash, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        challenge.id,
        challenge.email,
        challenge.purpose,
        challenge.codeHash,
        challenge.expiresAt,
        challenge.attempts,
        challenge.pendingName,
        challenge.pendingPasswordHash,
        challenge.updatedAt,
        challenge.updatedAt,
      ],
    );
  });
}

export async function deleteOtpChallengeById(id: string): Promise<void> {
  await withDb(async (client) => {
    await client.query(`DELETE FROM vt_otp_challenges WHERE id = $1`, [id]);
  });
}

export async function incrementOtpAttempts(id: string): Promise<void> {
  await withDb(async (client) => {
    await client.query(
      `UPDATE vt_otp_challenges
       SET attempts = attempts + 1, updated_at = NOW()
       WHERE id = $1`,
      [id],
    );
  });
}
