'use strict';
var express = require('express');
var router = express.Router();

var socket = require("./socket")

let title = "Jacob's Multiplayer Game"

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title });
});
router.get('/game', function (req, res) {
  res.render('game', { title, port: socket.socketPort });
})

module.exports = router;
