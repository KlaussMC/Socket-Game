'use strict';
var express = require('express');
var router = express.Router();
var search = require('./search')

var socket = require("./socket")

let title = "Duel.io"

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title });
});
router.get('/game', function (req, res) {
  res.render('game', { title, port: socket.socketPort });
})

//docs

router.get('/docs', function (req, res) {
  res.render('docs/main', { title })
})
// router.get('/docs/player-command-menu', function (req, res) {
//   res.render('docs/playerCommandMenu', { title })
// })
// router.get('/docs/player-command-menu2', function (req, res) {
//   res.render('docs/playerCommandMenu2', { title })
// })

router.get('/docs/:page', function (req, res) {
	res.render('docs/' + req.params.page)
})
router.get('/search/:search', function (req, res) {
	console.log(req.params)
	res.render('docs/search', { items: search(req.params.search) })
})

module.exports = router;
