'use strict';
let express = require('express');
let router = express.Router();
let search = require('./search')

let socket = require("./socket")
let db = require("krakendb")
db.loaddb("comments");

let title = "Duel.io"

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title });
});
router.get('/game', function (req, res) {
  res.render('game', { title, port: socket.socketPort });
})
router.get('/about', function (req, res) {
  res.render('about', { title })
})
router.get('/notes', function (req, res) {
  res.render('notes', { title, input: getComments() })
})
router.post('/notes', function (req, res) {
  console.log('new comment')
  let data = [`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`, req.body.note]

  db.push("comment" + db.length(), data)
  db.exportdb()

  res.render('notes', { title: title, input: getComments() })
})

function getComments() {
  let comments = [];
  for (let i = 0; i < db.length(); i++) {
    let tmp = db.getItem(i)
    if (Array.isArray(tmp)) {
      // console.log(tmp)
      // console.log(Array.isArray(tmp))
      // console.log(tmp[1])
      comments.push(tmp)
    }
  }

  return comments;
}

//docs

router.get('/docs', function (req, res) {
  res.render('docs/main', { title })
})

router.get('/docs/:page', function (req, res) {
	res.render('docs/' + req.params.page)
})
router.get('/search/:search', function (req, res) {
	console.log(req.params)
	res.render('docs/search', { items: search(req.params.search) })
})

module.exports = router;
