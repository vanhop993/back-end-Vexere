const express = require("express");
const { postNewCommentStation } = require("../controllers/commentStation");
const auth = require("../helpers/authorization");
const router = express.Router();

router.post("/commentStation",auth(["admin","user"]),postNewCommentStation)

module.exports = router;