let express = require('express');
let router = express.Router();
let axios = require('axios');

router.get("/", (req, res, next) => {
    res.render("index");
});

router.get("/settings", (req, res, next) => {
    res.render("settings");
});

router.get("/notifications", (req, res, next) => {
    res.render("notifications");
});

router.get("/logs", (req, res, next) => {
    res.render("logs");
});

module.exports = router;