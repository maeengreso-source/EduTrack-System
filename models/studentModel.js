const db = require("../config/db");


async function getAll(){

    const [rows] = await db.query(`

        SELECT *
        FROM tbl_students
        ORDER BY id DESC

    `);


    return rows;

}


module.exports = {
    getAll
};