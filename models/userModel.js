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
// ===============================
// Get All Users
// ===============================
async function getAll(
    search = "",
    role = "",
    status = "",
    limit = 10,
    offset = 0
) {
  let sql = `
      SELECT
          u.id,

          u.employee_id,
          u.student_id,

          u.profile_image,

          u.first_name,
          u.middle_name,
          u.last_name,

          u.username,
          u.email,

          u.status,
          u.last_login,
          u.created_at,

          r.role_name

      FROM tbl_users u

      INNER JOIN tbl_roles r
          ON u.role_id = r.id

      WHERE 1 = 1
  `;

    const params = [];

    // Search
    if (search) {

        sql += `
            AND (
                u.first_name LIKE ?
                OR u.middle_name LIKE ?
                OR u.last_name LIKE ?
                OR u.username LIKE ?
                OR u.email LIKE ?
            )
        `;

        const keyword = `%${search}%`;

        params.push(
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        );

    }

    // Filter by Role
    if (role) {

        sql += ` AND r.role_name = ?`;

        params.push(role);

    }

    // Filter by Status
    if (status) {

        sql += ` AND u.status = ?`;

        params.push(status);

    }

    sql += `
        ORDER BY u.id DESC
        LIMIT ?
        OFFSET ?
    `;

    params.push(limit);
    params.push(offset);

    const [rows] = await db.query(sql, params);

    return rows;

}
// ===============================
// Count All Users
// ===============================
async function countAll(
    search = "",
    role = "",
    status = ""
){

    let sql = `
        SELECT COUNT(*) AS total
        FROM tbl_users u
        INNER JOIN tbl_roles r
            ON u.role_id = r.id
        WHERE 1 = 1
    `;

    const params = [];

    if (search) {

        sql += `
            AND (
                u.first_name LIKE ?
                OR u.middle_name LIKE ?
                OR u.last_name LIKE ?
                OR u.username LIKE ?
                OR u.email LIKE ?
            )
        `;

        const keyword = `%${search}%`;

        params.push(
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        );

    }

    if (role) {

        sql += ` AND r.role_name = ?`;

        params.push(role);

    }

    if (status) {

        sql += ` AND u.status = ?`;

        params.push(status);

    }

    const [rows] = await db.query(sql, params);

    return rows[0].total;

}


// ===============================
// Create User
// ===============================
async function create(user) {

    const {

        employee_id,
        student_id,
        profile_image,

        first_name,
        middle_name,
        last_name,

        username,
        email,
        password,

        role_id

    } = user;

    await db.query(
        `
        INSERT INTO tbl_users
        (
            employee_id,
            student_id,
            profile_image,

            first_name,
            middle_name,
            last_name,

            username,
            email,
            password,

            role_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            employee_id,
            student_id,
            profile_image,

            first_name,
            middle_name,
            last_name,

            username,
            email,
            password,

            role_id
        ]
    );

}

//Update User

async function update(id, user) {

  const {
    first_name,
    middle_name,
    last_name,
    username,
    email,
    role_id,
    status
  } = user;

  await db.query(
    `
    UPDATE tbl_users
    SET
      first_name=?,
      middle_name=?,
      last_name=?,
      username=?,
      email=?,
      role_id=?,
      status=?
    WHERE id=?
    `,
    [
      first_name,
      middle_name,
      last_name,
      username,
      email,
      role_id,
      status,
      id
    ]
  );

}

// Delete User

async function remove(id) {

  await db.query(
    `
    DELETE FROM tbl_users
    WHERE id=?
    `,
    [id]
  );

}

// Unlock Account
async function unlockAccount(id) {

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

// ===============================
// Dashboard Statistics
// ===============================
async function getStatistics() {

    const [rows] = await db.query(`
        SELECT

            COUNT(*) AS totalUsers,

            SUM(
                CASE
                    WHEN status = 'Active'
                    THEN 1
                    ELSE 0
                END
            ) AS activeUsers,

            SUM(
                CASE
                    WHEN status = 'Inactive'
                    THEN 1
                    ELSE 0
                END
            ) AS inactiveUsers,

            -- Teachers
            SUM(
                CASE
                    WHEN role_id = 5
                    THEN 1
                    ELSE 0
                END
            ) AS teachers,

            -- Students
            SUM(
                CASE
                    WHEN role_id = 6
                    THEN 1
                    ELSE 0
                END
            ) AS students,

            -- School Staff
            SUM(
                CASE
                    WHEN role_id IN (1,2,3,4)
                    THEN 1
                    ELSE 0
                END
            ) AS schoolStaff

        FROM tbl_users
    `);

    return rows[0];


}
// ==========================================
// Generate Employee ID
// ==========================================

async function generateEmployeeId() {

    const [rows] = await db.query(`
        SELECT COUNT(*) + 1 AS nextNumber
        FROM tbl_users
        WHERE employee_id IS NOT NULL
    `);

    const year = new Date().getFullYear();

    const number = String(rows[0].nextNumber).padStart(4, "0");

    return `EMP-${year}-${number}`;

}

// ==========================================
// Generate Student ID
// ==========================================

async function generateStudentId() {

    const [rows] = await db.query(`
        SELECT COUNT(*) + 1 AS nextNumber
        FROM tbl_users
        WHERE student_id IS NOT NULL
    `);

    const year = new Date().getFullYear();

    const number = String(rows[0].nextNumber).padStart(4, "0");

    return `STU-${year}-${number}`;

}


module.exports = {

    findByUsername,
    findById,

    updateLastLogin,
    incrementFailedAttempts,
    lockAccount,
    resetFailedAttempts,
    unlockAccount,

    getAll,
    countAll,
    getStatistics,

    create,
    update,
    remove,

    generateEmployeeId,
    generateStudentId

};