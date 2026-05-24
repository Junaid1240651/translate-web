/**
 * Creates vt_users and vt_otp_challenges in Supabase/PostgreSQL.
 * Run: npm run db:migrate
 */
import { config } from "dotenv";
import { resolve } from "path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

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

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to landing/.env");
    process.exit(1);
  }

  const sslFlag = process.env.DATABASE_SSL?.trim().toLowerCase();
  const pool = new pg.Pool({
    connectionString: url,
    ssl: sslFlag === "true" || sslFlag === "1" ? { rejectUnauthorized: false } : false,
  });

  const client = await pool.connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log("Auth schema ready: vt_users, vt_otp_challenges, vt_payments, vt_subscriptions");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
