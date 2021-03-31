const express = require("express");
const { postNewStation,getStation,getAllStation } = require("../controllers/station");
const auth = require("../helpers/authorization");
const router = express.Router();

router.post("/station",auth(["admin"]),postNewStation);
router.get("/allstation",getAllStation)
router.get("/station",getStation);

module.exports = router