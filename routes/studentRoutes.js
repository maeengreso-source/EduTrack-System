const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get(
    "/",
    authMiddleware,
    roleMiddleware("Super Administrator ", "Administrator", "Registrar", "Staff", "Teacher"),

    (req, res) => {


        res.render("students/index", {

            title: "Students",

            user: req.session.user,


            // TEMPORARY DATA FOR DESIGN ONLY
            students: [

                {
                    student_id:"2026001",
                    first_name:"Juan",
                    last_name:"Dela Cruz",
                    gender:"Male",
                    grade_level:"Grade 10",
                    section_name:"Section A",
                    status:"Active",
                    enrollment_date:"August 6, 2026"
                },


                {
                    student_id:"2026002",
                    first_name:"Maria",
                    last_name:"Santos",
                    gender:"Female",
                    grade_level:"Grade 11",
                    section_name:"Section B",
                    status:"Active",
                    enrollment_date:"August 6, 2026"
                }


            ]


        });


    }
);



module.exports = router;