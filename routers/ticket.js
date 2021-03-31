const express = require("express");
const { getTicket } = require("../controllers/ticket");
const auth = require("../helpers/authorization");
const router = express.Router();

router.get("/tickets",auth(["admin","user"]),getTicket)

module.exports = router;