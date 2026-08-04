const db = require("../config/db");

// Find user by username
async function findByUsername(username) {
  const [rows] = await db.query(
    `
    SELECT 
      u.*,
      r.role_name
    FROM tbl_users u
    INNER JOIN tbl_roles r
      ON u.role_id = r.id
    WHERE u.username = ?
    LIMIT 1
    `,
    [username]
  );

  return rows[0];
}

// Find user by ID
async function findById(id) {
  const [rows] = await db.query(
    `
    SELECT
      u.*,
      r.role_name
    FROM tbl_users u
    INNER JOIN tbl_roles r
      ON u.role_id = r.id
    WHERE u.id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
}

// Update last login
async function updateLastLogin(id) {
  await db.query(
    `
    UPDATE tbl_users
    SET
      last_login = NOW(),
      failed_login_attempts = 0,
      locked_until = NULL
    WHERE id = ?
    `,
    [id]
  );
}

// Increase failed login attempts
async function incrementFailedAttempts(id) {
  await db.query(
    `
    UPDATE tbl_users
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE id = ?
    `,
    [id]
  );
}

// Lock account
async function lockAccount(id, lockedUntil) {
  await db.query(
    `
    UPDATE tbl_users
    SET locked_until = ?
    WHERE id = ?
    `,
    [lockedUntil, id]
  );
}

// Reset failed login attempts
async function resetFailedAttempts(id) {
  await db.query(
    `
    UPDATE tbl_users
    SET
      failed_login_attempts = 0,
      locked_until = NULL
    WHERE id = ?
    `,
    [id]
  );
}

module.exports = {
  findByUsername,
  findById,
  updateLastLogin,
  incrementFailedAttempts,
  lockAccount,
  resetFailedAttempts,
};