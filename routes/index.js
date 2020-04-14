let express = require('express');
let router = express.Router();
let axios = require('axios');

router.get("/", (req, res, next) => {
    let newsArticles;
    
    axios.get('http://127.0.0.1:3000/news')
        .then((response) => {
            res.render("index", {articles: response.data.articles});
        })
        .catch(err => {
            
        });
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

router.get("/account", (req, res, next) => {
    res.render("account");
});

router.get("/signout", (req, res, next) => {
    res.render("signout");
});

module.exports = router;