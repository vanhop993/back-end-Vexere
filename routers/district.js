const express = require('express');
const { postNewDistrict } = require('../controllers/district');
const auth = require('../helpers/authorization');
const router  = express.Router();

router.post("/district",auth(["admin"]),postNewDistrict);

module.exports = router;