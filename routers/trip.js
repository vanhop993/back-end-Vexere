const express = require("express");
const { postNewTRip, getTrip, getTripByCompany, postBooking } = require("../controllers/trip");
const auth = require("../helpers/authorization");
const router = express.Router();

router.post("/trip",auth(["admin"]),postNewTRip);
router.post("/booking",auth(["user","admin"]),postBooking)
router.get("/trip",getTrip);
router.get("/tripcompany",auth(["admin"]),getTripByCompany);

module.exports=router;