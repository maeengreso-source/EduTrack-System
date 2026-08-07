const db = require("../config/db");

async function getAll() {

    const [rows] = await db.query(`
        SELECT id, role_name
        FROM tbl_roles
        ORDER BY id
    `);

    return rows;

}

module.exports = {

    getAll

};