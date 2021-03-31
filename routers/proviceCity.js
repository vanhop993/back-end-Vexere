const express = require('express');
const {postNewProviceCity,getAllProviceCity} = require('../controllers/proviceCity');
const auth = require('../helpers/authorization');
const router = express.Router();

router.post("/provice-city",auth(["admin"]),postNewProviceCity);
router.get("/provice-city",getAllProviceCity);

module.exports = router;