const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get(
    "/",
    authMiddleware,
    roleMiddleware("Super Administrator", "Administrator"),
    (req, res) => {


        res.render("teachers/index", {

            title: "Teachers",

            user: req.session.user,


            // TEMPORARY DATA FOR DESIGN ONLY
            teachers:[

                {
                    teacher_id:"TCH-001",
                    first_name:"Juan",
                    last_name:"Santos",
                    email:"juan.santos@school.com",
                    gender:"Male",
                    department:"Science Department",
                    subject:"Physics",
                    status:"Active",
                    date_joined:"August 2026"
                },


                {
                    teacher_id:"TCH-002",
                    first_name:"Maria",
                    last_name:"Cruz",
                    email:"maria.cruz@school.com",
                    gender:"Female",
                    department:"Mathematics Department",
                    subject:"Algebra",
                    status:"Active",
                    date_joined:"August 2026"
                }

            ]

        });


    }
);


module.exports = router;