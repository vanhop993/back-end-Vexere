const express = require("express");
const { postNewBus,getBus,getAllBusByCompany, getAllBus } = require("../controllers/bus");
const router = express.Router();
const auth = require("../helpers/authorization")

router.post("/bus",auth(["admin"]),postNewBus);
router.get("/allbus",getAllBus);
router.get("/busofcompany",getAllBusByCompany );
router.get("/bus",getBus);

module.exports = router;