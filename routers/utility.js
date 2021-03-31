const express = require("express");
const { postNewUtility, deleteUtility, getAllUtility } = require("../controllers/utility");
const auth = require("../helpers/authorization");
const router = express.Router();

router.post("/utility",auth(["admin"]),postNewUtility);
router.get("/allutility",getAllUtility);
router.delete("/utility",auth(["admin"]),deleteUtility);

module.exports=router;