const express = require("express");
const router = express.Router();

const { obterDashboard } = require("../controllers/dashboard.controller");

// GET /dashboard
router.get("/", obterDashboard);

module.exports = router;
