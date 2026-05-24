import { Pool, type PoolClient, type QueryResultRow } from "pg";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function useSsl(): boolean | { rejectUnauthorized: boolean } {
  const flag = process.env.DATABASE_SSL?.trim().toLowerCase();
  if (flag === "true" || flag === "1") {
    return { rejectUnauthorized: false };
  }
  return false;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPool(): Pool {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required for PostgreSQL auth storage");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: url,
      ssl: useSsl(),
      max: 10,
    });
  }

  return pool;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS vt_users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vt_otp_challenges (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  pending_name VARCHAR(255),
  pending_password_hash VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, purpose)
);

CREATE INDEX IF NOT EXISTS idx_vt_otp_challenges_email ON vt_otp_challenges (email);

ALTER TABLE vt_users ADD COLUMN IF NOT EXISTS image_url VARCHAR(512);

CREATE TABLE IF NOT EXISTS vt_payments (
  id UUID PRIMARY KEY,
  subscription_id UUID,
  user_id UUID REFERENCES vt_users(id) ON DELETE SET NULL,
  plan_id VARCHAR(20) NOT NULL,
  amount INT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
  razorpay_payment_id VARCHAR(255) NOT NULL UNIQUE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'paid',
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vt_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES vt_users(id) ON DELETE SET NULL,
  payment_id UUID,
  plan_id VARCHAR(20) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  activation_key VARCHAR(24) NOT NULL UNIQUE,
  amount INT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vt_subscriptions_user ON vt_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_vt_subscriptions_email ON vt_subscriptions (LOWER(customer_email));
CREATE INDEX IF NOT EXISTS idx_vt_subscriptions_key ON vt_subscriptions (activation_key);
CREATE INDEX IF NOT EXISTS idx_vt_payments_user ON vt_payments (user_id);
CREATE INDEX IF NOT EXISTS idx_vt_payments_email ON vt_payments (LOWER(customer_email));
`;

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = await getPool().connect();
      try {
        await client.query(SCHEMA_SQL);
      } finally {
        client.release();
      }
    })();
  }
  await schemaReady;
}

export async function withDb<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export type UserRow = QueryResultRow & {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  image_url: string | null;
  created_at: Date;
};

export type OtpChallengeRow = QueryResultRow & {
  id: string;
  email: string;
  purpose: string;
  code_hash: string;
  expires_at: Date;
  attempts: number;
  pending_name: string | null;
  pending_password_hash: string | null;
  created_at: Date;
  updated_at: Date;
};
