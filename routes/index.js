let express = require('express');
let router = express.Router();
let axios = require('axios');
var admin = require("firebase-admin");

let firebaseUtil = require("../firebaseUtil");
let firebaseDbAdapter = require('../utils/firebaseDbAdapter');


router.get("/", (req, res, next) => {
    let newsArticles;

    axios.get('http://127.0.0.1:3000/news')
        .then((response) => {
            res.render("index", { articles: response.data.articles });
        })
        .catch(err => {

        });
});


router.get("/settings", (req, res, next) => {
    res.render("settings");
});

router.get("/notifications", (req, res, next) => {
    //res.render("notifications");
    firebaseDbAdapter.getNotifications(function (result) {
        console.log({ notifications: result });
        res.render("notifications", { notifications: result });
    });
});

router.get("/logs", (req, res, next) => {
    firebaseDbAdapter.getLogs(function (result) {
        console.log({ logs: result });
        res.render("logs", { logs: result });
    });
});

router.get("/account", (req, res, next) => {
    res.render("account");
});

router.get("/signout", (req, res, next) => {
    res.render("signout");
});

module.exports = router;