let express = require('express');
let router = express.Router();

const axios = require("axios");

const BASE_URL = "https://newsapi.org/v2/everything?apiKey=42e54a01fdc844a3be2f81bd21073306&pageSize=20";
const TOP_HEADLINE = "https://newsapi.org/v2/top-headlines?apiKey=42e54a01fdc844a3be2f81bd21073306";
const NEWS_SOURCES = "https://newsapi.org/v2/sources?apiKey=42e54a01fdc844a3be2f81bd21073306";

/**
 * Get Latest Headlines from around Canada.
 * 
 * Language: EN
 */
router.get(['/', '/top'], (req, res, next) => {

    AxiosGet(`${TOP_HEADLINE}&country=ca`, req, res);
});


/**
 * Get Latest Headlines from the country specified in the parameter.
 * 
 * Countries available: ae, ar, at, au, be, bg, br, ca, ch, cn, co, cu, cz, de, eg, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za.
 */
router.get(['/:country', '/top/:country'], (req, res, next) => {

    AxiosGet(`${TOP_HEADLINE}&country=${req.params.country}`, req, res);
});


/**
 * Get news based on the category.
 * 
 * Supported categories: business, entertainment, general, health, science, sports, technology
 */
router.get('/category/:name', (req, res, next) => {

    AxiosGet(`${TOP_HEADLINE}&category=${req.params.name}`, req, res);
});


/**
 * Get news based on a keyword or a query.
 * 
 * By default, language will be english.
 */
router.get('/search/:q?', (req, res, next) => {

    AxiosGet(`${BASE_URL}&q=${req.params.q}`, req, res);
});


/**
 * Get news based on a keyword or a query in the language passed as parameter.
 * 
 * Supported languages: ar, de, en, es, fr, he, it, nl, no, pt, ru, se, ud, zh.
 */
router.get('/search/:q/:lang', (req, res, next) => {

    AxiosGet(`${BASE_URL}&q=${req.params.q}&language=${req.params.lang}`, req, res);
});


/**
 * Get a list of news sources available based on country.
 * 
 * Countries available: ae, ar, at, au, be, bg, br, ca, ch, cn, co, cu, cz, de, eg, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za.
 */
router.get('/sources/:country', (req, res, next) => {
    if(!country) req.params.country = "ca";
    AxiosGet(`${NEWS_SOURCES}&country=${req.params.country}&language=en`, req, res);
});


/**
 * Get a list of news sources available based on language.
 * 
 * Languages available: ar, de, en, es, fr, he, it, nl, no, pt, ru, se, ud, zh.
 */
router.get('/sources/:lang', (req, res, next) => {
    
    AxiosGet(`${NEWS_SOURCES}&country=ca&language=${req.params.lang}`, req, res);
});


/**
 * Get a list of news sources available based on country and language.
 * 
 * Countries available: ae, ar, at, au, be, bg, br, ca, ch, cn, co, cu, cz, de, eg, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za.
 * Supported languages: ar, de, en, es, fr, he, it, nl, no, pt, ru, se, ud, zh.
 */
router.get('/sources/:country/:lang', (req, res, next) => {
    
    AxiosGet(`${NEWS_SOURCES}&country=${req.params.country}&language=${req.params.lang}`, req, res);
});


/**
 * @function name - AxiosGet()
 * @returns {}
 * @param {string} URL - The url required to make get request.
 * @param {Object} req - The request object to get request parameters and request info.
 * @param {Object} res - The response object to send response back to user.
 */
function AxiosGet(URL, req, res) {
    axios.get(URL)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json({error: error.response.data.message, success: false});
        });
}

module.exports = router;