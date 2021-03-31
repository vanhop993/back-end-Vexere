const express = require("express");
const { postNewCommentCompany } = require("../controllers/commentCompany");
const router = express.Router();
const auth = require("../helpers/authorization");

router.post("/commentCompany",auth(["admin","user"]),postNewCommentCompany)

module.exports = router;